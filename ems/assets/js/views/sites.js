/* AI 建站 / 站群管理 + SEO·GEO 体检 */
import { h, esc, card, kpi, tag, icon, table, demoClick, hint, bar } from '../ui.js';
import { donut } from '../charts.js';
import { SITES, SEO_AUDIT } from '../data.js';

export default function sites() {
  const totalTraffic = SITES.reduce((a, s) => a + s.traffic, 0);
  const totalLeads = SITES.reduce((a, s) => a + s.leads, 0);

  const cols = [
    { t:'ID', cls:'num', render: s => h`<span class="muted">${s.id}</span>` },
    { t:'站点', render: s => h`
        <div class="b">${esc(s.name)}</div>
        <div class="small mono muted">${esc(s.domain)}</div>
        ${s.parent ? h`<div class="small"><span class="tag">母站：${esc(s.parent)}</span></div>` : h`<div class="small">${tag('母站', 'brand')}</div>`}` },
    { t:'语言', render: s => esc(s.lang) },
    { t:'配色', render: s => h`<span class="flex gap4">${s.colors.map(c =>
        h`<i style="width:22px;height:20px;border-radius:4px;background:${c};display:inline-block;border:1px solid var(--border)"></i>`)}</span>` },
    { t:'上线', render: s => h`<span class="tag ${s.online ? 'ok' : ''}">${s.online ? '已上线' : '未上线'}</span>` },
    { t:'构建', render: s => tag(s.build, s.build.startsWith('成功') ? 'ok' : s.build.includes('构建中') ? 'warn' : '') },
    { t:'页面', cls:'num', render: s => s.pages },
    { t:'月访问', cls:'num', render: s => s.traffic.toLocaleString() },
    { t:'线索', cls:'num', render: s => h`<b>${s.leads}</b>` },
    { t:'SEO', render: s => h`<div style="min-width:64px">${bar(s.seo, s.seo >= 80 ? '#10b981' : s.seo >= 60 ? '#f59e0b' : '#dc2626')}<span class="small">${s.seo}</span></div>` },
    { t:'GEO', render: s => h`<div style="min-width:64px">${bar(s.geo, s.geo >= 70 ? '#10b981' : s.geo >= 50 ? '#f59e0b' : '#dc2626')}<span class="small">${s.geo}</span></div>` },
    { t:'操作', render: () => h`<div class="row-actions">
        <button class="btn sm" data-demo="页面管理">页面</button>
        <button class="btn sm" data-demo="AI 指令">${icon('spark')} AI</button>
        <button class="btn sm primary" data-demo="Git 部署">部署</button></div>` },
  ];

  const html = h`
    <div class="page-head">
      <div>
        <h1>AI 建站 · 站群管理</h1>
        <div class="sub">一个母站 + N 个语言/品类子站，hreflang 与 canonical 自动生成。Astro 静态构建 → Git 部署 → CDN，产物安全、快、便宜。</div>
      </div>
      <div class="actions">
        <button class="btn" data-demo="模板库">${icon('doc')} 模板库</button>
        <button class="btn primary" data-demo="AI 创建网站">${icon('spark')} AI 创建网站</button>
      </div>
    </div>

    <div class="grid g4 mb16">
      ${kpi({ label:'站群站点数', value: SITES.length, foot:'1 母站 + 4 语言子站' })}
      ${kpi({ label:'月自然访问', value: totalTraffic.toLocaleString(), delta:'34%', foot:'全部来自自然搜索' })}
      ${kpi({ label:'站群贡献线索', value: totalLeads, delta:'12', foot:'占全部线索的 26%' })}
      ${kpi({ label:'AI 搜索被引用', value:'6', unit:'次/30天', foot:'行业头部 20+ 次', hint:'GEO 的核心指标：被 ChatGPT/Perplexity/Gemini 引用的次数' })}
    </div>

    ${hint(h`<b>为什么 SEO 之外还要做 GEO</b>：美国 Google 约 <b>58% 的查询已是「零点击」</b> —— 用户直接读 AI 生成的答案，不再点进网站。独立站的角色因此从「接流量的落地页」变成「喂给 AI 的可信语料源」。SEO 保收录与排名，GEO 争 AI 回答里的被引用位。`)}

    <div class="mt16 mb16">
      ${card(table(cols, SITES), {
        title:'站点列表',
        sub:'母子站关系显式建模，避免重复内容惩罚',
        right: h`<button class="btn sm" data-demo="批量重建">批量重建</button>`, tight:true })}
    </div>

    <div class="grid g-2-1">
      ${card(h`
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>体检项</th><th>当前值</th><th>说明</th></tr></thead>
          <tbody>${SEO_AUDIT.map(a => h`<tr>
            <td class="b">${esc(a.item)}</td>
            <td>${tag(a.value, a.state === 'ok' ? 'ok' : 'warn')}</td>
            <td class="muted small">${esc(a.note)}</td></tr>`)}</tbody>
        </table></div>
        <div class="hint mt12">${icon('spark')}<div>
          <b>seo-geo-auditor 优先建议</b>：为每个产品页补充「参数对照表 + 标准声明」段落。可被 AI 直接引用的事实段落目前仅覆盖 41%，这是被引用次数落后行业头部的主因。
          <button class="btn sm mt8" data-demo="批量生成事实段落">批量生成事实段落</button></div></div>`,
        { title:'SEO / GEO 体检 · hengda-hydraulic.com', sub:'每周自动执行' })}

      ${card(h`
        <div class="flex ac gap12 mb16">
          ${donut([
            { name:'ChatGPT', v:3, color:'#10b981' },
            { name:'Perplexity', v:2, color:'#2563eb' },
            { name:'Gemini', v:1, color:'#a855f7' },
          ], { center:'6|次被引用' })}
          <div class="legend" style="flex-direction:column;flex:1">
            <span><i style="background:#10b981"></i>ChatGPT 3 次</span>
            <span><i style="background:#2563eb"></i>Perplexity 2 次</span>
            <span><i style="background:#a855f7"></i>Gemini 1 次</span>
          </div>
        </div>
        <h4 style="font-size:13px" class="mb8">GEO 资产清单</h4>
        <div class="flex gap6 wrap">
          ${tag('Schema.org · Product', 'ok')} ${tag('Schema.org · FAQPage', 'ok')}
          ${tag('Schema.org · Organization', 'ok')} ${tag('Schema.org · HowTo', 'danger')}
          ${tag('参数对照表', 'warn')} ${tag('标准与认证声明', 'ok')}
          ${tag('权威信源外链', 'warn')}
        </div>
        <div class="small muted mt12">GEO 的做法不是堆关键词，而是把品牌信息以 AI 语义友好的结构化方式组织，并建设权威信源。</div>`,
        { title:'AI 搜索引用监测', sub:'过去 30 天' })}
    </div>

    <div class="mt16">
      ${hint(h`<b>产品定位上的诚实</b>：截至 2026 年 7 月，尚没有纯 AI 建站系统能完全独立建成功能、生态、前后端全可控的商业站。我们的定位是「<b>AI 大规模生产 + 人工把关</b>」—— 发布前强制一次人工确认，既符合技术现实，也是对客户品牌的保护。`, 'warn')}
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
