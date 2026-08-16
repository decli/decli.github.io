/* AI Agents：目标 → 计划 → 任务 → 步骤 → 事件；HITL 分级；运行回放 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint, bar, openDrawer } from '../ui.js';
import { AGENTS, AGENT_GOAL, AGENT_RUN_LOG } from '../data.js';

let tab = 'list';

const LEVEL_DESC = {
  L0: ['', 'L0 观察 · 只给建议'],
  L1: ['brand', 'L1 草稿 · 人工审核后发送'],
  L2: ['info', 'L2 有限自主 · 白名单动作自动执行'],
  L3: ['warn', 'L3 目标自主 · 护栏内自主执行'],
};

const LOG_KIND = { ok:['ok','完成'], info:['','信息'], warn:['warn','告警'], block:['danger','拦截'], hold:['warn','挂起'] };

function listTab() {
  const cols = [
    { t:'ID', cls:'num', render: a => h`<span class="muted">${a.id}</span>` },
    { t:'Agent', render: a => h`<div class="b mono" style="font-size:12.5px">${esc(a.name)}</div>
        <div class="small muted">${esc(a.desc)}</div>` },
    { t:'自主级别', render: a => { const [k, n] = LEVEL_DESC[a.level]; return h`<span class="tag ${k}" title="${n}">${a.level}</span>`; } },
    { t:'工具', render: a => h`<div class="flex gap4 wrap" style="max-width:230px">${a.tools.map(t => h`<span class="tag mono" style="font-size:10.5px">${esc(t)}</span>`)}</div>` },
    { t:'24h 运行', cls:'num', render: a => a.runs24 },
    { t:'任务数', cls:'num', render: a => a.tasks },
    { t:'成功率', render: a => a.enabled ? h`<div style="min-width:70px">${bar(a.success, a.success >= 95 ? '#10b981' : '#f59e0b')}<span class="small">${a.success}%</span></div>` : h`<span class="muted">—</span>` },
    { t:'24h 成本', cls:'num', render: a => a.cost ? h`¥${a.cost.toFixed(1)}` : h`<span class="muted">—</span>` },
    { t:'启用', render: a => h`<span class="tag ${a.enabled ? 'ok' : ''}">${a.enabled ? '已启用' : '已停用'}</span>` },
    { t:'操作', render: a => h`<div class="row-actions">
        <button class="btn sm" data-agent="${esc(a.name)}">配置</button>
        <button class="btn sm" data-demo="运行日志">日志</button></div>` },
  ];

  return h`
    <div class="grid g4 mb16">
      ${kpi({ label:'启用 Agent', value: AGENTS.filter(a => a.enabled).length, foot:`共 ${AGENTS.length} 个` })}
      ${kpi({ label:'24h 执行任务', value: AGENTS.reduce((a, x) => a + x.tasks, 0), foot:'相当于约 2.3 个人力日' })}
      ${kpi({ label:'24h AI 成本', value:'¥' + AGENTS.reduce((a, x) => a + x.cost, 0).toFixed(1), foot:'折合每席位 ¥23.6/天', hint:'成本必须能算到单客户单任务，否则毛利守不住' })}
      ${kpi({ label:'待人工处理', value:'1', foot:'A-314 内容审核已挂起 9h12m' })}
    </div>

    ${hint(h`<b>Agent 不是「AI 小助手」</b>：区别在于它有<b>目标</b>、能<b>拆计划</b>、会<b>调工具</b>、留<b>全量痕迹</b>、并且<b>可被人接管</b>。每一步都记录 {输入, 工具, 参数, 输出, 模型, token, 成本, 耗时, 决策依据}，既是审计需要，也是产品改进的数据来源。`)}

    <div class="mt16">${card(table(cols, AGENTS), {
      title:'Agent 列表',
      right: h`<button class="btn sm primary" data-demo="新建 Agent">${icon('plus')} 新建 Agent</button>`, tight:true })}</div>

    <div class="grid g2 mt16">
      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>级别</th><th>行为</th><th>适用</th></tr></thead>
          <tbody>
            <tr><td>${tag('L0', '')}</td><td>只给建议，人全手动</td><td class="muted small">新客户上线首两周</td></tr>
            <tr><td>${tag('L1', 'brand')}</td><td>Agent 起草，人审核后发送</td><td class="muted small"><b>默认级别</b></td></tr>
            <tr><td>${tag('L2', 'info')}</td><td>白名单动作自动执行，外发仍需审核</td><td class="muted small">熟悉后</td></tr>
            <tr><td>${tag('L3', 'warn')}</td><td>护栏内自主执行，异常升级给人</td><td class="muted small">成熟客户 + 低风险场景</td></tr>
          </tbody>
        </table></div>
        <div class="small muted mt12">分级是让老板敢用的关键。默认 L1 —— 我们不做黑盒自动发送。</div>`,
        { title:'人机协作（HITL）分级' })}

      ${card(h`
        <div class="doc mono" style="line-height:1.85">
Goal   目标（人设定）
  ↓
Plan   计划（可编辑）
  ↓
Task   任务（可调度 · 有预算/超时/重试）
  ↓
Step   步骤（工具调用）
  ↓
Event  事件（全量留痕 · 可回放 · 可归因）
        </div>
        <div class="small muted mt12">
          <b>幂等</b>：每个 Step 有幂等键，工作流重放不会重复发信 —— 发信是不可逆动作，需要最强保护。<br>
          <b>预算</b>：Goal 级 token 与金额上限，超限暂停并通知。<br>
          <b>接管</b>：任何 Task 可 pause → 人工改输入/输出 → resume。
        </div>`, { title:'编排模型' })}
    </div>`;
}

function goalTab() {
  const g = AGENT_GOAL;
  return h`
    <div class="grid g-2-1 mb16">
      ${card(h`
        <div class="flex ac jb mb12">
          <div>
            <div class="b" style="font-size:14px">${esc(g.objective)}</div>
            <div class="small muted mt4">${esc(g.id)} · 负责人 ${esc(g.owner)} · 截止 ${esc(g.deadline)}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:22px;font-weight:700">${g.progress} / ${g.target}</div>
            <div class="small muted">高意向线索</div>
          </div>
        </div>
        ${bar(g.progress / g.target * 100)}
        <div class="flex jb small muted mt4">
          <span>进度 ${Math.round(g.progress / g.target * 100)}%</span>
          <span>预算 ${g.budget.used} / ${g.budget.total} ${g.budget.unit}</span>
        </div>

        <h4 class="mt16 mb8" style="font-size:13px">执行计划（可编辑）</h4>
        <div class="timeline">
          ${g.plan.map(p => h`
            <div class="tl-item ${p.state === 'done' ? 'ok' : p.state === 'running' ? '' : 'muted'}">
              <div class="tl-time">步骤 ${p.n} · <span class="mono">${esc(p.agent)}</span>
                ${tag(p.state === 'done' ? '已完成' : p.state === 'running' ? '执行中' : '待执行',
                      p.state === 'done' ? 'ok' : p.state === 'running' ? 'brand' : '')}</div>
              <div class="tl-title">${esc(p.title)}</div>
              <div class="tl-body">${esc(p.out)}</div>
            </div>`)}
        </div>

        <div class="flex gap8 mt16">
          <button class="btn" data-demo="暂停目标">${icon('pause')} 暂停</button>
          <button class="btn" data-demo="编辑计划">编辑计划</button>
          <button class="btn" data-demo="调整预算">调整预算</button>
        </div>`,
        { title:'目标任务 · Goal', sub:'人设定目标，Agent 拆计划并执行' })}

      ${card(h`
        <dl class="kv">
          <dt>已用预算</dt><dd>${g.budget.used} credits（¥${(g.budget.used * 0.01).toFixed(2)}）</dd>
          <dt>预算上限</dt><dd>${g.budget.total} credits · 超限自动暂停</dd>
          <dt>参与 Agent</dt><dd>5 个</dd>
          <dt>产出线索</dt><dd>41 条（≥80 分）</dd>
          <dt>已入组触达</dt><dd>33 人</dd>
          <dt>已获回复</dt><dd>7 人（21.2%）</dd>
          <dt>判定高意向</dt><dd>5 人</dd>
        </dl>
        <div class="hint mt16">${icon('spark')}<div>
          <b>成本可解释</b>：界面上明示每个动作消耗多少 credits。不透明的用量计费是客户流失的第一杀手。</div></div>`,
        { title:'预算与产出' })}
    </div>`;
}

function logTab() {
  return h`
    ${hint(h`每一条都是可回放的 Event 记录。注意 <b>20:00:14</b> 那条 —— compliance-officer 拦截了 3 位未获 WhatsApp opt-in 的联系人。这类拦截是发送路径上的强制关卡，业务代码无法绕过。`, 'warn')}
    <div class="mt16">
      ${card(h`
        <div class="list">
          ${AGENT_RUN_LOG.map(l => { const [k, n] = LOG_KIND[l.lvl]; return h`
            <div class="list-item">
              <span class="small muted mono" style="width:62px;flex:none;margin-top:2px">${esc(l.t)}</span>
              <span class="tag ${k}" style="margin-top:1px;flex:none">${n}</span>
              <div class="li-main">
                <div class="li-title" style="font-weight:550">
                  <span class="mono" style="color:var(--brand)">${esc(l.agent)}</span>
                  <span class="muted">›</span>
                  <span class="mono muted" style="font-size:11.5px">${esc(l.step)}</span>
                </div>
                <div class="li-desc">${esc(l.msg)}</div>
                <div class="li-meta mono" style="font-size:11px">${esc(l.meta)}</div>
              </div>
              <button class="btn sm" data-demo="回放此步">回放</button>
            </div>`; })}
        </div>`,
        { title:'运行日志 · 最近 24 小时',
          right: h`<div class="seg"><button class="on">全部</button><button data-demo="筛选">告警</button><button data-demo="筛选">拦截</button></div>`,
          tight:true })}
    </div>`;
}

function agentConfig(name) {
  const a = AGENTS.find(x => x.name === name);
  if (!a) return '';
  const [k, n] = LEVEL_DESC[a.level];
  return h`
    <div class="flex ac gap8 mb16">
      <span class="mono b" style="font-size:15px">${esc(a.name)}</span>
      <span class="tag ${k}">${n}</span>
    </div>
    <div class="muted mb16">${esc(a.desc)}</div>

    <h4 style="font-size:13px" class="mb8">工具集（MCP 注册）</h4>
    <div class="flex gap6 wrap mb16">${a.tools.map(t => h`<span class="tag mono">${esc(t)}</span>`)}</div>

    <h4 style="font-size:13px" class="mb8">护栏配置</h4>
    <dl class="kv">
      <dt>自主级别</dt><dd>${a.level} — ${n.split(' · ')[1]}</dd>
      <dt>Token 预算</dt><dd>5,000 / 日 · 超限降级到小模型</dd>
      <dt>速率限制</dt><dd>60 次 / 分钟</dd>
      <dt>失败重试</dt><dd>3 次 · 指数退避</dd>
      <dt>超时降级</dt><dd>外部 API 超时 → 使用缓存结果或跳过</dd>
      <dt>幂等保护</dt><dd>已启用（发信类动作强制）</dd>
      <dt>模型路由</dt><dd>分类任务 → haiku；写作 → opus；批量评分 → 小模型</dd>
    </dl>

    <div class="hint mt16">${icon('shield')}<div>
      任何外发动作在执行前都会经过 <b>compliance-officer</b> 的拦截检查（opt-in、退订名单、地域规则、页脚注入、内容合规、频率上限）。这不是本 Agent 的配置项，而是系统级的强制关卡。</div></div>

    <div class="flex gap8 mt16">
      <button class="btn primary" data-demo="保存配置">保存</button>
      <button class="btn" data-demo="测试运行">测试运行</button>
      <button class="btn danger" data-demo="停用 Agent">停用</button>
    </div>`;
}

export default function agents() {
  const html = h`
    <div class="page-head">
      <div>
        <h1>AI Agents</h1>
        <div class="sub">编排层，不是散落各页面的「智能生成」按钮。目标 → 计划 → 任务 → 步骤 → 事件，全程可观测、可接管、可回放。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="工具市场">${icon('gear')} 工具市场（MCP）</button>
        <button class="btn primary" data-demo="新建目标">${icon('plus')} 新建目标</button>
      </div>
    </div>
    <div class="card mb16" style="padding:0">
      <div class="tabs">
        <button data-tab="list" class="${tab === 'list' ? 'on' : ''}">Agent 列表</button>
        <button data-tab="goal" class="${tab === 'goal' ? 'on' : ''}">目标任务</button>
        <button data-tab="log"  class="${tab === 'log'  ? 'on' : ''}">运行日志</button>
      </div>
    </div>
    <div id="agentBody">${tab === 'list' ? listTab() : tab === 'goal' ? goalTab() : logTab()}</div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const t = e.target.closest('[data-tab]');
        if (t) {
          tab = t.dataset.tab;
          el.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
          document.getElementById('agentBody').innerHTML =
            tab === 'list' ? listTab() : tab === 'goal' ? goalTab() : logTab();
          return;
        }
        const a = e.target.closest('[data-agent]');
        if (a) {
          return openDrawer('Agent 配置', agentConfig(a.dataset.agent), (mask) => {
            mask.addEventListener('click', (ev) => {
              const b = ev.target.closest('[data-demo]');
              if (b) demoClick(b.dataset.demo);
            });
          });
        }
        const d = e.target.closest('[data-demo]');
        if (d) demoClick(d.dataset.demo);
      });
    },
  };
}
