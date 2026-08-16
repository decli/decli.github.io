/* 系统设置：集成 / 权限 / 计费 —— 同时作为体验版的说明页 */
import { h, esc, card, tag, icon, demoClick, hint, bar } from '../ui.js';
import { COMPANY_PROFILE, docLink } from '../data.js';

const INTEGRATIONS = [
  { name:'企业邮箱 (IMAP / OAuth)', desc:'Gmail / Outlook / 腾讯企业邮 / 阿里企业邮', state:'已连接 3 个', kind:'ok', note:'OAuth 授权，不存储密码' },
  { name:'邮件发送 (SES / Postmark)', desc:'专属 IP 池 + 多域名身份隔离', state:'已连接', kind:'ok', note:'起步用第三方，量大后自建 MTA 降本' },
  { name:'WhatsApp Business Cloud API', desc:'Meta 官方 API', state:'已连接', kind:'ok', note:'绝不使用非官方协议库 —— 封号且违反条款' },
  { name:'LinkedIn', desc:'用户自有账号 + 保守限速', state:'已连接 2 个账号', kind:'warn', note:'平台风控敏感，产品不承诺规避风控' },
  { name:'海关数据', desc:'多供应商抽象层，支持切换与比价', state:'已连接 2 家', kind:'ok', note:'避免单一供应商锁定与涨价风险' },
  { name:'汇率 / 物流追踪', desc:'实时汇率、船公司在途查询', state:'已连接', kind:'ok', note:'—' },
  { name:'ERP / PLM (MCP)', desc:'把自有系统注册为 Agent 工具', state:'未连接', kind:'', note:'开放能力，也是生态位' },
  { name:'跨境收款', desc:'PingPong / 连连', state:'未连接', kind:'', note:'—' },
];

export default function settings() {
  const html = h`
    <div class="page-head">
      <div>
        <h1>系统设置</h1>
        <div class="sub">${esc(COMPANY_PROFILE.name)} · ${esc(COMPANY_PROFILE.plan)} · ${COMPANY_PROFILE.seats} 席位</div>
      </div>
      <div class="actions">
        <button class="btn primary" data-demo="升级套餐">升级套餐</button>
      </div>
    </div>

    ${hint(h`<b>关于这个体验版</b>：纯静态前端演示，用于对齐产品认知、做客户访谈与投资演示。<b>其中公司名称、人名、域名、订单与金额全部为虚构示例</b>，与任何真实企业或个人无关。产品与技术方案文档见仓库 <span class="mono">/docs</span> 目录。`)}

    <div class="grid g-2-1 mt16 mb16">
      ${card(h`
        <div class="list" style="margin:-16px">
          ${INTEGRATIONS.map(i => h`
            <div class="list-item">
              <div class="li-main">
                <div class="li-title">${esc(i.name)} ${i.state.startsWith('已') ? tag(i.state, i.kind || 'ok') : tag(i.state, '')}</div>
                <div class="li-desc">${esc(i.desc)}</div>
                ${i.note !== '—' ? h`<div class="li-meta">${icon('info')} <span>${esc(i.note)}</span></div>` : ''}
              </div>
              <button class="btn sm" data-demo="${i.state.startsWith('已') ? '管理集成' : '连接'}">${i.state.startsWith('已') ? '管理' : '连接'}</button>
            </div>`)}
        </div>`, { title:'集成', sub:'外贸场景的集成决定了系统天花板' })}

      <div class="grid" style="align-content:start">
        ${card(h`
          <dl class="kv">
            <dt>当前套餐</dt><dd><b>${esc(COMPANY_PROFILE.plan)}</b> · ¥3,980/年·席位</dd>
            <dt>席位</dt><dd>${COMPANY_PROFILE.seats} / 20</dd>
            <dt>本月 AI</dt><dd>68,420 / 120,000 credits</dd>
            <dt>本月发信</dt><dd>2,462 / 96,000 封</dd>
            <dt>海关数据</dt><dd>本月 3,204 条 · ¥3,845</dd>
            <dt>站点托管</dt><dd>5 站 · ¥3,000/年</dd>
          </dl>
          <div class="mt12">
            <div class="flex jb small mb8"><span>AI credits 使用</span><b>57%</b></div>
            ${bar(57)}
          </div>
          <div class="small muted mt8">界面上明示每个动作消耗多少 credits —— 不透明的用量计费是客户流失的第一杀手。</div>`,
          { title:'套餐与用量' })}

        ${card(h`
          <dl class="kv">
            <dt>私海上限</dt><dd>每人 80 家</dd>
            <dt>自动回收</dt><dd>180 天无有效跟进 → 回公海</dd>
            <dt>无回应回收</dt><dd>90 天无客户回应 → 提醒，120 天 → 回收</dd>
            <dt>SLA 首响</dt><dd>4 小时（从「收到」计时）</dd>
            <dt>数据权限</dt><dd>行级隔离，私海不可跨人查看</dd>
            <dt>离职交接</dt><dd>一键转移，历史记录 100% 保留</dd>
          </dl>
          <button class="btn mt12" data-demo="编辑规则">编辑规则</button>`,
          { title:'客户资产规则', sub:'直击「人走客凉」的机制设计' })}
      </div>
    </div>

    <div class="grid g2">
      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>角色</th><th>可见范围</th><th>关键权限</th></tr></thead>
          <tbody>
            <tr><td class="b">业务员</td><td>自己的私海 + 公海</td><td class="small muted">跟进、报价、发起 PI；不可导出批量客户</td></tr>
            <tr><td class="b">主管</td><td>本组全部客户</td><td class="small muted">审批折扣、查看组内过程数据</td></tr>
            <tr><td class="b">老板 / 管理员</td><td>全公司</td><td class="small muted">渠道 ROI、团队健康度、合规、计费</td></tr>
            <tr><td class="b">单证 / 生产</td><td>已签约订单</td><td class="small muted">签收跨部门任务、上传单证；不可见客户联系方式</td></tr>
            <tr><td class="b">财务</td><td>订单与收款</td><td class="small muted">对账、账龄、汇率损益</td></tr>
          </tbody>
        </table></div>`, { title:'角色与权限', tight:true })}

      ${card(h`
        <div class="list" style="margin:-16px">
          <a class="list-item" href="${docLink('00-行业调研与业务流程.md')}" target="_blank" rel="noopener" style="color:inherit">
            <div class="li-main"><div class="li-title">00 · 行业调研与业务流程</div>
              <div class="li-desc">市场变化、角色画像、领域建模、竞品格局</div></div>${icon('arrow')}</a>
          <a class="list-item" href="${docLink('01-产品方案.md')}" target="_blank" rel="noopener" style="color:inherit">
            <div class="li-main"><div class="li-title">01 · 产品方案</div>
              <div class="li-desc">定位、功能架构、八大模块、差异化护城河</div></div>${icon('arrow')}</a>
          <a class="list-item" href="${docLink('02-技术方案.md')}" target="_blank" rel="noopener" style="color:inherit">
            <div class="li-main"><div class="li-title">02 · 技术方案</div>
              <div class="li-desc">架构、选型、数据模型、关键子系统、风险</div></div>${icon('arrow')}</a>
          <a class="list-item" href="${docLink('03-路线图与商业化.md')}" target="_blank" rel="noopener" style="color:inherit">
            <div class="li-main"><div class="li-title">03 · 路线图与商业化</div>
              <div class="li-desc">M0–M4 路线、定价、单位经济、GTM、90 天行动</div></div>${icon('arrow')}</a>
        </div>`, { title:'产品与技术方案文档' })}
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
