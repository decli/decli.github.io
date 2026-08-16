/* ==========================================================================
   手写 SVG 图表（无第三方库、无 CDN）
   所有函数返回 SVG 字符串，宽度用 viewBox 自适应容器。
   ========================================================================== */
import { esc } from './ui.js';

const pathFrom = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** 折线 + 面积 */
export function lineChart(data, { w = 640, h = 200, pad = 30, color = '#2563eb', fmt = (v) => v } = {}) {
  const max = Math.max(...data.map(d => d.v)) * 1.15 || 1;
  const iw = w - pad * 2, ih = h - pad - 22;
  const pts = data.map((d, i) => [pad + (data.length === 1 ? iw / 2 : (i * iw) / (data.length - 1)), pad + ih - (d.v / max) * ih]);
  const grid = [0, .25, .5, .75, 1].map(t => {
    const y = pad + ih * t;
    return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="#e5e9f0" stroke-width="1"/>`;
  }).join('');
  const area = `${pathFrom(pts)} L${pts.at(-1)[0]},${pad + ih} L${pts[0][0]},${pad + ih} Z`;
  const id = 'g' + Math.random().toString(36).slice(2, 8);
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="height:${h}px">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${grid}
    <path d="${area}" fill="url(#${id})"/>
    <path d="${pathFrom(pts)}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="#fff" stroke="${color}" stroke-width="2"><title>${esc(data[i].m)}: ${esc(fmt(data[i].v))}</title></circle>`).join('')}
    ${data.map((d, i) => `<text x="${pts[i][0]}" y="${h - 6}" text-anchor="middle" font-size="10.5" fill="#8b97ab">${esc(d.m)}</text>`).join('')}
  </svg>`;
}

/** 横向条形（用于渠道对比、排行） */
export function barsH(rows, { max, fmt = (v) => v, labelW = 108, h = 26, gap = 7 } = {}) {
  const M = max || Math.max(...rows.map(r => r.v)) || 1;
  const H = rows.length * (h + gap);
  return `<svg class="chart" viewBox="0 0 400 ${H}" style="height:${H}px">
    ${rows.map((r, i) => {
      const y = i * (h + gap), bw = Math.max(2, ((400 - labelW - 56) * r.v) / M);
      return `<g>
        <text x="0" y="${y + h / 2 + 4}" font-size="11.5" fill="#55637a">${esc(r.name)}</text>
        <rect x="${labelW}" y="${y + 4}" width="${bw}" height="${h - 8}" rx="4" fill="${r.color || '#2563eb'}"/>
        <text x="${labelW + bw + 7}" y="${y + h / 2 + 4}" font-size="11.5" fill="#16202e" font-weight="600">${esc(fmt(r.v))}</text>
      </g>`;
    }).join('')}
  </svg>`;
}

/** 分组柱状（收入 vs 投入等） */
export function barsV(groups, series, { w = 620, h = 210, pad = 34, fmt = (v) => v } = {}) {
  const max = Math.max(...groups.flatMap(g => series.map(s => g[s.k]))) * 1.15 || 1;
  const iw = w - pad * 2, ih = h - pad - 24;
  const gw = iw / groups.length, bw = Math.min(20, (gw - 12) / series.length);
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" style="height:${h}px">
    ${[0, .25, .5, .75, 1].map(t => `<line x1="${pad}" y1="${pad + ih * t}" x2="${w - pad}" y2="${pad + ih * t}" stroke="#e5e9f0"/>`).join('')}
    ${groups.map((g, i) => series.map((s, j) => {
      const bh = (g[s.k] / max) * ih;
      const x = pad + i * gw + gw / 2 - (series.length * bw) / 2 + j * bw;
      return `<rect x="${x}" y="${pad + ih - bh}" width="${bw - 3}" height="${bh}" rx="3" fill="${s.color}">
        <title>${esc(g.name)} · ${esc(s.name)}: ${esc(fmt(g[s.k]))}</title></rect>`;
    }).join('')).join('')}
    ${groups.map((g, i) => `<text x="${pad + i * gw + gw / 2}" y="${h - 7}" text-anchor="middle" font-size="10.5" fill="#8b97ab">${esc(g.name)}</text>`).join('')}
  </svg>`;
}

/** 漏斗 */
export function funnel(steps, { w = 560, rowH = 40 } = {}) {
  const max = steps[0].v || 1;
  const H = steps.length * rowH + 8;
  return `<svg class="chart" viewBox="0 0 ${w} ${H}" style="height:${H}px">
    ${steps.map((s, i) => {
      const y = i * rowH + 4;
      const bw = (s.v / max) * (w - 190);
      const x = 96;
      const conv = i ? ((s.v / steps[i - 1].v) * 100).toFixed(0) + '%' : '—';
      return `<g>
        <text x="0" y="${y + rowH / 2 + 4}" font-size="11.5" fill="#55637a">${esc(s.name)}</text>
        <rect x="${x}" y="${y + 6}" width="${Math.max(3, bw)}" height="${rowH - 14}" rx="4" fill="${s.color}"/>
        <text x="${x + bw + 8}" y="${y + rowH / 2 + 4}" font-size="11.5" font-weight="600" fill="#16202e">${s.v}</text>
        <text x="${w - 4}" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="11" fill="${i && s.v / steps[i-1].v < .35 ? '#dc2626' : '#8b97ab'}">${conv}</text>
      </g>`;
    }).join('')}
  </svg>`;
}

/** 环形（占比 / 完成度） */
export function donut(segments, { size = 132, thickness = 16, center = '' } = {}) {
  const total = segments.reduce((a, s) => a + s.v, 0) || 1;
  const r = (size - thickness) / 2, c = size / 2, C = 2 * Math.PI * r;
  let acc = 0;
  return `<svg class="chart" viewBox="0 0 ${size} ${size}" style="height:${size}px;width:${size}px">
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#eef1f6" stroke-width="${thickness}"/>
    ${segments.map(s => {
      const len = (s.v / total) * C;
      const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}"
        stroke-dasharray="${len - 1.5} ${C - len + 1.5}" stroke-dashoffset="${-acc}"
        transform="rotate(-90 ${c} ${c})" stroke-linecap="round"><title>${esc(s.name)}: ${s.v}</title></circle>`;
      acc += len; return el;
    }).join('')}
    ${center ? `<text x="${c}" y="${c - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="#16202e">${esc(center.split('|')[0])}</text>
      <text x="${c}" y="${c + 14}" text-anchor="middle" font-size="10.5" fill="#8b97ab">${esc(center.split('|')[1] || '')}</text>` : ''}
  </svg>`;
}

/** 迷你雷达（线索评分四维） */
export function radar(dims, { size = 150, color = '#2563eb' } = {}) {
  const c = size / 2, R = c - 26, n = dims.length;
  const pt = (i, r) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  };
  const rings = [.25, .5, .75, 1].map(t =>
    `<polygon points="${Array.from({ length: n }, (_, i) => pt(i, R * t).join(',')).join(' ')}" fill="none" stroke="#e5e9f0"/>`).join('');
  const poly = dims.map((d, i) => pt(i, (R * d.v) / 100).join(',')).join(' ');
  return `<svg class="chart" viewBox="0 0 ${size} ${size}" style="height:${size}px;width:${size}px">
    ${rings}
    ${dims.map((_, i) => `<line x1="${c}" y1="${c}" x2="${pt(i, R)[0]}" y2="${pt(i, R)[1]}" stroke="#e5e9f0"/>`).join('')}
    <polygon points="${poly}" fill="${color}22" stroke="${color}" stroke-width="2"/>
    ${dims.map((d, i) => {
      const [x, y] = pt(i, R + 14);
      return `<text x="${x}" y="${y + 3}" text-anchor="middle" font-size="9.5" fill="#8b97ab">${esc(d.name)}</text>`;
    }).join('')}
  </svg>`;
}

/** 稀疏火花线（列表内嵌） */
export function spark(vals, { w = 74, h = 22, color = '#2563eb' } = {}) {
  const max = Math.max(...vals) || 1, min = Math.min(...vals);
  const rng = max - min || 1;
  const pts = vals.map((v, i) => [(i * w) / (vals.length - 1), h - 2 - ((v - min) / rng) * (h - 5)]);
  return `<svg viewBox="0 0 ${w} ${h}" style="height:${h}px;width:${w}px;vertical-align:middle">
    <path d="${pathFrom(pts)}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round"/>
  </svg>`;
}

/** 甘特（订单节点） */
export function gantt(milestones, { w = 640, rowH = 30 } = {}) {
  const H = milestones.length * rowH + 10;
  const colors = { done: '#10b981', doing: '#2563eb', todo: '#cbd5e1', overdue: '#dc2626' };
  return `<svg class="chart" viewBox="0 0 ${w} ${H}" style="height:${H}px">
    ${milestones.map((m, i) => {
      const y = i * rowH + 6;
      const x0 = 92, span = (w - x0 - 96) / milestones.length;
      const x = x0 + i * span;
      return `<g>
        <text x="0" y="${y + 14}" font-size="11.5" fill="#55637a">${esc(m.name)}</text>
        <line x1="${x0}" y1="${y + 10}" x2="${w - 92}" y2="${y + 10}" stroke="#eef1f6" stroke-width="2"/>
        <rect x="${x}" y="${y + 4}" width="${Math.max(span - 6, 10)}" height="13" rx="3.5" fill="${colors[m.state]}"/>
        <text x="${w - 86}" y="${y + 14}" font-size="10.5" fill="#8b97ab">计划 ${esc(m.planned)}${m.actual !== '—' ? ` · 实际 ${esc(m.actual)}` : ''}</text>
      </g>`;
    }).join('')}
  </svg>`;
}
