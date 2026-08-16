/* 客户管理：分层 + 公海/私海 + 资产沉淀 */
import { h, esc, card, kpi, tag, tierChip, icon, table, demoClick, hint, bar } from '../ui.js';
import { donut } from '../charts.js';
import { CUSTOMERS, fmtMoney } from '../data.js';

const STAGE_KIND = {
  '已签约':'ok', '生产中':'ok', '已发货':'ok', 'PI已发':'warn',
  '已报价':'purple', '需求明确':'brand', '已触达':'info', '无响应':'',
};

export default function customers() {
  const priv = CUSTOMERS.filter(c => c.pool === 'private');
  const pub  = CUSTOMERS.filter(c => c.pool === 'public');
  const assetAvg = Math.round(CUSTOMERS.reduce((a, c) => a + c.assetScore, 0) / CUSTOMERS.length);

  const cols = [
    { t:'客户', render: c => h`
        <a class="link" href="#/customers/${esc(c.id)}">${esc(c.flag)} ${esc(c.name)}</a>
        <div class="small muted">${esc(c.id)} · 首次接触 ${esc(c.firstContact)} · 来源 ${esc(c.source)}</div>` },
    { t:'分层', render: c => tierChip(c.tier) },
    { t:'阶段', render: c => tag(c.stage, STAGE_KIND[c.stage] ?? '') },
    { t:'金额', cls:'num', render: c => c.amount ? h`<b>${fmtMoney(c.amount, c.currency)}</b>` : h`<span class="muted">—</span>` },
    { t:'归属', render: c => c.owner === '—' ? h`<span class="tag warn">公海</span>` : esc(c.owner) },
    { t:'客户本地时间', render: c => h`<span class="small muted">UTC${esc(c.utc)} · ${esc(c.tz.split('/')[1].replace('_',' '))}</span>` },
    { t:'最近活动', render: c => {
        const stale = new Date('2026-08-15') - new Date(c.lastActivity) > 30 * 864e5;
        return h`<span class="small ${stale ? '' : ''}">${esc(c.lastActivity)}</span>
          ${stale ? tag('沉睡', 'warn') : ''}`;
      } },
    { t:'资产沉淀', render: c => h`<div style="min-width:80px">${bar(c.assetScore, c.assetScore >= 85 ? '#10b981' : c.assetScore >= 65 ? '#2563eb' : '#f59e0b')}<span class="small muted">${c.assetScore}%</span></div>` },
    { t:'操作', render: c => h`<div class="row-actions">
        <a class="btn sm" href="#/customers/${esc(c.id)}">360 视图</a>
        ${c.pool === 'public' ? h`<button class="btn sm primary" data-demo="认领客户">认领</button>` : ''}</div>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>客户管理</h1>
        <div class="sub">公海 / 私海机制直击「人走客凉」：私海有容量上限，长期不跟进自动回收，离职一键交接且历史记录 100% 保留。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="导入客户">${icon('doc')} 导入</button>
        <button class="btn" data-demo="回收规则设置">${icon('gear')} 回收规则</button>
        <button class="btn primary" data-demo="新建客户">${icon('plus')} 新建客户</button>
      </div>
    </div>

    <div class="grid g-3-2 mb16">
      <div class="grid g4" style="align-content:start">
        ${kpi({ label:'客户总数', value: CUSTOMERS.length, foot:`私海 ${priv.length} · 公海 ${pub.length}` })}
        ${kpi({ label:'KA / A 类客户', value: CUSTOMERS.filter(c=>['KA','A'].includes(c.tier)).length, foot:'贡献 82% 成交额' })}
        ${kpi({ label:'资产沉淀率', value: assetAvg, unit:'%', delta:'7pt', hint:'有完整联系方式 + 沟通记录 + 报价历史的客户占比' })}
        ${kpi({ label:'30 天未触达', value:'1', foot:'已触发盘活提醒' })}
      </div>
      ${card(h`
        <div class="flex ac gap12">
          ${donut([
            { name:'KA', v: CUSTOMERS.filter(c=>c.tier==='KA').length, color:'#dc2626' },
            { name:'A',  v: CUSTOMERS.filter(c=>c.tier==='A').length,  color:'#2563eb' },
            { name:'B',  v: CUSTOMERS.filter(c=>c.tier==='B').length,  color:'#0891b2' },
            { name:'C',  v: CUSTOMERS.filter(c=>c.tier==='C').length,  color:'#94a3b8' },
          ], { center:`${CUSTOMERS.length}|客户总数` })}
          <div style="flex:1" class="legend" style="flex-direction:column">
            <span><i style="background:#dc2626"></i>KA 战略客户 · 年采购 &gt; $2M</span>
            <span><i style="background:#2563eb"></i>A 重点客户 · $500K–2M</span>
            <span><i style="background:#0891b2"></i>B 成长客户 · $100–500K</span>
            <span><i style="background:#94a3b8"></i>C 长尾客户 · &lt; $100K</span>
          </div>
        </div>`, { title:'客户分层', sub:'避免「一锅乱炖」' })}
    </div>

    ${hint(h`<b>自动回收规则演示</b>：Brasilcorte（C-0987）因 183 天无有效跟进已回收至公海。海关数据显示其 2026 年设备进口量增长 40% —— 系统同时标记为「值得二次开发」，建议换人换角度重启。`, 'warn')}

    <div class="mt16">
      ${card(h`
        <div class="toolbar">
          <input class="input" placeholder="搜索客户名 / 联系人 / 国家" style="width:240px">
          <select class="select"><option>全部分层</option><option>KA</option><option>A</option><option>B</option><option>C</option></select>
          <select class="select"><option>全部归属</option><option>我的客户</option><option>公海</option></select>
          <select class="select"><option>全部阶段</option><option>已签约</option><option>PI已发</option><option>已报价</option></select>
          <span class="grow"></span>
          <span class="small muted">共 ${CUSTOMERS.length} 家（演示子集）</span>
        </div>
        ${table(cols, CUSTOMERS)}`, { tight: true })}
    </div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-demo]');
        if (b) demoClick(b.dataset.demo);
      });
    },
  };
}
