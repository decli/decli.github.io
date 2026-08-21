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
 *   dl     安装包地址。给下载了才能跑的东西用（原生 App），
 *          渲染成主按钮「下载」。它**不算**「可在线体验」，
 *          也不占两格 —— 首页把大版面留给零门槛点开就能试的东西
 *   repo   GitHub 仓库名
 *   shots  产品截图。鼠标停在卡片底部那条空白上就展开，见 index.html 的 peek
 *          [{ src, zh, en }]，src 用站内 /shots/<slug>/<名>.webp，
 *          第一张是封面 —— 挑最能说明「这是什么」的那张放前面
 *
 * 有 href 的会自动排在前面并占两格（见 index.html 的 featured）。
 *
 * ── 截图是怎么来的 ──
 * 一律来自项目自己，没有一张是画出来的示意图：
 *   ftms / ems / wxformat3   本地起服务跑真实构建产物，Playwright 截图
 *   macpleco / ip-geo(popup) 项目仓库 README 里现成的截图
 *   jobornot / ip-geo(设置)  Chromium 加载未打包扩展，开扩展页截图
 *   pagescroll               把用户脚本注进真实网页（就是这一页），截控件那一角
 * 原图统一压到长边 2560 的 webp（25 张 2.1 MB）—— 全屏大图最宽会到 1240 CSS px，
 * 2 倍屏就是 2480 物理像素，出图小于这个数就是在放大，放大就是糊。
 * 引用地址由 tools/stamp.py 盖上内容哈希，改了图不会被缓存挡住。
 * 详见 README「产品截图」和「缓存与版本号」两节。
 * 没有截图的几个不是漏了：TabInfoCopy 压根没有界面，公众号导出和 Bing 壁纸
 * 脚本要登录到目标站点才有东西可看，安卓两个没有模拟器 —— 与其摆张示意图，
 * 不如不摆，卡片上那条预览入口也就不出现。
 */

window.CATEGORIES = [
  { key: "web", zh: "在线应用", en: "Web Apps" },
  { key: "ext", zh: "浏览器扩展", en: "Extensions" },
  { key: "script", zh: "用户脚本", en: "Userscripts" },
  { key: "desktop", zh: "桌面应用", en: "Desktop Apps" },
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
    shots: [
      { src: "/shots/ftms/dashboard.webp", zh: "数据看板", en: "Dashboard" },
      { src: "/shots/ftms/follow-ups.webp", zh: "跟单表", en: "Shipment tracker" },
      { src: "/shots/ftms/orders.webp", zh: "订单核算跟踪", en: "Order margins" },
      { src: "/shots/ftms/tax-refund.webp", zh: "退税管理", en: "Tax refunds" },
      { src: "/shots/ftms/login.webp", zh: "登录页", en: "Sign-in" },
    ],
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
    shots: [
      { src: "/shots/ems/dashboard.webp", zh: "工作台", en: "Workspace" },
      { src: "/shots/ems/leads.webp", zh: "线索雷达", en: "Lead radar" },
      { src: "/shots/ems/inbox.webp", zh: "统一收件箱", en: "Unified inbox" },
      { src: "/shots/ems/agents.webp", zh: "AI Agents", en: "AI agents" },
      { src: "/shots/ems/analytics.webp", zh: "经营分析", en: "Analytics" },
    ],
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
    shots: [
      { src: "/shots/wxformat3/editor.webp", zh: "左写右看", en: "Write & preview" },
      { src: "/shots/wxformat3/themes.webp", zh: "换一套主题", en: "Another theme" },
      { src: "/shots/wxformat3/customizer.webp", zh: "配色工坊", en: "Colour studio" },
    ],
  },

  /* ── 桌面应用 ───────────────────────────────────────────── */
  {
    slug: "macpleco",
    cat: "desktop",
    name: "MacPleco",
    desc: {
      zh: "Mac 清理工具。删什么都先进废纸篓，风险项一律不替你勾，每一条都写清它到底是什么、在哪个路径 —— 不靠制造焦虑卖清理。",
      en: "A calm Mac cleaner. Everything goes to the Trash first, risky items are never ticked for you, and every row says in plain words what it is and where it lives.",
    },
    tags: { zh: ["macOS 15+", "Swift 6", "清理 / 监控"], en: ["macOS 15+", "Swift 6", "Clean & Monitor"] },
    /* 借它自己的应用图标（去掉 macOS 图标外圈那层透明留白）—— 跟子站借 favicon 一个道理 */
    icon: "/icons/macpleco.png",
    dl: "https://github.com/decli/MacPleco/releases/latest",
    repo: "MacPleco",
    shots: [
      { src: "/shots/macpleco/overview.webp", zh: "概览 · 一屏说完", en: "Overview" },
      { src: "/shots/macpleco/clean.webp", zh: "清理 · 路径全摊开", en: "Clean" },
      { src: "/shots/macpleco/apps.webp", zh: "应用 · 连残留一起卸", en: "Apps" },
      { src: "/shots/macpleco/space.webp", zh: "空间 · 磁盘热力图", en: "Space" },
      { src: "/shots/macpleco/tune-up.webp", zh: "优化 · 八项对症修复", en: "Tune-Up" },
      { src: "/shots/macpleco/monitor.webp", zh: "监控 · 实时四表", en: "Monitor" },
    ],
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
    shots: [
      { src: "/shots/ip-geo/popup.webp", zh: "工具栏弹窗", en: "Toolbar popup" },
      { src: "/shots/ip-geo/options.webp", zh: "设置", en: "Settings" },
    ],
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
    shots: [
      { src: "/shots/jobornot/sidepanel.webp", zh: "侧边栏 · 两步开工", en: "Side panel" },
      { src: "/shots/jobornot/options.webp", zh: "设置 · 自带 Key", en: "Settings · BYOK" },
    ],
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
    /* 就是在这一页上截的 —— 这脚本本来就匹配所有网站，随便哪张网页都算数 */
    shots: [
      { src: "/shots/pagescroll/pill.webp", zh: "悬浮胶囊 · 就在这一页", en: "The pill, on this very page" },
      { src: "/shots/pagescroll/settings.webp", zh: "右键改默认位置", en: "Right-click to reposition" },
    ],
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
    /* 这台机器上没有安卓模拟器，截不了新的；直接引 CodeHelper README 里那张。
       它是 GitHub 的附件地址，拿不到就自己消失（见 index.html 的 onerror）——
       想要它跟别的一样稳，把图存进 CodeHelper 仓库再换成 /shots/ 下的本地副本 */
    shots: [
      {
        src: "https://github.com/user-attachments/assets/f3d01b4f-31aa-4289-be76-27b72f03ed24",
        zh: "首页 · 还没取的包裹",
        en: "Home · unclaimed parcels",
      },
    ],
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
