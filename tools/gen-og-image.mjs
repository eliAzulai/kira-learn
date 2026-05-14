#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetDir = join(__dirname, '../assets');
const svgPath = join(assetDir, 'og-image.svg');
const pngPath = join(assetDir, 'og-image.png');

const width = 1200;
const height = 630;

const node = ({ id, x, y, label, kind = 'core' }) => {
  const palette = {
    core: ['#39d8ff', '#dff8ff'],
    bridge: ['#8db5ff', '#eef4ff'],
    question: ['#c6a7ff', '#f5f0ff'],
  }[kind];

  return `
    <g>
      <circle cx="${x}" cy="${y}" r="31" fill="${palette[0]}" opacity="0.14"/>
      <circle cx="${x}" cy="${y}" r="10" fill="${palette[0]}"/>
      <circle cx="${x}" cy="${y}" r="4" fill="${palette[1]}"/>
      <text x="${x}" y="${y + 46}" text-anchor="middle" class="node-label">${label}</text>
      <text x="${x}" y="${y - 34}" text-anchor="middle" class="node-id">${id}</text>
    </g>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090f18"/>
      <stop offset="52%" stop-color="#101720"/>
      <stop offset="100%" stop-color="#11151d"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14202a" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#0c1219" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#39d8ff"/>
      <stop offset="52%" stop-color="#8db5ff"/>
      <stop offset="100%" stop-color="#c6a7ff"/>
    </linearGradient>
    <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.65 0 0 0 0 0.85 0 0 0 0.28 0"/>
      <feBlend in="SourceGraphic" mode="screen"/>
    </filter>
    <style>
      text {
        font-family: Arial, Helvetica, sans-serif;
        letter-spacing: 0;
      }
      .eyebrow {
        fill: #8bddec;
        font-size: 17px;
        font-weight: 700;
      }
      .title {
        fill: #edf6ff;
        font-size: 86px;
        font-weight: 700;
      }
      .subtitle {
        fill: #9cc7d3;
        font-size: 30px;
        font-weight: 400;
      }
      .meta {
        fill: #668a98;
        font-size: 21px;
        font-weight: 400;
      }
      .panel-title {
        fill: #e7f6ff;
        font-size: 29px;
        font-weight: 700;
      }
      .panel-copy {
        fill: #9eb6c2;
        font-size: 18px;
        font-weight: 400;
      }
      .node-label {
        fill: #b9d2df;
        font-size: 16px;
        font-weight: 700;
      }
      .node-id {
        fill: #668a98;
        font-size: 12px;
        font-weight: 700;
      }
    </style>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#background)"/>
  <path d="M0 96H1200M0 216H1200M0 336H1200M0 456H1200M180 0V630M360 0V630M540 0V630M720 0V630M900 0V630M1080 0V630" stroke="#213040" stroke-width="1" opacity="0.42"/>
  <path d="M0 0H1200V630H0Z" fill="none" stroke="#27384a" stroke-width="1"/>
  <rect x="0" y="0" width="9" height="${height}" fill="url(#accent)"/>

  <g filter="url(#softGlow)" opacity="0.9">
    <path d="M720 113C799 31 916 22 1009 85C1117 158 1133 303 1040 404C939 514 760 493 693 363C652 284 660 176 720 113Z" fill="#1b8fb8" opacity="0.08"/>
  </g>

  <text x="70" y="118" class="eyebrow">LIVE STUDY CONSOLE</text>
  <text x="70" y="224" class="title">Kira Learn</text>
  <text x="74" y="293" class="subtitle">Mapping the agentic systems stack</text>
  <text x="74" y="340" class="meta">AI agents / orchestration / systems design</text>

  <g transform="translate(70 428)">
    <rect x="0" y="0" width="374" height="76" rx="14" fill="#0d171f" stroke="#263849"/>
    <text x="24" y="31" class="panel-copy">What I am mapping now</text>
    <text x="24" y="58" class="eyebrow">orchestration as product architecture</text>
  </g>

  <g transform="translate(650 92)">
    <rect x="0" y="0" width="474" height="424" rx="22" fill="url(#panel)" stroke="#263849"/>
    <text x="34" y="56" class="panel-title">Current map</text>
    <text x="34" y="87" class="panel-copy">Questions, protocols, memory, evaluation, and loops.</text>

    <g stroke-linecap="round" stroke-width="2.4" fill="none">
      <path d="M126 162L244 132L344 170" stroke="#39d8ff" opacity="0.55"/>
      <path d="M244 132L246 266L141 308" stroke="#8db5ff" opacity="0.55"/>
      <path d="M246 266L348 292L344 170" stroke="#c6a7ff" opacity="0.55"/>
      <path d="M126 162L141 308" stroke="#39d8ff" opacity="0.32"/>
    </g>

    ${node({ id: '01', x: 126, y: 162, label: 'Agent loops' })}
    ${node({ id: '02', x: 244, y: 132, label: 'Tools', kind: 'bridge' })}
    ${node({ id: '03', x: 344, y: 170, label: 'Memory', kind: 'question' })}
    ${node({ id: '04', x: 246, y: 266, label: 'Evaluation', kind: 'bridge' })}
    ${node({ id: '05', x: 141, y: 308, label: 'Protocols' })}
    ${node({ id: '06', x: 348, y: 292, label: 'Product', kind: 'question' })}
  </g>

  <rect x="70" y="570" width="1060" height="3" fill="url(#accent)" opacity="0.9"/>
  <text x="70" y="548" class="meta">kiralearn.space</text>
</svg>`;

mkdirSync(assetDir, { recursive: true });
writeFileSync(svgPath, `${svg}\n`, 'utf8');

const renderer = new Resvg(svg, {
  fitTo: { mode: 'width', value: width },
  font: { loadSystemFonts: true },
});

writeFileSync(pngPath, renderer.render().asPng());
console.log(`wrote ${svgPath}`);
console.log(`wrote ${pngPath}`);
