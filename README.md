# decli.github.io

<https://decli.github.io/> —— 站点首页。

**这个仓库名不是随便起的，也改不了。** GitHub Pages 的用户站点只认一个仓库名：
`<用户名>.github.io`，一字不差。正是这个名字让根地址 `https://decli.github.io/` 存在。
换成任何别的名字，它就降级成子路径下的项目站点。

---

## 这里只放首页

```
index.html    首页
sites.js      ← 加一个项目只改这一个文件
404.html      站点级 404（含单页应用的深链接兜底）
robots.txt    站点级（爬虫只读根目录这一份）
```

没有构建步骤，没有依赖。**改完直接推，推完直接生效。**

各个项目**不在这里** —— 它们各自是独立仓库的项目站点，自己发自己的：

| 地址 | 来自 |
| --- | --- |
| `/` | 本仓库 |
| `/ftms/` | [decli/ftms](https://github.com/decli/ftms) |
| `/ems/` | [decli/ems](https://github.com/decli/ems) |
| `/wxformat3/` | [decli/wxformat3](https://github.com/decli/wxformat3) |

> 项目站点的路径**就是仓库名**，一字不差、不能自选 —— 想要 `/xxx/`，仓库就得叫 `xxx`。
> 这也是为什么 `ForeignTradeManagementSystem` 和 `ExportMarketingSystem` 改成了 `ftms` / `ems`。

这个仓库一度还兼着「产物仓库」，`ftms/`、`ems/` 两个目录由各自的项目用脚本推进来。
改成项目站点之后那套跨仓库部署整个不需要了 —— 一个项目一个仓库，各自发各自的。

---

## 加一个项目

只改 [`sites.js`](sites.js)：

```js
{
  slug: "xxx",              // 短名。埋点靠它区分「点了哪个项目」
  href: "/xxx/",            // 同域项目站点；站外项目写完整 URL
  name: "项目名",
  desc: "一句话说清它替谁解决什么",
  tags: ["关键词", "关键词"],
  icon: "/xxx/favicon.svg", // `/` 开头当图片，否则当 emoji
  live: true,               // false = 标「筹备中」且不可点
}
```

样式、搜索、埋点全跟着数据走，`index.html` 一个字都不用动。

两件容易忘的配套：

- 新项目如果是**单页应用**，把前缀加进 `sites.js` 末尾的 `SPA_PREFIXES`，否则深链接刷新会 404
- 新项目如果有 **sitemap**，在 `robots.txt` 里加一行 `Sitemap:` —— 爬虫只读根目录这一份

---

## 几个不显眼但重要的地方

**深链接兜底。** `/ftms/` 是单页应用，刷新 `/ftms/follow-ups` 会走 404 流程。正常情况下
Pages 回落到那个项目站点自己的 `404.html`，走不到这儿。但「Pages 会不会替子目录去找最近的
404.html」官方说得并不硬，一旦不这么做就是**所有深链接刷新全 404**。所以 `404.html` 里补了
一道：把原始路径记进 `sessionStorage` 再跳回子站首页，应用启动时 `replaceState` 还原。
其中 `p !== prefix` 那半句是防死循环的 —— 少了它，子站真挂掉时浏览器会一直转圈。

**访问统计。** 首页和各子站共用同一个 GA4 property（`G-Y7H2JMNX74`）。同域下 GA4 靠域名级
`_ga` cookie 认人，一个 property 才能把「从首页点进 ftms、退出来又去了 ems」看成一次会话、
一条路径。分站靠 `site` 参数和 `page_path` 前缀在报表里切开。开了「请勿跟踪」就不发。

**版权邮箱画在 canvas 上。** 页脚那个邮箱不是文本节点，源码里也没有可直接正则捞走的字面量，
更没写进 `aria-label` / `title`。邮箱以文本形态出现在公开网页上，半天就会进群发名录。
补偿：整块可点击复制，读屏用户拿到的是可粘贴的真地址，而爬虫不会去点按钮。

**键盘。** `/` 聚焦搜索 · `Esc` 清空退出。跟 `/ftms/` 的习惯一致。

---

© decli · 2026
