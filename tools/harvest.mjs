#!/usr/bin/env node
/**
 * 从各个项目仓库里收「AI 写了多少代码」和截图背后的真代码，写进 code/。
 *
 *     node tools/harvest.mjs                 # 自己把 15 个仓库浅克隆到临时目录
 *     node tools/harvest.mjs --repos <目录>   # 已经克隆好了，直接读
 *     node tools/harvest.mjs --repos <目录> --others <目录>
 *                                            # 再算上作品清单以外的仓库（含私有）；两个可以是同一个目录
 *     node tools/harvest.mjs --only <slug> --repos <目录>
 *                                            # 只重收这一个项目（新加的、刚改过的），其余项目沿用 index.json 里的数
 *
 * ── 它产出什么 ──
 *   code/index.json      每个项目的行数、文件数、语言分布，以及总数
 *   --others <目录>      （可选）作品清单以外、我和 AI 提交过的仓库，公开的、私有的都算，各自克隆在这个目录下
 *                        （作品的仓库也在里面的话自动跳过）。只计入总数：index.json 里只记一个合计
 *                        others = { repos, loc, files }，不记仓库名、不出摘录 —— 私有仓库的名字和代码
 *                        都不该出现在公开的页面上。没给 --others 时沿用上一次的合计，总数不会悄悄变少
 *   code/<slug>.json     这个项目的代码摘录：每张截图对应「画出这一屏的那个源文件」
 *                        的开头一段，外加一个代表文件（没有截图的项目靠它）
 *   --skyline <文件>     （可选）每个项目每一行代码的长度，base64。
 *                        GitHub 个人主页「长卷」用它画山的轮廓 —— 山是代码的形状，不是画的
 *
 * ── 行数怎么数 ──
 *   就是 wc -l：git 里跟踪的每个文本文件数一遍换行符，二进制（图片、字体）跳过。
 *   代码、文档、配置、部署脚本都算 —— 需求文档和部署脚本也是 AI 写的，也是项目落地的一部分。
 *   首页对外只报一个量级（两位有效数字往下取整，带个 +），所以不抠细节。
 *
 * ── 摘录和行长 ──
 *   这两样只看源码文件：不看 docs/、锁文件、node_modules / dist / build、*.min.js、
 *   单行超长的生成文件（平均每行 > 400 字符）、40 KB 以上的 svg、README / Markdown / JSON。
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
  ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".astro", ".html", ".css", ".scss", ".py", ".swift", ".kt",
  ".kts", ".java", ".sh", ".xml", ".svg", ".toml", ".yml", ".yaml", ".gradle", ".pro", ".plist",
]);
const SKIP_DIRS = new Set(["docs", ".git", "node_modules", "dist", "build", "vendor", ".next", "out", "coverage", "__pycache__", ".gradle"]);
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

/** wc -l：git 跟踪的文本文件的换行符个数，外加有几个文件 */
function wcRepo(dir) {
  const list = execFileSync("git", ["-C", dir, "ls-files", "-z"]).toString().split("\0").filter(Boolean);
  let loc = 0, files = 0;
  for (const rel of list) {
    let buf;
    try { buf = fs.readFileSync(path.join(dir, rel)); } catch { continue; }   // 子模块、链接坏了的
    if (buf.subarray(0, 8192).includes(0)) continue;                          // 二进制
    for (let i = buf.indexOf(10); i >= 0; i = buf.indexOf(10, i + 1)) loc++;
    files++;
  }
  return { loc, files };
}

/** --others：目录下每个不在作品清单里的仓库各数一遍，只留合计。仓库名只打在终端上给跑的人看 */
function countOthers(base, projects) {
  const mine = new Set(projects.map((p) => p.repo.toLowerCase()));
  const out = { repos: 0, loc: 0, files: 0, generated: new Date().toISOString().slice(0, 10) };
  for (const ent of fs.readdirSync(base, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const dir = path.join(base, ent.name);
    if (mine.has(ent.name.toLowerCase()) || !fs.statSync(dir).isDirectory() || !fs.existsSync(path.join(dir, ".git"))) continue;
    const r = wcRepo(dir);
    out.repos += 1; out.loc += r.loc; out.files += r.files;
    console.log(`  · ${ent.name.padEnd(30)} ${String(r.loc).padStart(7)} 行  ${String(r.files).padStart(4)} 个文件`);
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
  const only = arg("--only");
  if (only && !projects.some((p) => p.slug === only)) throw new Error(`sites.js 里没有 ${only}`);
  let prev = null;
  try { prev = JSON.parse(fs.readFileSync(path.join(OUT, "index.json"), "utf8")); } catch {}
  let base = arg("--repos");
  if (!base) {
    base = fs.mkdtempSync(path.join(os.tmpdir(), "harvest-"));
    for (const p of projects.filter((q) => !only || q.slug === only)) {
      console.log(`克隆 ${p.repo} …`);
      execFileSync("git", ["clone", "-q", "--depth", "1", `https://github.com/decli/${p.repo}.git`, path.join(base, p.repo)]);
    }
  }

  fs.mkdirSync(OUT, { recursive: true });
  const index = { generated: new Date().toISOString().slice(0, 10), total: 0, projects: {} };
  const sky = [];

  for (const p of projects) {
    if (only && p.slug !== only) {                    // --only：别的项目原样沿用上一次的数
      const kept = prev && prev.projects && prev.projects[p.slug];
      if (kept) { index.projects[p.slug] = kept; index.total += kept.loc; }
      continue;
    }
    const dir = path.join(base, p.repo);
    if (!fs.existsSync(dir)) { console.warn(`跳过 ${p.slug}：没有 ${dir}`); continue; }
    const { loc, files } = wcRepo(dir);
    let biggest = null;
    const langs = {};
    const skyline = [];
    for (const f of walk(dir).sort()) {
      const r = codeLines(f);
      if (!r) continue;
      const ext = path.extname(f).slice(1).toLowerCase();
      langs[ext] = (langs[ext] || 0) + r.nonBlank.length;
      if (!biggest || r.nonBlank.length > biggest.n) biggest = { n: r.nonBlank.length, rel: path.relative(dir, f) };
      for (const l of r.nonBlank) skyline.push(Math.min(255, l.replace(/\t/g, "  ").replace(/\s+$/, "").length));
    }
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
  const othersDir = arg("--others");
  let others = null;
  if (othersDir) others = countOthers(path.resolve(othersDir), projects);
  else {
    try { others = JSON.parse(fs.readFileSync(path.join(OUT, "index.json"), "utf8")).others || null; } catch {}
    if (others) console.log(`沿用上次的其余 ${others.repos} 个仓库 ${others.loc} 行（重数加 --others <目录>）`);
  }
  if (others) { index.others = others; index.total += others.loc; }
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1) + "\n");
  console.log(`合计 ${index.total} 行${others ? `（作品 ${index.total - others.loc} + 其余 ${others.repos} 个仓库 ${others.loc}）` : ""} → code/`);
}

main();
