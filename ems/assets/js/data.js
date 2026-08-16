/* ==========================================================================
   EMS 体验版 · 模拟数据
   ⚠️ 全部为虚构数据。公司名、人名、域名、订单、金额均为演示用途杜撰，
      与任何真实企业或个人无关。
   数据结构刻意贴近 docs/02-技术方案.md 中的领域模型。
   ========================================================================== */

/* 产品与技术方案文档的位置（仓库目前只有开发分支，尚无 main）。
   将来合并到 main 后，把下面的 DOCS_REF 改成 'main' 即可，无需改其他地方。 */
const DOCS_REPO = 'https://github.com/decli/ExportMarketingSystem';
const DOCS_REF  = 'claude/foreign-trade-marketing-system-9pn4ty';
export const DOCS_URL = `${DOCS_REPO}/tree/${DOCS_REF}/docs`;
export const docLink  = (file) => `${DOCS_REPO}/blob/${DOCS_REF}/docs/${encodeURIComponent(file)}`;

export const ME = {
  name: '林薇',
  initials: '林',
  role: '外贸业务员',
  team: '欧洲组',
  company: '武汉昇镭激光设备有限公司',
  target: 40000000,         // 年度个人目标（CNY）
};

export const COMPANY_PROFILE = {
  name: '武汉昇镭激光设备有限公司',
  industry: '激光装备 / 光纤激光切割机',
  markets: ['德国', '美国', '墨西哥', '波兰', '土耳其', '巴西'],
  seats: 12,
  plan: 'Growth 版',
};

/* ---------- 线索雷达：数据源 ---------- */
export const LEAD_SOURCES = [
  { id: 'customs',  name: '海关数据',     desc: '80+ 国官方进出口提单记录', freshness: '日更', today: 1268, quality: 92, cost: '¥1.2/条', color: 'brand',  enabled: true },
  { id: 'linkedin', name: 'LinkedIn',     desc: '决策人职级与联系方式补全', freshness: '实时', today: 312,  quality: 88, cost: '席位内',  color: 'info',   enabled: true },
  { id: 'search',   name: '搜索引擎',     desc: 'Google/Bing 长尾关键词挖掘', freshness: '周更', today: 486,  quality: 64, cost: '¥0.1/条', color: 'purple', enabled: true },
  { id: 'maps',     name: '地图商户',     desc: 'Google Maps 本地钣金加工厂', freshness: '月更', today: 203,  quality: 71, cost: '¥0.1/条', color: 'ok',     enabled: true },
  { id: 'expo',     name: '展会名录',     desc: '汉诺威/芝加哥金属加工展名单', freshness: '按展', today: 88,   quality: 85, cost: '¥2.0/条', color: 'warn',   enabled: true },
  { id: 'visitor',  name: '官网访客识别', desc: '匿名访客反查公司（最高意向）', freshness: '实时', today: 37,  quality: 96, cost: '¥3.0/条', color: 'pink',   enabled: true },
];

/* ---------- 线索 ---------- */
export const LEADS = [
  { id:'L-8821', company:'Steinmetz Lasersysteme GmbH', country:'德国', flag:'🇩🇪', tz:'Europe/Berlin', source:'customs', score:94,
    contact:'Jonas Brenner', title:'Procurement Director', channels:['email','linkedin'],
    why:'近 6 个月从中国进口光纤激光切割设备 11 批次，单批均值 $86K，现有供应商 2 家、集中度低，采购频次上升 23%',
    breakdown:{ match:96, activity:92, entry:88, reach:98 }, hs:'8456.11', lastImport:'2026-07-28', status:'new' },
  { id:'L-8817', company:'Cascade Fabrication Systems Inc.', country:'美国', flag:'🇺🇸', tz:'America/Los_Angeles', source:'visitor', score:91,
    contact:'Daniel Ortiz', title:'VP Sourcing', channels:['email'],
    why:'昨日访问官网 4 次，浏览「6kW 光纤激光切割机」页面停留 6 分 20 秒，下载了 PDF 规格书',
    breakdown:{ match:93, activity:98, entry:74, reach:90 }, hs:'8456.11', lastImport:'2026-08-02', status:'new' },
  { id:'L-8809', company:'Grupo Corte Láser del Norte', country:'墨西哥', flag:'🇲🇽', tz:'America/Mexico_City', source:'customs', score:88,
    contact:'Alejandra Ruiz', title:'Compras Gerente', channels:['email','whatsapp'],
    why:'2026 年新增激光切割设备进口线，7 批次全部来自台湾与韩国供应商，单价高于市场均值 18%，切入空间大',
    breakdown:{ match:90, activity:86, entry:94, reach:82 }, hs:'8456.11', lastImport:'2026-07-19', status:'new' },
  { id:'L-8802', company:'Nordvik Metallteknikk AS', country:'挪威', flag:'🇳🇴', tz:'Europe/Oslo', source:'linkedin', score:83,
    contact:'Ingrid Solberg', title:'Head of Supply Chain', channels:['linkedin'],
    why:'公司近期发布钣金车间扩建公告，LinkedIn 在招 2 名激光设备操作技师，现有产线设备集中在欧洲品牌（高价）',
    breakdown:{ match:84, activity:78, entry:90, reach:76 }, hs:'8456.11', lastImport:'—', status:'new' },
  { id:'L-8798', company:'Ege Metal Makina San. Ltd.', country:'土耳其', flag:'🇹🇷', tz:'Europe/Istanbul', source:'expo', score:79,
    contact:'Emre Yılmaz', title:'General Manager', channels:['email','whatsapp'],
    why:'汉诺威金属加工展参展商，主营钣金件代工，设备需求与我方机型高度重合；土耳其市场我方尚无客户',
    breakdown:{ match:88, activity:62, entry:82, reach:80 }, hs:'8456.11', lastImport:'2026-05-11', status:'contacted' },
  { id:'L-8790', company:'Brasilcorte Máquinas Ltda.', country:'巴西', flag:'🇧🇷', tz:'America/Sao_Paulo', source:'customs', score:76,
    contact:'Carla Mendes', title:'Diretora Comercial', channels:['email'],
    why:'近 12 个月 5 批次进口，但单批金额较小（$12K 均值，以激光头与耗材为主），属成长型客户',
    breakdown:{ match:82, activity:70, entry:78, reach:72 }, hs:'8466.93', lastImport:'2026-06-30', status:'contacted' },
  { id:'L-8784', company:'PolTech Metalcut Sp. z o.o.', country:'波兰', flag:'🇵🇱', tz:'Europe/Warsaw', source:'search', score:72,
    contact:'—', title:'—', channels:[],
    why:'关键词「fiber laser cutting machine distributor Poland」自然结果首页，官网有明确经销商招募页',
    breakdown:{ match:80, activity:55, entry:85, reach:40 }, hs:'—', lastImport:'—', status:'new' },
  { id:'L-8771', company:'Rajkot Sheetmetal Works', country:'印度', flag:'🇮🇳', tz:'Asia/Kolkata', source:'maps', score:58,
    contact:'Vikram Patel', title:'Owner', channels:['whatsapp'],
    why:'本地钣金加工厂，评分 4.2/128 条评价；但印度市场价格敏感度高，与我方中高端定位偏差',
    breakdown:{ match:52, activity:60, entry:70, reach:66 }, hs:'—', lastImport:'—', status:'parked' },
];

/* ---------- 客户 ---------- */
export const CUSTOMERS = [
  { id:'C-1042', name:'Falkenberg Metalltechnik GmbH', short:'Falkenberg', country:'德国', flag:'🇩🇪', tz:'Europe/Berlin', utc:'+2',
    tier:'KA', owner:'林薇', pool:'private', stage:'已签约', amount:2860000, currency:'USD',
    contacts:[
      {name:'Markus Weber', title:'Procurement Director', email:'m.weber@falkenberg-mt.de', wa:'+49 170 ****213', optinEmail:'legitimate_interest', optinWA:'granted'},
      {name:'Sabine Koch',  title:'Quality Manager',      email:'s.koch@falkenberg-mt.de',  wa:'—', optinEmail:'granted', optinWA:'none'},
    ],
    firstContact:'2024-03-11', lastActivity:'2026-08-14', orders:7, aging:0,
    source:'展会名录 · 汉诺威 2024', assetScore:96,
    ai:'高价值稳定客户。最近 3 台设备均提前 2 天完成装配与调试，客户满意度高。检测到其 Q4 常规扩产窗口临近（历史 3 年均在 9 月上旬下单），建议 8 月下旬主动提交 Q4 排产方案 + 锁价提议。' },
  { id:'C-1038', name:'Cascade Fabrication Systems Inc.', short:'Cascade', country:'美国', flag:'🇺🇸', tz:'America/Los_Angeles', utc:'-7',
    tier:'A', owner:'林薇', pool:'private', stage:'已报价', amount:680000, currency:'USD',
    contacts:[{name:'Daniel Ortiz', title:'VP Sourcing', email:'d.ortiz@cascadefab.com', wa:'—', optinEmail:'granted', optinWA:'none'}],
    firstContact:'2026-05-02', lastActivity:'2026-08-15', orders:1, aging:0,
    source:'官网访客识别', assetScore:88,
    ai:'高意向。昨日重复访问官网 4 次并下载规格书，通常是内部评审的信号。报价已发出 6 天未回复 — 建议今天以「补充 FDA/CDRH 激光产品注册说明」为由跟进，避开直接催单。' },
  { id:'C-1031', name:'Grupo Corte Láser del Norte', short:'Corte Láser', country:'墨西哥', flag:'🇲🇽', tz:'America/Mexico_City', utc:'-6',
    tier:'A', owner:'张junhao', pool:'private', stage:'PI已发', amount:412000, currency:'USD',
    contacts:[{name:'Alejandra Ruiz', title:'Compras Gerente', email:'a.ruiz@cortelasernorte.mx', wa:'+52 81 ****4471', optinEmail:'legitimate_interest', optinWA:'granted'}],
    firstContact:'2026-04-18', lastActivity:'2026-08-13', orders:0, aging:0,
    source:'海关数据', assetScore:81,
    ai:'⚠️ PI 已发 9 天未签回。历史数据显示本行业 PI 超过 14 天未签回的成交率下降至 31%。建议改用 WhatsApp（客户已授权）语音跟进，西语沟通转化率更高。' },
  { id:'C-1024', name:'Ege Metal Makina San. Ltd.', short:'Ege Metal', country:'土耳其', flag:'🇹🇷', tz:'Europe/Istanbul', utc:'+3',
    tier:'B', owner:'林薇', pool:'private', stage:'需求明确', amount:186000, currency:'USD',
    contacts:[{name:'Emre Yılmaz', title:'General Manager', email:'emre@egemetalmakina.com.tr', wa:'+90 532 ****889', optinEmail:'legitimate_interest', optinWA:'none'}],
    firstContact:'2026-05-11', lastActivity:'2026-08-09', orders:0, aging:0,
    source:'展会名录', assetScore:74,
    ai:'客户已明确需求（12kW 大幅面机型，首批 2 台、年采购 4 台），但对认证有顾虑。建议下一步直接提供 CE 符合性声明、EN 60825-1 激光安全测试报告与既有欧洲客户案例（可脱敏）。' },
  { id:'C-1019', name:'Nordvik Metallteknikk AS', short:'Nordvik', country:'挪威', flag:'🇳🇴', tz:'Europe/Oslo', utc:'+2',
    tier:'B', owner:'王一诺', pool:'private', stage:'已触达', amount:0, currency:'USD',
    contacts:[{name:'Ingrid Solberg', title:'Head of Supply Chain', email:'i.solberg@nordvik-mt.no', wa:'—', optinEmail:'legitimate_interest', optinWA:'none'}],
    firstContact:'2026-08-01', lastActivity:'2026-08-08', orders:0, aging:0,
    source:'LinkedIn', assetScore:62,
    ai:'首封开发信已打开 3 次但未回复 — 有兴趣但未到行动点。序列将于 8/18 发送第二封（案例导向）。' },
  { id:'C-0987', name:'Brasilcorte Máquinas Ltda.', short:'Brasilcorte', country:'巴西', flag:'🇧🇷', tz:'America/Sao_Paulo', utc:'-3',
    tier:'C', owner:'—', pool:'public', stage:'无响应', amount:0, currency:'USD',
    contacts:[{name:'Carla Mendes', title:'Diretora Comercial', email:'c.mendes@brasilcorte.com.br', wa:'—', optinEmail:'legitimate_interest', optinWA:'none'}],
    firstContact:'2025-11-20', lastActivity:'2026-02-14', orders:0, aging:0,
    source:'海关数据', assetScore:48,
    ai:'已回收至公海（183 天无有效跟进）。海关数据显示其 2026 年设备进口量增长 40%，值得二次开发 — 建议换人换角度重启。' },
  { id:'C-0954', name:'Steinmetz Lasersysteme GmbH', short:'Steinmetz', country:'德国', flag:'🇩🇪', tz:'Europe/Berlin', utc:'+2',
    tier:'A', owner:'林薇', pool:'private', stage:'生产中', amount:940000, currency:'EUR',
    contacts:[{name:'Jonas Brenner', title:'Procurement Director', email:'brenner@steinmetz-laser.de', wa:'+49 171 ****508', optinEmail:'granted', optinWA:'granted'}],
    firstContact:'2025-02-09', lastActivity:'2026-08-15', orders:4, aging:0,
    source:'海关数据', assetScore:93,
    ai:'订单 SO-2609 生产中，客户验机节点 8/22。客户历来重视过程可视 — 建议在验机完成当天主动推送带图与切样视频的进度报告，历史上此举使复购间隔缩短约 3 周。' },
  { id:'C-0921', name:'PolTech Metalcut Sp. z o.o.', short:'PolTech', country:'波兰', flag:'🇵🇱', tz:'Europe/Warsaw', utc:'+2',
    tier:'C', owner:'王一诺', pool:'private', stage:'已发货', amount:78000, currency:'EUR',
    contacts:[{name:'Tomasz Nowak', title:'Purchasing', email:'t.nowak@poltech-metalcut.pl', wa:'—', optinEmail:'granted', optinWA:'none'}],
    firstContact:'2025-09-03', lastActivity:'2026-08-11', orders:2, aging:32,
    source:'搜索引擎', assetScore:70,
    ai:'⚠️ 尾款逾期 32 天（€23,400）。客户历史付款记录良好，可能是内部流程问题。建议由财务出面发正式对账函，而非销售催款。' },
];

/* ---------- 统一收件箱 ---------- */
export const INBOX = [
  { id:'M-5521', channel:'email', from:'Daniel Ortiz', company:'Cascade Fabrication Systems Inc.', flag:'🇺🇸',
    subject:'Re: Quotation Q-2608 — 6kW Fiber Laser Cutting Machine SL-FC3015',
    preview:'Hi Wei, thanks for the quote. Our engineering team reviewed the spec sheet. Two questions before we move forward…',
    localTime:'客户当地 22:14（昨夜）', receivedAt:'2026-08-15 13:14', unread:true, sla:'2h 12m', slaState:'warn',
    intent:['技术确认','议价'], priority:'高',
    aiSummary:'① 工程团队已通过规格评审（好信号）；② 询问激光器与切割头能否延长至 3 年质保（目前我方标配 2 年）；③ 若订单量提至 8 台，希望单价下调 6%。',
    aiSuggestion:'建议：质保可让步（成本影响约 1.2%），价格让 3.5% 并绑定 8 台批量与 30% 预付款。产品库显示该机型历史成交毛利 34%，让至 30.5% 仍健康。',
    draft:'Dear Daniel,\n\nThank you for the quick turnaround from your engineering team.\n\nOn the two points:\n\n1) Warranty — we can extend cover on the laser source and cutting head to 36 months for this configuration, parts and labour included, provided the machines are commissioned per our installation guide (attached) and use the recommended assist-gas purity.\n\n2) Pricing — at 8 units we can offer USD 75,270/unit (‑3.5% vs. quoted), with 30% deposit / 70% against copy of B/L. This price is valid for 21 days.\n\nI have attached the updated spec sheet with the 36-month warranty clause highlighted, plus the CE Declaration of Conformity and the EN 60825-1 laser safety test report for the SL-FC3015 series. The FDA/CDRH accession number for US import is included on page 4.\n\nWould a short call on Thursday 09:00 PST work to close out the remaining details?\n\nBest regards,\nWei Lin' },
  { id:'M-5518', channel:'whatsapp', from:'Alejandra Ruiz', company:'Grupo Corte Láser del Norte', flag:'🇲🇽',
    subject:'WhatsApp · PI-2607 状态',
    preview:'Hola Wei, disculpa la demora. El PI está con nuestro director financiero…',
    localTime:'客户当地 09:41（今晨）', receivedAt:'2026-08-15 23:41', unread:true, sla:'40m', slaState:'ok',
    intent:['流程进展'], priority:'高',
    aiSummary:'PI 已在其财务总监处审批，客户预计本周五前签回。同时询问能否把交期从 45 天压到 35 天。',
    aiSuggestion:'交期是这单的真实卡点，不是价格。建议今天就找生产确认 35 天可行性 — 若可行，主动回复即可显著提升签回概率。',
    draft:'Hola Alejandra,\n\nGracias por la actualización.\n\nSobre el plazo de entrega: he consultado con producción esta mañana. Podemos comprometernos a 38 días desde el pago del anticipo (en lugar de 45), reservando capacidad de línea la próxima semana para las cinco máquinas.\n\nSi el PI puede firmarse antes del viernes, mantengo la reserva de producción. ¿Le funciona?\n\nSaludos cordiales,\nWei' },
  { id:'M-5514', channel:'email', from:'Markus Weber', company:'Falkenberg Metalltechnik GmbH', flag:'🇩🇪',
    subject:'Q4 planning — indicative volumes',
    preview:'Wei, we are starting Q4 planning. Could you send indicative lead times for the 12 kW machines…',
    localTime:'客户当地 17:05（昨日）', receivedAt:'2026-08-15 23:05', unread:true, sla:'1h 16m', slaState:'ok',
    intent:['需求','复购'], priority:'高',
    aiSummary:'KA 客户主动启动 Q4 规划，询问 12kW 大幅面机型的交期与价格指引。这是年度最大单的前置信号（历史 Q4 订单均值 $780K）。',
    aiSuggestion:'不要只回交期。建议附上「Q4 产能预留方案 + 锁价协议」，把被动报价变成主动锁单。历史上该客户对锁价方案接受度高。',
    draft:'Dear Markus,\n\nGood to hear Q4 planning is underway.\n\nFor the SL-FC4020-12K, current lead time is 42 days ex-works. Given the Q4 congestion we both saw last year, I would like to propose something more useful than a lead time:\n\n• Reserved assembly slots for weeks 41–47 (up to 9 machines)\n• Price lock at the current level through 31 Dec 2026, protecting against the laser-source cost movement we are seeing\n• Consolidated shipping to Hamburg every two weeks\n\nIn exchange we would need indicative volumes by 5 September — no firm commitment required.\n\nI have attached a one-page summary. Shall I hold the capacity while you review?\n\nBest regards,\nWei' },
  { id:'M-5509', channel:'form', from:'Ahmed Al-Farsi', company:'Gulf Metal Works LLC', flag:'🇦🇪',
    subject:'官网表单 · 询价：Fiber laser cutting machine 3015, 3kW',
    preview:'We are a distributor in Dubai looking for a long-term supplier of fiber laser cutting machines…',
    localTime:'客户当地 19:22（昨日）', receivedAt:'2026-08-15 23:22', unread:false, sla:'已响应 · 38m', slaState:'ok',
    intent:['新询盘','经销合作'], priority:'中',
    aiSummary:'迪拜经销商，寻找长期供应商，首单意向 2 台 3kW 3015 机型，要求提供 FOB 与 CIF Jebel Ali 两种报价，并询问本地备件支持。',
    aiSuggestion:'新客户 + 经销商定位，建议先做资质核验（公司注册、既往进口记录）再报价。系统已自动查询海关数据：该公司近 12 个月有 6 批次金属加工设备进口记录 ✓ 真实买家。',
    draft:'' },
  { id:'M-5501', channel:'email', from:'Tomasz Nowak', company:'PolTech Metalcut', flag:'🇵🇱',
    subject:'Re: Payment reminder — Invoice INV-2605',
    preview:'Wei, sorry for the delay. Our accounting is migrating systems…',
    localTime:'客户当地 11:30（8/13）', receivedAt:'2026-08-13 17:30', unread:false, sla:'已响应', slaState:'ok',
    intent:['付款'], priority:'高',
    aiSummary:'客户称财务系统迁移导致付款延迟，承诺 8 月底前结清 €23,400 尾款。',
    aiSuggestion:'口头承诺已 3 次。建议升级处理：由财务发正式对账函并要求书面付款计划，同时暂停新订单接单（金额已达该客户信用上限的 85%）。',
    draft:'' },
];

/* ---------- 商机 ---------- */
export const DEAL_STAGES = [
  { key:'contacted', name:'已触达',   color:'#94a3b8' },
  { key:'engaged',   name:'有回应',   color:'#38bdf8' },
  { key:'qualified', name:'需求明确', color:'#6366f1' },
  { key:'quoted',    name:'已报价',   color:'#a855f7' },
  { key:'pi',        name:'PI已发',   color:'#f59e0b' },
  { key:'won',       name:'已签约',   color:'#10b981' },
];

export const DEALS = [
  { id:'D-3301', name:'Cascade · 6kW 切割机 8 台首单',      company:'Cascade Fabrication', flag:'🇺🇸', amount:680000,  stage:'quoted',    owner:'林薇',   days:6,  prob:65, next:'跟进质保与价格让步' },
  { id:'D-3298', name:'Corte Láser · 5 台年度框架',          company:'Grupo Corte Láser del Norte', flag:'🇲🇽', amount:412000, stage:'pi', owner:'张junhao', days:9, prob:55, next:'PI 签回（已逾期）', risk:true },
  { id:'D-3294', name:'Falkenberg · Q4 扩产 9 台',           company:'Falkenberg Metalltechnik', flag:'🇩🇪', amount:780000,  stage:'qualified', owner:'林薇',   days:1,  prob:72, next:'提交产能预留 + 锁价方案' },
  { id:'D-3288', name:'Ege Metal · 12kW 大幅面首批 2 台',     company:'Ege Metal Makina', flag:'🇹🇷', amount:186000,  stage:'qualified', owner:'林薇',   days:6,  prob:40, next:'提供 CE / EN 60825-1 报告与欧洲案例' },
  { id:'D-3281', name:'Gulf Metal Works · 3kW 首单 2 台',     company:'Gulf Metal Works', flag:'🇦🇪', amount:96000,   stage:'engaged',   owner:'王一诺', days:0,  prob:25, next:'资质核验后报价' },
  { id:'D-3277', name:'Nordvik · 钣金车间扩建配套',           company:'Nordvik Metallteknikk', flag:'🇳🇴', amount:240000, stage:'contacted', owner:'王一诺', days:7, prob:15, next:'序列第 2 封（8/18）' },
  { id:'D-3269', name:'Steinmetz · 2026 年度框架',            company:'Steinmetz Lasersysteme', flag:'🇩🇪', amount:940000,  stage:'won',       owner:'林薇',   days:0,  prob:100, next:'生产中 · 客户验机 8/22' },
  { id:'D-3255', name:'Falkenberg · Q3 追加',                 company:'Falkenberg Metalltechnik', flag:'🇩🇪', amount:2860000, stage:'won',      owner:'林薇',   days:0,  prob:100, next:'已发货 · 尾款 9/02' },
  { id:'D-3248', name:'Brasilcorte · 试单 1 台',              company:'Brasilcorte Máquinas', flag:'🇧🇷', amount:34000,   stage:'contacted', owner:'—',    days:183, prob:5, next:'已回收公海', risk:true },
];

/* ---------- 触达序列 ---------- */
export const SEQUENCES = [
  { id:'SEQ-01', name:'德语区 · 钣金加工厂决策人开发', lang:'德语/英语', active:true, enrolled:284, replied:41, meetings:12, opted:6,
    steps:[
      { day:0,  ch:'email',    title:'价值切入：引用其设备进口记录',  note:'个性化字段：进口批次数 / 设备功率段 / 现有供应商国别', rate:'打开 62% · 回复 9%' },
      { day:3,  ch:'email',    title:'未打开则换标题重发',         note:'改用不同时段（客户当地 08:15）投递',                rate:'打开 +18%' },
      { day:5,  ch:'linkedin', title:'连接请求 + 一句话',          note:'仅当邮件已打开未回复时触发',                        rate:'接受 34%' },
      { day:8,  ch:'email',    title:'切样视频 + 具体价格区间',    note:'附同区域客户脱敏案例与实际切割样件视频',            rate:'回复 14%' },
      { day:12, ch:'whatsapp', title:'简短跟进（需 opt-in）',      note:'⛔ 未获 opt-in 的联系人自动跳过此步',               rate:'回复 22%' },
      { day:20, ch:'email',    title:'最后一次 + 明确退出选项',    note:'无响应转入培育池，季度复跟',                        rate:'回复 6%' },
    ] },
  { id:'SEQ-02', name:'拉美 · 西语市场开发', lang:'西班牙语', active:true, enrolled:156, replied:29, meetings:8, opted:3,
    steps:[
      { day:0,  ch:'email',    title:'西语开发信 · 性价比切入',    note:'与台湾/韩国设备的配置与价格对比', rate:'打开 58% · 回复 12%' },
      { day:4,  ch:'whatsapp', title:'WhatsApp 语音介绍（需 opt-in）', note:'拉美 WhatsApp 渗透率高，效果显著', rate:'回复 31%' },
      { day:9,  ch:'email',    title:'案例 + 报价区间',            note:'—', rate:'回复 11%' },
      { day:18, ch:'email',    title:'收尾',                       note:'—', rate:'回复 5%' },
    ] },
  { id:'SEQ-03', name:'沉睡客户盘活 · 12 个月未成交', lang:'英语', active:false, enrolled:412, replied:38, meetings:6, opted:14,
    steps:[
      { day:0,  ch:'email', title:'新机型/新认证告知（不催单）', note:'纯价值信息，无销售动作', rate:'打开 44% · 回复 6%' },
      { day:10, ch:'email', title:'行业价格与光源成本趋势简报',  note:'内容营销型', rate:'回复 4%' },
      { day:30, ch:'email', title:'一次性询问是否仍有需求',      note:'明确退出选项', rate:'回复 3%' },
    ] },
];

export const DOMAIN_HEALTH = [
  { domain:'shenglei-laser.com',   role:'主域 · 交易邮件', spf:'ok', dkim:'ok', dmarc:'p=reject',      score:96, sent:842,  bounce:0.4, complaint:0.01, age:'4 年 2 月', state:'健康' },
  { domain:'shenglei-machinery.com', role:'冷开发子域 A',  spf:'ok', dkim:'ok', dmarc:'p=quarantine',  score:88, sent:1240, bounce:2.1, complaint:0.04, age:'11 个月', state:'健康' },
  { domain:'sl-industrial.com',    role:'冷开发子域 B',    spf:'ok', dkim:'ok', dmarc:'p=none',        score:64, sent:380,  bounce:4.8, complaint:0.11, age:'28 天',   state:'预热中' },
  { domain:'shenglei-parts.net',   role:'冷开发子域 C',    spf:'warn',dkim:'ok', dmarc:'缺失',          score:41, sent:0,    bounce:0,   complaint:0,    age:'6 天',    state:'待配置' },
];

/* ---------- 报价与 PI ---------- */
export const QUOTES = [
  { id:'Q-2608', company:'Cascade Fabrication Systems Inc.', flag:'🇺🇸', ver:3, incoterm:'FOB Shanghai', amount:624000, currency:'USD',
    margin:34.2, fx:'7.16', validUntil:'2026-09-05', status:'待回复', items:6, sentAt:'2026-08-09' },
  { id:'Q-2607', company:'Grupo Corte Láser del Norte', flag:'🇲🇽', ver:2, incoterm:'CIF Manzanillo', amount:412000, currency:'USD',
    margin:29.8, fx:'7.16', validUntil:'2026-08-31', status:'已转 PI', items:4, sentAt:'2026-08-02' },
  { id:'Q-2606', company:'Ege Metal Makina San. Ltd.', flag:'🇹🇷', ver:1, incoterm:'FOB Shanghai', amount:186000, currency:'USD',
    margin:31.5, fx:'7.16', validUntil:'2026-09-10', status:'待回复', items:3, sentAt:'2026-08-06' },
  { id:'Q-2603', company:'Falkenberg Metalltechnik GmbH', flag:'🇩🇪', ver:5, incoterm:'DDP Hamburg', amount:2860000, currency:'USD',
    margin:36.1, fx:'7.16', validUntil:'2026-07-20', status:'已成交', items:12, sentAt:'2026-06-28' },
];

export const PI_SAMPLE = {
  no:'PI-2607', date:'2026-08-06', buyer:'Grupo Corte Láser del Norte S.A. de C.V.',
  address:'Av. Constitución 1234, Monterrey, N.L. 64000, México',
  seller:'Wuhan Shenglei Laser Equipment Co., Ltd.',
  incoterm:'CIF Manzanillo', payment:'30% T/T deposit, 70% against copy of B/L',
  leadTime:'38 days after deposit', port:'Shanghai, China → Manzanillo, Mexico',
  packing:'Machines wrapped in VCI film and bolted to steel base frames in 40\'HQ containers; accessories in fumigated wooden cases (ISPM 15)',
  validity:'2026-08-31', currency:'USD',
  items:[
    { no:1, desc:'Fiber Laser Cutting Machine · SL-FC3015-6K', spec:'6kW source, 3000×1500mm, exchange table, CE / EN 60825-1', qty:4, unit:'set', price:82000, amount:328000 },
    { no:2, desc:'Fiber Laser Cutting Machine · SL-FC3015-3K', spec:'3kW source, 3000×1500mm, single table, CE / EN 60825-1',   qty:1, unit:'set', price:48000, amount:48000  },
    { no:3, desc:'Spare parts kit',                            spec:'Protective lenses, nozzles, ceramic rings — 1 year usage', qty:5, unit:'set', price:2400,  amount:12000  },
    { no:4, desc:'Freight & insurance (CIF)',                  spec:'Manzanillo, 3 × 40\'HQ',                                   qty:1, unit:'lot', price:24000, amount:24000  },
  ],
  total:412000,
};

/* ---------- 订单 ---------- */
export const ORDERS = [
  { id:'SO-2609', company:'Steinmetz Lasersysteme GmbH', flag:'🇩🇪', amount:940000, currency:'EUR', signed:'2026-06-28',
    etd:'2026-09-05', progress:58, state:'生产中', owner:'林薇',
    milestones:[
      { name:'定金到账', planned:'07-02', actual:'07-01', state:'done' },
      { name:'备料',     planned:'07-10', actual:'07-09', state:'done' },
      { name:'装配调试', planned:'08-20', actual:'—',     state:'doing' },
      { name:'客户验机', planned:'08-22', actual:'—',     state:'todo' },
      { name:'订舱',     planned:'08-28', actual:'—',     state:'todo' },
      { name:'报关',     planned:'09-02', actual:'—',     state:'todo' },
      { name:'开船',     planned:'09-05', actual:'—',     state:'todo' },
      { name:'尾款',     planned:'09-20', actual:'—',     state:'todo' },
    ],
    docs:[
      { name:'销售合同', state:'ok' }, { name:'形式发票', state:'ok' }, { name:'装箱单', state:'pending' },
      { name:'商业发票', state:'pending' }, { name:'提单', state:'pending' }, { name:'原产地证 (FORM A)', state:'missing' },
    ],
    tasks:[
      { dept:'生产部', text:'客户指定 IPG 光源替代标配国产光源（非标配置）', ack:true,  by:'陈工', at:'07-11' },
      { dept:'品质部', text:'每台需附 CE 符合性声明与 EN 60825-1 激光安全测试报告', ack:true,  by:'刘工', at:'07-12' },
      { dept:'单证部', text:'原产地证需在开船前 5 天办妥（客户清关要求）', ack:false, by:'—', at:'—' },
    ] },
  { id:'SO-2605', company:'Falkenberg Metalltechnik GmbH', flag:'🇩🇪', amount:2860000, currency:'USD', signed:'2026-05-14',
    etd:'2026-08-08', progress:92, state:'已发货', owner:'林薇',
    milestones:[
      { name:'定金到账', planned:'05-18', actual:'05-17', state:'done' },
      { name:'备料',     planned:'05-28', actual:'05-26', state:'done' },
      { name:'装配调试', planned:'07-20', actual:'07-18', state:'done' },
      { name:'客户验机', planned:'07-24', actual:'07-23', state:'done' },
      { name:'订舱',     planned:'07-30', actual:'07-29', state:'done' },
      { name:'报关',     planned:'08-05', actual:'08-04', state:'done' },
      { name:'开船',     planned:'08-08', actual:'08-08', state:'done' },
      { name:'尾款',     planned:'09-02', actual:'—',     state:'todo' },
    ],
    docs:[{name:'销售合同',state:'ok'},{name:'形式发票',state:'ok'},{name:'装箱单',state:'ok'},{name:'商业发票',state:'ok'},{name:'提单',state:'ok'},{name:'原产地证',state:'ok'}],
    tasks:[{ dept:'物流部', text:'到港后通知客户预约清关行与吊装设备', ack:true, by:'赵敏', at:'08-08' }] },
  { id:'SO-2598', company:'PolTech Metalcut', flag:'🇵🇱', amount:78000, currency:'EUR', signed:'2026-04-02',
    etd:'2026-06-12', progress:100, state:'待收尾款', owner:'王一诺',
    milestones:[
      { name:'定金到账', planned:'04-08', actual:'04-07', state:'done' },
      { name:'装配调试', planned:'05-25', actual:'05-24', state:'done' },
      { name:'开船',     planned:'06-12', actual:'06-12', state:'done' },
      { name:'尾款',     planned:'07-14', actual:'—',     state:'overdue' },
    ],
    docs:[{name:'销售合同',state:'ok'},{name:'商业发票',state:'ok'},{name:'提单',state:'ok'}],
    tasks:[{ dept:'财务部', text:'尾款逾期 32 天，已发第 3 次提醒', ack:true, by:'孙财', at:'08-11' }] },
];

/* ---------- 站群 ---------- */
export const SITES = [
  { id:46, name:'ShengleiLaser', domain:'shenglei-laser.com', role:'母站', lang:'英语', framework:'Astro',
    online:true, build:'成功 · v18', pages:86, traffic:12480, leads:37, seo:88, geo:74, updated:'2026-08-14',
    colors:['#0f172a','#2563eb','#38bdf8'] },
  { id:45, name:'Laserschneidmaschine DE', domain:'laserschneidmaschine.de', role:'子站 · 德语', lang:'德语', framework:'Astro',
    online:true, build:'成功 · v9', pages:42, traffic:5230, leads:19, seo:81, geo:69, updated:'2026-08-12',
    colors:['#1e293b','#d97706','#0ea5e9'], parent:'shenglei-laser.com' },
  { id:43, name:'Cortadora Láser MX', domain:'cortadoralaser.mx', role:'子站 · 西语', lang:'西班牙语', framework:'Astro',
    online:true, build:'成功 · v6', pages:31, traffic:2870, leads:11, seo:72, geo:58, updated:'2026-08-10',
    colors:['#7f1d1d','#d4a373','#84a98c'], parent:'shenglei-laser.com' },
  { id:42, name:'Découpe Laser FR', domain:'decoupe-laser-machine.fr', role:'子站 · 法语', lang:'法语', framework:'Astro',
    online:true, build:'构建中 · v3', pages:24, traffic:1140, leads:4, seo:64, geo:47, updated:'2026-08-15',
    colors:['#1d4ed8','#0f172a','#f97316'], parent:'shenglei-laser.com' },
  { id:41, name:'Lazer Kesim TR', domain:'lazerkesimmakinesi.com.tr', role:'子站 · 土耳其语', lang:'土耳其语', framework:'Astro',
    online:false, build:'未构建', pages:12, traffic:0, leads:0, seo:38, geo:22, updated:'2026-08-15',
    colors:['#1d4ed8','#0f172a','#f97316'], parent:'shenglei-laser.com' },
];

export const SEO_AUDIT = [
  { item:'Google 收录页面数', value:'78 / 86', state:'warn', note:'8 个页面未收录，建议提交 sitemap 并检查 canonical' },
  { item:'核心词首页排名',   value:'11 / 24',  state:'ok',   note:'"fiber laser cutting machine manufacturer china" 第 4 位' },
  { item:'页面速度 (LCP)',   value:'1.4s',     state:'ok',   note:'静态托管 + CDN，移动端 92 分' },
  { item:'Schema.org 结构化数据', value:'Product ✓ FAQ ✓ Organization ✓ HowTo ✗', state:'warn', note:'补 HowTo 可提升 AI 引用概率' },
  { item:'hreflang 配置',    value:'4 语种正确', state:'ok',  note:'母子站互链完整，无重复内容风险' },
  { item:'AI 搜索引用监测',  value:'6 次 / 30 天', state:'warn', note:'ChatGPT 3 次、Perplexity 2 次、Gemini 1 次；行业头部为 20+ 次' },
  { item:'可被引用事实段落', value:'覆盖 41%',  state:'warn', note:'建议为每个机型页补充「功率-板厚切割能力对照表 + 认证声明」' },
];

/* ---------- 内容工厂 ---------- */
export const CONTENT = [
  { id:'A-311', title:'Fiber Laser Cutting Machine Buying Guide (2026): 1.5kW to 12kW', lang:'英语', type:'指南',
    kw:'fiber laser cutting machine buying guide', vol:2400, diff:38, state:'已发布', geo:['FAQ','SpecTable','HowTo'], views:1820, leads:6, site:'shenglei-laser.com' },
  { id:'A-309', title:'3 kW oder 6 kW? Welche Laserleistung für Ihre Blechdicke?', lang:'德语', type:'对比',
    kw:'laserschneidmaschine 3kw 6kw', vol:880, diff:24, state:'已发布', geo:['FAQ','ComparisonTable'], views:940, leads:4, site:'laserschneidmaschine.de' },
  { id:'A-306', title:'EN 60825-1 Laser Safety Classes Explained (with CE checklist)', lang:'英语', type:'技术',
    kw:'EN 60825-1 laser safety class', vol:1600, diff:31, state:'已发布', geo:['HowTo','FAQ'], views:2140, leads:9, site:'shenglei-laser.com' },
  { id:'A-314', title:'Cómo elegir un proveedor de máquinas de corte láser en China', lang:'西班牙语', type:'指南',
    kw:'proveedor máquinas corte láser china', vol:590, diff:19, state:'待审核', geo:['FAQ','Checklist'], views:0, leads:0, site:'cortadoralaser.mx' },
  { id:'A-315', title:'Laser Cutting Head Maintenance Checklist (Printable)', lang:'英语', type:'工具',
    kw:'laser cutting head maintenance', vol:3100, diff:44, state:'AI 撰写中', geo:['HowTo','Checklist'], views:0, leads:0, site:'shenglei-laser.com' },
  { id:'A-316', title:'Comparatif : machines de découpe laser européennes vs chinoises', lang:'法语', type:'对比',
    kw:'machine découpe laser chine', vol:420, diff:22, state:'选题池', geo:[], views:0, leads:0, site:'decoupe-laser-machine.fr' },
];

export const TOPIC_RADAR = [
  { topic:'laser cutting machine for EV battery tray', vol:1900, trend:'+142%', reason:'电动车电池托盘量产爆发，AI 搜索中该问题被频繁提问，竞品内容覆盖为 0', pri:'高' },
  { topic:'fiber laser vs CO2 laser for stainless steel', vol:720, trend:'+31%',  reason:'选型对照类问题，AI 极易引用结构化对照表', pri:'高' },
  { topic:'laser cutting machine lead time from china',   vol:390,  trend:'+58%',  reason:'采购决策期问题，转化意图极强', pri:'高' },
  { topic:'best fiber laser cutting machine brands 2026', vol:2600, trend:'+12%',  reason:'榜单型关键词，需要第三方权威信源支撑', pri:'中' },
];

/* ---------- AI Agents ---------- */
export const AGENTS = [
  { id:45, name:'lead-hunter',        desc:'多源线索挖掘 · 评分 · 去重入池',        level:'L2', enabled:true,  runs24:14, tasks:29, success:96, cost:42.6,  tools:['customs.search','maps.search','llm.score'], updated:'2026-08-15 09:12' },
  { id:44, name:'inbox-triage',       desc:'询盘分诊 · 摘要 · 意向打标 · SLA 预警',  level:'L2', enabled:true,  runs24:58, tasks:58, success:99, cost:18.3,  tools:['mail.read','llm.classify','crm.write'], updated:'2026-08-15 23:41' },
  { id:42, name:'reply-drafter',      desc:'基于产品库与历史成交生成回复草稿',      level:'L1', enabled:true,  runs24:31, tasks:31, success:94, cost:66.1,  tools:['kb.retrieve','quote.calc','llm.write'], updated:'2026-08-15 23:44' },
  { id:41, name:'sequence-runner',    desc:'多渠道序列执行 · 限速与合规护栏',        level:'L2', enabled:true,  runs24:6,  tasks:212, success:98, cost:9.4,  tools:['email.send','linkedin.act','whatsapp.send'], updated:'2026-08-15 20:00' },
  { id:40, name:'content-writer',     desc:'选题 → 多语言成文 → GEO 结构化输出',     level:'L1', enabled:true,  runs24:3,  tasks:5,   success:100,cost:88.2, tools:['seo.research','llm.write','schema.build'], updated:'2026-08-15 14:30' },
  { id:38, name:'deliverability-guard',desc:'发信域健康监控 · 自动降速与熔断',       level:'L3', enabled:true,  runs24:24, tasks:24,  success:100,cost:1.2,  tools:['dns.check','dmarc.parse','postmaster.api'], updated:'2026-08-15 22:00' },
  { id:37, name:'compliance-officer', desc:'opt-in 校验 · 退订同步 · 审计报告（拦截式）', level:'L3', enabled:true, runs24:212, tasks:212, success:100, cost:0.8, tools:['optin.check','unsub.sync','audit.log'], updated:'2026-08-15 23:59' },
  { id:35, name:'deal-coach',         desc:'商机停滞诊断 · 下一步建议 · 丢单归因',   level:'L1', enabled:true,  runs24:1,  tasks:9,   success:100,cost:12.7, tools:['crm.read','llm.analyze'], updated:'2026-08-15 08:00' },
  { id:33, name:'order-tracker',      desc:'订单节点跟催 · 客户进度通报草稿',        level:'L1', enabled:true,  runs24:2,  tasks:6,   success:100,cost:5.3,  tools:['erp.read','llm.write'], updated:'2026-08-15 08:05' },
  { id:29, name:'site-builder',       desc:'站点生成 · 构建 · Git 部署',            level:'L1', enabled:true,  runs24:1,  tasks:1,   success:100,cost:31.0, tools:['astro.build','git.push','cdn.purge'], updated:'2026-08-15 11:20' },
  { id:27, name:'seo-geo-auditor',    desc:'收录/排名/AI 引用监测与优化建议',        level:'L2', enabled:true,  runs24:1,  tasks:5,   success:100,cost:7.9,  tools:['gsc.api','serp.check','ai.citation'], updated:'2026-08-15 06:00' },
  { id:24, name:'contact-enricher',   desc:'决策人邮箱/职级/社媒补全',              level:'L2', enabled:false, runs24:0,  tasks:0,   success:0,  cost:0,    tools:['linkedin.enrich','email.verify'], updated:'2026-08-10 16:40' },
];

export const AGENT_GOAL = {
  id:'G-118', objective:'本季度在墨西哥市场获取 30 个高意向线索（评分 ≥ 80）',
  owner:'张junhao', deadline:'2026-09-30', progress:19, target:30,
  budget:{ used:1284, total:5000, unit:'credits' },
  plan:[
    { n:1, title:'海关数据筛选墨西哥金属加工设备进口商', agent:'lead-hunter',      state:'done',    out:'筛得 214 家，评分 ≥80 共 41 家' },
    { n:2, title:'补全决策人联系方式',             agent:'contact-enricher', state:'done',    out:'41 家中 33 家取得决策人邮箱' },
    { n:3, title:'生成西语开发内容与落地页',        agent:'content-writer',   state:'done',    out:'1 篇指南 + 1 个落地页已发布' },
    { n:4, title:'执行西语序列 SEQ-02',            agent:'sequence-runner',  state:'running', out:'已入组 33 人 · 已回复 7 人' },
    { n:5, title:'回复分诊与转人工',               agent:'inbox-triage',     state:'running', out:'7 条回复中 5 条判定为高意向' },
    { n:6, title:'阶段复盘与话术优化',             agent:'deal-coach',       state:'todo',    out:'—' },
  ],
};

export const AGENT_RUN_LOG = [
  { t:'23:44:12', agent:'reply-drafter', lvl:'ok',    step:'llm.write',      msg:'为 M-5521（Cascade Fabrication）生成回复草稿，引用产品库 SL-FC3015-6K 参数与历史成交价区间', meta:'claude-opus · 2,140 tok · ¥1.82 · 3.4s' },
  { t:'23:43:58', agent:'reply-drafter', lvl:'info',  step:'kb.retrieve',    msg:'检索知识库：SL-FC3015 质保政策 / 8 台阶梯价 / CE 与 EN 60825-1 报告位置（命中 4 条）', meta:'pgvector · 0.3s' },
  { t:'23:41:07', agent:'inbox-triage',  lvl:'ok',    step:'llm.classify',   msg:'M-5518（WhatsApp · Corte Láser del Norte）分诊完成 → 意向「流程进展」，优先级高', meta:'claude-haiku · 610 tok · ¥0.04' },
  { t:'23:22:31', agent:'lead-hunter',   lvl:'ok',    step:'customs.search', msg:'核验 Gulf Metal Works LLC：近 12 个月 6 批次金属加工设备进口记录 ✓ 真实买家', meta:'customs-api · 1.1s' },
  { t:'22:00:00', agent:'deliverability-guard', lvl:'warn', step:'dmarc.parse', msg:'sl-industrial.com 退信率升至 4.8%（阈值 4%）→ 自动降速至 60 封/日并暂停新入组', meta:'自动执行 · L3 授权范围内' },
  { t:'20:00:14', agent:'sequence-runner', lvl:'block', step:'whatsapp.send', msg:'SEQ-01 第 5 步：3 位联系人未获 WhatsApp opt-in → 已跳过（合规拦截器）', meta:'compliance-officer 拦截 · 已记入审计' },
  { t:'20:00:02', agent:'sequence-runner', lvl:'ok',   step:'email.send',    msg:'SEQ-01 第 4 步投递 28 封（按客户本地时间 09:00 窗口排程）', meta:'shenglei-machinery.com · 限速内' },
  { t:'14:30:22', agent:'content-writer',  lvl:'hold', step:'human.review',  msg:'A-314 西语指南已完成，等待人工审核后发布（L1 草稿模式）', meta:'已挂起 9h 12m · 待林薇处理' },
  { t:'11:20:45', agent:'site-builder',    lvl:'ok',   step:'git.push',      msg:'decoupe-laser-machine.fr 构建 v3 → 已推送并触发 CDN 刷新', meta:'Astro 4.6 · 24 页 · 38s' },
  { t:'09:12:03', agent:'lead-hunter',     lvl:'ok',   step:'llm.score',     msg:'新增线索 47 条，评分完成；≥80 分 12 条已推送至「今日建议开发」', meta:'claude-haiku · 批量 · ¥3.20' },
  { t:'08:00:11', agent:'deal-coach',      lvl:'warn', step:'llm.analyze',   msg:'D-3298（Corte Láser del Norte）PI 已发 9 天未签回 → 生成诊断与建议动作，已推送给负责人', meta:'claude-sonnet · ¥0.91' },
  { t:'06:00:00', agent:'seo-geo-auditor', lvl:'info', step:'ai.citation',   msg:'AI 引用监测：过去 30 天被引用 6 次（ChatGPT 3 / Perplexity 2 / Gemini 1）', meta:'定时任务' },
];

/* ---------- 经营分析 ---------- */
export const CHANNEL_ROI = [
  { ch:'主动开发（海关数据）', spend:380000,  leads:412, deals:9,  revenue:10400000, color:'#2563eb' },
  { ch:'独立站 SEO/GEO',      spend:520000,  leads:186, deals:11, revenue:13100000, color:'#10b981' },
  { ch:'B2B 平台（阿里）',     spend:960000,  leads:520, deals:7,  revenue:5500000,  color:'#f59e0b' },
  { ch:'展会',                spend:1800000, leads:96,  deals:6,  revenue:11800000, color:'#a855f7' },
  { ch:'LinkedIn 社媒',       spend:240000,  leads:143, deals:4,  revenue:3500000,  color:'#0ea5e9' },
  { ch:'老客户复购/转介',      spend:120000,  leads:64,  deals:14, revenue:19400000, color:'#ec4899' },
];

export const MONTHLY_REVENUE = [
  { m:'2月', v:520 }, { m:'3月', v:680 }, { m:'4月', v:610 }, { m:'5月', v:830 },
  { m:'6月', v:950 }, { m:'7月', v:880 }, { m:'8月', v:1120 },
];

export const FUNNEL = [
  { name:'线索',     v:1421, color:'#93c5fd' },
  { name:'已触达',   v:1086, color:'#60a5fa' },
  { name:'有回应',   v:318,  color:'#3b82f6' },
  { name:'需求明确', v:164,  color:'#2563eb' },
  { name:'已报价',   v:92,   color:'#1d4ed8' },
  { name:'PI已发',   v:58,   color:'#1e40af' },
  { name:'已签约',   v:41,   color:'#10b981' },
];

export const TEAM = [
  { name:'林薇',    role:'欧洲组',   deals:14, revenue:27200000, respond:96, followRate:92, zombie:4,  assets:94 },
  { name:'张junhao',role:'拉美组',   deals:9,  revenue:14100000, respond:88, followRate:79, zombie:12, assets:81 },
  { name:'王一诺',  role:'北美组',   deals:7,  revenue:9800000,  respond:74, followRate:66, zombie:23, assets:68 },
  { name:'陈曦',    role:'中东/非洲', deals:6,  revenue:7400000,  respond:91, followRate:84, zombie:8,  assets:86 },
  { name:'刘洋',    role:'亚太组',   deals:5,  revenue:5200000,  respond:69, followRate:58, zombie:31, assets:59 },
];

export const MARKET_DIST = [
  { c:'德国',  v:2280, flag:'🇩🇪' }, { c:'美国', v:1560, flag:'🇺🇸' }, { c:'墨西哥', v:840, flag:'🇲🇽' },
  { c:'波兰',  v:490,  flag:'🇵🇱' }, { c:'土耳其', v:384, flag:'🇹🇷' }, { c:'巴西', v:312, flag:'🇧🇷' },
  { c:'挪威',  v:246,  flag:'🇳🇴' }, { c:'阿联酋', v:228, flag:'🇦🇪' },
];

export const LOST_REASONS = [
  { r:'价格高于竞品', v:34 }, { r:'交期过长', v:22 }, { r:'认证不满足', v:16 },
  { r:'客户预算取消', v:12 }, { r:'选择了本地供应商', v:10 }, { r:'其他', v:6 },
];

/* ---------- 合规 ---------- */
export const COMPLIANCE = {
  optin:{ granted:1284, legitimate:2960, none:412, withdrawn:87 },
  unsub:{ total:203, last30:38, avgRemoveHours:0.4 },
  lia:[
    { scenario:'德语区钣金加工厂冷邮件开发', region:'EU', status:'已批准', by:'法务顾问 · 周律', at:'2026-03-12', review:'2027-03-12' },
    { scenario:'拉美市场西语开发（含 WhatsApp）', region:'LATAM', status:'已批准', by:'法务顾问 · 周律', at:'2026-04-08', review:'2027-04-08' },
    { scenario:'英国经销商开发', region:'UK', status:'待审核', by:'—', at:'—', review:'—' },
  ],
  audit:[
    { t:'2026-08-15 20:00', actor:'compliance-officer', act:'拦截发送', target:'SEQ-01 · 3 位联系人', detail:'WhatsApp 营销消息缺少 opt-in 证据' },
    { t:'2026-08-15 16:22', actor:'林薇',               act:'导出客户数据', target:'欧洲组 · 128 条', detail:'导出行为已记录，含字段级脱敏' },
    { t:'2026-08-14 09:41', actor:'系统',               act:'处理退订', target:'k.mueller@***.de', detail:'0.3 小时内从全部 3 个序列移除' },
    { t:'2026-08-13 11:05', actor:'王一诺',             act:'修改联系人', target:'C-1019 · Ingrid Solberg', detail:'补充职级信息' },
    { t:'2026-08-12 14:33', actor:'系统',               act:'GDPR 数据主体请求', target:'DSR-0042', detail:'数据导出请求已完成（用时 2 天）' },
  ],
  risks:[
    { level:'high', text:'shenglei-parts.net 缺少 DMARC 记录，暂不可用于发送', action:'前往 DNS 配置' },
    { level:'mid',  text:'英国经销商开发场景的 LIA 尚未批准，序列 SEQ-04 已自动暂停', action:'提交审核' },
    { level:'mid',  text:'412 位联系人 opt-in 状态为「无」，不可用于 WhatsApp 营销', action:'发起 opt-in 收集' },
    { level:'low',  text:'87 位联系人已撤回同意，已从所有序列排除', action:'查看名单' },
  ],
};

/* ---------- 工作台：待办 ---------- */
export const TODOS = [
  { pri:'urgent', title:'回复 Cascade 的报价追问',        meta:'SLA 剩余 2h12m · 商机 $680K', why:'工程评审已通过，是推进关键节点', link:'#/inbox' },
  { pri:'urgent', title:'Corte Láser · PI 已 9 天未签回',  meta:'商机 $412K · 成交率随时间快速下降', why:'建议改 WhatsApp 语音跟进（已授权）', link:'#/deals' },
  { pri:'high',   title:'Falkenberg Q4 产能预留方案',      meta:'历史 Q4 均值 $780K', why:'客户已主动询问，把被动报价变主动锁单', link:'#/customers/C-1042' },
  { pri:'high',   title:'审核 A-314 西语指南（AI 已完成）', meta:'挂起 9h12m · L1 草稿模式', why:'发布后可支撑拉美市场 Goal G-118', link:'#/content' },
  { pri:'normal', title:'PolTech 尾款逾期 32 天',          meta:'€23,400', why:'建议转财务发对账函，销售不宜直接催款', link:'#/orders' },
  { pri:'normal', title:'Ege Metal 认证材料补充',          meta:'商机 $186K · 6 天无进展', why:'客户顾虑点明确，材料齐备即可推进', link:'#/customers/C-1024' },
];

export const NIGHT_BRIEF = {
  count: 9, high: 3,
  items: [
    { from:'Cascade Fabrication 🇺🇸', tag:'高意向', text:'工程评审通过，问质保与 8 台阶梯价' },
    { from:'Falkenberg Metalltechnik 🇩🇪', tag:'高意向', text:'主动启动 Q4 规划，询问 12kW 机型交期' },
    { from:'Corte Láser del Norte 🇲🇽', tag:'高意向', text:'PI 在财务总监处，问能否 45→35 天交期' },
    { from:'Gulf Metal Works 🇦🇪',    tag:'新询盘', text:'迪拜经销商，2 台 3kW 3015，要 FOB/CIF 双报价' },
    { from:'其余 5 封',               tag:'低优先', text:'2 封退订、2 封自动回复、1 封无关营销' },
  ]
};

/* ---------- 通用工具 ---------- */
export const fmtMoney = (n, cur = 'USD') => {
  const sym = { USD:'$', EUR:'€', CNY:'¥' }[cur] || '';
  if (n >= 1000000) return sym + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000)    return sym + Math.round(n / 1000) + 'K';
  return sym + n.toLocaleString();
};
export const fmtCny = (n) => n >= 10000 ? '¥' + (n / 10000).toFixed(1) + '万' : '¥' + n.toLocaleString();
