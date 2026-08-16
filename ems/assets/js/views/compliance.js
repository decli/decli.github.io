/* 合规中心：opt-in 证据链 / LIA / 退订 / 审计日志 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint } from '../ui.js';
import { donut } from '../charts.js';
import { COMPLIANCE } from '../data.js';

export default function compliance() {
  const o = COMPLIANCE.optin;
  const totalContacts = o.granted + o.legitimate + o.none + o.withdrawn;

  const liaCols = [
    { t:'开发场景', render: l => h`<b>${esc(l.scenario)}</b>` },
    { t:'适用地区', render: l => tag(l.region, 'brand') },
    { t:'状态', render: l => tag(l.status, l.status === '已批准' ? 'ok' : 'warn') },
    { t:'批准人', render: l => esc(l.by) },
    { t:'批准日期', render: l => h`<span class="small">${esc(l.at)}</span>` },
    { t:'复审日期', render: l => h`<span class="small">${esc(l.review)}</span>` },
    { t:'操作', render: l => h`<button class="btn sm" data-demo="${l.status === '已批准' ? '查看 LIA' : '提交审核'}">${l.status === '已批准' ? '查看' : '提交审核'}</button>` },
  ];

  const auditCols = [
    { t:'时间', render: a => h`<span class="small mono">${esc(a.t)}</span>` },
    { t:'操作者', render: a => a.actor === '系统' || a.actor.includes('-')
        ? h`<span class="mono small" style="color:var(--brand)">${esc(a.actor)}</span>` : esc(a.actor) },
    { t:'动作', render: a => tag(a.act, a.act === '拦截发送' ? 'danger' : a.act.includes('GDPR') ? 'warn' : '') },
    { t:'对象', render: a => h`<span class="small">${esc(a.target)}</span>` },
    { t:'详情', render: a => h`<span class="small muted">${esc(a.detail)}</span>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>合规中心</h1>
        <div class="sub">合规不是设置页里的一个开关，而是贯穿数据采集、模板审批、发送执行、退订处理、审计留痕的横切能力，并且<b>默认安全</b>。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="导出合规报告">${icon('doc')} 导出合规报告</button>
        <button class="btn primary" data-demo="新建 LIA">${icon('plus')} 新建 LIA 评估</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'联系人总数', value: totalContacts.toLocaleString(), foot:'含所有渠道' })}
      ${kpi({ label:'明示同意 (opt-in)', value: o.granted.toLocaleString(), foot:`占 ${(o.granted/totalContacts*100).toFixed(0)}% · 可用于 WhatsApp 营销` })}
      ${kpi({ label:'退订处理时长', value: COMPLIANCE.unsub.avgRemoveHours, unit:'小时', foot:'CAN-SPAM 要求 10 个工作日内', hint:'我们的标准远严于法规要求' })}
      ${kpi({ label:'合规拦截（30 天）', value:'47', foot:'均为未获 opt-in 的 WhatsApp 发送尝试' })}
    </div>

    ${COMPLIANCE.risks.some(r => r.level === 'high')
      ? hint(h`<b>高风险项</b>：${esc(COMPLIANCE.risks.find(r => r.level === 'high').text)} —— 该域名当前已被系统禁止用于发送，直到 DMARC 配置完成。`, 'danger') : ''}

    <div class="grid g-2-1 mb16 mt16">
      ${card(h`
        <div class="flex ac gap12 mb16">
          ${donut([
            { name:'明示同意', v:o.granted, color:'#10b981' },
            { name:'正当利益', v:o.legitimate, color:'#2563eb' },
            { name:'无合法基础', v:o.none, color:'#f59e0b' },
            { name:'已撤回', v:o.withdrawn, color:'#dc2626' },
          ], { center:`${totalContacts}|联系人` })}
          <div class="legend" style="flex-direction:column;flex:1;gap:9px">
            <span><i style="background:#10b981"></i><b>明示同意</b> ${o.granted} · 邮件与 WhatsApp 均可</span>
            <span><i style="background:#2563eb"></i><b>正当利益</b> ${o.legitimate} · 仅邮件，需关联 LIA</span>
            <span><i style="background:#f59e0b"></i><b>无合法基础</b> ${o.none} · WhatsApp 按钮已物理禁用</span>
            <span><i style="background:#dc2626"></i><b>已撤回</b> ${o.withdrawn} · 已从所有序列排除</span>
          </div>
        </div>
        <div class="doc mono" style="font-size:11.5px;line-height:1.8">
<span class="muted">// opt-in 证据链结构（每条同意都可举证）</span>
{
  "contact_id": "CT-8821",
  "channel": "whatsapp",
  "source": "官网表单 · 独立勾选框（非默认勾选、非捆绑）",
  "ip": "203.0.113.45",
  "captured_at": "2026-06-14T08:32:11Z",
  "form_snapshot": "s3://ems-evidence/forms/f-2026-0614.html",
  "legal_basis": "explicit consent (GDPR Art.6(1)(a))"
}</div>
        <div class="small muted mt8">Meta 要求提供书面同意证据才批 WhatsApp 模板；「CRM 里存了号码」不构成群发许可。EU 营销消息还需<b>两重许可</b>：WhatsApp 专项 opt-in + GDPR 合法性基础。</div>`,
        { title:'opt-in 状态与证据链', sub:'按渠道分别存储，不是一个布尔值走天下' })}

      ${card(h`
        <div class="list" style="margin:-16px">
          ${COMPLIANCE.risks.map(r => h`
            <div class="list-item">
              <span class="tag ${r.level === 'high' ? 'danger' : r.level === 'mid' ? 'warn' : ''}" style="margin-top:2px">
                ${r.level === 'high' ? '高' : r.level === 'mid' ? '中' : '低'}</span>
              <div class="li-main"><div class="li-desc" style="margin:0">${esc(r.text)}</div></div>
              <button class="btn sm" data-demo="${esc(r.action)}">${esc(r.action)}</button>
            </div>`)}
        </div>`, { title:'风险清单' })}
    </div>

    <div class="mb16">
      ${card(table(liaCols, COMPLIANCE.lia), {
        title:'正当利益评估（LIA）存档',
        sub:'GDPR Art.6(1)(f) 允许 B2B 冷邮件，但必须完成并留存「目的 / 必要性 / 平衡」三段测试',
        tight:true })}
    </div>

    ${hint(h`<b>LIA 向导</b>：系统为每个开发场景生成三段论评估模板 —— <b>目的测试</b>（为何联系此人）· <b>必要性测试</b>（是否有侵入性更低的方式）· <b>平衡测试</b>（对方的合理预期是否被违背）。未通过审核的场景，其序列会被自动暂停（当前 SEQ-04 即处于此状态）。B2B 冷邮件违规罚则区间从小企业 €500 到 €900,000+。`)}

    <div class="grid g2 mt16">
      ${card(h`
        <dl class="kv">
          <dt>退订总数</dt><dd>${COMPLIANCE.unsub.total} 人</dd>
          <dt>近 30 天</dt><dd>${COMPLIANCE.unsub.last30} 人（退订率 0.52%）</dd>
          <dt>平均处理</dt><dd>${COMPLIANCE.unsub.avgRemoveHours} 小时（法规要求 10 个工作日）</dd>
          <dt>生效范围</dt><dd>全局 · 跨序列 · 跨发信账号 · 跨渠道</dd>
        </dl>
        <h4 class="mt16 mb8" style="font-size:13px">每封邮件页脚强制注入</h4>
        <div class="doc" style="font-size:11.5px;line-height:1.7">
Ningbo Hengda Precision Machinery Co., Ltd.<br>
No. 88 Jiangnan Road, Yinzhou District, Ningbo 315100, China<br>
You are receiving this because we identified your company as an importer of metal fabrication equipment.
<a href="javascript:void 0">Unsubscribe</a> · <a href="javascript:void 0">Privacy policy</a>
        </div>
        <div class="small muted mt8">公司名 + 实际地址 + 可用退订链接 + 联系原因 —— 一次性覆盖 CAN-SPAM / GDPR / CASL 的大部分要求。</div>`,
        { title:'退订中心' })}

      ${card(h`
        <dl class="kv">
          <dt>数据主体请求</dt><dd>本年 3 起，平均 2 天完成（法规上限 30 天）</dd>
          <dt>字段级加密</dt><dd>客户邮箱、电话 · KMS 托管密钥</dd>
          <dt>导出审计</dt><dd>所有导出行为强审计，含字段级脱敏记录</dd>
          <dt>数据驻留</dt><dd>可选 EU / 中国 / 新加坡区域</dd>
          <dt>日志保留</dt><dd>7 年（满足审计与举证需要）</dd>
        </dl>
        <div class="hint mt16">${icon('shield')}<div>
          <b>把合规做成卖点</b>：多数外贸营销工具最薄弱、也最容易变成客户重大风险的一环，恰恰是这里。做扎实，它就是护城河。</div></div>`,
        { title:'数据保护' })}
    </div>

    <div class="mt16">
      ${card(table(auditCols, COMPLIANCE.audit), {
        title:'审计日志', sub:'谁在什么时候对什么做了什么 —— 全量、不可篡改', tight:true,
        right: h`<button class="btn sm" data-demo="导出审计日志">导出</button>` })}
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
