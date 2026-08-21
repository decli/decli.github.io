#!/usr/bin/env python3
"""给会变的静态资源盖上内容版本号。

── 它解决什么 ──
GitHub Pages 给**所有**响应发 `Cache-Control: max-age=600`，而且 Pages 不支持
自定义响应头，这个 600 秒改不掉。但浏览器的缓存是**按 URL 存的**：URL 变了就
是另一个资源，当场重新下。所以只要资源地址里带上内容哈希，改了图、改了
sites.js，新的 index.html 一到就会去取新的，不会拿旧缓存对付。

唯一治不了的是 `index.html` 自己 —— 它是入口，URL 不能变，所以推上去之后
最多有 10 分钟旧副本还在。那一段只能硬刷新，仓库这边做什么都没用。

── 它怎么做 ──
1. 算出 sites.js、shots/**、icons/** 每个文件的 sha256 前 8 位
2. 把这张表写进 index.html 两个标记之间的 `window.ASSET_V`
3. 顺手把 `<script src="sites.js">` 改成 `sites.js?v=<哈希>`

index.html 里的 `V()` 查这张表拼 `?v=`；表里没有的（子站 favicon、外链图）
原样返回。表整个不存在也不报错，就是退回没有版本号的状态。

── 怎么跑 ──
    python3 tools/stamp.py          # 改完资源、推之前跑一次
推到 main 时 .github/workflows/stamp.yml 会自动跑一遍并回提交，
所以正常情况下不用手动执行 —— 手动这条是给 Actions 关掉时兜底的。
反复跑是幂等的：内容没变，文件就一个字节都不动。
"""

import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
BEGIN = "<!-- ASSET-VERSIONS:BEGIN -->"
END = "<!-- ASSET-VERSIONS:END -->"

# 要盖版本号的：本仓库自己发的、会被 index.html 按地址引用的静态资源。
# 子站的 favicon（/ftms/favicon.svg 之类）不在这儿 —— 那些文件归各自仓库管，
# 这边算不出哈希，也不该替它们决定缓存。
TARGETS = ["sites.js", "shots", "icons"]


def digest(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()[:8]


def collect() -> dict:
    out = {}
    for t in TARGETS:
        p = ROOT / t
        if p.is_file():
            out["/" + t] = digest(p)
        elif p.is_dir():
            for f in sorted(p.rglob("*")):
                if f.is_file() and not f.name.startswith("."):
                    out["/" + f.relative_to(ROOT).as_posix()] = digest(f)
    return out


def main() -> int:
    if not INDEX.exists():
        print("找不到 index.html", file=sys.stderr)
        return 1

    src = INDEX.read_text(encoding="utf-8")
    if BEGIN not in src or END not in src:
        print(f"index.html 里没有 {BEGIN} / {END} 这对标记，不知道往哪写", file=sys.stderr)
        return 1

    assets = collect()
    if not assets:
        print("没找到任何要盖版本号的资源", file=sys.stderr)
        return 1

    # 一行一个键，diff 起来看得清是哪个文件变了；别压成一整行
    body = ",\n        ".join(f'"{k}": "{v}"' for k, v in assets.items())
    block = (
        f"{BEGIN}\n"
        f"    <script>\n"
        f"      /* 由 tools/stamp.py 生成，别手改 */\n"
        f"      window.ASSET_V = {{\n        {body}\n      }};\n"
        f"    </script>\n"
        f"    {END}"
    )
    out = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END), lambda _: block, src, flags=re.S)

    # sites.js 是用 <script src> 引的，进不了 V()，只能在这儿直接改地址
    sj = assets.get("/sites.js")
    if sj:
        out = re.sub(r'src="sites\.js(?:\?v=[0-9a-f]+)?"', f'src="sites.js?v={sj}"', out)

    if out == src:
        print(f"没有变化（{len(assets)} 个资源）")
        return 0

    INDEX.write_text(out, encoding="utf-8")
    print(f"已盖版本号：{len(assets)} 个资源 → index.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
