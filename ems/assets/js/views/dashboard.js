/* 工作台：业务员视角 / 老板视角 —— 同一份数据，两套信息架构 */
import { h, esc, card, kpi, tag, bar, hint, icon, demoClick, scoreColor } from '../ui.js';
import { lineChart, funnel, barsH, donut } from '../charts.js';
import { state } from '../app.js';
import {
  ME, TODOS, NIGHT_BRIEF, LEADS, DEALS, CUSTOMERS, MONTHLY_REVENUE, FUNNEL,
  CHANNEL_ROI, TEAM, COMPLIANCE, DOMAIN_HEALTH, fmtMoney, fmtCny,
} from '../data.js';

const PRI = { urgent: ['danger', '紧急'], high: ['warn', '重要'], normal: ['', '常规'] };

/* ---------------------------------------------------------------- 业务员 */
function salesView() {
  const myDeals = DEALS.filter(d => d.owner === ME.name && d.stage !== 'won');
  const pipeline = myDeals.reduce((a, d) => a + d.amount, 0);
  const won = DEALS.filter(d => d.owner === ME.name && d.stage === 'won').reduce((a, d) => a + d.amount, 0);
  const wonCny = won * 7.16;
  const topLeads = [...LEADS].sort((a, b) => b.score - a.score).slice(0, 4);

  return h`
    <div class="page-head">
      <div>
        <h1>早上好，${esc(ME.name)}</h1>
        <div class="sub">昨夜共 <b>${NIGHT_BRIEF.count}</b> 封新消息，其中 <b>${NIGHT_BRIEF.high}</b> 封高意向。今日建议开发 <b>12</b> 个新线索。当前 <b>${myDeals.length}</b> 个在手商机。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="写开发信">${icon('send')} 写开发信</button>
        <button class="btn primary" data-demo="AI 晨间简报">${icon('spark')} AI 晨间简报</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'本年度已成交', value: fmtCny(wonCny), delta:'26%', foot:`年度目标 ${fmtCny(ME.target)} · 完成 ${Math.round(wonCny / ME.target * 100)}%` })}
      ${kpi({ label:'在手商机金额', value: fmtMoney(pipeline), foot:`${myDeals.length} 个商机 · 加权 ${fmtMoney(myDeals.reduce((a,d)=>a+d.amount*d.prob/100,0))}` })}
      ${kpi({ label:'首响达标率', value:'96', unit:'%', delta:'4pt', foot:'团队均值 84% · SLA 4 小时' })}
      ${kpi({ label:'待处理待办', value: TODOS.length, foot:'其中 2 项紧急', hint:'按 SLA 紧急度与成交概率排序，而非创建时间' })}
    </div>

    <div class="grid g-3-2 mb16">
      ${card(h`
        <div class="list" style="margin:-16px">
          ${TODOS.map(t => {
            const [k, label] = PRI[t.pri];
            return h`<a class="list-item" href="${t.link}" style="color:inherit">
              <span class="tag ${k}" style="margin-top:2px">${label}</span>
              <div class="li-main">
                <div class="li-title">${esc(t.title)}</div>
                <div class="li-desc">${esc(t.meta)}</div>
                <div class="li-meta">${icon('spark')} <span>${esc(t.why)}</span></div>
              </div>
              <span class="muted">${icon('arrow')}</span>
            </a>`;
          })}
        </div>`,
        { title:'今日待办', sub:'按 SLA 紧急度 × 成交概率排序', right: h`<button class="btn sm" data-demo="重新排序">重新排序</button>` })}

      ${card(h`
        <div class="hint mb12">
          ${icon('clock')}
          <div><b>夜间来信晨间简报</b>：欧美客户在他们的白天发信，你的凌晨。系统在 08:30 自动聚合并排序。</div>
        </div>
        <div class="list" style="margin:0 -16px -16px">
          ${NIGHT_BRIEF.items.map(i => h`
            <div class="list-item">
              <div class="li-main">
                <div class="li-title">${esc(i.from)} ${tag(i.tag, i.tag === '高意向' ? 'danger' : i.tag === '新询盘' ? 'brand' : '')}</div>
                <div class="li-desc">${esc(i.text)}</div>
              </div>
            </div>`)}
        </div>`,
        { title:'昨夜 9 封新消息', right: h`<a class="btn sm" href="#/inbox">去收件箱</a>` })}
    </div>

    <div class="grid g-2-1 mb16">
      ${card(h`
        <div class="flex ac jb mb12">
          <div class="legend"><span><i style="background:#2563eb"></i>本月新增线索</span></div>
          <span class="small muted">仅显示评分 ≥ 75 的线索</span>
        </div>
        <div class="list" style="margin:0 -16px -16px">
          ${topLeads.map(l => h`
            <div class="list-item">
              <span class="tag" style="background:${scoreColor(l.score)}18;color:${scoreColor(l.score)};border-color:${scoreColor(l.score)}44;font-weight:650;margin-top:2px">${l.score}</span>
              <div class="li-main">
                <div class="li-title">${esc(l.flag)} ${esc(l.company)} <span class="muted small">· ${esc(l.contact)}${l.title !== '—' ? ' / ' + esc(l.title) : ''}</span></div>
                <div class="li-desc">${esc(l.why)}</div>
              </div>
              <button class="btn sm" data-demo="加入触达序列">加入序列</button>
            </div>`)}
        </div>`,
        { title:'今日建议开发', sub:'每条都附「为什么是他」——这是信任的建立点',
          right: h`<a class="btn sm" href="#/leads">查看全部 12 条</a>` })}

      ${card(h`
        ${funnel(FUNNEL.slice(2), { w: 400, rowH: 34 })}
        <div class="hint warn mt12" style="font-size:12px">
          ${icon('alert')}
          <div>「有回应 → 需求明确」转化仅 <b>52%</b>，是你目前最大的漏点。Deal Coach 建议：首次回复后 48 小时内主动约一次视频。</div>
        </div>`,
        { title:'我的转化漏斗', sub:'近 90 天' })}
    </div>

    <div class="grid g2">
      ${card(h`
        <div class="list" style="margin:-16px">
          ${DEALS.filter(d => d.risk || d.days > 5).slice(0, 4).map(d => h`
            <div class="list-item">
              <div class="li-main">
                <div class="li-title">${esc(d.flag)} ${esc(d.name)}</div>
                <div class="li-desc">${fmtMoney(d.amount)} · 已停滞 ${d.days} 天 · 赢率 ${d.prob}%</div>
                <div class="li-meta">${icon('spark')} <span>建议：${esc(d.next)}</span></div>
              </div>
              <a class="btn sm" href="#/deals">处理</a>
            </div>`)}
        </div>`, { title:'卡住的商机', sub:'超过 5 天无进展' })}

      ${card(h`
        ${lineChart(MONTHLY_REVENUE, { h: 186, fmt: v => v + '万' })}
        <div class="small muted mt8">单位：万元人民币（全公司含税成交额）</div>`,
        { title:'月度成交趋势' })}
    </div>`;
}

/* ---------------------------------------------------------------- 老板 */
function bossView() {
  const totalRev = CHANNEL_ROI.reduce((a, c) => a + c.revenue, 0);
  const totalSpend = CHANNEL_ROI.reduce((a, c) => a + c.spend, 0);
  const totalDeals = CHANNEL_ROI.reduce((a, c) => a + c.deals, 0);
  const assetAvg = Math.round(CUSTOMERS.reduce((a, c) => a + c.assetScore, 0) / CUSTOMERS.length);
  const publicPool = CUSTOMERS.filter(c => c.pool === 'public').length;

  const roiRows = [...CHANNEL_ROI]
    .map(c => ({ name: c.ch, v: Math.round(c.revenue / c.spend * 10) / 10, color: c.color }))
    .sort((a, b) => b.v - a.v);

  return h`
    <div class="page-head">
      <div>
        <h1>经营总览</h1>
        <div class="sub">本年度成交 ${fmtCny(totalRev)} · 营销投入 ${fmtCny(totalSpend)} · 综合 ROI <b>${(totalRev / totalSpend).toFixed(1)}×</b>。以下按「钱花在哪、客户在不在公司手里、有什么风险」组织。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="导出经营月报">${icon('doc')} 导出月报</button>
        <a class="btn primary" href="#/analytics">${icon('chart')} 深度分析</a>
      </div>
    </div>

    <div class="grid g5 mb16">
      ${kpi({ label:'本年度成交额', value: fmtCny(totalRev), delta:'18%', foot:`${totalDeals} 单 · 客单价 ${fmtCny(Math.round(totalRev / totalDeals))}` })}
      ${kpi({ label:'综合获客成本', value: fmtCny(Math.round(totalSpend / totalDeals)), delta:'9%', deltaDir:'down', foot:'单客成本环比下降' })}
      ${kpi({ label:'客户资产沉淀率', value: assetAvg, unit:'%', delta:'7pt', foot:`${publicPool} 个客户在公海`, hint:'有完整联系方式 + 沟通记录 + 报价历史的客户占比' })}
      ${kpi({ label:'在手订单', value: fmtCny(28420000), foot:'3 个订单在执行 · 最近交期 9/05' })}
      ${kpi({ label:'应收逾期', value: fmtCny(182520), delta:'32 天', deltaDir:'down', foot:'PolTech €23,400 · 已升级至财务' })}
    </div>

    <div class="grid g-3-2 mb16">
      ${card(h`
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>渠道</th><th class="num">投入</th><th class="num">线索</th><th class="num">成交</th><th class="num">成交额</th><th class="num">单客成本</th><th class="num">ROI</th></tr></thead>
            <tbody>
              ${CHANNEL_ROI.map(c => {
                const roi = c.revenue / c.spend;
                const cac = Math.round(c.spend / c.deals);
                return h`<tr>
                  <td><span class="flex ac gap6"><i class="dot-s" style="background:${c.color}"></i>${esc(c.ch)}</span></td>
                  <td class="num">${fmtCny(c.spend)}</td>
                  <td class="num">${c.leads}</td>
                  <td class="num">${c.deals}</td>
                  <td class="num b">${fmtCny(c.revenue)}</td>
                  <td class="num">${fmtCny(cac)}</td>
                  <td class="num"><span class="tag ${roi >= 20 ? 'ok' : roi >= 12 ? 'brand' : roi >= 6 ? 'warn' : 'danger'}">${roi.toFixed(1)}×</span></td>
                </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <div class="hint mt12">
          ${icon('spark')}
          <div><b>归因结论</b>：老客户复购 ROI <b>161.7×</b> 却只投了 ¥12 万；B2B 平台投入 ¥96 万、ROI 仅 <b>5.7×</b>，是全部渠道中最低。建议把平台预算的 30% 转投复购运营与独立站内容。</div>
        </div>`,
        { title:'渠道 ROI 归因', sub:'从线索源头追到回款——这是老板最该看、也最难拿到的一张表', tight: false })}

      ${card(h`
        ${barsH(roiRows, { fmt: v => v + '×' })}
        <div class="small muted mt8">投入产出比（成交额 ÷ 投入）</div>`,
        { title:'渠道 ROI 排名' })}
    </div>

    <div class="grid g-2-1 mb16">
      ${card(h`
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>成员</th><th>小组</th><th class="num">成交</th><th class="num">成交额</th><th>首响达标</th><th>跟进及时率</th><th class="num">僵尸客户</th><th class="num">资产沉淀</th></tr></thead>
            <tbody>
              ${TEAM.map(t => h`<tr>
                <td class="b">${esc(t.name)}</td>
                <td class="muted">${esc(t.role)}</td>
                <td class="num">${t.deals}</td>
                <td class="num b">${fmtCny(t.revenue)}</td>
                <td style="min-width:96px">${bar(t.respond, t.respond >= 85 ? '#10b981' : t.respond >= 70 ? '#f59e0b' : '#dc2626')}<span class="small muted">${t.respond}%</span></td>
                <td style="min-width:96px">${bar(t.followRate, t.followRate >= 85 ? '#10b981' : t.followRate >= 70 ? '#f59e0b' : '#dc2626')}<span class="small muted">${t.followRate}%</span></td>
                <td class="num">${t.zombie > 20 ? h`<span class="tag danger">${t.zombie}</span>` : t.zombie}</td>
                <td class="num">${t.assets}%</td>
              </tr>`)}
            </tbody>
          </table>
        </div>
        <div class="hint warn mt12">
          ${icon('alert')}
          <div><b>刘洋</b>的僵尸客户 31 个、跟进及时率 58%、资产沉淀 59% —— 不是业绩问题，是<b>过程问题</b>。建议先看跟进记录再谈指标，避免直接加 KPI 造成消极。</div>
        </div>`,
        { title:'团队健康度', sub:'过程可视 + 异常提醒，而非单纯业绩排名' })}

      ${card(h`
        <div class="flex ac gap12 mb12">
          ${donut([
            { name:'私海（有归属）', v: CUSTOMERS.filter(c=>c.pool==='private').length, color:'#2563eb' },
            { name:'公海（待认领）', v: publicPool, color:'#f59e0b' },
          ], { center: `${assetAvg}%|资产沉淀率` })}
          <div style="flex:1">
            <div class="legend" style="flex-direction:column;gap:8px">
              <span><i style="background:#2563eb"></i>私海 ${CUSTOMERS.filter(c=>c.pool==='private').length} 家</span>
              <span><i style="background:#f59e0b"></i>公海 ${publicPool} 家</span>
            </div>
          </div>
        </div>
        <dl class="kv">
          <dt>自动回收</dt><dd>本月 <b>7</b> 家因 180 天无有效跟进回收</dd>
          <dt>离职交接</dt><dd>历史记录 <b>100%</b> 保留，无信息断档</dd>
          <dt>私海上限</dt><dd>每人 80 家（防止圈地不跟进）</dd>
        </dl>`,
        { title:'客户资产沉淀', sub:'直击「人走客凉」' })}
    </div>

    <div class="grid g3">
      ${card(h`
        <div class="list" style="margin:-16px">
          ${COMPLIANCE.risks.map(r => h`
            <div class="list-item">
              <span class="tag ${r.level === 'high' ? 'danger' : r.level === 'mid' ? 'warn' : ''}" style="margin-top:2px">
                ${r.level === 'high' ? '高' : r.level === 'mid' ? '中' : '低'}</span>
              <div class="li-main"><div class="li-desc" style="margin:0">${esc(r.text)}</div></div>
              <a class="btn sm" href="#/compliance">${esc(r.action)}</a>
            </div>`)}
        </div>`, { title:'风险预警', sub:'合规与资金' })}

      ${card(h`
        <div class="list" style="margin:-16px">
          ${DOMAIN_HEALTH.map(d => h`
            <div class="list-item">
              <div class="li-main">
                <div class="li-title mono" style="font-size:12px">${esc(d.domain)}</div>
                <div class="li-meta">${esc(d.role)} · 域龄 ${esc(d.age)} · 退信 ${d.bounce}%</div>
                <div class="mt4">${bar(d.score, d.score >= 85 ? '#10b981' : d.score >= 60 ? '#f59e0b' : '#dc2626')}</div>
              </div>
              <span class="tag ${d.score >= 85 ? 'ok' : d.score >= 60 ? 'warn' : 'danger'}">${d.score}</span>
            </div>`)}
        </div>`, { title:'发信域健康度', sub:'域名信誉是公司资产', right: h`<a class="btn sm" href="#/sequences">详情</a>` })}

      ${card(h`
        ${lineChart(MONTHLY_REVENUE, { h: 176, color:'#10b981', fmt: v => v + '万' })}
        <div class="small muted mt8">全公司月度成交额（万元）· 8 月为进行中</div>`,
        { title:'成交趋势' })}
    </div>`;
}

export default function dashboard() {
  return {
    html: state.role === 'boss' ? bossView() : salesView(),
    mount(el) {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-demo]');
        if (b) demoClick(b.dataset.demo);
      });
    },
  };
}
