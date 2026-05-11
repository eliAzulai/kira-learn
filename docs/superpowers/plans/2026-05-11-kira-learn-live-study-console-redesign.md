# Kira Learn Live Study Console Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current simple article grid homepage with a static, refined spatial atlas / live study console inspired by the approved second concept.

**Architecture:** Keep the project pure static and continue generating `index.html` from article metadata through `lib/render-index.js`. The renderer will derive the latest note, cluster/path links, and a compact notes index from the existing article list, then output code-native HTML/CSS/SVG with no client framework. Tests will lock the new homepage landmarks while preserving existing article discoverability and escaping behavior.

**Tech Stack:** Node.js ESM, `node:test`, static HTML, CSS, inline SVG, existing Inter font import.

---

## File Structure

- Modify `tests/render-index.test.js`: add assertions for the new study-console shell, latest-note CTA, system-map labels, cluster/path sections, and compact full notes index.
- Modify `lib/render-index.js`: replace the old card-grid template with a structured live study console renderer; add small pure helper functions for latest article, article lookup, cluster/topic data, and notes-index rendering.
- Regenerate `index.html`: run `npm run build` after renderer changes.
- No changes to `build-index.js`, `lib/extract-metadata.js`, `lib/render-sharp.js`, or article files.

## Task 1: Lock The New Homepage Contract In Tests

**Files:**
- Modify: `tests/render-index.test.js`

- [ ] **Step 1: Add tests for study-console landmarks**

Append these tests after the existing `renderIndex links to /sharp variant` test and before the XSS escaping test:

```js
test('renderIndex renders the live study console shell', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /Mapping the agentic systems stack/);
  assert.match(html, /A public study console for AI agents, orchestration, systems design, and the architecture patterns behind the tools\./);
  assert.match(html, /Open current map/);
  assert.match(html, /Read latest note/);
  assert.match(html, /Current question/);
  assert.match(html, /When does agent orchestration become product architecture\?/);
});

test('renderIndex renders system map labels', () => {
  const html = renderIndex(sampleArticles);
  for (const label of ['Agent loops', 'Orchestration', 'Tool protocols', 'Memory', 'Evaluation', 'Product systems']) {
    assert.ok(html.includes(label), `missing map label: ${label}`);
  }
});

test('renderIndex renders learning and research sections', () => {
  const html = renderIndex(sampleArticles);
  for (const label of ['Current mapping', 'Learning paths', 'Article clusters', 'Evolving diagrams', 'Notes index']) {
    assert.ok(html.includes(label), `missing section: ${label}`);
  }
});

test('renderIndex latest note CTA links to newest article', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /href="\/articles\/how-dns-works"[^>]*>Read latest note/);
});
```

- [ ] **Step 2: Run tests to verify new assertions fail**

Run:

```bash
npm test
```

Expected: FAIL with missing text such as `Mapping the agentic systems stack`, because `lib/render-index.js` still renders the old grid homepage.

- [ ] **Step 3: Commit the failing test checkpoint**

```bash
git add tests/render-index.test.js
git commit -m "test: lock Kira Learn study console homepage"
```

## Task 2: Add Static Content Models And Helper Functions

**Files:**
- Modify: `lib/render-index.js`

- [ ] **Step 1: Add helper constants above `export function renderIndex`**

Insert this code after the file header comment and before `export function renderIndex(articles)`:

```js
const SYSTEM_NODES = [
  { id: 'agent-loops', label: 'Agent loops', x: 50, y: 18, tone: 'blue' },
  { id: 'tool-protocols', label: 'Tool protocols', x: 20, y: 42, tone: 'cyan' },
  { id: 'orchestration', label: 'Orchestration', x: 50, y: 44, tone: 'cyan active' },
  { id: 'memory', label: 'Memory', x: 79, y: 42, tone: 'green' },
  { id: 'evaluation', label: 'Evaluation', x: 35, y: 70, tone: 'indigo' },
  { id: 'product-systems', label: 'Product systems', x: 66, y: 70, tone: 'blue' },
];

const LEARNING_PATHS = [
  { title: 'Agentic architecture', description: 'Designing intelligent systems that act.', progress: 6, total: 10, estimate: '~5h', slugHints: ['supervisor-loop-vs-ralph-loop', 'operator-hotlist-vs-ralph-look'] },
  { title: 'Systems design', description: 'From components to resilient systems.', progress: 4, total: 9, estimate: '~4h', slugHints: ['gemini-notebooklm-human-intelligence-system', 'macos-background-items-daemon-tracing'] },
  { title: 'Tools for thought', description: 'Interfaces, protocols, and human-AI collaboration.', progress: 3, total: 8, estimate: '~3h', slugHints: ['prompting-claude-thinking-partner', 'top-claude-code-tools-april-2026'] },
];

const ARTICLE_CLUSTERS = [
  {
    title: 'Architecture',
    topics: [
      { label: 'Agent loops', count: 6, slugHints: ['supervisor-loop-vs-ralph-loop'] },
      { label: 'Orchestration', count: 7, slugHints: ['natebjones-missing-orchestration-layer-destroying-teams'] },
      { label: 'Interfaces', count: 4, slugHints: ['operator-hotlist-vs-ralph-look'] },
      { label: 'Boundaries', count: 6, slugHints: ['acp-vs-acpx-vs-cli-routing'] },
    ],
  },
  {
    title: 'Systems',
    topics: [
      { label: 'Reliability', count: 5, slugHints: ['ssh-keys-vps-security-and-server-hardening'] },
      { label: 'Evaluation', count: 5, slugHints: ['gemini-notebooklm-human-intelligence-system'] },
      { label: 'Observability', count: 4, slugHints: ['macos-background-items-daemon-tracing'] },
      { label: 'Safety', count: 4, slugHints: ['ssh-keys-vps-security-and-server-hardening'] },
    ],
  },
  {
    title: 'Tools',
    topics: [
      { label: 'Tool protocols', count: 6, slugHints: ['acp-vs-acpx-vs-cli-routing'] },
      { label: 'Context engineering', count: 6, slugHints: ['prompting-claude-thinking-partner'] },
      { label: 'Memory systems', count: 5, slugHints: ['gemini-notebooklm-human-intelligence-system'] },
      { label: 'RAG patterns', count: 3, slugHints: ['top-claude-code-tools-april-2026-adaptation'] },
    ],
  },
  {
    title: 'Product',
    topics: [
      { label: 'Product systems', count: 5, slugHints: ['natebjones-6-6-billion-ai-company-one-week-moat'] },
      { label: 'Workflows', count: 4, slugHints: ['natebjones-markdown-file-replaced-design-meeting-google-stitch'] },
      { label: 'UX for AI systems', count: 3, slugHints: ['operator-hotlist-vs-ralph-look'] },
      { label: 'GTM & adoption', count: 3, slugHints: ['natebjones-3-trillion-ipo-trap'] },
    ],
  },
];
```

- [ ] **Step 2: Add pure helper functions near the bottom of the file**

Insert these helpers above `formatDate(iso)`:

```js
function getLatestArticle(sorted) {
  return sorted[0] ?? null;
}

function articleUrl(article) {
  return article ? `/articles/${escapeAttr(article.slug)}` : '#notes-index';
}

function findArticle(sorted, slugHints) {
  for (const slug of slugHints) {
    const match = sorted.find((article) => article.slug === slug);
    if (match) return match;
  }
  return sorted[0] ?? null;
}

function progressDots(progress, total) {
  return Array.from({ length: total }, (_, index) => {
    const active = index < progress ? ' is-active' : '';
    return `<span class="progress-dot${active}" aria-hidden="true"></span>`;
  }).join('');
}
```

- [ ] **Step 3: Run tests and verify old failures remain**

Run:

```bash
npm test
```

Expected: FAIL on the new homepage shell assertions. The helper additions should not introduce syntax errors.

## Task 3: Replace The Old Homepage Template With The Atlas Layout

**Files:**
- Modify: `lib/render-index.js`

- [ ] **Step 1: Replace `renderIndex` with the new document template**

Replace the current `export function renderIndex(articles) { ... }` body with:

```js
export function renderIndex(articles) {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const latest = getLatestArticle(sorted);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kira Learn — Mapping the agentic systems stack</title>
<meta name="description" content="A public study console for AI agents, orchestration, systems design, and the architecture patterns behind the tools.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
${renderStyles()}
</style>
</head>
<body>
<div class="page-shell">
  ${renderTopNav()}
  <main>
    ${renderHero(latest)}
    <div class="console-grid" aria-label="Kira Learn study console">
      ${renderCurrentMapping(latest)}
      ${renderLearningPaths(sorted)}
      ${renderArticleClusters(sorted)}
      ${renderEvolvingDiagrams(sorted)}
    </div>
    ${renderNotesIndex(sorted)}
  </main>
  ${renderFooter(articles.length)}
</div>
</body>
</html>
`;
}
```

- [ ] **Step 2: Remove the old `cards` constant usage**

Delete this line from the previous implementation if it remains:

```js
const cards = sorted.map(renderCard).join('\n');
```

- [ ] **Step 3: Run tests and observe missing renderer helper failures**

Run:

```bash
npm test
```

Expected: FAIL with a `renderStyles is not defined` or similar reference error. This confirms the new template is wired and the next task fills in sections.

## Task 4: Implement Section Renderers And SVG Artifacts

**Files:**
- Modify: `lib/render-index.js`

- [ ] **Step 1: Add navigation and hero renderers**

Insert after `renderIndex`:

```js
function renderTopNav() {
  return `<header class="topbar">
    <a class="brand" href="/" aria-label="Kira Learn home"><span class="brand-mark" aria-hidden="true"></span>Kira Learn</a>
    <nav class="nav-links" aria-label="Primary navigation">
      <a href="#maps">Maps</a>
      <a href="#paths">Paths</a>
      <a href="#notes-index">Notes</a>
      <a href="/sharp">Sharp view</a>
    </nav>
    <a class="search-control" href="#notes-index" aria-label="Search notes, maps, and topics">
      <span aria-hidden="true">⌕</span>
      <span>Search notes, maps, topics...</span>
      <kbd>/</kbd>
    </a>
  </header>`;
}

function renderHero(latest) {
  return `<section class="hero" id="maps">
    <div class="hero-copy">
      <h1>Mapping the agentic systems stack</h1>
      <p>A public study console for AI agents, orchestration, systems design, and the architecture patterns behind the tools.</p>
      <div class="hero-actions">
        <a class="button primary" href="#current-map">Open current map <span aria-hidden="true">→</span></a>
        <a class="button secondary" href="${articleUrl(latest)}">Read latest note</a>
      </div>
      ${latest ? `<aside class="latest-note" aria-label="Latest note">
        <span>Latest note</span>
        <a href="${articleUrl(latest)}">${escapeHtml(latest.title)}</a>
        <time datetime="${escapeAttr(latest.date)}">${escapeHtml(formatDate(latest.date))}</time>
      </aside>` : ''}
    </div>
    ${renderSystemMap()}
    <aside class="question-rail">
      <span>Current question</span>
      <p>When does agent orchestration become product architecture?</p>
      <dl>
        <div><dt>Focus area</dt><dd>Orchestration boundaries, interfaces, and responsibilities.</dd></div>
        <div><dt>Last updated</dt><dd>May 11, 2026</dd></div>
      </dl>
      <a href="#current-mapping">View full history →</a>
    </aside>
  </section>`;
}
```

- [ ] **Step 2: Add system map renderer**

Insert after `renderHero`:

```js
function renderSystemMap() {
  const nodes = SYSTEM_NODES.map((node) => {
    const [primaryTone, secondaryTone] = node.tone.split(' ');
    const active = secondaryTone === 'active' ? ' is-active' : '';
    return `<div class="map-node tone-${primaryTone}${active}" style="--x:${node.x}%;--y:${node.y}%">
      <span class="node-icon" aria-hidden="true"></span>
      <span>${escapeHtml(node.label)}</span>
    </div>`;
  }).join('');

  return `<section class="system-map" id="current-map" aria-label="Current system map">
    <svg class="map-lines" viewBox="0 0 1000 560" role="img" aria-label="Connected system map lines">
      <ellipse cx="500" cy="280" rx="390" ry="174"></ellipse>
      <ellipse cx="500" cy="280" rx="250" ry="105"></ellipse>
      <path d="M500 120 L500 245 M260 235 L430 255 M570 255 L760 235 M465 310 L365 392 M535 310 L640 392"></path>
      <path class="soft-line" d="M500 120 C620 145 710 168 760 235 M260 235 C314 315 338 353 365 392 M640 392 C676 350 708 301 760 235"></path>
    </svg>
    ${nodes}
    <div class="map-controls" aria-hidden="true"><span>−</span><span>＋</span><span>⛶</span><span>⌂</span></div>
  </section>`;
}
```

- [ ] **Step 3: Add lower-section renderers**

Insert after `renderSystemMap`:

```js
function renderCurrentMapping(latest) {
  return `<section class="panel current-mapping" id="current-mapping">
    <div class="section-heading"><span>1. Current mapping</span><a href="#notes-index">View all →</a></div>
    <div class="mapping-content">
      <div>
        <h2>Open questions</h2>
        <a class="question-card" href="#current-map"><strong>How do we design durable agent loops?</strong><span>Exploring patterns for supervision, reflection, and iteration at scale.</span></a>
        <a class="question-card" href="#current-map"><strong>What is the minimal viable orchestration layer?</strong><span>Defining the smallest set of responsibilities before productization.</span></a>
      </div>
      <article class="artifact-card">
        <span>Latest artifact</span>
        <h3>Orchestration boundary playbook v0.2</h3>
        <p>Research note · ${latest ? escapeHtml(formatDate(latest.date)) : 'May 11, 2026'}</p>
        <a href="${articleUrl(latest)}">Open note →</a>
      </article>
    </div>
  </section>`;
}

function renderLearningPaths(sorted) {
  const rows = LEARNING_PATHS.map((path) => {
    const article = findArticle(sorted, path.slugHints);
    return `<a class="path-row" href="${articleUrl(article)}">
      <span class="path-glyph" aria-hidden="true"></span>
      <span><strong>${escapeHtml(path.title)}</strong><small>${escapeHtml(path.description)}</small></span>
      <span class="progress-track" aria-label="${path.progress} of ${path.total} notes">${progressDots(path.progress, path.total)}</span>
      <span class="path-count">${path.progress} / ${path.total}</span>
      <span class="path-estimate">${escapeHtml(path.estimate)}</span>
      <span aria-hidden="true">→</span>
    </a>`;
  }).join('');

  return `<section class="panel learning-paths" id="paths">
    <div class="section-heading"><span>2. Learning paths</span><a href="#notes-index">View all paths →</a></div>
    <div class="path-list">${rows}</div>
  </section>`;
}

function renderArticleClusters(sorted) {
  const columns = ARTICLE_CLUSTERS.map((cluster) => {
    const topics = cluster.topics.map((topic) => {
      const article = findArticle(sorted, topic.slugHints);
      return `<a class="topic-row" href="${articleUrl(article)}"><span>${escapeHtml(topic.label)}</span><span>${topic.count}</span></a>`;
    }).join('');
    const total = cluster.topics.reduce((sum, topic) => sum + topic.count, 0);
    return `<section class="cluster-column">
      <h3>${escapeHtml(cluster.title)} <small>${total} notes</small></h3>
      ${topics}
    </section>`;
  }).join('');

  return `<section class="panel article-clusters">
    <div class="section-heading"><span>3. Article clusters</span><a href="#notes-index">Browse all notes →</a></div>
    <div class="cluster-grid">${columns}</div>
  </section>`;
}

function renderEvolvingDiagrams(sorted) {
  const related = sorted.slice(0, 3).map((article) => `<a href="${articleUrl(article)}">${escapeHtml(article.title)}<small>${escapeHtml(formatDate(article.date))}</small></a>`).join('');
  return `<section class="panel evolving-diagrams">
    <div class="section-heading"><span>4. Evolving diagrams</span><a href="#notes-index">View all diagrams →</a></div>
    <div class="diagram-wrap">
      ${renderLayerDiagram()}
      <aside class="related-notes"><h3>Related notes</h3>${related}<a class="all-related" href="#notes-index">See all related notes →</a></aside>
    </div>
  </section>`;
}
```

- [ ] **Step 4: Add diagram, notes index, and footer renderers**

Insert after `renderEvolvingDiagrams`:

```js
function renderLayerDiagram() {
  return `<svg class="layer-diagram" viewBox="0 0 640 260" role="img" aria-label="Layered architecture diagram">
    <g class="diagram-layer"><path d="M118 54h336l48 44H70z"></path><text x="28" y="86">Product systems</text></g>
    <g class="diagram-layer is-active"><path d="M118 112h336l48 44H70z"></path><text x="28" y="144">Orchestration layer</text></g>
    <g class="diagram-layer"><path d="M118 170h336l48 44H70z"></path><text x="28" y="202">Tool & memory layer</text></g>
    <path class="diagram-link" d="M300 76v126 M210 134h214 M250 192h154"></path>
    <rect x="246" y="124" width="146" height="42" rx="6"></rect>
    <text class="diagram-label" x="276" y="150">Agent runtime</text>
  </svg>`;
}

function renderNotesIndex(sorted) {
  const links = sorted.map((article) => `<a class="note-link" href="${articleUrl(article)}">
    <span>${escapeHtml(article.title)}</span>
    <time datetime="${escapeAttr(article.date)}">${escapeHtml(formatDate(article.date))}</time>
  </a>`).join('');

  return `<section class="notes-index" id="notes-index">
    <div class="section-heading"><span>Notes index</span><span>${sorted.length} ${sorted.length === 1 ? 'article' : 'articles'}</span></div>
    <div class="notes-list">${links}</div>
  </section>`;
}

function renderFooter(count) {
  return `<footer class="site-footer">
    <p><span aria-hidden="true">▪</span> kira@learn:~$ keep mapping</p>
    <nav aria-label="Footer navigation">
      <a href="#maps">About</a>
      <a href="#notes-index">Notes index</a>
      <a href="/sharp">Sharp view</a>
      <span>${count} ${count === 1 ? 'article' : 'articles'}</span>
    </nav>
  </footer>`;
}
```

- [ ] **Step 5: Run tests and observe style helper failure**

Run:

```bash
npm test
```

Expected: FAIL with `renderStyles is not defined`. The markup helpers should parse successfully.

## Task 5: Implement The Refined Atlas CSS

**Files:**
- Modify: `lib/render-index.js`

- [ ] **Step 1: Add the `renderStyles` function**

Insert this function after `renderFooter`:

```js
function renderStyles() {
  return String.raw`
  :root {
    --bg: #03070b;
    --bg-soft: #071019;
    --panel: rgba(8, 17, 27, 0.72);
    --panel-strong: rgba(11, 22, 34, 0.88);
    --line: rgba(137, 207, 230, 0.16);
    --line-soft: rgba(255, 255, 255, 0.08);
    --text: #f4f7fb;
    --muted: #a4afbd;
    --faint: #667281;
    --cyan: #48d9ff;
    --cyan-soft: rgba(72, 217, 255, 0.12);
    --indigo: #8f84ff;
    --green: #a6e675;
    --radius: 8px;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    min-height: 100vh;
    background:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px),
      radial-gradient(circle at 55% 20%, rgba(72,217,255,0.08), transparent 34rem),
      var(--bg);
    background-size: 54px 54px, 54px 54px, auto, auto;
    color: var(--text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: "cv01", "ss03";
    line-height: 1.5;
  }
  a { color: inherit; text-decoration: none; }
  .page-shell { width: min(100%, 1480px); margin: 0 auto; padding: 0 20px 28px; }
  .topbar {
    min-height: 58px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
    border-bottom: 1px solid var(--line-soft);
  }
  .brand, .nav-links, .search-control, .site-footer nav { display: flex; align-items: center; }
  .brand { gap: 10px; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
  .brand-mark { width: 14px; height: 14px; border-left: 2px solid var(--cyan); border-bottom: 2px solid var(--cyan); transform: rotate(45deg); }
  .nav-links { gap: clamp(18px, 4vw, 42px); color: #d6dce5; font-size: 13px; }
  .nav-links a:hover, .site-footer a:hover, .section-heading a:hover { color: var(--cyan); }
  .search-control {
    justify-self: end;
    gap: 10px;
    min-width: min(330px, 100%);
    padding: 8px 10px;
    border: 1px solid var(--line-soft);
    border-radius: 6px;
    color: var(--faint);
    font-size: 12px;
    background: rgba(255,255,255,0.02);
  }
  kbd { margin-left: auto; color: var(--muted); border: 1px solid var(--line-soft); border-radius: 4px; padding: 1px 6px; font: inherit; }
  .hero {
    min-height: 520px;
    display: grid;
    grid-template-columns: minmax(290px, 390px) minmax(480px, 1fr) minmax(230px, 280px);
    gap: 28px;
    align-items: center;
    padding: 30px 0 24px;
  }
  .hero-copy h1 {
    margin: 0;
    max-width: 440px;
    font-size: clamp(2.6rem, 5vw, 4.6rem);
    line-height: 1.04;
    letter-spacing: 0;
    font-weight: 500;
  }
  .hero-copy p { max-width: 410px; color: var(--muted); font-size: 16px; line-height: 1.65; margin: 22px 0 28px; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
  .button { display: inline-flex; align-items: center; gap: 14px; min-height: 42px; padding: 0 18px; border-radius: 6px; border: 1px solid var(--line); font-size: 13px; font-weight: 500; }
  .button.primary { background: linear-gradient(180deg, #5bdfff, #26bde8); color: #031017; border-color: transparent; }
  .button.secondary { color: var(--muted); background: rgba(255,255,255,0.025); }
  .latest-note { display: grid; gap: 5px; margin-top: 42px; font-size: 13px; }
  .latest-note span, .section-heading, .question-rail span, .artifact-card > span, .related-notes h3 { color: var(--faint); text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px; }
  .latest-note a { color: var(--text); }
  .latest-note time { color: var(--faint); font-size: 12px; }
  .system-map {
    position: relative;
    min-height: 430px;
    border-radius: var(--radius);
    overflow: hidden;
  }
  .system-map::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(72,217,255,0.11), transparent 58%);
    pointer-events: none;
  }
  .map-lines { position: absolute; inset: 0; width: 100%; height: 100%; }
  .map-lines ellipse, .map-lines path { fill: none; stroke: rgba(124, 174, 200, 0.22); stroke-width: 1.2; }
  .map-lines path { stroke: rgba(72, 217, 255, 0.76); }
  .map-lines .soft-line { stroke: rgba(164, 175, 189, 0.32); stroke-dasharray: 7 8; }
  .map-node {
    position: absolute;
    left: var(--x);
    top: var(--y);
    transform: translate(-50%, -50%);
    min-width: 148px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 16px;
    border: 1px solid var(--line);
    border-radius: 7px;
    background: rgba(7, 16, 25, 0.92);
    box-shadow: 0 0 26px rgba(72,217,255,0.08);
    font-size: 15px;
    white-space: nowrap;
  }
  .map-node.is-active { border-color: var(--cyan); color: #dff9ff; box-shadow: 0 0 34px rgba(72,217,255,0.3), inset 0 0 18px rgba(72,217,255,0.08); }
  .tone-indigo { border-color: rgba(143,132,255,0.55); }
  .tone-green { border-color: rgba(166,230,117,0.5); }
  .node-icon { width: 16px; height: 16px; border: 1px solid currentColor; border-radius: 3px; color: var(--cyan); }
  .tone-green .node-icon { color: var(--green); }
  .tone-indigo .node-icon { color: var(--indigo); }
  .map-controls { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; border: 1px solid var(--line-soft); border-radius: 6px; overflow: hidden; color: var(--muted); }
  .map-controls span { width: 34px; height: 30px; display: grid; place-items: center; border-right: 1px solid var(--line-soft); background: rgba(255,255,255,0.025); }
  .map-controls span:last-child { border-right: 0; }
  .question-rail, .panel, .notes-index {
    border: 1px solid var(--line-soft);
    border-radius: var(--radius);
    background: var(--panel);
    backdrop-filter: blur(10px);
  }
  .question-rail { padding: 24px 20px; }
  .question-rail p { font-size: 18px; line-height: 1.4; margin: 14px 0 20px; }
  .question-rail dl { margin: 0; display: grid; gap: 18px; border-top: 1px solid var(--line-soft); padding-top: 18px; }
  .question-rail dt { color: var(--faint); text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; }
  .question-rail dd { margin: 5px 0 0; color: var(--muted); font-size: 13px; }
  .question-rail a { display: inline-block; margin-top: 18px; color: var(--cyan); font-size: 13px; }
  .console-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 14px 28px; border-top: 1px solid var(--line-soft); padding-top: 12px; }
  .panel { padding: 16px; }
  .section-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }
  .section-heading a { color: var(--muted); text-transform: none; letter-spacing: 0; font-size: 12px; }
  .mapping-content, .diagram-wrap { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; }
  .panel h2 { margin: 0 0 12px; color: var(--faint); text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px; font-weight: 500; }
  .question-card, .artifact-card, .path-row, .topic-row, .note-link, .related-notes a {
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }
  .question-card { display: grid; gap: 5px; padding: 13px 14px; border: 1px solid var(--line-soft); border-left-color: var(--cyan); border-radius: 6px; margin-bottom: 10px; }
  .question-card strong { font-size: 13px; font-weight: 500; }
  .question-card span { color: var(--faint); font-size: 12px; }
  .artifact-card { padding: 18px; border: 1px solid var(--line-soft); border-radius: 6px; background: rgba(255,255,255,0.018); }
  .artifact-card h3 { margin: 12px 0 8px; font-size: 17px; line-height: 1.3; font-weight: 500; }
  .artifact-card p { color: var(--faint); margin: 0 0 16px; font-size: 12px; }
  .artifact-card a, .all-related { color: var(--cyan); font-size: 13px; }
  .path-list { display: grid; gap: 8px; }
  .path-row { display: grid; grid-template-columns: 42px minmax(160px, 1fr) minmax(150px, 260px) 48px 44px 18px; align-items: center; gap: 14px; padding: 12px; border: 1px solid var(--line-soft); border-radius: 6px; }
  .path-glyph { width: 34px; height: 34px; border: 1px solid var(--cyan); border-radius: 6px; background: var(--cyan-soft); }
  .path-row strong, .cluster-column h3 { display: block; font-size: 13px; font-weight: 500; }
  .path-row small, .cluster-column small, .related-notes small { display: block; color: var(--faint); font-size: 11px; margin-top: 2px; font-weight: 400; }
  .progress-track { display: flex; gap: 14px; align-items: center; }
  .progress-dot { width: 5px; height: 5px; border-radius: 50%; border: 1px solid rgba(164,175,189,0.55); }
  .progress-dot.is-active { background: var(--cyan); border-color: var(--cyan); box-shadow: 0 0 12px rgba(72,217,255,0.35); }
  .path-count, .path-estimate { color: var(--muted); font-size: 12px; text-align: right; }
  .article-clusters { grid-column: span 1; }
  .evolving-diagrams { grid-column: span 1; }
  .cluster-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  .cluster-column { padding: 0 16px; border-left: 1px solid var(--line-soft); }
  .cluster-column:first-child { border-left: 0; padding-left: 0; }
  .cluster-column h3 { margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }
  .topic-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.055); color: var(--muted); font-size: 12px; }
  .diagram-wrap { grid-template-columns: 1fr minmax(180px, 250px); }
  .layer-diagram { width: 100%; min-height: 190px; }
  .layer-diagram path, .layer-diagram rect { fill: rgba(255,255,255,0.018); stroke: rgba(164,175,189,0.28); }
  .layer-diagram .is-active path { stroke: var(--cyan); fill: rgba(72,217,255,0.06); }
  .layer-diagram text { fill: var(--muted); font-size: 14px; }
  .layer-diagram .diagram-label { fill: var(--text); font-size: 13px; }
  .diagram-link { stroke: var(--cyan) !important; stroke-dasharray: 5 7; fill: none !important; }
  .related-notes { border-left: 1px solid var(--line-soft); padding-left: 18px; }
  .related-notes a { display: grid; gap: 2px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.055); font-size: 13px; }
  .notes-index { margin-top: 14px; padding: 16px; }
  .notes-list { columns: 3 260px; column-gap: 24px; }
  .note-link { break-inside: avoid; display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--muted); font-size: 12px; }
  .note-link span { color: #dbe4ef; }
  .note-link time { color: var(--faint); white-space: nowrap; }
  .question-card:hover, .artifact-card:hover, .path-row:hover, .topic-row:hover, .note-link:hover, .related-notes a:hover { border-color: rgba(72,217,255,0.34); color: var(--text); }
  .site-footer { display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 28px 0 0; color: var(--muted); font-size: 12px; }
  .site-footer p { margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .site-footer p span { color: var(--green); }
  .site-footer nav { gap: 24px; }
  @media (max-width: 1180px) {
    .hero { grid-template-columns: 1fr; }
    .system-map { min-height: 380px; }
    .question-rail { max-width: none; }
    .console-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 820px) {
    .page-shell { padding-inline: 14px; }
    .topbar { grid-template-columns: 1fr; padding: 14px 0; gap: 12px; }
    .nav-links { order: 3; justify-content: space-between; width: 100%; gap: 10px; }
    .search-control { justify-self: stretch; min-width: 0; }
    .hero { min-height: auto; padding-top: 34px; }
    .system-map { min-height: 460px; }
    .map-node { min-width: 126px; padding: 10px 11px; font-size: 12px; }
    .mapping-content, .diagram-wrap { grid-template-columns: 1fr; }
    .path-row { grid-template-columns: 34px 1fr 18px; }
    .progress-track, .path-count, .path-estimate { display: none; }
    .cluster-grid { grid-template-columns: 1fr 1fr; gap: 18px 0; }
    .site-footer { align-items: flex-start; flex-direction: column; }
  }
  @media (max-width: 540px) {
    .hero-copy h1 { font-size: 2.45rem; }
    .hero-actions { flex-direction: column; align-items: stretch; }
    .button { justify-content: center; }
    .system-map { min-height: 420px; }
    .map-node { min-width: 112px; white-space: normal; text-align: center; }
    .cluster-grid { grid-template-columns: 1fr; }
    .cluster-column, .cluster-column:first-child { border-left: 0; padding: 0; }
    .notes-list { columns: 1; }
  }`;
}
```

- [ ] **Step 2: Run tests and verify all pass**

Run:

```bash
npm test
```

Expected: PASS for all tests.

- [ ] **Step 3: Commit renderer implementation**

```bash
git add lib/render-index.js tests/render-index.test.js
git commit -m "feat: redesign homepage as live study console"
```

## Task 6: Regenerate The Homepage And Verify Build Output

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Regenerate static files**

Run:

```bash
npm run build
```

Expected output:

```text
built index.html and sharp.html from 28 articles
```

The article count may be higher if new articles were added before implementation. `sharp.html` may be rewritten by the build script even if its content is unchanged.

- [ ] **Step 2: Run the full test suite again**

Run:

```bash
npm test
```

Expected: PASS for all tests.

- [ ] **Step 3: Inspect git diff for intended files only**

Run:

```bash
git status --short
git diff --stat
```

Expected changed files:

```text
M index.html
```

If `sharp.html` changes only from build-script formatting or regenerated content, inspect it with `git diff -- sharp.html`. Keep it only if the build intentionally updated article metadata output; otherwise leave it untouched.

- [ ] **Step 4: Commit generated homepage**

```bash
git add index.html
git commit -m "build: regenerate live study console homepage"
```

## Task 7: Browser And Visual Fidelity Verification

**Files:**
- No source edits unless verification finds a concrete defect.

- [ ] **Step 1: Start a local static server**

Run:

```bash
python3 -m http.server 4173
```

Expected: server listening on `http://localhost:4173`.

- [ ] **Step 2: Open the homepage in the browser**

Open:

```text
http://localhost:4173/
```

Verify:

- First viewport has concise left copy, central/right system map, and current-question rail.
- The page feels more like a spatial atlas than a dense dashboard.
- `Open current map` scrolls to the map.
- `Read latest note` opens the newest article.
- `/sharp` link works.
- System map labels are readable.
- Notes index preserves all article links.

- [ ] **Step 3: Check mobile width**

Use the browser responsive tools or a narrow window around `390px` wide.

Verify:

- No horizontal overflow.
- Navigation wraps cleanly.
- Hero headline remains readable.
- Map nodes do not overlap in an incoherent way.
- Lower sections stack in this order: Current mapping, Learning paths, Article clusters, Evolving diagrams, Notes index.

- [ ] **Step 4: Compare against approved concept**

Open the approved concept image:

```text
/Users/eliHome/.codex/generated_images/019e17b7-7f43-7ea3-af6d-952590e48480/ig_02b4110e3de0382b016a01fd54f8008194963b1c3063b720e3.png
```

Compare these points:

- Overall dark graphite/cyan/indigo palette.
- Hero balance: text left, map dominant, current-question rail restrained.
- Map node labels and line geometry.
- Section order and section naming.
- Lower research-desk density: structured but not overloaded.
- Typography scale and line length.
- Article clusters are compact text groupings, not old cards.

- [ ] **Step 5: Fix any fidelity defects and rerun verification**

If defects are found, edit `lib/render-index.js`, run:

```bash
npm test
npm run build
```

Then re-check the browser. Commit fixes with:

```bash
git add lib/render-index.js index.html
git commit -m "fix: tune live study console fidelity"
```

## Self-Review

Spec coverage:

- Live map first viewport: Task 4 and Task 5.
- Less overloaded, refined spatial atlas direction: Task 5 and Task 7.
- Current mapping, learning paths, article clusters, evolving diagrams: Task 4.
- Static site constraints through `lib/render-index.js` and `npm run build`: Task 3 through Task 6.
- Existing article discoverability: Task 1 and Task 4 through `renderNotesIndex`.
- Browser/mobile verification: Task 7.

Placeholder scan: no incomplete implementation instructions remain.

Type consistency: helper names used in the template are defined in the plan: `renderStyles`, `renderTopNav`, `renderHero`, `renderSystemMap`, `renderCurrentMapping`, `renderLearningPaths`, `renderArticleClusters`, `renderEvolvingDiagrams`, `renderNotesIndex`, `renderFooter`, `getLatestArticle`, `articleUrl`, `findArticle`, `progressDots`, `formatDate`, `escapeHtml`, and `escapeAttr`.
