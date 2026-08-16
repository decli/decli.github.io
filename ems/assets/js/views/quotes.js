/* 报价与 PI：版本化、成本与汇率快照、PI 独立于赢单 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint, openDrawer } from '../ui.js';
import { QUOTES, PI_SAMPLE, fmtMoney } from '../data.js';

function piDoc() {
  return h`
    <div class="doc" style="background:#fff">
      <div class="flex jb" style="border-bottom:2px solid var(--text);padding-bottom:10px;margin-bottom:14px">
        <div>
          <div style="font-size:16px;font-weight:700">PROFORMA INVOICE</div>
          <div class="small muted">${esc(PI_SAMPLE.seller)}</div>
        </div>
        <div style="text-align:right" class="small">
          <div><b>No.</b> ${esc(PI_SAMPLE.no)}</div>
          <div><b>Date</b> ${esc(PI_SAMPLE.date)}</div>
          <div><b>Valid until</b> ${esc(PI_SAMPLE.validity)}</div>
        </div>
      </div>

      <div class="grid g2 mb12" style="gap:14px">
        <div>
          <div class="small muted">BUYER</div>
          <div class="b">${esc(PI_SAMPLE.buyer)}</div>
          <div class="small">${esc(PI_SAMPLE.address)}</div>
        </div>
        <div class="small">
          <div><b>Incoterm</b> ${esc(PI_SAMPLE.incoterm)}</div>
          <div><b>Port</b> ${esc(PI_SAMPLE.port)}</div>
          <div><b>Payment</b> ${esc(PI_SAMPLE.payment)}</div>
          <div><b>Lead time</b> ${esc(PI_SAMPLE.leadTime)}</div>
        </div>
      </div>

      <table class="tbl" style="font-size:11.8px">
        <thead><tr><th>#</th><th>Description</th><th>Specification</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${PI_SAMPLE.items.map(i => h`<tr>
            <td>${i.no}</td><td class="b">${esc(i.desc)}</td><td class="muted">${esc(i.spec)}</td>
            <td class="num">${i.qty.toLocaleString()} ${esc(i.unit)}</td>
            <td class="num">$${i.price.toLocaleString()}</td>
            <td class="num b">$${i.amount.toLocaleString()}</td></tr>`)}
          <tr><td colspan="5" class="num b">TOTAL (${esc(PI_SAMPLE.currency)})</td>
              <td class="num b" style="font-size:14px">$${PI_SAMPLE.total.toLocaleString()}</td></tr>
        </tbody>
      </table>

      <div class="small mt12">
        <div><b>Packing:</b> ${esc(PI_SAMPLE.packing)}</div>
        <div class="mt4"><b>Remarks:</b> Prices are based on FX rate 7.16 CNY/USD locked on 2026-08-06. Beyond validity date, prices are subject to reconfirmation.</div>
      </div>
    </div>

    ${hint(h`<b>PI 的十项必备条款</b>：规格 · 颜色 · 材料 · 价格 · 数量 · 包装方式 · 运输贸易方式 · 付款方式 · 发货时间 · 有效期。系统按模板强制填齐，缺项无法生成，避免事后扯皮。`)}

    <div class="flex gap8 mt16 wrap">
      <button class="btn primary" data-demo="发送 PI">${icon('send')} 发送给客户</button>
      <button class="btn" data-demo="导出 PDF">${icon('doc')} 导出 PDF</button>
      <button class="btn" data-demo="切换语言">切换语言（EN/ES/DE）</button>
      <button class="btn" data-demo="电子签">请求电子签</button>
    </div>`;
}

export default function quotes() {
  const cols = [
    { t:'报价单号', render: q => h`<a class="link" href="javascript:void 0" data-q="${esc(q.id)}">${esc(q.id)}</a>
        <div class="small muted">v${q.ver} · 发送 ${esc(q.sentAt)}</div>` },
    { t:'客户', render: q => h`${esc(q.flag)} ${esc(q.company)}` },
    { t:'价格条款', render: q => tag(q.incoterm, 'brand') },
    { t:'金额', cls:'num', render: q => h`<b>${fmtMoney(q.amount, q.currency)}</b>` },
    { t:'毛利率', cls:'num', render: q => h`<span class="tag ${q.margin >= 33 ? 'ok' : q.margin >= 28 ? 'warn' : 'danger'}">${q.margin}%</span>` },
    { t:'汇率快照', render: q => h`<span class="small mono">${esc(q.fx)}</span>` },
    { t:'有效期', render: q => {
        const expired = new Date(q.validUntil) < new Date('2026-08-15');
        return h`<span class="small ${expired ? '' : ''}">${esc(q.validUntil)}</span>${expired ? tag('已过期', '') : ''}`;
      } },
    { t:'状态', render: q => tag(q.status, q.status === '已成交' ? 'ok' : q.status === '已转 PI' ? 'warn' : 'brand') },
    { t:'操作', render: q => h`<div class="row-actions">
        <button class="btn sm" data-q="${esc(q.id)}">查看</button>
        <button class="btn sm" data-demo="新版本">新版本</button></div>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>报价与 PI</h1>
        <div class="sub">每个版本冻结<b>成本快照 + 汇率</b>，事后可算真实毛利。价格条款（EXW/FOB/CIF/DDP）自动换算运费与保险。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="报价模板">${icon('doc')} 报价模板</button>
        <button class="btn primary" data-demo="新建报价">${icon('plus')} 新建报价</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'本月报价', value:'18', foot:'合计 $4.6M' })}
      ${kpi({ label:'报价→PI 转化', value:'41', unit:'%', delta:'6pt' })}
      ${kpi({ label:'PI→签约转化', value:'62', unit:'%', foot:'低于 14 天签回的成交率显著更高' })}
      ${kpi({ label:'平均毛利率', value:'32.9', unit:'%', delta:'1.4pt', deltaDir:'down', foot:'受铝合金原材料波动影响' })}
    </div>

    ${hint(h`<b>汇率与成本快照的意义</b>：报价时 7.16 的汇率、当时的原材料成本，都会随报价单一起冻结。三个月后复盘这单赚没赚、赚在哪里，才有依据 —— 这是很多外贸公司算不清账的根源。`)}

    <div class="grid g-2-1 mt16">
      ${card(table(cols, QUOTES), { title:'报价单', tight:true })}
      ${card(h`
        <div class="timeline">
          <div class="tl-item ok"><div class="tl-time">v1 · 07-28</div><div class="tl-title">初次报价 $658K</div>
            <div class="tl-body">FOB Shanghai，标准 2 年质保</div></div>
          <div class="tl-item ok"><div class="tl-time">v2 · 08-04</div><div class="tl-title">客户要求增加认证 → $641K</div>
            <div class="tl-body">调整为含 CE 与 EN 60825-1 检测费用的版本</div></div>
          <div class="tl-item"><div class="tl-time">v3 · 08-09</div><div class="tl-title">阶梯价方案 $624K（当前）</div>
            <div class="tl-body">8 台阶梯价，毛利率 34.2%（成本快照已冻结）</div></div>
          <div class="tl-item muted"><div class="tl-time">v4 · 待生成</div><div class="tl-title">建议：3 年质保 + 3.5% 让价</div>
            <div class="tl-body">AI 测算：让至毛利 30.5% 仍健康，且质保成本仅占 1.2%</div></div>
        </div>`, { title:'Q-2608 版本历史', sub:'Cascade Fabrication Systems' })}
    </div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const d = e.target.closest('[data-demo]');
        if (d) return demoClick(d.dataset.demo);
        if (e.target.closest('[data-q]')) {
          openDrawer('形式发票 PI-2607 · Grupo Corte Láser del Norte', piDoc(), (mask) => {
            mask.addEventListener('click', (ev) => {
              const b = ev.target.closest('[data-demo]');
              if (b) demoClick(b.dataset.demo);
            });
          });
        }
      });
    },
  };
}
