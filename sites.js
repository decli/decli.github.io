/**
 * 首页收纳的项目。
 *
 * ══════════════════════════════════════════════════════════════════
 *  加一个项目：往 PROJECTS 里加一条，别的文件都不用动。
 * ══════════════════════════════════════════════════════════════════
 *
 *   slug   短名。埋点靠它区分「点了哪个项目」，也参与搜索
 *   cat    分类，取 CATEGORIES 里的 key
 *   name   显示名。中英文同名写一个字符串，不同写 {zh, en}
 *   desc   {zh, en} —— 一句话说清**它替谁解决什么**。
 *          「多主题、实时预览、一键复制」是功能罗列；
 *          「让公众号排版不用再手动调格式」才是它解决的事
 *   tags   {zh:[], en:[]} 三四个关键词，也参与搜索
 *   icon   `/` 开头当图片地址（同域子站直接借它自己的 favicon）；
 *          否则当 ICONS 里的 key，用 tint 上色
 *   tint   图标底色 [起, 止]
 *   href   在线地址。没有就不填 —— 卡片只留「源码」
 *   repo   GitHub 仓库名
 *
 * 有 href 的会自动排在前面并占两格（见 index.html 的 featured）。
 */

window.CATEGORIES = [
  { key: "web", zh: "在线应用", en: "Web Apps" },
  { key: "ext", zh: "浏览器扩展", en: "Extensions" },
  { key: "script", zh: "用户脚本", en: "Userscripts" },
  { key: "app", zh: "移动应用", en: "Mobile Apps" },
];

window.PROJECTS = [
  /* ── 在线应用：打开就能用 ───────────────────────────────── */
  {
    slug: "ftms",
    cat: "web",
    name: { zh: "信风 Tradewind", en: "Tradewind" },
    desc: {
      zh: "外贸业务全流程管理系统。询盘、报价、PI、采购生产、出运跟单、收汇、退税，一个 PI 号串到底。",
      en: "End-to-end foreign trade management. Inquiry, quote, PI, production, shipping, collection and tax refund — all threaded on a single PI number.",
    },
    tags: { zh: ["外贸管理", "跟单", "出口退税", "33 个模块"], en: ["Trade Ops", "Shipments", "Tax Refund", "33 modules"] },
    icon: "/ftms/favicon.svg",
    href: "/ftms/",
    repo: "ftms",
  },
  {
    slug: "ems",
    cat: "web",
    name: { zh: "EMS 外贸营销系统", en: "EMS" },
    desc: {
      zh: "AI Agent 驱动的外贸全链路增长系统 —— 从「找到买家」到「收到货款」跑在同一套数据上。",
      en: "AI-agent-driven growth system for exporters — from finding buyers to getting paid, all on one dataset.",
    },
    tags: { zh: ["获客", "AI Agent", "外贸营销"], en: ["Lead Gen", "AI Agent", "Marketing"] },
    /* 用它自己的 favicon，别拿 emoji 顶替 —— 图标是产品的脸，
       首页摆一个跟站内对不上的图标，第一眼就露怯 */
    icon: "/ems/favicon.svg",
    href: "/ems/",
    repo: "ems",
  },
  {
    slug: "wxformat3",
    cat: "web",
    name: "WxMark",
    desc: {
      zh: "微信公众号 Markdown 排版工具。左边写、右边预览，一键复制成带内联样式的 HTML 直接粘进后台。",
      en: "Markdown formatter for WeChat articles. Write on the left, preview on the right, copy inline-styled HTML straight into the editor.",
    },
    tags: { zh: ["公众号", "Markdown", "排版", "6 套主题"], en: ["WeChat", "Markdown", "Themes"] },
    icon: "/wxformat3/favicon.svg",
    href: "/wxformat3/",
    repo: "wxformat3",
  },

  /* ── 浏览器扩展 ─────────────────────────────────────────── */
  {
    slug: "ip-geo",
    cat: "ext",
    name: { zh: "IP 归属地监控", en: "IP Geolocation" },
    desc: {
      zh: "工具栏徽标直接显示出口国家代码，IPv4 / IPv6 与归属地一眼可见 —— 代理有没有真的生效，不用再开个测试网站去看。",
      en: "Puts the exit country code right on the toolbar badge, with IPv4/IPv6 and geolocation at a glance — no more opening a test site to check whether the proxy actually took effect.",
    },
    tags: { zh: ["Chrome 扩展", "IP", "代理排查"], en: ["Chrome", "IP", "Proxy"] },
    icon: "globe",
    tint: ["#0ea5e9", "#2563eb"],
    repo: "IP_Geolocation_Extension_Chrome",
  },
  {
    slug: "jobornot",
    cat: "ext",
    name: { zh: "职得投 JobOrNot", en: "JobOrNot" },
    desc: {
      zh: "浏览 BOSS 直聘 / 猎聘时，把简历和岗位 JD 摆在一起比，诚实回答「值不值得投、怎么投得更好」。",
      en: "While you browse job boards, it matches your résumé against the job description and answers honestly: worth applying, and how to apply better.",
    },
    tags: { zh: ["求职", "AI 匹配", "扩展"], en: ["Job Hunt", "AI", "Extension"] },
    icon: "target",
    tint: ["#f59e0b", "#ef4444"],
    repo: "JobOrNot",
  },
  {
    slug: "wx-export",
    cat: "ext",
    name: { zh: "公众号数据导出", en: "WeChat MP Exporter" },
    desc: {
      zh: "在已登录的公众号后台本地导出近期发表的文章与阅读、点赞、分享数据，拿来做内容复盘和选题分析。",
      en: "Exports recent article stats — reads, likes, shares — locally from your logged-in WeChat dashboard, for content review and topic analysis.",
    },
    tags: { zh: ["公众号", "数据导出", "扩展 + 脚本"], en: ["WeChat", "Export", "Analytics"] },
    icon: "chat",
    tint: ["#10b981", "#059669"],
    repo: "weixin_public_export",
  },
  {
    slug: "tabinfocopy",
    cat: "ext",
    name: "TabInfoCopy",
    desc: {
      zh: "一键复制当前标签页的标题和网址，省掉「点地址栏、全选、复制、再回去抄标题」这四步。",
      en: "Copies the current tab's title and URL in one click — no more click-address-bar, select-all, copy, then go back and retype the title.",
    },
    tags: { zh: ["Chrome 扩展", "效率"], en: ["Chrome", "Productivity"] },
    icon: "tab",
    tint: ["#8b5cf6", "#6366f1"],
    repo: "TabInfoCopy",
  },
  {
    slug: "ip-display",
    cat: "ext",
    name: "IP Display",
    desc: {
      zh: "显示当前 IP 与国内外归属地。上面那个 IP 归属地监控的前身，留着做个记录。",
      en: "Shows your current IP and whether it resolves domestically or overseas. The predecessor of IP Geolocation above, kept for the record.",
    },
    tags: { zh: ["Chrome 扩展", "IP", "早期版本"], en: ["Chrome", "IP", "Early"] },
    icon: "globe",
    tint: ["#64748b", "#475569"],
    repo: "IPDisplayExtension",
  },

  /* ── 用户脚本 ───────────────────────────────────────────── */
  {
    slug: "pagescroll",
    cat: "script",
    name: "PageScroll",
    desc: {
      zh: "任意网页上一个可拖动的悬浮胶囊，一点回顶或到底。用 Shadow DOM 隔离样式，SPA 重渲染后它会自己回来。",
      en: "A draggable floating pill on any page — one tap to the top or bottom. Style-isolated with Shadow DOM, and it restores itself after SPA re-renders.",
    },
    tags: { zh: ["油猴脚本", "效率", "Shadow DOM"], en: ["Userscript", "Productivity", "Shadow DOM"] },
    icon: "scroll",
    tint: ["#06b6d4", "#0891b2"],
    repo: "pagescroll",
  },
  {
    slug: "bing-wallpaper",
    cat: "script",
    name: { zh: "Bing 壁纸批量下载", en: "Bing Wallpaper Batch" },
    desc: {
      zh: "在壁纸列表页勾选多张，一次把 4K / UHD 原图批量下到指定目录，不用一张张点进去另存为。",
      en: "Tick several wallpapers on the list page and batch-download the 4K/UHD originals into one folder — no opening each to save-as.",
    },
    tags: { zh: ["油猴脚本", "壁纸", "批量下载"], en: ["Userscript", "Wallpaper", "Batch"] },
    icon: "download",
    tint: ["#ec4899", "#db2777"],
    repo: "BingWDByte4KBatchDownloader",
  },

  /* ── 移动应用 ───────────────────────────────────────────── */
  {
    slug: "codehelper",
    cat: "app",
    name: { zh: "取件码助手", en: "Pickup Code Helper" },
    desc: {
      zh: "给家里老人做的 Android 应用。自动从短信里挑出还没取的取件码，用取件小票的样子大字号摆出来，到驿站直接给人看。",
      en: "An Android app built for my parents. Picks unclaimed parcel codes out of your SMS and shows them large, like a pickup receipt you just hold up at the counter.",
    },
    tags: { zh: ["Android", "适老化", "短信解析"], en: ["Android", "Accessibility", "SMS"] },
    icon: "package",
    tint: ["#f97316", "#ea580c"],
    repo: "CodeHelper",
  },
  {
    slug: "chinesechess",
    cat: "app",
    name: { zh: "老爸下象棋", en: "Chinese Chess" },
    desc: {
      zh: "Android 平板上的中国象棋，按 14 寸横屏放大过布局，三档 AI，落子有音效和语音播报。",
      en: "Chinese chess for Android tablets — layout scaled up for a 14-inch landscape screen, three AI levels, move sounds and voice callouts.",
    },
    tags: { zh: ["Android", "象棋", "大屏"], en: ["Android", "Chess", "Tablet"] },
    icon: "chess",
    tint: ["#a16207", "#854d0e"],
    repo: "chinesechess03",
  },
];

/**
 * 哪些子路径是**单页应用**。
 *
 * 404.html 要用它：SPA 的深链接刷新会走 404 流程，得把原始路径记下来
 * 再交还给应用。不是 SPA 的站不用列 —— 列了反而会让它的真 404 跳错地方。
 */
window.SPA_PREFIXES = ["/ftms/"];
