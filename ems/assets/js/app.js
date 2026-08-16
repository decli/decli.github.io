/* ==========================================================================
   应用外壳 · 路由 · 全局状态
   ========================================================================== */
import { h, esc, icon } from './ui.js';
import { ME, COMPANY_PROFILE, INBOX, DOCS_URL } from './data.js';

import dashboard   from './views/dashboard.js';
import leads       from './views/leads.js';
import customers   from './views/customers.js';
import customerDet from './views/customer-detail.js';
import inbox       from './views/inbox.js';
import sequences   from './views/sequences.js';
import deals       from './views/deals.js';
import quotes      from './views/quotes.js';
import orders      from './views/orders.js';
import sites       from './views/sites.js';
import content     from './views/content.js';
import agents      from './views/agents.js';
import analytics   from './views/analytics.js';
import compliance  from './views/compliance.js';
import settings    from './views/settings.js';

/* ---------- 全局状态 ---------- */
export const state = {
  role: localStorage.getItem('ems.role') || 'sales',   // sales | boss
};

/* ---------- 导航 ---------- */
const NAV = [
  { group: '获客与营销', items: [
    { id: 'dashboard', name: '工作台',   ico: 'dashboard' },
    { id: 'leads',     name: '线索雷达', ico: 'radar' },
    { id: 'sequences', name: '触达序列', ico: 'send' },
    { id: 'content',   name: '内容工厂', ico: 'content' },
    { id: 'sites',     name: 'AI 建站',  ico: 'site' },
  ]},
  { group: '客户与订单', items: [
    { id: 'inbox',     name: '统一收件箱', ico: 'inbox', badge: () => INBOX.filter(m => m.unread).length },
    { id: 'customers', name: '客户管理',   ico: 'users' },
    { id: 'deals',     name: '商机看板',   ico: 'deals' },
    { id: 'quotes',    name: '报价与 PI',  ico: 'quote' },
    { id: 'orders',    name: '订单交付',   ico: 'order' },
  ]},
  { group: '智能与管理', items: [
    { id: 'agents',     name: 'AI Agents', ico: 'agent', badge: () => 1 },
    { id: 'analytics',  name: '经营分析',  ico: 'chart' },
    { id: 'compliance', name: '合规中心',  ico: 'shield' },
    { id: 'settings',   name: '系统设置',  ico: 'gear' },
  ]},
];

const VIEWS = {
  dashboard, leads, customers, inbox, sequences, deals,
  quotes, orders, sites, content, agents, analytics, compliance, settings,
};

const TITLES = {
  dashboard: ['个人中心', '工作台'],
  leads: ['获客', '线索雷达'],
  sequences: ['获客', '触达序列'],
  content: ['获客', '内容工厂'],
  sites: ['获客', 'AI 建站 / 站群管理'],
  inbox: ['客户', '统一收件箱'],
  customers: ['客户', '客户管理'],
  deals: ['客户', '商机看板'],
  quotes: ['客户', '报价与 PI'],
  orders: ['交付', '订单管理'],
  agents: ['智能', 'AI Agents'],
  analytics: ['管理', '经营分析'],
  compliance: ['管理', '合规中心'],
  settings: ['管理', '系统设置'],
};

/* ---------- 路由 ---------- */
function resolve() {
  const raw = location.hash.replace(/^#\/?/, '') || 'dashboard';
  const parts = raw.split('/').filter(Boolean);
  const head = parts[0] || 'dashboard';
  if (head === 'customers' && parts[1]) return { key: 'customers', render: () => customerDet(parts[1]), param: parts[1] };
  if (VIEWS[head]) return { key: head, render: () => VIEWS[head](), param: null };
  return { key: 'dashboard', render: () => dashboard(), param: null };
}

/* ---------- 客户当地时间小时钟 ---------- */
function clockHtml() {
  const now = new Date();
  const fmt = (tz) => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now);
  return h`
    <span class="clock" title="演示：常驻显示主要市场的客户当地时间——外贸的时差是刚需约束">
      <span class="dot"></span>
      <span>🇩🇪 <b>${fmt('Europe/Berlin')}</b></span>
      <span class="muted">·</span>
      <span>🇺🇸 <b>${fmt('America/Los_Angeles')}</b></span>
      <span class="muted">·</span>
      <span>🇲🇽 <b>${fmt('America/Mexico_City')}</b></span>
    </span>`;
}

/* ---------- 外壳 ---------- */
function shell() {
  return h`
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-mark">E</div>
          <div>
            <div class="brand-name">EMS</div>
          </div>
          <span class="brand-tag">体验版</span>
        </div>
        <nav class="nav" id="nav"></nav>
        <div class="nav-foot">
          ${esc(COMPANY_PROFILE.name)}<br>
          <span style="color:#7d8ba6">${esc(COMPANY_PROFILE.plan)} · ${COMPANY_PROFILE.seats} 席位</span>
        </div>
      </aside>

      <div class="main">
        <div class="demo-banner">
          <span>◈</span>
          <span><b>产品体验版</b> · 数据全部虚构，公司名与人名均为示例，与真实企业无关</span>
          <span class="sp"></span>
          <a href="${DOCS_URL}" target="_blank" rel="noopener">查看产品与技术方案 →</a>
        </div>
        <header class="topbar">
          <button class="icon-btn menu-toggle" id="menuBtn" aria-label="菜单">${icon('menu')}</button>
          <div class="crumbs" id="crumbs"></div>
          <div class="topbar-spacer"></div>
          <div id="clock"></div>
          <div class="role-switch" id="roleSwitch" title="业务员与老板是两套信息架构，不是权限多少的区别">
            <button data-role="sales"><span class="rs-full">业务员视角</span><span class="rs-min">业务员</span></button>
            <button data-role="boss"><span class="rs-full">老板视角</span><span class="rs-min">老板</span></button>
          </div>
          <button class="icon-btn" id="bellBtn" aria-label="通知">${icon('bell')}<span class="dot-badge"></span></button>
          <div class="avatar" title="${esc(ME.name)} · ${esc(ME.role)}">${esc(ME.initials)}</div>
        </header>
        <main class="content" id="content"></main>
      </div>
    </div>`;
}

function renderNav(activeKey) {
  document.getElementById('nav').innerHTML = NAV.map(g => h`
    <div class="nav-group">
      <div class="nav-group-label">${g.group}</div>
      ${g.items.map(it => {
        const n = it.badge?.() || 0;
        return h`<a class="nav-item ${it.id === activeKey ? 'active' : ''}" href="#/${it.id}">
          <span class="ico">${icon(it.ico)}</span><span>${it.name}</span>
          ${n ? h`<span class="nav-badge">${n}</span>` : ''}
        </a>`;
      })}
    </div>`).join('');
}

function renderRole() {
  document.querySelectorAll('#roleSwitch button').forEach(b =>
    b.classList.toggle('on', b.dataset.role === state.role));
}

let clockTimer;

function route() {
  const { key, render, param } = resolve();
  renderNav(key);

  const [g, t] = TITLES[key] || ['', ''];
  document.getElementById('crumbs').innerHTML = param
    ? h`<span>${g}</span><span class="sep">/</span><a href="#/customers">${t}</a><span class="sep">/</span><b>客户 360</b>`
    : h`<span>${g}</span><span class="sep">/</span><b>${t}</b>`;

  const out = render();
  // 用全新的节点替换，确保上一个视图挂载的事件监听器随旧节点一起销毁
  const old = document.getElementById('content');
  const el = document.createElement('main');
  el.className = 'content';
  el.id = 'content';
  el.innerHTML = typeof out === 'string' ? out : out.html;
  old.replaceWith(el);
  window.scrollTo(0, 0);
  if (typeof out !== 'string') out.mount?.(el);
  document.body.classList.remove('nav-open');
}

/* ---------- 启动 ---------- */
function boot() {
  document.getElementById('app').innerHTML = shell();

  const tick = () => { document.getElementById('clock').innerHTML = clockHtml(); };
  tick();
  clockTimer = setInterval(tick, 20000);

  renderRole();
  document.getElementById('roleSwitch').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-role]');
    if (!b) return;
    state.role = b.dataset.role;
    localStorage.setItem('ems.role', state.role);
    renderRole();
    route();
  });

  document.getElementById('menuBtn').addEventListener('click', () =>
    document.body.classList.toggle('nav-open'));

  document.getElementById('bellBtn').addEventListener('click', () =>
    import('./ui.js').then(m => m.demoClick('通知中心')));

  addEventListener('hashchange', route);
  route();
}

boot();
