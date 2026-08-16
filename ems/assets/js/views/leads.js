/* 线索雷达：多源获客 + 可解释评分 */
import { h, esc, card, kpi, tag, icon, table, scoreChip, openDrawer, demoClick, hint, bar } from '../ui.js';
import { radar } from '../charts.js';
import { LEAD_SOURCES, LEADS } from '../data.js';

const srcName = (id) => LEAD_SOURCES.find(s => s.id === id)?.name || id;
const STATUS = { new: ['brand', '待开发'], contacted: ['info', '已触达'], parked: ['', '已搁置'] };

function detail(l) {
  const dims = [
    { name: '需求匹配', v: l.breakdown.match },
    { name: '采购活跃', v: l.breakdown.activity },
    { name: '切入可能', v: l.breakdown.entry },
    { name: '可触达性', v: l.breakdown.reach },
  ];
  return h`
    <div class="flex ac gap12 mb16">
      <div>
        <div style="font-size:17px;font-weight:650">${esc(l.flag)} ${esc(l.company)}</div>
        <div class="muted small mt4">${esc(l.country)} · 来源：${esc(srcName(l.source))} · ${esc(l.id)}</div>
      </div>
      <div style="margin-left:auto;text-align:center">
        <div style="font-size:30px;font-weight:700;color:#2563eb;line-height:1">${l.score}</div>
        <div class="small muted">AI 评分</div>
      </div>
    </div>

    ${hint(h`<b>为什么是他</b>：${esc(l.why)}`)}

    <div class="flex ac gap12 mt16">
      ${radar(dims)}
      <div style="flex:1">
        ${dims.map(d => h`
          <div class="mb8">
            <div class="flex jb small"><span>${d.name}</span><b>${d.v}</b></div>
            ${bar(d.v)}
          </div>`)}
      </div>
    </div>

    <h4 class="mt16 mb8" style="font-size:13px">来源快照（合规与归因的依据）</h4>
    <div class="doc mono">
{
  "source": "${esc(l.source)}",
  "hs_code": "${esc(l.hs)}",
  "last_import": "${esc(l.lastImport)}",
  "captured_at": "2026-08-15T09:12:03Z",
  "legal_basis": "GDPR Art.6(1)(f) legitimate interest",
  "lia_record": "LIA-2026-003 (已批准)"
}</div>

    <h4 class="mt16 mb8" style="font-size:13px">决策人</h4>
    <dl class="kv">
      <dt>姓名</dt><dd>${esc(l.contact)}</dd>
      <dt>职位</dt><dd>${esc(l.title)}</dd>
      <dt>可用渠道</dt><dd>${l.channels.length
        ? l.channels.map(c => tag({ email:'邮件', linkedin:'LinkedIn', whatsapp:'WhatsApp' }[c], 'brand')).join(' ')
        : '<span class="muted">尚未补全 — 可交由 contact-enricher 处理</span>'}</dd>
      <dt>HS Code</dt><dd>${esc(l.hs)}</dd>
      <dt>最近进口</dt><dd>${esc(l.lastImport)}</dd>
    </dl>

    <div class="flex gap8 mt16 wrap">
      <button class="btn primary" data-demo="加入触达序列">${icon('send')} 加入序列 SEQ-01</button>
      <button class="btn" data-demo="转为客户">${icon('users')} 转为客户</button>
      <button class="btn" data-demo="补全决策人">${icon('spark')} 补全决策人</button>
      <button class="btn ghost" data-demo="搁置">搁置</button>
    </div>`;
}

export default function leads() {
  const cols = [
    { t:'评分', cls:'num', render: l => scoreChip(l.score) },
    { t:'公司', render: l => h`<a class="link" href="javascript:void 0" data-id="${esc(l.id)}">${esc(l.flag)} ${esc(l.company)}</a>
        <div class="small muted truncate" style="max-width:340px">${esc(l.why)}</div>` },
    { t:'决策人', render: l => l.contact === '—'
        ? h`<span class="muted small">待补全</span>`
        : h`${esc(l.contact)}<div class="small muted">${esc(l.title)}</div>` },
    { t:'来源', render: l => tag(srcName(l.source)) },
    { t:'渠道', render: l => l.channels.length
        ? h`<span class="flex gap4">${l.channels.map(c => h`<span class="muted" title="${c}">${icon(c === 'whatsapp' ? 'wa' : c === 'linkedin' ? 'linkedin' : 'mail')}</span>`)}</span>`
        : h`<span class="muted small">—</span>` },
    { t:'最近进口', render: l => h`<span class="small">${esc(l.lastImport)}</span>` },
    { t:'状态', render: l => { const [k, n] = STATUS[l.status]; return tag(n, k); } },
    { t:'操作', render: l => h`<div class="row-actions">
        <button class="btn sm" data-id="${esc(l.id)}">详情</button>
        <button class="btn sm primary" data-demo="加入序列">加入序列</button></div>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>线索雷达</h1>
        <div class="sub">六个数据源并行扫描。不给你一张 5000 行的表，只给每天 20 条「今日建议开发」，每条附一句「为什么是他」。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="数据源设置">${icon('gear')} 数据源设置</button>
        <button class="btn primary" data-demo="新建挖掘任务">${icon('plus')} 新建挖掘任务</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'今日新增线索', value:'2,394', delta:'12%', foot:'六源合计 · 已去重' })}
      ${kpi({ label:'高分线索（≥80）', value:'12', foot:'已推送至工作台' })}
      ${kpi({ label:'本月线索成本', value:'¥3,842', foot:'折合 ¥1.6 / 条' })}
      ${kpi({ label:'线索→回复率', value:'14.2', unit:'%', delta:'2.1pt', foot:'行业均值约 5%' })}
    </div>

    <div class="grid g3 mb16" style="gap:12px">
      ${LEAD_SOURCES.map(s => h`
        <div class="card" style="padding:13px 15px">
          <div class="flex ac gap8">
            <span class="tag ${s.color}">${esc(s.name)}</span>
            <span class="small muted">${esc(s.freshness)}</span>
            <span style="margin-left:auto" class="tag ${s.enabled ? 'ok' : ''}">${s.enabled ? '已启用' : '未启用'}</span>
          </div>
          <div class="small muted mt8">${esc(s.desc)}</div>
          <div class="flex ac jb mt12">
            <div><div class="small muted">今日</div><div class="b tnum">${s.today}</div></div>
            <div><div class="small muted">质量分</div><div class="b tnum">${s.quality}</div></div>
            <div><div class="small muted">成本</div><div class="b">${esc(s.cost)}</div></div>
          </div>
          <div class="mt8">${bar(s.quality, s.quality >= 85 ? '#10b981' : s.quality >= 70 ? '#2563eb' : '#f59e0b')}</div>
        </div>`)}
    </div>

    ${hint(h`<b>数据新鲜度很关键</b>：三个月前的海关记录，可能意味着客户已经跟别人签了。系统对每个源标注更新频率，并在评分的「采购活跃度」维度中对陈旧数据降权。`)}

    <div class="mt16">
      ${card(h`
        <div class="toolbar">
          <input class="input" placeholder="搜索公司名 / 国家 / HS Code" style="width:250px">
          <select class="select"><option>全部来源</option>${LEAD_SOURCES.map(s => h`<option>${esc(s.name)}</option>`)}</select>
          <select class="select"><option>评分 ≥ 70</option><option>评分 ≥ 85</option><option>全部</option></select>
          <select class="select"><option>全部状态</option><option>待开发</option><option>已触达</option></select>
          <span class="grow"></span>
          <span class="small muted">共 ${LEADS.length} 条（演示子集）</span>
          <button class="btn sm" data-demo="批量入组">批量加入序列</button>
        </div>
        ${table(cols, [...LEADS].sort((a, b) => b.score - a.score))}`,
        { tight: true })}
    </div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const d = e.target.closest('[data-demo]');
        if (d) return demoClick(d.dataset.demo);
        const t = e.target.closest('[data-id]');
        if (!t) return;
        const l = LEADS.find(x => x.id === t.dataset.id);
        if (l) openDrawer('线索详情', detail(l), (mask) => {
          mask.addEventListener('click', (ev) => {
            const b = ev.target.closest('[data-demo]');
            if (b) demoClick(b.dataset.demo);
          });
        });
      });
    },
  };
}
