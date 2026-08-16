/* 内容工厂：选题雷达 → 大纲 → 多语言成文 → 人工把关 → 站群发布 → 效果回流 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint } from '../ui.js';
import { CONTENT, TOPIC_RADAR } from '../data.js';

const STATE_KIND = { '已发布':'ok', '待审核':'warn', 'AI 撰写中':'brand', '选题池':'' };

export default function content() {
  const published = CONTENT.filter(c => c.state === '已发布');
  const views = published.reduce((a, c) => a + c.views, 0);
  const leads = published.reduce((a, c) => a + c.leads, 0);

  const cols = [
    { t:'标题', render: c => h`
        <div class="b truncate" style="max-width:360px">${esc(c.title)}</div>
        <div class="small muted">${esc(c.id)} · ${esc(c.lang)} · ${esc(c.type)} · ${esc(c.site)}</div>` },
    { t:'目标关键词', render: c => h`<div class="mono small">${esc(c.kw)}</div>
        <div class="small muted">月搜索 ${c.vol} · 难度 ${c.diff}</div>` },
    { t:'GEO 资产', render: c => c.geo.length
        ? h`<span class="flex gap4 wrap">${c.geo.map(g => tag(g, 'purple'))}</span>`
        : h`<span class="muted small">—</span>` },
    { t:'状态', render: c => tag(c.state, STATE_KIND[c.state]) },
    { t:'浏览', cls:'num', render: c => c.views ? c.views.toLocaleString() : h`<span class="muted">—</span>` },
    { t:'线索', cls:'num', render: c => c.leads ? h`<b>${c.leads}</b>` : h`<span class="muted">—</span>` },
    { t:'操作', render: c => h`<div class="row-actions">
        ${c.state === '待审核' ? h`<button class="btn sm primary" data-demo="审核并发布">审核</button>`
          : c.state === '选题池' ? h`<button class="btn sm primary" data-demo="生成内容">${icon('spark')} 生成</button>`
          : h`<button class="btn sm" data-demo="查看内容">查看</button>`}
        <button class="btn sm" data-demo="多语言分发">分发</button></div>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>内容工厂</h1>
        <div class="sub">产品/素材库 → 选题雷达 → 大纲 → 多语言成文 → <b>人工把关</b> → 站群发布 → 效果回流。中小外贸做不动内容的三个原因（不会写英文、不懂 SEO、没听过 GEO），这条流水线各解决一个。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="内容日历">${icon('doc')} 内容日历</button>
        <button class="btn primary" data-demo="新建选题">${icon('spark')} AI 选题</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'已发布内容', value: published.length, foot:'覆盖 4 个语种' })}
      ${kpi({ label:'内容带来浏览', value: views.toLocaleString(), delta:'41%', foot:'近 30 天自然流量' })}
      ${kpi({ label:'内容带来线索', value: leads, foot:'CPL ¥286，为投放的 1/6' })}
      ${kpi({ label:'待人工审核', value:'1', foot:'A-314 已挂起 9h12m', hint:'L1 草稿模式：AI 完成后必须人工确认才能发布' })}
    </div>

    <div class="grid g-2-1 mb16">
      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>选题</th><th class="num">月搜索</th><th>趋势</th><th>为什么值得做</th><th>优先级</th></tr></thead>
          <tbody>${TOPIC_RADAR.map(t => h`<tr>
            <td class="mono" style="font-size:12px">${esc(t.topic)}</td>
            <td class="num">${t.vol}</td>
            <td><span class="tag ok">${esc(t.trend)}</span></td>
            <td class="muted small" style="max-width:320px">${esc(t.reason)}</td>
            <td>${tag(t.pri, t.pri === '高' ? 'danger' : 'warn')}</td></tr>`)}</tbody>
        </table></div>
        <div class="hint mt12">${icon('spark')}<div>
          选题不只看搜索量，更看 <b>AI 搜索中被提问的频率</b> 与 <b>竞品内容覆盖度</b>。「laser cutting machine for EV battery tray」竞品覆盖为 0，是当前最值得抢的位置。</div></div>`,
        { title:'选题雷达', sub:'关键词 + 竞品缺口 + AI 搜索问题', right: h`<button class="btn sm" data-demo="刷新选题">刷新</button>` })}

      ${card(h`
        <div class="timeline">
          <div class="tl-item ok"><div class="tl-time">Step 1 · 自动</div><div class="tl-title">选题雷达扫描</div>
            <div class="tl-body">关键词工具 + 竞品内容缺口 + AI 搜索高频问题</div></div>
          <div class="tl-item ok"><div class="tl-time">Step 2 · 自动</div><div class="tl-title">大纲生成</div>
            <div class="tl-body">检索产品库真实参数与认证，绝不虚构规格</div></div>
          <div class="tl-item ok"><div class="tl-time">Step 3 · 自动</div><div class="tl-title">多语言成文（12+ 语种）</div>
            <div class="tl-body">不是翻译，是按各语种市场的关注点重写</div></div>
          <div class="tl-item warn"><div class="tl-time">Step 4 · <b>人工必经</b></div><div class="tl-title">事实校验与品牌把关</div>
            <div class="tl-body">系统强制一次人工确认，不可跳过</div></div>
          <div class="tl-item"><div class="tl-time">Step 5 · 自动</div><div class="tl-title">GEO 结构化输出</div>
            <div class="tl-body">Schema.org + FAQ 块 + 可被引用的事实段落</div></div>
          <div class="tl-item muted"><div class="tl-time">Step 6 · 自动</div><div class="tl-title">站群发布与效果回流</div>
            <div class="tl-body">收录 / 排名 / 线索 / AI 引用回写至内容记录</div></div>
        </div>`, { title:'内容生产流水线' })}
    </div>

    ${card(table(cols, CONTENT), {
      title:'内容库', sub:'每篇内容都关联到具体站点与目标关键词，效果可归因', tight:true })}

    <div class="mt16">
      ${hint(h`<b>内容的真正价值不是流量，是被引用</b>：一篇结构化良好的技术对照文章，可能带来的自然点击有限，但当采购经理问 ChatGPT「光纤激光和 CO2 激光切不锈钢有什么区别」时被引用，品牌就出现在了决策的最前端。这是 2026 年外贸内容的新计分方式。`)}
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
