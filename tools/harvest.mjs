#!/usr/bin/env node
/**
 * 从各个项目仓库里收「AI 写了多少代码」和截图背后的真代码，写进 code/。
 *
 *     node tools/harvest.mjs                 # 自己把 15 个仓库浅克隆到临时目录
 *     node tools/harvest.mjs --repos <目录>   # 已经克隆好了，直接读
 *     node tools/harvest.mjs --others <目录> --only-others
 *                                            # 只重数作品清单以外的仓库（含私有），15 个项目的数不动
 *
 * ── 它产出什么 ──
 *   code/index.json      每个项目的行数、文件数、语言分布，以及总数
 *   code/<slug>.json     这个项目的代码摘录：每张截图对应「画出这一屏的那个源文件」
 *                        的开头一段，外加一个代表文件（没有截图的项目靠它）
 *   --others <目录>      （可选）作品清单以外、我提交过的全部仓库（公开的、私有的都算，fork 不算）
 *                        各自克隆在这个目录下。只计入总数：index.json 里只记一个合计
 *                        others = { repos, loc, files }，不记仓库名、不出摘录 ——
 *                        私有仓库的名字和代码都不该出现在公开的页面上。
 *                        没给 --others 时沿用上一次 index.json 里的合计，总数不会悄悄变少。
 *                        同一个东西的前后几版不重复算：一个仓库 70% 以上的代码行在另一个更大的仓库里也有，
 *                        它就是旧版，跳过；一个仓库把某件作品 70% 以上的代码都包进去了，它就是那件作品的新版，
 *                        只算它多出来的那部分（作品自己那份已经按项目算过了）。
 *                        作品的仓库也克隆在这个目录下的话，就拿来比对 —— 不比对就认不出「作品的新版」
 *   --skyline <文件>     （可选）每个项目每一行代码的长度，base64。
 *                        GitHub 个人主页「长卷」用它画山的轮廓 —— 山是代码的形状，不是画的
 *
 * ── 行数怎么数（数字要经得起追问）──
 *   只数产品代码：源码、样式、标记、构建与 CI 脚本，非空行。
 *   不数：docs/ 目录、锁文件、node_modules / dist / build、*.min.js、gradlew 这类
 *   工具生成的东西、单行超长的生成文件（平均每行 > 400 字符）、40 KB 以上的 svg。
 *   README、Markdown 文档、JSON 数据一律不算 —— 它们是写给人看的，不叫「代码」。
 *
 * ── 截图对应哪个文件 ──
 *   写在 sites.js 里：项目上的 `code` 是代表文件，每张截图上的 `code` 是画出那一屏的文件。
 *   路径后面可以带 `#关键词`，摘录从第一处出现它的那一行开始（单文件应用用得上）。
 *   没写的就挑这个项目里最大的源文件 —— 宁可泛一点，也不编一个对不上的。
 *
 * 没有依赖，只要 node 和 git。反复跑结果一样（同一个提交的话）。
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "code");

const CODE_EXT = new Set([
  ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".css", ".scss", ".py", ".swift", ".kt",
  ".kts", ".java", ".sh", ".xml", ".svg", ".toml", ".yml", ".yaml", ".gradle", ".pro", ".plist",
]);
// uploads：运行时别人传上来的文件（代码评审工具收的样本），不是写出来的代码
const SKIP_DIRS = new Set(["docs", ".git", "node_modules", "dist", "build", "vendor", ".next", "out", "coverage", "__pycache__", ".gradle", "uploads"]);
// 认不出来的生成物，按仓库点名：个人主页仓库里的 SVG 都是 build.py / studio 画出来的产物
const GENERATED = { decli: /^(styles\/[^/]+\/)?assets\/.*\.svg$/ };
const SKIP_FILES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]);
const EXCERPT_LINES = 140;
const MAX_COL = 132;

/* ── 读 sites.js：它是给浏览器写的，挂在 window 上 ── */
function loadSites() {
  const src = fs.readFileSync(path.join(ROOT, "sites.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.PROJECTS || [];
}

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : null;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (!SKIP_DIRS.has(ent.name)) walk(path.join(dir, ent.name), out);
    } else if (ent.isFile()) {
      out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

/** 这个文件算不算「代码」；算的话返回它的非空行 */
function codeLines(file) {
  const name = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  if (SKIP_FILES.has(name) || !CODE_EXT.has(ext) || name.endsWith(".min.js")) return null;
  let txt;
  try { txt = fs.readFileSync(file, "utf8"); } catch { return null; }
  if (ext === ".svg" && txt.length > 40000) return null;
  const lines = txt.split(/\r?\n/);
  const nonBlank = lines.filter((l) => l.trim());
  if (nonBlank.length && txt.length / nonBlank.length > 400) return null;
  return { lines, nonBlank };
}

/** 数一个仓库：行数、文件数、语言分布、最大的文件、每一行的长度，外加拿来比对新旧版的「像样的行」 */
function countRepo(dir, repo = path.basename(dir)) {
  let loc = 0, files = 0, biggest = null;
  const langs = {};
  const skyline = [];
  const sig = [];
  const gen = GENERATED[repo.toLowerCase()];
  for (const f of walk(dir).sort()) {
    if (gen && gen.test(path.relative(dir, f).split(path.sep).join("/"))) continue;
    const r = codeLines(f);
    if (!r) continue;
    for (const l of r.nonBlank) { const t = l.trim(); if (t.length > 12) sig.push(t); }
    const ext = path.extname(f).slice(1).toLowerCase();
    loc += r.nonBlank.length;
    files += 1;
    langs[ext] = (langs[ext] || 0) + r.nonBlank.length;
    if (!biggest || r.nonBlank.length > biggest.n) biggest = { n: r.nonBlank.length, rel: path.relative(dir, f) };
    for (const l of r.nonBlank) skyline.push(Math.min(255, l.replace(/\t/g, "  ").replace(/\s+$/, "").length));
  }
  return { loc, files, langs, biggest, skyline, sig };
}

/** a 里像样的行，有几成在 b 里也出现 */
function containedIn(a, bSet) {
  if (!a.sig.length) return 0;
  let n = 0;
  for (const l of a.sig) if (bSet.has(l)) n++;
  return n / a.sig.length;
}

/** --others：目录下每个仓库各数一遍，只留合计。仓库名只打在终端上给跑的人看。
    projLoc：作品仓库名（小写）→ 总数里已经算了它多少行 */
const SAME = 0.7;     // 真是同一个东西的几版，实测在 80%～92%；不相干的仓库都在 30% 以下
function countOthers(base, projLoc) {
  const repos = [];
  for (const ent of fs.readdirSync(base, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const dir = path.join(base, ent.name);
    if (!fs.statSync(dir).isDirectory() || !fs.existsSync(path.join(dir, ".git"))) continue;
    const r = countRepo(dir, ent.name);
    repos.push({ name: ent.name, work: projLoc.has(ent.name.toLowerCase()), ...r, set: new Set(r.sig) });
  }
  const bigger = (a, b) => b.loc > a.loc || (b.loc === a.loc && b.name < a.name);
  const out = { repos: 0, loc: 0, files: 0, generated: new Date().toISOString().slice(0, 10) };
  for (const r of repos) {
    if (r.work) continue;                               // 作品已经按项目算过，这里只拿来比对
    const older = repos.find((o) => o !== r && bigger(r, o) && containedIn(r, o.set) >= SAME);
    if (older) { console.log(`  × ${r.name.padEnd(28)} ${String(r.loc).padStart(7)} 行  是 ${older.name} 的旧版，不算`); continue; }
    const works = repos.filter((w) => w.work && w.loc < r.loc && containedIn(w, r.set) >= SAME);
    const minus = works.reduce((a, w) => a + projLoc.get(w.name.toLowerCase()), 0);
    const loc = Math.max(0, r.loc - minus);
    out.repos += 1; out.loc += loc; out.files += r.files;
    // 顺手报一下最像的那个仓库，阈值卡在边上的时候看得出来
    const near = repos.filter((o) => o !== r).map((o) => [o.name, containedIn(r, o.set)]).sort((a, b) => b[1] - a[1])[0];
    const note = works.length ? `（是 ${works.map((w) => w.name).join("、")} 的新版，只算多出来的 ${loc} 行）`
      : near && near[1] >= 0.3 ? `（最像 ${near[0]}：${Math.round(near[1] * 100)}% 的行在它里面也有）` : "";
    console.log(`  · ${r.name.padEnd(28)} ${String(r.loc).padStart(7)} 行  ${String(r.files).padStart(4)} 个文件${note}`);
  }
  return out;
}

function excerpt(repoDir, spec) {
  const [rel, anchor] = spec.split("#");
  const file = path.join(repoDir, rel);
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  let start = 0;
  if (anchor) {
    const k = lines.findIndex((l) => l.includes(anchor));
    if (k >= 0) start = k;
  } else {
    // 没指定从哪开始，就跳过文件头上那串 import / package / 版权注释 —— 透镜里该露出来的是干活的代码
    const HEAD = /^\s*(import\b|from\b|export \* from|package\b|using\b|#!|#include|"use strict"|'use strict'|\/\/|\/\*|\*|<!doctype|<html|<head|<meta|<link|$)/i;
    while (start < lines.length - 20) {
      const l = lines[start];
      if (/^\s*\/\*/.test(l) && !l.includes("*/")) {            // 多行块注释：跳到它结束
        while (start < lines.length - 20 && !lines[start].includes("*/")) start++;
        start++;
      } else if (/^\s*import\b[^}]*\{[^}]*$/.test(l)) {   // JS 里拆成多行的 import { … }：跳到 from 那行
        while (start < lines.length - 20 && !/\bfrom\b/.test(lines[start])) start++;
        start++;
      } else if (HEAD.test(l)) start++;
      else break;
    }
  }
  const body = lines.slice(start, start + EXCERPT_LINES).map((l) => {
    const s = l.replace(/\t/g, "  ").replace(/\s+$/, "");
    return s.length > MAX_COL ? s.slice(0, MAX_COL - 1) + "…" : s;
  });
  return { path: rel, start: start + 1, text: body.join("\n") };
}

function main() {
  const projects = loadSites();
  const prev = (() => { try { return JSON.parse(fs.readFileSync(path.join(OUT, "index.json"), "utf8")); } catch { return null; } })();
  const othersDir = arg("--others");
  const projLoc = new Map(projects.map((p) => [p.repo.toLowerCase(), prev && prev.projects[p.slug] ? prev.projects[p.slug].loc : 0]));
  let others = prev && prev.others;
  // 完整重数时，作品的数要先数出来才能拿去比对；只重数其余仓库时，用 index.json 里记着的数
  const runOthers = () => { if (othersDir) others = countOthers(path.resolve(othersDir), projLoc); };
  if (process.argv.includes("--only-others")) runOthers();
  // 只重数其余仓库：15 个项目的数、摘录、行长都不动，只改合计
  if (process.argv.includes("--only-others")) {
    if (!prev || !othersDir) { console.error("--only-others 要配 --others <目录>，而且 code/index.json 得已经有了"); process.exit(1); }
    const workLoc = Object.values(prev.projects).reduce((a, p) => a + p.loc, 0);
    const index = { generated: prev.generated, total: workLoc + others.loc, projects: prev.projects, others };
    fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1) + "\n");
    console.log(`合计 ${index.total} 行（作品 ${workLoc} + 其余 ${others.repos} 个仓库 ${others.loc}）→ code/index.json`);
    return;
  }

  let base = arg("--repos");
  if (!base) {
    base = fs.mkdtempSync(path.join(os.tmpdir(), "harvest-"));
    for (const p of projects) {
      console.log(`克隆 ${p.repo} …`);
      execFileSync("git", ["clone", "-q", "--depth", "1", `https://github.com/decli/${p.repo}.git`, path.join(base, p.repo)]);
    }
  }

  fs.mkdirSync(OUT, { recursive: true });
  const index = { generated: new Date().toISOString().slice(0, 10), total: 0, projects: {} };
  const sky = [];

  for (const p of projects) {
    const dir = path.join(base, p.repo);
    if (!fs.existsSync(dir)) { console.warn(`跳过 ${p.slug}：没有 ${dir}`); continue; }
    const { loc, files, langs, biggest, skyline } = countRepo(dir, p.repo);
    projLoc.set(p.repo.toLowerCase(), loc);
    const langsSorted = Object.fromEntries(Object.entries(langs).sort((a, b) => b[1] - a[1]));
    index.projects[p.slug] = { repo: p.repo, loc, files, langs: langsSorted };
    index.total += loc;
    sky.push({ slug: p.slug, lines: skyline });

    const main = excerpt(dir, p.code || (biggest && biggest.rel) || "");
    const shots = {};
    for (const s of p.shots || []) {
      const key = path.basename(s.src).replace(/\.[a-z0-9]+$/i, "");
      if (s.code) shots[key] = excerpt(dir, s.code);
    }
    fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify({ slug: p.slug, repo: p.repo, main, shots }));
    console.log(`${p.slug.padEnd(16)} ${String(loc).padStart(7)} 行  ${String(files).padStart(4)} 个文件`);
  }

  /* --skyline <文件>：每个项目每一行代码的长度（0~255，一个字节一行），{ slug: base64 }。
     首页用不上；GitHub 个人主页那卷「长卷」拿它画山 —— 山的轮廓就是代码的行长，一行不少 */
  const skyFile = arg("--skyline");
  if (skyFile) {
    const skyOut = {};
    for (const sk of sky) skyOut[sk.slug] = Buffer.from(sk.lines).toString("base64");
    fs.writeFileSync(path.resolve(skyFile), JSON.stringify(skyOut));
    console.log(`行长 → ${skyFile}`);
  }
  runOthers();
  if (others) {
    index.others = others; index.total += others.loc;
    if (!othersDir) console.log(`沿用上次的其余 ${others.repos} 个仓库 ${others.loc} 行（重数加 --others <目录>）`);
  }
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1) + "\n");
  console.log(`合计 ${index.total} 行 → code/`);
}

main();
