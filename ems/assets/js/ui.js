/* ==========================================================================
   UI 原语：模板、图标、通用组件
   视图函数返回 { html, mount? }，mount 在插入 DOM 后执行以绑定交互。
   ========================================================================== */

/** 转义，防止模拟数据中的特殊字符破坏结构 */
export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** 模板标签：数组自动 join，其余原样插入（内容已在调用处控制） */
export const h = (strings, ...vals) =>
  strings.reduce((out, s, i) => {
    const v = vals[i - 1];
    return out + (Array.isArray(v) ? v.join('') : (v ?? '')) + s;
  });

/* ---------- 图标（内联 SVG，24×24 stroke 风格，无外部依赖） ---------- */
const P = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
        stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

export const ICONS = {
  dashboard: P('<rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="11" width="7" height="10" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>'),
  radar:     P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6-4"/>'),
  users:     P('<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7" r="3.2"/><path d="M17 11a3 3 0 1 0-1-5.8"/><path d="M21 20v-1.4a3.6 3.6 0 0 0-2.6-3.4"/>'),
  inbox:     P('<path d="M3 13h5l1.6 2.6h4.8L16 13h5"/><path d="M4.6 5h14.8l1.6 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z"/>'),
  send:      P('<path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 15 21.5l-4-8.5-8.5-4z"/>'),
  deals:     P('<path d="M3 20h18"/><rect x="4" y="11" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="13" rx="1"/><rect x="16" y="13" width="4" height="6" rx="1"/>'),
  quote:     P('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  order:     P('<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'),
  site:      P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
  content:   P('<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>'),
  agent:     P('<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 7V4"/><circle cx="12" cy="3" r="1.3"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/>'),
  chart:     P('<path d="M3 3v18h18"/><path d="M7 15l4-5 3.5 3.5L21 7"/>'),
  shield:    P('<path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6z"/><path d="M9.2 12.2l2 2 3.8-4"/>'),
  gear:      P('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>'),
  mail:      P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>'),
  wa:        P('<path d="M3.5 20.5 5 16a8 8 0 1 1 3 3z"/><path d="M9 10c0 3 2 5 5 5 .8 0 1.3-.6 1-1.2l-.6-1-1.6.5-2.1-2.1.5-1.6-1-.6C9.6 8.7 9 9.2 9 10z" fill="currentColor" stroke="none"/>'),
  form:      P('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>'),
  linkedin:  P('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5V17M7.5 7.3v.1M11.5 17v-3.6c0-1.6 1-2.4 2.2-2.4s2.3.8 2.3 2.6V17"/>'),
  bell:      P('<path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>'),
  menu:      P('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  search:    P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  plus:      P('<path d="M12 5v14M5 12h14"/>'),
  check:     P('<path d="m5 12.5 4.5 4.5L19 7"/>'),
  x:         P('<path d="M6 6l12 12M18 6 6 18"/>'),
  clock:     P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>'),
  alert:     P('<path d="M12 3.5 22 20H2z"/><path d="M12 10v4.2M12 17.2v.1"/>'),
  info:      P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>'),
  spark:     P('<path d="m12 3 2.1 5.4L19.5 10l-5.4 2.1L12 17.5l-2.1-5.4L4.5 10l5.4-1.6z"/><path d="M18.5 16.5 19 18l1.5.5L19 19l-.5 1.5L18 19l-1.5-.5L18 18z"/>'),
  arrow:     P('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  play:      P('<path d="M7 4.5 19 12 7 19.5z"/>'),
  pause:     P('<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>'),
  doc:       P('<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h6"/>'),
  globe:     P('<circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>'),
  building:  P('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/>'),
};

export const icon = (n) => ICONS[n] || '';

/* ---------- 通用组件 ---------- */

export const card = (body, opts = {}) => h`
  <section class="card ${opts.cls || ''}">
    ${opts.title ? h`
      <header class="card-head">
        <h3>${opts.title}</h3>
        ${opts.sub ? h`<span class="sub">${opts.sub}</span>` : ''}
        ${opts.right ? h`<div class="right">${opts.right}</div>` : ''}
      </header>` : ''}
    <div class="card-body ${opts.tight ? 'tight' : ''}">${body}</div>
  </section>`;

export const kpi = ({ label, value, unit, delta, deltaDir, foot, hint }) => h`
  <div class="card kpi">
    <div class="label">${label}${hint ? h` <span class="muted" title="${esc(hint)}">ⓘ</span>` : ''}</div>
    <div class="value">${value}${unit ? h`<small>${unit}</small>` : ''}</div>
    <div class="foot">
      ${delta ? h`<span class="delta ${deltaDir || 'up'}">${deltaDir === 'down' ? '↓' : '↑'} ${delta}</span>` : ''}
      ${foot ? h`<span>${foot}</span>` : ''}
    </div>
  </div>`;

export const tag = (text, kind = '') => h`<span class="tag ${kind}">${text}</span>`;

export const bar = (pct, color) => h`
  <div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%${color ? `;background:${color}` : ''}"></i></div>`;

export const hint = (text, kind = '') => h`
  <div class="hint ${kind}"><span class="ico">${icon(kind === 'danger' || kind === 'warn' ? 'alert' : 'info')}</span><div>${text}</div></div>`;

/** 表格：cols = [{ k, t, cls?, render? }] */
export const table = (cols, rows) => h`
  <div class="table-wrap">
    <table class="tbl">
      <thead><tr>${cols.map(c => h`<th class="${c.cls || ''}">${c.t}</th>`)}</tr></thead>
      <tbody>
        ${rows.map(r => h`<tr>${cols.map(c => h`<td class="${c.cls || ''}">${c.render ? c.render(r) : esc(r[c.k])}</td>`)}</tr>`)}
      </tbody>
    </table>
  </div>`;

export const channelIcon = (ch) => ({
  email: icon('mail'), whatsapp: icon('wa'), form: icon('form'), linkedin: icon('linkedin'),
}[ch] || icon('mail'));

export const channelName = (ch) => ({ email:'邮件', whatsapp:'WhatsApp', form:'官网表单', linkedin:'LinkedIn' }[ch] || ch);

/** 评分色：绿 / 蓝 / 橙 / 灰 */
export const scoreColor = (n) => n >= 85 ? '#10b981' : n >= 70 ? '#2563eb' : n >= 50 ? '#f59e0b' : '#94a3b8';

export const scoreChip = (n) => h`
  <span class="tag" style="background:${scoreColor(n)}18;color:${scoreColor(n)};border-color:${scoreColor(n)}44;font-weight:650">${n}</span>`;

export const tierChip = (t) => tag(t, { KA:'danger', A:'brand', B:'info', C:'' }[t] ?? '');

/* ---------- 抽屉 ---------- */
export function openDrawer(title, bodyHtml, onMount) {
  closeDrawer();
  const mask = document.createElement('div');
  mask.className = 'drawer-mask';
  mask.innerHTML = h`
    <aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <header class="drawer-head">
        <h3 style="font-size:15px">${title}</h3>
        <button class="icon-btn" style="margin-left:auto" data-close aria-label="关闭">${icon('x')}</button>
      </header>
      <div class="drawer-body">${bodyHtml}</div>
    </aside>`;
  mask.addEventListener('click', (e) => {
    if (e.target === mask || e.target.closest('[data-close]')) closeDrawer();
  });
  document.body.appendChild(mask);
  document.addEventListener('keydown', escClose);
  onMount?.(mask);
}
export function closeDrawer() {
  document.querySelector('.drawer-mask')?.remove();
  document.removeEventListener('keydown', escClose);
}
const escClose = (e) => { if (e.key === 'Escape') closeDrawer(); };

/** 演示用的轻量提示（右下角） */
export function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `position:fixed;right:18px;bottom:18px;z-index:200;background:${
    kind === 'warn' ? '#d97706' : kind === 'danger' ? '#dc2626' : '#16202e'
  };color:#fff;padding:9px 14px;border-radius:9px;font-size:12.5px;box-shadow:0 10px 30px rgba(0,0,0,.22);
  max-width:340px;animation:fade .16s ease`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/** 供演示：未实现功能的统一反馈 */
export const demoClick = (label) => toast(`体验版：「${label}」在正式版中可用`, 'warn');
