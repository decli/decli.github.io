/* 客户 360：一条时间线串起邮件 / WhatsApp / 报价 / 订单 / 网站行为 */
import { h, esc, card, tag, tierChip, icon, demoClick, hint, bar } from '../ui.js';
import { CUSTOMERS, DEALS, ORDERS, QUOTES, fmtMoney } from '../data.js';

const TIMELINE = {
  'C-1042': [
    { t:'2026-08-15 23:05', k:'ok',    ch:'email', title:'客户来信 · Q4 planning — indicative volumes', body:'Markus 主动启动 Q4 规划，询问 DN32 系列交期与价格指引。AI 判定为年度最大单的前置信号。' },
    { t:'2026-08-12 10:22', k:'',      ch:'site',  title:'官网行为 · 浏览「DN32 系列」产品页 3 次', body:'来自 hydraulikventil.de，停留合计 8 分 42 秒，下载技术手册 PDF。' },
    { t:'2026-08-02 09:14', k:'ok',    ch:'order', title:'订单 SO-2605 已开船', body:'汉堡港 ETA 09-12。已自动向客户推送带图进度报告（含验货照片 24 张）。' },
    { t:'2026-07-23 16:40', k:'ok',    ch:'order', title:'验货通过 · 提前 1 天', body:'TÜV 第三方抽检报告已附。' },
    { t:'2026-06-28 11:05', k:'ok',    ch:'quote', title:'报价 Q-2603 v5 → 成交', body:'DDP Hamburg · $2.86M · 毛利率 36.1%（成本与汇率已冻结快照）。' },
    { t:'2024-03-11 14:00', k:'muted', ch:'expo',  title:'首次接触 · 汉诺威工业展', body:'展位来访，交换名片。来源快照已存档。' },
  ],
  'C-1038': [
    { t:'2026-08-15 13:14', k:'warn',  ch:'email', title:'客户来信 · Re: Quotation Q-2608', body:'工程评审通过；询问 3 年质保；500 台希望降价 6%。SLA 剩余 2h12m。' },
    { t:'2026-08-14 22:30', k:'ok',    ch:'site',  title:'官网行为 · 高频访问（4 次 / 6 分 20 秒）', body:'浏览「高压柱塞泵」页面并下载 PDF 规格书 — 通常是内部评审信号。' },
    { t:'2026-08-09 09:00', k:'',      ch:'quote', title:'报价 Q-2608 v3 已发送', body:'FOB Ningbo · $624K · 有效期至 09-05。' },
    { t:'2026-05-02 08:12', k:'muted', ch:'radar', title:'线索入池 · 官网访客识别', body:'匿名访客反查为 Pacific Fluid Power Inc.，AI 评分 91。' },
  ],
};

const CH_ICON = { email:'mail', site:'globe', order:'order', quote:'quote', expo:'building', radar:'radar', wa:'wa' };

export default function customerDetail(id) {
  const c = CUSTOMERS.find(x => x.id === id);
  if (!c) return h`<div class="empty">未找到该客户。<a href="#/customers">返回客户列表</a></div>`;

  const tl = TIMELINE[c.id] || [
    { t:c.lastActivity, k:'', ch:'email', title:'最近一次跟进', body:'（体验版仅为部分客户预置了完整时间线，可查看 Weidmann 或 Pacific Fluid）' },
    { t:c.firstContact, k:'muted', ch:'radar', title:'首次接触 · ' + c.source, body:'来源快照已存档。' },
  ];
  const deals = DEALS.filter(d => c.name.includes(d.company.split(' ')[0]) || d.company.includes(c.short));
  const orders = ORDERS.filter(o => o.company.includes(c.short));
  const quotes = QUOTES.filter(q => q.company.includes(c.short));

  const html = h`
    <div class="page-head">
      <div>
        <h1>${esc(c.flag)} ${esc(c.name)}</h1>
        <div class="sub flex ac gap8 wrap mt4">
          ${tierChip(c.tier)} ${tag(c.stage, 'brand')}
          <span class="muted">${esc(c.id)}</span>
          <span class="muted">·</span><span class="muted">归属 ${esc(c.owner)}</span>
          <span class="muted">·</span><span class="muted">来源 ${esc(c.source)}</span>
          <span class="muted">·</span><span class="muted">客户当地 UTC${esc(c.utc)}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="写邮件">${icon('mail')} 写邮件</button>
        <button class="btn" data-demo="WhatsApp">${icon('wa')} WhatsApp</button>
        <button class="btn primary" data-demo="新建报价">${icon('quote')} 新建报价</button>
      </div>
    </div>

    ${c.ai ? h`<div class="hint ${c.ai.startsWith('⚠️') ? 'warn' : ''} mb16">
      ${icon('spark')}<div><b>Deal Coach 洞察</b>：${esc(c.ai.replace('⚠️ ', ''))}</div></div>` : ''}

    <div class="grid g-2-1">
      <div class="grid" style="align-content:start">
        ${card(h`
          <div class="timeline">
            ${tl.map(e => h`
              <div class="tl-item ${e.k}">
                <div class="tl-time">${esc(e.t)}</div>
                <div class="tl-title flex ac gap6"><span class="muted">${icon(CH_ICON[e.ch] || 'mail')}</span>${esc(e.title)}</div>
                <div class="tl-body">${esc(e.body)}</div>
              </div>`)}
          </div>`,
          { title:'客户时间线', sub:'邮件 / WhatsApp / 官网行为 / 报价 / 订单 归一到同一条线',
            right: h`<button class="btn sm" data-demo="筛选渠道">筛选</button>` })}

        ${deals.length ? card(h`
          <div class="table-wrap"><table class="tbl">
            <thead><tr><th>商机</th><th class="num">金额</th><th>阶段</th><th class="num">赢率</th><th>下一步</th></tr></thead>
            <tbody>${deals.map(d => h`<tr>
              <td><b>${esc(d.name)}</b><div class="small muted">${esc(d.id)}</div></td>
              <td class="num b">${fmtMoney(d.amount)}</td>
              <td>${tag(({contacted:'已触达',engaged:'有回应',qualified:'需求明确',quoted:'已报价',pi:'PI已发',won:'已签约'})[d.stage], d.stage === 'won' ? 'ok' : 'brand')}</td>
              <td class="num">${d.prob}%</td>
              <td class="small muted">${esc(d.next)}</td>
            </tr>`)}</tbody>
          </table></div>`, { title:'商机', tight:true }) : ''}

        ${orders.length ? card(h`
          <div class="table-wrap"><table class="tbl">
            <thead><tr><th>订单号</th><th class="num">金额</th><th>状态</th><th>进度</th><th>ETD</th></tr></thead>
            <tbody>${orders.map(o => h`<tr>
              <td><a class="link" href="#/orders">${esc(o.id)}</a></td>
              <td class="num b">${fmtMoney(o.amount, o.currency)}</td>
              <td>${tag(o.state, o.state === '已发货' ? 'ok' : o.state === '待收尾款' ? 'danger' : 'brand')}</td>
              <td style="min-width:100px">${bar(o.progress)}<span class="small muted">${o.progress}%</span></td>
              <td class="small">${esc(o.etd)}</td>
            </tr>`)}</tbody>
          </table></div>`, { title:'订单', tight:true }) : ''}
      </div>

      <div class="grid" style="align-content:start">
        ${card(h`
          <dl class="kv">
            <dt>国家</dt><dd>${esc(c.flag)} ${esc(c.country)}</dd>
            <dt>时区</dt><dd>${esc(c.tz)} (UTC${esc(c.utc)})</dd>
            <dt>分层</dt><dd>${tierChip(c.tier)}</dd>
            <dt>归属</dt><dd>${esc(c.owner)} · ${c.pool === 'private' ? '私海' : '<span class="tag warn">公海</span>'}</dd>
            <dt>首次接触</dt><dd>${esc(c.firstContact)}</dd>
            <dt>最近活动</dt><dd>${esc(c.lastActivity)}</dd>
            <dt>历史订单</dt><dd>${c.orders} 单</dd>
            <dt>报价历史</dt><dd>${quotes.length} 份</dd>
          </dl>
          <div class="mt12">
            <div class="flex jb small mb8"><span>客户资产沉淀率</span><b>${c.assetScore}%</b></div>
            ${bar(c.assetScore, c.assetScore >= 85 ? '#10b981' : '#f59e0b')}
            <div class="small muted mt4">联系方式完整 · 沟通记录完整 · 报价历史完整 → 该客户即使换人跟进也不会断档</div>
          </div>`, { title:'客户档案' })}

        ${card(h`
          ${c.contacts.map(p => h`
            <div class="contact-row">
              <div class="b">${esc(p.name)}</div>
              <div class="small muted">${esc(p.title)}</div>
              <div class="small mt4 mono">${esc(p.email)}</div>
              ${p.wa !== '—' ? h`<div class="small mono">${esc(p.wa)}</div>` : ''}
              <div class="flex gap4 mt8 wrap">
                ${p.optinEmail === 'granted' ? tag('邮件 · 明示同意', 'ok')
                  : p.optinEmail === 'legitimate_interest' ? tag('邮件 · 正当利益', 'info') : tag('邮件 · 无', '')}
                ${p.optinWA === 'granted' ? tag('WhatsApp · 已授权', 'ok') : tag('WhatsApp · 未授权', 'warn')}
              </div>
            </div>`)}
          <div class="small muted">opt-in 按渠道分别存储并留存证据链 —— 未授权渠道的发送按钮在界面上物理禁用。</div>`,
          { title:'联系人与 opt-in 状态' })}
      </div>
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
