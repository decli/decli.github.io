/* 订单交付：节点甘特 + 单证清单 + 跨部门任务签收 */
import { h, esc, card, kpi, tag, icon, demoClick, hint, bar } from '../ui.js';
import { gantt } from '../charts.js';
import { ORDERS, fmtMoney } from '../data.js';

let current = ORDERS[0].id;

const DOC_KIND = { ok:['ok','已备齐'], pending:['warn','待办理'], missing:['danger','缺失'] };

function orderPane(o) {
  return h`
    <div class="card-head">
      <div>
        <h3>${esc(o.flag)} ${esc(o.id)} · ${esc(o.company)}</h3>
        <div class="small muted mt4">签约 ${esc(o.signed)} · ETD ${esc(o.etd)} · 负责人 ${esc(o.owner)}</div>
      </div>
      <div class="right">
        <b style="font-size:16px">${fmtMoney(o.amount, o.currency)}</b>
        ${tag(o.state, o.state === '已发货' ? 'ok' : o.state === '待收尾款' ? 'danger' : 'brand')}
      </div>
    </div>
    <div class="card-body">
      <div class="flex ac gap12 mb16">
        <div style="flex:1">${bar(o.progress, o.progress === 100 ? '#10b981' : '#2563eb')}</div>
        <b class="tnum">${o.progress}%</b>
      </div>

      <h4 style="font-size:13px" class="mb8">交付节点</h4>
      ${gantt(o.milestones)}
      <div class="legend mt8">
        <span><i style="background:#10b981"></i>已完成</span>
        <span><i style="background:#2563eb"></i>进行中</span>
        <span><i style="background:#cbd5e1"></i>待开始</span>
        <span><i style="background:#dc2626"></i>已逾期</span>
      </div>

      <div class="grid g2 mt16">
        <div>
          <h4 style="font-size:13px" class="mb8">单证清单</h4>
          <div class="flex gap6 wrap">
            ${o.docs.map(d => { const [k, n] = DOC_KIND[d.state]; return h`<span class="tag ${k}">${esc(d.name)} · ${n}</span>`; })}
          </div>
          ${o.docs.some(d => d.state === 'missing')
            ? h`<div class="hint danger mt12">${icon('alert')}<div><b>原产地证缺失</b>：客户清关要求开船前 5 天办妥，当前距开船 21 天。已生成单证部待办。</div></div>` : ''}
        </div>
        <div>
          <h4 style="font-size:13px" class="mb8">跨部门任务（需签收）</h4>
          <div class="list" style="border:1px solid var(--border);border-radius:10px">
            ${o.tasks.map(t => h`
              <div class="list-item" style="padding:9px 11px">
                <span class="tag ${t.ack ? 'ok' : 'danger'}" style="margin-top:1px">${esc(t.dept)}</span>
                <div class="li-main">
                  <div class="li-desc" style="margin:0">${esc(t.text)}</div>
                  <div class="li-meta">${t.ack ? `✓ ${esc(t.by)} 已签收 · ${esc(t.at)}` : '⚠ 尚未签收'}</div>
                </div>
              </div>`)}
          </div>
          <div class="small muted mt8">销售确认的客户特殊要求自动生成部门待办并要求签收 —— 堵住「信息在交接处衰减」的漏洞。</div>
        </div>
      </div>

      ${o.state === '生产中' ? h`
        <div class="hint ok mt16">
          ${icon('spark')}
          <div><b>order-tracker 建议</b>：验货节点 8/22。该客户历来重视过程可视 —— 建议在验货完成当天推送带图进度报告。历史数据显示此举使复购间隔缩短约 3 周。
            <button class="btn sm mt8" data-demo="生成进度通报">生成客户进度通报草稿</button></div>
        </div>` : ''}
    </div>`;
}

export default function orders() {
  const o = ORDERS.find(x => x.id === current) || ORDERS[0];
  const inProd = ORDERS.filter(x => x.state === '生产中').reduce((a, x) => a + x.amount, 0);

  const html = h`
    <div class="page-head">
      <div>
        <h1>订单交付</h1>
        <div class="sub">交期节点反向触发对客户的<b>主动进度通报</b> —— 这是最有效、也最被忽视的复购铺垫。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="导出交期表">${icon('doc')} 导出交期表</button>
        <button class="btn primary" data-demo="新建订单">${icon('plus')} 新建订单</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'在手订单', value: ORDERS.length, foot:`合计 ${fmtMoney(ORDERS.reduce((a,x)=>a+x.amount,0))}` })}
      ${kpi({ label:'在产金额', value: fmtMoney(inProd, 'EUR'), foot:'最近交期 09-05' })}
      ${kpi({ label:'准交率', value:'96', unit:'%', delta:'3pt', foot:'近 12 个月 · 行业均值 82%' })}
      ${kpi({ label:'逾期应收', value:'€23,400', delta:'32 天', deltaDir:'down', foot:'PolTech · 已升级至财务' })}
    </div>

    ${hint(h`<b>PolTech 尾款逾期 32 天</b>：客户历史付款记录良好，可能是内部流程问题。系统建议<b>由财务出面发正式对账函</b>，而非销售催款 —— 保住销售与客户的关系，同时给出正式压力。`, 'warn')}

    <div class="grid g-split mt16">
      ${card(h`
        <div class="list">
          ${ORDERS.map(x => h`
            <div class="list-item" data-order="${esc(x.id)}" style="cursor:pointer;${x.id === current ? 'background:var(--brand-soft)' : ''}">
              <div class="li-main">
                <div class="li-title">${esc(x.flag)} ${esc(x.id)}</div>
                <div class="li-desc truncate">${esc(x.company)}</div>
                <div class="li-meta">
                  <b>${fmtMoney(x.amount, x.currency)}</b>
                  ${tag(x.state, x.state === '已发货' ? 'ok' : x.state === '待收尾款' ? 'danger' : 'brand')}
                </div>
                <div class="mt4">${bar(x.progress, x.progress === 100 ? '#10b981' : '#2563eb')}</div>
              </div>
            </div>`)}
        </div>`, { tight: true })}
      <section class="card" id="orderPane">${orderPane(o)}</section>
    </div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const d = e.target.closest('[data-demo]');
        if (d) return demoClick(d.dataset.demo);
        const row = e.target.closest('[data-order]');
        if (!row) return;
        current = row.dataset.order;
        document.getElementById('orderPane').innerHTML = orderPane(ORDERS.find(x => x.id === current));
        el.querySelectorAll('[data-order]').forEach(r => {
          r.style.background = r.dataset.order === current ? 'var(--brand-soft)' : '';
        });
      });
    },
  };
}
