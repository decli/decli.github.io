/* 商机看板：可拖拽，但阶段推进需要客观事件依据 */
import { h, esc, card, kpi, tag, icon, demoClick, hint, toast } from '../ui.js';
import { funnel } from '../charts.js';
import { DEALS, DEAL_STAGES, FUNNEL, LOST_REASONS, fmtMoney } from '../data.js';

/* 每个阶段的客观进入条件——这是让预测可信的关键约束 */
const ENTRY_RULE = {
  contacted: '已发出首次触达',
  engaged:   '收到客户回复（非自动回复）',
  qualified: '已确认规格与数量，或收到目标价',
  quoted:    '报价单已发送且客户已打开',
  pi:        'PI 已生成并发送',
  won:       '合同已签回 或 定金已到账',
};

const deals = DEALS.map(d => ({ ...d }));   // 本地副本，允许演示拖拽

function board() {
  return h`
    <div class="kanban">
      ${DEAL_STAGES.map(s => {
        const list = deals.filter(d => d.stage === s.key);
        const sum = list.reduce((a, d) => a + d.amount, 0);
        return h`
          <div class="kb-col" data-stage="${s.key}">
            <div class="kb-head">
              <i class="dot-s" style="background:${s.color}"></i>
              <b style="font-size:12.5px">${s.name}</b>
              <span class="n">${list.length}</span>
            </div>
            <div class="small muted" style="padding:0 12px 6px">${fmtMoney(sum)}</div>
            <div class="kb-body">
              ${list.map(d => h`
                <div class="kb-card" draggable="true" data-deal="${esc(d.id)}">
                  <div class="t">${esc(d.flag)} ${esc(d.name)}</div>
                  <div class="m">
                    <span class="amount">${fmtMoney(d.amount)}</span>
                    <span>·</span><span>${d.prob}%</span>
                    ${d.risk ? tag('风险', 'danger') : d.days > 5 ? tag(d.days + '天无进展', 'warn') : ''}
                  </div>
                  <div class="m"><span class="muted">${esc(d.owner)}</span><span>·</span><span class="truncate">${esc(d.next)}</span></div>
                </div>`)}
              ${list.length ? '' : h`<div class="small muted" style="padding:10px;text-align:center">拖动卡片到此</div>`}
            </div>
          </div>`;
      })}
    </div>`;
}

export default function dealsView() {
  const total = deals.filter(d => d.stage !== 'won').reduce((a, d) => a + d.amount, 0);
  const weighted = deals.filter(d => d.stage !== 'won').reduce((a, d) => a + d.amount * d.prob / 100, 0);
  const piAmt = deals.filter(d => d.stage === 'pi').reduce((a, d) => a + d.amount, 0);
  const wonAmt = deals.filter(d => d.stage === 'won').reduce((a, d) => a + d.amount, 0);

  const html = h`
    <div class="page-head">
      <div>
        <h1>商机看板</h1>
        <div class="sub">阶段推进需要<b>客观事件</b>支撑。拖动卡片试试——缺少依据时系统会提示，这是让预测数据可信的关键约束。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="按负责人分组">${icon('users')} 按负责人</button>
        <button class="btn primary" data-demo="新建商机">${icon('plus')} 新建商机</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'在手商机总额', value: fmtMoney(total), foot:`${deals.filter(d=>d.stage!=='won').length} 个商机` })}
      ${kpi({ label:'加权预测', value: fmtMoney(weighted), foot:'按各阶段历史赢率加权' })}
      ${kpi({ label:'已发 PI 金额', value: fmtMoney(piAmt), foot:'PI ≠ 赢单，单独统计', hint:'PI 只是书面确认报价条件，离下单还差很远。混入赢单会让预测虚高' })}
      ${kpi({ label:'已签约金额', value: fmtMoney(wonAmt), delta:'18%', foot:'本季度' })}
    </div>

    ${hint(h`<b>PI 转化率 <b>62%</b></b> —— 已发 PI 的商机中最终签约的比例。很多系统把「发出 PI」直接算成赢单，导致预测系统性虚高。这里把它设为独立阶段并单独统计。`)}

    <div class="mt16 mb16">${board()}</div>

    <div class="grid g2">
      ${card(h`
        ${funnel(FUNNEL, { w: 520, rowH: 36 })}
        <div class="small muted mt8">右列为环比上一阶段的转化率，低于 35% 标红。</div>`,
        { title:'全公司转化漏斗', sub:'近 90 天' })}

      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>丢单原因</th><th class="num">数量</th><th>占比</th></tr></thead>
          <tbody>${LOST_REASONS.map(r => h`<tr>
            <td>${esc(r.r)}</td>
            <td class="num b">${r.v}</td>
            <td style="min-width:140px">
              <div class="bar"><i style="width:${r.v}%;background:${r.v > 25 ? '#dc2626' : r.v > 14 ? '#f59e0b' : '#94a3b8'}"></i></div>
            </td></tr>`)}</tbody>
        </table></div>
        <div class="hint mt12">${icon('spark')}<div>
          「价格高于竞品」占 34% —— 但其中 <b>21 单</b>的客户从未看过我们的成本构成说明。建议在报价单中默认附「价值拆解页」，A/B 测试已在 SEQ-01 中启动。</div></div>`,
        { title:'丢单原因分析', sub:'结构化必填字段 —— 老板能拿到的最有价值的一份数据', tight:false })}
    </div>`;

  return {
    html,
    mount(el) {
      let dragging = null;

      el.addEventListener('dragstart', (e) => {
        const c = e.target.closest('.kb-card');
        if (!c) return;
        dragging = c.dataset.deal;
        c.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragend', (e) => {
        e.target.closest('.kb-card')?.classList.remove('dragging');
        el.querySelectorAll('.kb-col').forEach(c => c.classList.remove('drop-target'));
      });
      el.addEventListener('dragover', (e) => {
        const col = e.target.closest('.kb-col');
        if (!col) return;
        e.preventDefault();
        el.querySelectorAll('.kb-col').forEach(c => c.classList.toggle('drop-target', c === col));
      });
      el.addEventListener('drop', (e) => {
        const col = e.target.closest('.kb-col');
        if (!col || !dragging) return;
        e.preventDefault();
        const d = deals.find(x => x.id === dragging);
        const to = col.dataset.stage;
        el.querySelectorAll('.kb-col').forEach(c => c.classList.remove('drop-target'));
        if (!d || d.stage === to) return;

        const fromIdx = DEAL_STAGES.findIndex(s => s.key === d.stage);
        const toIdx = DEAL_STAGES.findIndex(s => s.key === to);
        d.stage = to;
        // 重绘看板
        el.querySelector('.kanban').outerHTML = board();

        if (toIdx > fromIdx) {
          toast(`已移至「${DEAL_STAGES[toIdx].name}」。缺少依据：${ENTRY_RULE[to]} —— 系统已标记为待补充证据`, 'warn');
        } else {
          toast(`已回退至「${DEAL_STAGES[toIdx].name}」，请填写回退原因`, 'warn');
        }
        dragging = null;
      });

      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-demo]');
        if (b) demoClick(b.dataset.demo);
      });
    },
  };
}
