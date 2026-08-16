/* 触达序列 + 送达率保障 + 合规护栏 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint, bar, channelIcon, channelName } from '../ui.js';
import { SEQUENCES, DOMAIN_HEALTH } from '../data.js';

let tab = 'seq';

function seqCard(s) {
  return h`
    <section class="card mb16">
      <header class="card-head">
        <h3>${esc(s.name)}</h3>
        <span class="sub">${esc(s.lang)} · ${s.steps.length} 步</span>
        ${s.active ? tag('运行中', 'ok') : tag('已暂停', '')}
        <div class="right">
          <span class="small muted">入组 <b>${s.enrolled}</b> · 回复 <b>${s.replied}</b> (${(s.replied / s.enrolled * 100).toFixed(1)}%) · 会议 <b>${s.meetings}</b> · 退订 <b>${s.opted}</b></span>
          <button class="btn sm" data-demo="编辑序列">编辑</button>
          <button class="btn sm ${s.active ? '' : 'primary'}" data-demo="${s.active ? '暂停序列' : '启动序列'}">
            ${s.active ? icon('pause') : icon('play')}</button>
        </div>
      </header>
      <div class="card-body">
        <div class="timeline">
          ${s.steps.map(st => h`
            <div class="tl-item ${st.ch === 'whatsapp' ? 'warn' : ''}">
              <div class="tl-time">Day ${st.day}</div>
              <div class="tl-title flex ac gap6">
                <span class="muted">${channelIcon(st.ch)}</span>${esc(st.title)}
                ${tag(channelName(st.ch), st.ch === 'whatsapp' ? 'warn' : st.ch === 'linkedin' ? 'info' : 'brand')}
              </div>
              <div class="tl-body">${esc(st.note)}</div>
              <div class="small muted mt4">${esc(st.rate)}</div>
            </div>`)}
          <div class="tl-item ok">
            <div class="tl-time">任意时刻</div>
            <div class="tl-title">★ 客户一旦回复 → 立即退出序列并转人工</div>
            <div class="tl-body">自动化必须在「人味」开始的地方停下。模板化回复是客户流失的首要原因。</div>
          </div>
        </div>
      </div>
    </section>`;
}

function seqTab() {
  return h`
    <div class="grid g4 mb16">
      ${kpi({ label:'在跑序列', value:'2', foot:'共 3 个序列 · 1 个已暂停' })}
      ${kpi({ label:'本月已入组', value:'440', foot:'去重后唯一联系人' })}
      ${kpi({ label:'平均回复率', value:'14.9', unit:'%', delta:'3.2pt', foot:'行业冷邮件均值约 3–5%' })}
      ${kpi({ label:'退订率', value:'0.52', unit:'%', foot:'低于 0.8% 的健康阈值' })}
    </div>
    ${hint(h`<b>合规护栏演示</b>：SEQ-01 第 5 步为 WhatsApp。系统在执行时逐人校验 opt-in 证据，昨晚有 <b>3 位</b>联系人因未获授权被 compliance-officer 拦截并跳过（已记入审计日志）。这类拦截不可被业务代码绕过。`, 'warn')}
    <div class="mt16">${SEQUENCES.map(seqCard)}</div>`;
}

function deliverTab() {
  const cols = [
    { t:'发信域', render: d => h`<div class="mono b">${esc(d.domain)}</div><div class="small muted">${esc(d.role)}</div>` },
    { t:'SPF',   render: d => d.spf === 'ok' ? tag('通过', 'ok') : tag('异常', 'danger') },
    { t:'DKIM',  render: d => d.dkim === 'ok' ? tag('通过', 'ok') : tag('异常', 'danger') },
    { t:'DMARC', render: d => d.dmarc === '缺失' ? tag('缺失', 'danger') : tag(d.dmarc, d.dmarc === 'p=reject' ? 'ok' : 'warn') },
    { t:'域龄', render: d => h`<span class="small">${esc(d.age)}</span>` },
    { t:'30天发送量', cls:'num', render: d => d.sent.toLocaleString() },
    { t:'退信率', cls:'num', render: d => h`<span class="${d.bounce > 4 ? 'tag danger' : d.bounce > 2 ? 'tag warn' : ''}">${d.bounce}%</span>` },
    { t:'投诉率', cls:'num', render: d => h`<span class="${d.complaint > .1 ? 'tag warn' : ''}">${d.complaint}%</span>` },
    { t:'健康分', render: d => h`<div style="min-width:88px">${bar(d.score, d.score >= 85 ? '#10b981' : d.score >= 60 ? '#f59e0b' : '#dc2626')}<span class="small b">${d.score}</span></div>` },
    { t:'状态', render: d => tag(d.state, d.state === '健康' ? 'ok' : d.state === '预热中' ? 'warn' : 'danger') },
  ];

  return h`
    <div class="grid g4 mb16">
      ${kpi({ label:'综合投递率', value:'94.2', unit:'%', delta:'1.8pt', foot:'配置 SPF+DKIM+DMARC 前为 61%' })}
      ${kpi({ label:'打开率', value:'46.8', unit:'%', foot:'按客户本地时间投递后 +11pt' })}
      ${kpi({ label:'今日发送配额', value:'1,240 / 1,800', foot:'预热限速中，用户不可绕过' })}
      ${kpi({ label:'自动熔断', value:'1', foot:'hd-industrial.com 已降速至 60 封/日', hint:'退信率超阈值时 deliverability-guard 自动降速' })}
    </div>

    ${hint(h`<b>为什么这是护城河</b>：仅配 SPF，邮件大概率进垃圾箱；DKIM 是 Gmail 最看重的信任指标；DMARC 决定认证失败时的处置。把投递率从 60% 拉到 94% 靠的是<b>认证 + 专属域名池 + 智能限速 + 反馈回路</b>四件事，而不是「群发功能」。`)}

    <div class="mt16 mb16">
      ${card(table(cols, DOMAIN_HEALTH), {
        title:'发信域健康度',
        sub:'交易邮件走主域，冷开发走子域 —— 主域信誉是公司资产，不能被开发信毁掉',
        right: h`<button class="btn sm" data-demo="添加发信域">${icon('plus')} 添加发信域</button>`, tight:true })}
    </div>

    <div class="grid g2">
      ${card(h`
        <div class="timeline">
          <div class="tl-item ok"><div class="tl-time">第 1–7 天</div><div class="tl-title">20 → 60 封/日</div>
            <div class="tl-body">仅发送给高互动名单（历史打开过的联系人），建立初始信誉</div></div>
          <div class="tl-item ok"><div class="tl-time">第 8–14 天</div><div class="tl-title">60 → 150 封/日</div>
            <div class="tl-body">若打开率 &gt; 30% 则按曲线加速，否则维持</div></div>
          <div class="tl-item"><div class="tl-time">第 15–30 天</div><div class="tl-title">150 → 500 封/日</div>
            <div class="tl-body">hd-industrial.com 当前处于此阶段（第 28 天），因退信率 4.8% 已自动降速</div></div>
          <div class="tl-item muted"><div class="tl-time">第 30 天后</div><div class="tl-title">稳定期 500–800 封/日</div>
            <div class="tl-body">动态调整，任何指标异常立即回退</div></div>
        </div>`,
        { title:'自动预热曲线', sub:'系统强制执行，不提供「一键群发 5000 封」的自毁按钮' })}

      ${card(h`
        <div class="doc mono" style="line-height:1.9">
<span class="muted">// 每一封外发邮件都必须通过的检查</span>
1. 全局退订名单        <span style="color:#10b981">✓ 跨序列跨账号生效</span>
2. 渠道级 opt-in 状态  <span style="color:#10b981">✓ WhatsApp 需证据链</span>
3. 地域规则           <span style="color:#10b981">✓ EU 收件人须关联 LIA</span>
4. 页脚自动注入        <span style="color:#10b981">✓ 公司名/地址/退订/事由</span>
5. 内容合规检查        <span style="color:#10b981">✓ 禁词/夸大宣称/价格泄露</span>
6. 频率上限           <span style="color:#10b981">✓ 同一联系人 7 天 ≤ 2 次</span>
        </div>
        <div class="small muted mt12">合规拦截器是发送路径上的唯一出口 —— 任何代码路径都无法绕过。检查不通过则挂起等人工，而非记日志放行。</div>`,
        { title:'合规拦截器', sub:'默认合规，不是设置页里的一个开关' })}
    </div>`;
}

export default function sequences() {
  const html = h`
    <div class="page-head">
      <div>
        <h1>触达中心</h1>
        <div class="sub">多渠道序列编排 + 送达率工程 + 合规护栏。做的不是「能群发」，而是「能送达、且合法」。</div>
      </div>
      <div class="actions">
        <button class="btn primary" data-demo="新建序列">${icon('plus')} 新建序列</button>
      </div>
    </div>
    <div class="card mb16" style="padding:0">
      <div class="tabs">
        <button data-tab="seq" class="${tab === 'seq' ? 'on' : ''}">序列编排</button>
        <button data-tab="del" class="${tab === 'del' ? 'on' : ''}">送达率与合规</button>
      </div>
    </div>
    <div id="seqBody">${tab === 'seq' ? seqTab() : deliverTab()}</div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const t = e.target.closest('[data-tab]');
        if (t) {
          tab = t.dataset.tab;
          el.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
          document.getElementById('seqBody').innerHTML = tab === 'seq' ? seqTab() : deliverTab();
          return;
        }
        const d = e.target.closest('[data-demo]');
        if (d) demoClick(d.dataset.demo);
      });
    },
  };
}
