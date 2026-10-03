#!/usr/bin/env python3
"""把首页用到的字从完整字体里切出来，存成 fonts/ 下的 woff2。

    pip install fonttools brotli
    python3 tools/fonts.py --src <放原始字体的目录>

── 为什么要切 ──
整套中文字体几 MB；一页真正用到的字只有几百个，切出来几十 KB。
而且自己托管，不走 Google Fonts —— 国内访问不稳，入口页不能把首屏押在别人的 CDN 上。

── 改了文案之后 ──
字表是扫首页、404 和 sites.js 得来的：改了文案、加了项目，重跑一次，再跑一次 stamp.py。
忘了跑也不会坏：缺的字落到后备字体（苹方 / 思源黑体），只是那几个字长得不一样。

── 原始字体（都是 SIL OFL 1.1，允许子集化和嵌入）──
  SmileySans-Oblique.ttf     得意黑            npm: @fontpkg/smiley-sans
  MartianMono[wdth,wght].ttf Martian Mono      github.com/google/fonts → ofl/martianmono
  Geist[wght].ttf            Geist             github.com/google/fonts → ofl/geist
"""

import argparse
import io
import pathlib

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent

# 西文基础集：数字、标点、英文版全靠它
LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + " ©·×–—‘’“”…→←↑↓↗⌘•°′″№™®§¶‹›«»€¥£"

# 输出名 → (原始字体, 轴的取值范围, 扫哪些页面；None 表示只要西文)
JOBS = {
    # 标题字：得意黑。只切页面上真出现过的字
    "smiley.woff2": ("SmileySans-Oblique.ttf", None, ["index.html", "404.html"]),
    # 代码、标签、数字：Martian Mono。宽度轴只留 75%～100%，字重 300～700
    "martian.woff2": ("MartianMono[wdth,wght].ttf", {"wdth": (75, 100), "wght": (300, 700)}, None),
    # 英文正文：Geist
    "geist.woff2": ("Geist[wght].ttf", {"wght": (300, 700)}, None),
}


def page_text(pages):
    """页面 + sites.js 里出现过的所有字符。粗一点没关系：多切几个字只是多几 KB"""
    text = set(LATIN)
    for rel in list(pages) + ["sites.js"]:
        p = ROOT / rel
        if p.exists():
            text |= set(p.read_text(encoding="utf-8"))
    return "".join(sorted(c for c in text if c.isprintable() or c == "　"))


def cut(src, axes, text):
    font = TTFont(src)
    opts = subset.Options()
    opts.layout_features = ["kern", "liga", "calt", "tnum", "case", "ss01", "zero"]
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]  # 留着版权和许可证
    opts.notdef_outline = True
    opts.hinting = False
    s = subset.Subsetter(opts)
    s.populate(text=text)
    s.subset(font)
    # 先切字再收窄轴：反过来做，大字体的 gvar 会在子集化时对不上号
    if axes and "fvar" in font:
        from fontTools.varLib import instancer
        font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="放原始字体的目录")
    a = ap.parse_args()
    src = pathlib.Path(a.src)
    out = ROOT / "fonts"
    out.mkdir(exist_ok=True)
    for name, (file, axes, pages) in JOBS.items():
        # 文件名里有方括号，不能当 glob 用
        f = next((p for p in src.rglob("*") if p.name == file), None)
        if not f:
            print(f"跳过 {name}：{src} 里没有 {file}")
            continue
        text = page_text(pages) if pages else LATIN
        data = cut(f, axes, text)
        (out / name).write_bytes(data)
        cjk = len([c for c in text if ord(c) > 0x2E80])
        print(f"{name:16s} {len(data) / 1024:7.1f} KB   {cjk} 个汉字")


if __name__ == "__main__":
    main()
