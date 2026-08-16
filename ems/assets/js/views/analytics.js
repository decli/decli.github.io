/* 经营分析：渠道归因 / 漏斗 / 市场分布 / 丢单归因 */
import { h, esc, card, kpi, tag, icon, demoClick, hint, bar } from '../ui.js';
import { lineChart, barsV, funnel, barsH, donut } from '../charts.js';
import { CHANNEL_ROI, MONTHLY_REVENUE, FUNNEL, MARKET_DIST, LOST_REASONS, TEAM, fmtCny } from '../data.js';

export default function analytics() {
  const totalRev = CHANNEL_ROI.reduce((a, c) => a + c.revenue, 0);
  const totalSpend = CHANNEL_ROI.reduce((a, c) => a + c.spend, 0);
  const totalDeals = CHANNEL_ROI.reduce((a, c) => a + c.deals, 0);

  const groups = CHANNEL_ROI.map(c => ({
    name: c.ch.length > 6 ? c.ch.slice(0, 5) + '…' : c.ch,
    spend: Math.round(c.spend / 10000),
    revenue: Math.round(c.revenue / 10000),
  }));

  const html = h`
    <div class="page-head">
      <div>
        <h1>经营分析</h1>
        <div class="sub">从线索源头追到回款的闭环归因。追不到成交额的功能我们不做 —— 这是产品的第一条设计信条。</div>
      </div>
      <div class="actions">
        <select class="select"><option>本年度</option><option>本月</option><option>本季度</option></select>
        <button class="btn" data-demo="导出报表">${icon('doc')} 导出</button>
      </div>
    </div>

    <div class="grid g5 mb16">
      ${kpi({ label:'成交额', value: fmtCny(totalRev), delta:'18%', foot:`${totalDeals} 单` })}
      ${kpi({ label:'营销投入', value: fmtCny(totalSpend), delta:'6%', foot:'含平台/展会/数据/投放' })}
      ${kpi({ label:'综合 ROI', value:(totalRev / totalSpend).toFixed(1), unit:'×', delta:'2.1', foot:'成交额 ÷ 投入' })}
      ${kpi({ label:'单客获客成本', value: fmtCny(Math.round(totalSpend / totalDeals)), delta:'9%', deltaDir:'down' })}
      ${kpi({ label:'客单价', value: fmtCny(Math.round(totalRev / totalDeals)), delta:'11%' })}
    </div>

    <div class="grid g-3-2 mb16">
      ${card(h`
        ${barsV(groups, [
          { k:'spend',   name:'投入',   color:'#f59e0b' },
          { k:'revenue', name:'成交额', color:'#2563eb' },
        ], { fmt: v => v + '万' })}
        <div class="legend mt8"><span><i style="background:#f59e0b"></i>投入（万元）</span><span><i style="background:#2563eb"></i>成交额（万元）</span></div>
        <div class="hint mt12">${icon('spark')}<div>
          <b>展会</b>投入 ¥180 万、成交 ¥1,180 万（6.6×），单客成本 ¥30 万 —— 高投入高回报，但现金流压力大且节奏不可控。
          <b>B2B 平台</b>投入 ¥96 万仅 5.7×，是全部渠道中 ROI 最低的一个。</div></div>`,
        { title:'渠道投入产出对比' })}

      ${card(h`
        ${barsH(CHANNEL_ROI.map(c => ({
          name: c.ch.length > 7 ? c.ch.slice(0, 6) + '…' : c.ch,
          v: Math.round(c.spend / c.deals),
          color: c.color,
        })).sort((a, b) => a.v - b.v), { fmt: v => fmtCny(v) })}
        <div class="small muted mt8">单客获客成本（投入 ÷ 成交客户数），越低越好</div>`,
        { title:'各渠道单客获客成本' })}
    </div>

    <div class="grid g3 mb16">
      ${card(h`
        ${funnel(FUNNEL, { w: 420, rowH: 34 })}
        <div class="hint warn mt8" style="font-size:12px">${icon('alert')}<div>
          「已触达 → 有回应」29.3%，「有回应 → 需求明确」51.6%。后者是<b>最大漏点</b>：客户回了但没进入实质需求确认。</div></div>`,
        { title:'全链路转化漏斗' })}

      ${card(h`
        <div class="list" style="margin:-16px">
          ${MARKET_DIST.map(m => h`
            <div class="list-item" style="padding:9px 16px">
              <span style="width:22px">${esc(m.flag)}</span>
              <div class="li-main">
                <div class="flex jb"><span class="b" style="font-size:12.5px">${esc(m.c)}</span><span class="tnum small">${fmtCny(m.v * 10000)}</span></div>
                <div class="mt4">${bar(m.v / 2280 * 100)}</div>
              </div>
            </div>`)}
        </div>`, { title:'市场分布', sub:'按成交额' })}

      ${card(h`
        <div class="flex ac gap12 mb12">
          ${donut(LOST_REASONS.map((r, i) => ({
            name: r.r, v: r.v,
            color: ['#dc2626','#f59e0b','#a855f7','#0891b2','#94a3b8','#cbd5e1'][i],
          })), { center:'100|丢单单数' })}
        </div>
        <div class="legend" style="flex-direction:column;gap:6px">
          ${LOST_REASONS.map((r, i) => h`<span><i style="background:${['#dc2626','#f59e0b','#a855f7','#0891b2','#94a3b8','#cbd5e1'][i]}"></i>${esc(r.r)} ${r.v}%</span>`)}
        </div>`, { title:'丢单原因', sub:'结构化必填' })}
    </div>

    <div class="grid g-2-1 mb16">
      ${card(h`
        ${lineChart(MONTHLY_REVENUE, { h: 210, fmt: v => v + '万' })}
        <div class="small muted mt8">全公司月度成交额（万元人民币）· 8 月为进行中</div>`,
        { title:'成交趋势' })}

      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>成员</th><th class="num">成交额</th><th class="num">僵尸客户</th></tr></thead>
          <tbody>${[...TEAM].sort((a,b)=>b.revenue-a.revenue).map(t => h`<tr>
            <td class="b">${esc(t.name)}<div class="small muted">${esc(t.role)}</div></td>
            <td class="num b">${fmtCny(t.revenue)}</td>
            <td class="num">${t.zombie > 20 ? h`<span class="tag danger">${t.zombie}</span>` : t.zombie}</td>
          </tr>`)}</tbody>
        </table></div>`, { title:'团队产出', tight:true })}
    </div>

    ${hint(h`<b>这张表能存在的前提</b>：每条线索都保留了来源快照，每次触达都留了痕，每笔订单都能追回它的第一次接触。没有这条数据链，「渠道 ROI」就只能靠拍脑袋估 —— 这也是多数外贸企业至今说不清预算该投哪里的根本原因。`)}`;

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
