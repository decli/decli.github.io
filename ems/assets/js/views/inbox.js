/* 统一收件箱：邮件 + WhatsApp + 官网表单 归一，AI 摘要 / 建议 / 草稿 */
import { h, esc, card, tag, icon, demoClick, channelIcon, channelName, hint } from '../ui.js';
import { INBOX } from '../data.js';

let current = INBOX[0].id;

function listPane() {
  return h`
    <div class="toolbar" style="padding:10px 12px">
      <input class="input" placeholder="搜索发件人 / 主题" style="flex:1;min-width:0">
      <button class="btn sm" data-demo="筛选">${icon('search')}</button>
    </div>
    <div class="seg" style="margin:0 12px 8px">
      <button class="on">全部 ${INBOX.length}</button>
      <button data-demo="按渠道筛选">未读 ${INBOX.filter(m=>m.unread).length}</button>
      <button data-demo="按渠道筛选">高意向 3</button>
    </div>
    <div class="list scroll-y" style="max-height:calc(100vh - 320px)">
      ${INBOX.map(m => h`
        <div class="list-item ${m.id === current ? 'sel' : ''}" data-msg="${esc(m.id)}" style="cursor:pointer;${m.id === current ? 'background:var(--brand-soft)' : ''}">
          <span class="muted" style="margin-top:2px" title="${channelName(m.channel)}">${channelIcon(m.channel)}</span>
          <div class="li-main">
            <div class="li-title" style="${m.unread ? '' : 'font-weight:500'}">
              ${esc(m.flag)} ${esc(m.from)}
              ${m.unread ? h`<span class="dot-s" style="background:#ef4444"></span>` : ''}
              <span class="small muted" style="margin-left:auto">${esc(m.receivedAt.slice(11))}</span>
            </div>
            <div class="li-desc truncate">${esc(m.subject)}</div>
            <div class="li-meta">
              ${m.intent.map(i => tag(i, i === '新询盘' ? 'brand' : ''))}
              <span class="tag ${m.slaState === 'warn' ? 'danger' : 'ok'}">${icon('clock')} ${esc(m.sla)}</span>
            </div>
          </div>
        </div>`)}
    </div>`;
}

function detailPane(m) {
  return h`
    <div class="card-head">
      <div style="min-width:0">
        <h3 class="truncate">${esc(m.subject)}</h3>
        <div class="small muted mt4">
          ${esc(m.flag)} <b>${esc(m.from)}</b> · ${esc(m.company)} ·
          ${channelName(m.channel)} · 收到 ${esc(m.receivedAt)} <span class="muted">(${esc(m.localTime)})</span>
        </div>
      </div>
      <div class="right">
        <span class="tag ${m.slaState === 'warn' ? 'danger' : 'ok'}">${icon('clock')} SLA ${esc(m.sla)}</span>
      </div>
    </div>
    <div class="card-body">
      <div class="doc mb16" style="white-space:pre-wrap">${esc(m.preview)}
…（体验版仅展示摘要片段）</div>

      <div class="hint mb12">
        ${icon('spark')}
        <div><b>AI 摘要</b>：${esc(m.aiSummary)}</div>
      </div>
      <div class="hint ok mb16">
        ${icon('spark')}
        <div><b>行动建议</b>：${esc(m.aiSuggestion)}</div>
      </div>

      ${m.draft ? h`
        <div class="flex ac jb mb8">
          <h4 style="font-size:13px">AI 回复草稿 <span class="tag info">L1 · 需人工审核后发送</span></h4>
          <div class="seg">
            <button class="on">正式</button><button data-demo="切换语气">热情</button><button data-demo="切换语气">简洁</button>
          </div>
        </div>
        <textarea class="input w100 mono" rows="16" style="line-height:1.65">${esc(m.draft)}</textarea>
        <div class="flex gap8 mt12 wrap">
          <button class="btn primary" data-demo="发送回复">${icon('send')} 审核并发送</button>
          <button class="btn" data-demo="重新生成">${icon('spark')} 重新生成</button>
          <button class="btn" data-demo="插入报价">${icon('quote')} 插入报价</button>
          <button class="btn ghost" data-demo="转他人处理">转他人处理</button>
          <span class="grow"></span>
          <span class="small muted flex ac gap4">${icon('shield')} 合规检查通过 · 页脚将自动注入退订链接</span>
        </div>`
      : h`
        <div class="empty" style="padding:24px">
          ${m.id === 'M-5509'
            ? '此询盘已由 inbox-triage 完成核验（海关数据确认为真实买家），reply-drafter 正在生成报价型回复…'
            : '该会话已由人工接管，AI 不再生成草稿。'}
        </div>
        <div class="flex gap8">
          <button class="btn primary" data-demo="生成草稿">${icon('spark')} 生成回复草稿</button>
          <button class="btn" data-demo="手动回复">手动回复</button>
        </div>`}
    </div>`;
}

export default function inbox() {
  const m = INBOX.find(x => x.id === current) || INBOX[0];

  const html = h`
    <div class="page-head">
      <div>
        <h1>统一收件箱</h1>
        <div class="sub">邮件、WhatsApp、官网表单、平台站内信汇聚一处。SLA 首响时钟从「收到」开始计时，不是从「你看到」开始。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="连接邮箱">${icon('mail')} 连接邮箱</button>
        <button class="btn" data-demo="连接 WhatsApp">${icon('wa')} 连接 WhatsApp</button>
        <button class="btn primary" data-demo="写新邮件">${icon('plus')} 写新邮件</button>
      </div>
    </div>

    ${hint(h`<b>为什么这一屏最重要</b>：调研中最高频的失败模式是「询盘分散在 4 个地方、凭感觉排优先级」。这里按 <b>SLA 紧急度 × 成交概率</b> 排序，并对每条给出摘要与建议，把「读懂 + 决定 + 起草」三步压缩成一步。`)}

    <div class="grid g-split mt16">
      ${card(listPane(), { tight: true })}
      <section class="card" id="msgPane">${detailPane(m)}</section>
    </div>`;

  return {
    html,
    mount(el) {
      el.addEventListener('click', (e) => {
        const d = e.target.closest('[data-demo]');
        if (d) return demoClick(d.dataset.demo);
        const row = e.target.closest('[data-msg]');
        if (!row) return;
        current = row.dataset.msg;
        const msg = INBOX.find(x => x.id === current);
        document.getElementById('msgPane').innerHTML = detailPane(msg);
        el.querySelectorAll('[data-msg]').forEach(r => {
          r.style.background = r.dataset.msg === current ? 'var(--brand-soft)' : '';
        });
      });
    },
  };
}
