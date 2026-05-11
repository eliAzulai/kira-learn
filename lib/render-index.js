/**
 * Render the spatial-atlas homepage (`/`).
 * Pure function - takes article list, returns full HTML string.
 *
 * @param {Array<{title:string,hook:string,date:string,slug:string}>} articles
 * @returns {string} complete HTML document
 */

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
        <a href="#current-map" class="button primary">Open current map <span aria-hidden="true">→</span></a>
        <a href="${articleUrl(latest)}" class="button secondary">Read latest note</a>
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

function renderLayerDiagram() {
  return `<svg class="layer-diagram" viewBox="0 0 640 260" role="img" aria-label="Layered architecture diagram">
    <g class="diagram-layer"><path d="M118 54h336l48 44H70z"></path><text x="28" y="86">Product systems</text></g>
    <g class="diagram-layer is-active"><path d="M118 112h336l48 44H70z"></path><text x="28" y="144">Orchestration layer</text></g>
    <g class="diagram-layer"><path d="M118 170h336l48 44H70z"></path><text x="28" y="202">Tool &amp; memory layer</text></g>
    <path class="diagram-link" d="M300 76v126 M210 134h214 M250 192h154"></path>
    <rect x="246" y="124" width="146" height="42" rx="6"></rect>
    <text class="diagram-label" x="276" y="150">Agent runtime</text>
  </svg>`;
}

function renderNotesIndex(sorted) {
  const links = sorted.map((article) => `<a class="note-link" href="${articleUrl(article)}">
    <span><strong>${escapeHtml(article.title)}</strong>${article.hook ? `<small>${escapeHtml(article.hook)}</small>` : ''}</span>
    <time datetime="${escapeAttr(article.date)}">${escapeHtml(formatDate(article.date))}</time>
  </a>`).join('');

  return `<section class="notes-index" id="notes-index">
    <div class="section-heading"><span>Notes index</span><span>${sorted.length} ${sorted.length === 1 ? 'article' : 'articles'}</span></div>
    <div class="notes-list">${links}</div>
  </section>`;
}

function renderFooter(count) {
  return `<footer class="site-footer">
    <p><span aria-hidden="true">.</span> kira@learn:~$ keep mapping</p>
    <nav aria-label="Footer navigation">
      <a href="#maps">About</a>
      <a href="#notes-index">Notes index</a>
      <a href="/sharp">Sharp view</a>
      <span>${count} ${count === 1 ? 'article' : 'articles'}</span>
    </nav>
  </footer>`;
}

function renderStyles() {
  return String.raw`
  :root {
    --color-bg: #03070b;
    --color-panel: rgba(8, 17, 27, 0.72);
    --color-panel-strong: rgba(11, 22, 34, 0.88);
    --color-line: rgba(137, 207, 230, 0.16);
    --color-line-soft: rgba(255, 255, 255, 0.08);
    --color-line-faint: rgba(255, 255, 255, 0.055);
    --color-grid-line: rgba(255, 255, 255, 0.018);
    --color-text: #f4f7fb;
    --color-text-soft: #dbe4ef;
    --color-muted: #a4afbd;
    --color-faint: #667281;
    --color-cyan: #48d9ff;
    --color-cyan-dark: #031017;
    --color-cyan-soft: rgba(72, 217, 255, 0.12);
    --color-cyan-halo: rgba(72, 217, 255, 0.34);
    --color-indigo: #8f84ff;
    --color-indigo-line: rgba(143, 132, 255, 0.55);
    --color-green: #a6e675;
    --color-green-line: rgba(166, 230, 117, 0.5);
    --color-transparent: transparent;
    --button-bg: linear-gradient(180deg, #5bdfff, #26bde8);
    --map-glow: radial-gradient(ellipse at center, rgba(72, 217, 255, 0.11), transparent 58%);
    --page-glow: radial-gradient(circle at 55% 20%, rgba(72, 217, 255, 0.08), transparent 34rem);
    --shadow-map: 0 0 1.625rem rgba(72, 217, 255, 0.08);
    --shadow-map-active: 0 0 2.125rem rgba(72, 217, 255, 0.3), inset 0 0 1.125rem rgba(72, 217, 255, 0.08);
    --size-full: 100%;
    --size-page: 92.5rem;
    --size-search: 20.625rem;
    --size-hero-copy-min: 18.125rem;
    --size-hero-copy-max: 30rem;
    --size-map-min: 40rem;
    --size-rail-min: 14.375rem;
    --size-rail-max: 17.5rem;
    --size-map-height: 28rem;
    --size-map-height-tablet: 23.75rem;
    --size-map-height-mobile: 28.75rem;
    --size-map-height-small: 26.25rem;
    --size-node-min: 9.25rem;
    --size-node-tablet: 7.875rem;
    --size-node-mobile: 7rem;
    --size-icon: 1rem;
    --size-brand-mark: 0.875rem;
    --size-control: 2.125rem;
    --size-path-glyph: 2.125rem;
    --size-progress-dot: 0.3125rem;
    --size-diagram-min: 11.875rem;
    --size-mobile-measure: 22rem;
    --space-0: 0;
    --space-hairline: 1px;
    --space-3xs: 0.0625rem;
    --space-2xs: 0.125rem;
    --space-xs: 0.25rem;
    --space-sm: 0.3125rem;
    --space-md: 0.5rem;
    --space-lg: 0.625rem;
    --space-xl: 0.75rem;
    --space-2xl: 0.875rem;
    --space-3xl: 1rem;
    --space-4xl: 1.125rem;
    --space-5xl: 1.25rem;
    --space-6xl: 1.5rem;
    --space-7xl: 1.75rem;
    --space-8xl: 2.125rem;
    --space-9xl: 2.625rem;
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --type-xs: 0.625rem;
    --type-sm: 0.6875rem;
    --type-md: 0.75rem;
    --type-lg: 0.8125rem;
    --type-xl: 0.9375rem;
    --type-2xl: 1rem;
    --type-3xl: 1.0625rem;
    --type-4xl: 1.125rem;
    --type-display-min: 2rem;
    --type-display: clamp(2.35rem, 3vw, 2.8rem);
    --line-tight: 1.04;
    --line-copy: 1.65;
    --line-body: 1.5;
    --tracking-label: 0.12em;
    --tracking-small: 0.08em;
    --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
    --duration-fast: 0.15s;
    --lift-hover: -0.125rem;
    --grid-size: 3.375rem;
    --columns-notes: 3 16.25rem;
    --x: 50%;
    --y: 50%;
  }
  * {
    box-sizing: border-box;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    margin: var(--space-0);
    min-height: 100vh;
    background:
      linear-gradient(var(--color-grid-line) var(--space-hairline), var(--color-transparent) var(--space-hairline)),
      linear-gradient(90deg, var(--color-grid-line) var(--space-hairline), var(--color-transparent) var(--space-hairline)),
      var(--page-glow),
      var(--color-bg);
    background-size: var(--grid-size) var(--grid-size), var(--grid-size) var(--grid-size), auto, auto;
    color: var(--color-text);
    font-family: var(--font-ui);
    font-feature-settings: "cv01", "ss03";
    line-height: var(--line-body);
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  a:focus-visible {
    outline: var(--space-hairline) solid var(--color-cyan);
    outline-offset: var(--space-xs);
  }
  .page-shell {
    width: min(var(--size-full), var(--size-page));
    margin: var(--space-0) auto;
    padding: var(--space-0) var(--space-5xl) var(--space-7xl);
  }
  .topbar {
    min-height: 3.625rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-6xl);
    border-bottom: var(--space-hairline) solid var(--color-line-soft);
  }
  .brand,
  .nav-links,
  .search-control,
  .site-footer nav {
    display: flex;
    align-items: center;
  }
  .brand {
    gap: var(--space-lg);
    font-size: var(--type-3xl);
    font-weight: 600;
  }
  .brand-mark {
    width: var(--size-brand-mark);
    height: var(--size-brand-mark);
    border-left: var(--space-2xs) solid var(--color-cyan);
    border-bottom: var(--space-2xs) solid var(--color-cyan);
    transform: rotate(45deg);
  }
  .nav-links {
    gap: clamp(var(--space-4xl), 4vw, var(--space-9xl));
    color: var(--color-text-soft);
    font-size: var(--type-lg);
  }
  .nav-links a:hover,
  .site-footer a:hover,
  .section-heading a:hover {
    color: var(--color-cyan);
  }
  .search-control {
    justify-self: end;
    gap: var(--space-lg);
    min-width: min(var(--size-search), var(--size-full));
    padding: var(--space-md) var(--space-lg);
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-md);
    color: var(--color-faint);
    font-size: var(--type-md);
    background: var(--color-panel);
  }
  kbd {
    margin-left: auto;
    color: var(--color-muted);
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-sm);
    padding: var(--space-3xs) var(--space-md);
    font: inherit;
  }
  .hero {
    min-height: 32.5rem;
    display: grid;
    grid-template-columns: minmax(var(--size-hero-copy-min), var(--size-hero-copy-max)) minmax(var(--size-map-min), 1fr) minmax(var(--size-rail-min), var(--size-rail-max));
    gap: var(--space-7xl);
    align-items: center;
    padding: 1.875rem var(--space-0) var(--space-6xl);
  }
  .hero > *,
  .panel,
  .notes-index {
    min-width: var(--space-0);
  }
  .hero-copy h1 {
    margin: var(--space-0);
    max-width: 30rem;
    font-size: var(--type-display);
    line-height: var(--line-tight);
    letter-spacing: var(--space-0);
    font-weight: 500;
  }
  .hero-copy p {
    max-width: 25.625rem;
    color: var(--color-muted);
    font-size: var(--type-2xl);
    line-height: var(--line-copy);
    margin: 1.375rem var(--space-0) var(--space-7xl);
  }
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xl);
  }
  .button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2xl);
    min-height: 2.625rem;
    padding: var(--space-0) var(--space-4xl);
    border-radius: var(--radius-md);
    border: var(--space-hairline) solid var(--color-line);
    font-size: var(--type-lg);
    font-weight: 500;
  }
  .button.primary {
    background: var(--button-bg);
    color: var(--color-cyan-dark);
    border-color: var(--color-transparent);
  }
  .button.secondary {
    color: var(--color-muted);
    background: var(--color-panel);
  }
  .latest-note {
    display: grid;
    gap: var(--space-sm);
    margin-top: var(--space-9xl);
    font-size: var(--type-lg);
  }
  .latest-note span,
  .section-heading,
  .question-rail span,
  .artifact-card > span,
  .related-notes h3 {
    color: var(--color-faint);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    font-size: var(--type-sm);
  }
  .latest-note a {
    color: var(--color-text);
  }
  .latest-note time {
    color: var(--color-faint);
    font-size: var(--type-md);
  }
  .system-map {
    position: relative;
    min-height: var(--size-map-height);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .system-map::before {
    content: "";
    position: absolute;
    inset: var(--space-0);
    background: var(--map-glow);
    pointer-events: none;
  }
  .map-lines {
    position: absolute;
    inset: var(--space-0);
    width: var(--size-full);
    height: var(--size-full);
  }
  .map-lines ellipse,
  .map-lines path {
    fill: none;
    stroke: var(--color-line);
    stroke-width: 1.2;
  }
  .map-lines path {
    stroke: var(--color-cyan);
  }
  .map-lines .soft-line {
    stroke: var(--color-muted);
    stroke-dasharray: 7 8;
  }
  .map-node {
    position: absolute;
    left: var(--x);
    top: var(--y);
    transform: translate(-50%, -50%);
    min-width: var(--size-node-min);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-lg);
    padding: var(--space-xl) var(--space-3xl);
    border: var(--space-hairline) solid var(--color-line);
    border-radius: var(--radius-lg);
    background: var(--color-panel-strong);
    box-shadow: var(--shadow-map);
    font-size: var(--type-xl);
    white-space: nowrap;
  }
  .map-node.is-active {
    border-color: var(--color-cyan);
    color: var(--color-text);
    box-shadow: var(--shadow-map-active);
  }
  .tone-indigo {
    border-color: var(--color-indigo-line);
  }
  .tone-green {
    border-color: var(--color-green-line);
  }
  .node-icon {
    width: var(--size-icon);
    height: var(--size-icon);
    border: var(--space-hairline) solid currentColor;
    border-radius: var(--radius-sm);
    color: var(--color-cyan);
  }
  .tone-green .node-icon {
    color: var(--color-green);
  }
  .tone-indigo .node-icon {
    color: var(--color-indigo);
  }
  .map-controls {
    position: absolute;
    left: 50%;
    bottom: var(--space-xl);
    transform: translateX(-50%);
    display: flex;
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-md);
    overflow: hidden;
    color: var(--color-muted);
  }
  .map-controls span {
    width: var(--size-control);
    height: 1.875rem;
    display: grid;
    place-items: center;
    border-right: var(--space-hairline) solid var(--color-line-soft);
    background: var(--color-panel);
  }
  .map-controls span:last-child {
    border-right: var(--space-0);
  }
  .question-rail,
  .panel,
  .notes-index {
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-lg);
    background: var(--color-panel);
    backdrop-filter: blur(0.625rem);
  }
  .question-rail {
    padding: var(--space-6xl) var(--space-5xl);
  }
  .question-rail p {
    font-size: var(--type-4xl);
    line-height: 1.4;
    margin: var(--space-2xl) var(--space-0) var(--space-5xl);
  }
  .question-rail dl {
    margin: var(--space-0);
    display: grid;
    gap: var(--space-4xl);
    border-top: var(--space-hairline) solid var(--color-line-soft);
    padding-top: var(--space-4xl);
  }
  .question-rail dt {
    color: var(--color-faint);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: var(--type-xs);
  }
  .question-rail dd {
    margin: var(--space-sm) var(--space-0) var(--space-0);
    color: var(--color-muted);
    font-size: var(--type-lg);
  }
  .question-rail a {
    display: inline-block;
    margin-top: var(--space-4xl);
    color: var(--color-cyan);
    font-size: var(--type-lg);
  }
  .console-grid {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: var(--space-2xl) var(--space-7xl);
    border-top: var(--space-hairline) solid var(--color-line-soft);
    padding-top: var(--space-xl);
  }
  .panel {
    padding: var(--space-3xl);
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3xl);
    margin-bottom: var(--space-3xl);
  }
  .section-heading a {
    color: var(--color-muted);
    text-transform: none;
    letter-spacing: var(--space-0);
    font-size: var(--type-md);
  }
  .mapping-content,
  .diagram-wrap {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: var(--space-7xl);
  }
  .panel h2 {
    margin: var(--space-0) var(--space-0) var(--space-xl);
    color: var(--color-faint);
    text-transform: uppercase;
    letter-spacing: var(--tracking-label);
    font-size: var(--type-sm);
    font-weight: 500;
  }
  .question-card,
  .artifact-card,
  .path-row,
  .topic-row,
  .note-link,
  .related-notes a {
    transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease, color var(--duration-fast) ease, transform var(--duration-fast) ease;
  }
  .question-card {
    display: grid;
    gap: var(--space-sm);
    padding: var(--space-lg) var(--space-2xl);
    border: var(--space-hairline) solid var(--color-line-soft);
    border-left-color: var(--color-cyan);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-lg);
  }
  .question-card strong {
    font-size: var(--type-lg);
    font-weight: 500;
  }
  .question-card span {
    color: var(--color-faint);
    font-size: var(--type-md);
  }
  .artifact-card {
    padding: var(--space-4xl);
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-md);
    background: var(--color-panel);
  }
  .artifact-card h3 {
    margin: var(--space-xl) var(--space-0) var(--space-md);
    font-size: var(--type-3xl);
    line-height: 1.3;
    font-weight: 500;
  }
  .artifact-card p {
    color: var(--color-faint);
    margin: var(--space-0) var(--space-0) var(--space-3xl);
    font-size: var(--type-md);
  }
  .artifact-card a,
  .all-related {
    color: var(--color-cyan);
    font-size: var(--type-lg);
  }
  .path-list {
    display: grid;
    gap: var(--space-md);
  }
  .path-row {
    display: grid;
    grid-template-columns: 2.625rem minmax(10rem, 1fr) minmax(9.375rem, 16.25rem) 3rem 2.75rem 1.125rem;
    align-items: center;
    gap: var(--space-2xl);
    padding: var(--space-xl);
    border: var(--space-hairline) solid var(--color-line-soft);
    border-radius: var(--radius-md);
  }
  .path-glyph {
    width: var(--size-path-glyph);
    height: var(--size-path-glyph);
    border: var(--space-hairline) solid var(--color-cyan);
    border-radius: var(--radius-md);
    background: var(--color-cyan-soft);
  }
  .path-row strong,
  .cluster-column h3 {
    display: block;
    font-size: var(--type-lg);
    font-weight: 500;
  }
  .path-row small,
  .cluster-column small,
  .related-notes small {
    display: block;
    color: var(--color-faint);
    font-size: var(--type-sm);
    margin-top: var(--space-2xs);
    font-weight: 400;
  }
  .progress-track {
    display: flex;
    gap: var(--space-2xl);
    align-items: center;
  }
  .progress-dot {
    width: var(--size-progress-dot);
    height: var(--size-progress-dot);
    border-radius: 50%;
    border: var(--space-hairline) solid var(--color-muted);
  }
  .progress-dot.is-active {
    background: var(--color-cyan);
    border-color: var(--color-cyan);
    box-shadow: var(--shadow-map);
  }
  .path-count,
  .path-estimate {
    color: var(--color-muted);
    font-size: var(--type-md);
    text-align: right;
  }
  .cluster-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-0);
  }
  .cluster-column {
    padding: var(--space-0) var(--space-3xl);
    border-left: var(--space-hairline) solid var(--color-line-soft);
  }
  .cluster-column:first-child {
    border-left: var(--space-0);
    padding-left: var(--space-0);
  }
  .cluster-column h3 {
    margin: var(--space-0) var(--space-0) var(--space-xl);
    text-transform: uppercase;
    letter-spacing: var(--tracking-small);
    font-size: var(--type-sm);
  }
  .topic-row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-xl);
    padding: var(--space-md) var(--space-0);
    border-bottom: var(--space-hairline) solid var(--color-line-faint);
    color: var(--color-muted);
    font-size: var(--type-md);
  }
  .diagram-wrap {
    grid-template-columns: 1fr minmax(11.25rem, 15.625rem);
  }
  .layer-diagram {
    width: var(--size-full);
    min-height: var(--size-diagram-min);
  }
  .layer-diagram path,
  .layer-diagram rect {
    fill: var(--color-panel);
    stroke: var(--color-line);
  }
  .layer-diagram .is-active path {
    stroke: var(--color-cyan);
    fill: var(--color-cyan-soft);
  }
  .layer-diagram text {
    fill: var(--color-muted);
    font-size: var(--type-2xl);
  }
  .layer-diagram .diagram-label {
    fill: var(--color-text);
    font-size: var(--type-lg);
  }
  .diagram-link {
    stroke: var(--color-cyan) !important;
    stroke-dasharray: 5 7;
    fill: none !important;
  }
  .related-notes {
    border-left: var(--space-hairline) solid var(--color-line-soft);
    padding-left: var(--space-4xl);
  }
  .related-notes a {
    display: grid;
    gap: var(--space-2xs);
    padding: var(--space-md) var(--space-0);
    border-bottom: var(--space-hairline) solid var(--color-line-faint);
    font-size: var(--type-lg);
  }
  .notes-index {
    margin-top: var(--space-2xl);
    padding: var(--space-3xl);
  }
  .notes-list {
    columns: var(--columns-notes);
    column-gap: var(--space-6xl);
  }
  .note-link {
    break-inside: avoid;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-xl);
    padding: var(--space-md) var(--space-0);
    border-bottom: var(--space-hairline) solid var(--color-line-faint);
    color: var(--color-muted);
    font-size: var(--type-md);
  }
  .note-link strong {
    display: block;
    color: var(--color-text-soft);
    font-weight: 500;
  }
  .note-link small {
    display: block;
    color: var(--color-faint);
    margin-top: var(--space-2xs);
  }
  .note-link time {
    color: var(--color-faint);
    white-space: nowrap;
  }
  .question-card:hover,
  .artifact-card:hover,
  .path-row:hover,
  .topic-row:hover,
  .note-link:hover,
  .related-notes a:hover {
    border-color: var(--color-cyan-halo);
    color: var(--color-text);
    transform: translateY(var(--lift-hover));
  }
  .site-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4xl);
    padding: var(--space-7xl) var(--space-0) var(--space-0);
    color: var(--color-muted);
    font-size: var(--type-md);
  }
  .site-footer p {
    margin: var(--space-0);
    font-family: var(--font-mono);
  }
  .site-footer p span {
    color: var(--color-green);
  }
  .site-footer nav {
    gap: var(--space-6xl);
  }
  @media (max-width: 73.75rem) {
    .hero {
      grid-template-columns: 1fr;
    }
    .system-map {
      min-height: var(--size-map-height-tablet);
    }
    .question-rail {
      max-width: none;
    }
    .console-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 51.25rem) {
    .page-shell {
      padding-inline: var(--space-2xl);
    }
    .topbar {
      grid-template-columns: 1fr;
      padding: var(--space-2xl) var(--space-0);
      gap: var(--space-xl);
    }
    .nav-links {
      order: 3;
      justify-content: space-between;
      width: var(--size-full);
      gap: var(--space-lg);
    }
    .search-control {
      justify-self: stretch;
      min-width: var(--space-0);
    }
    .hero {
      min-height: auto;
      padding-top: var(--space-8xl);
    }
    .system-map {
      min-height: var(--size-map-height-mobile);
    }
    .map-node {
      min-width: var(--size-node-tablet);
      padding: var(--space-lg) var(--space-sm);
      font-size: var(--type-md);
    }
    .mapping-content,
    .diagram-wrap {
      grid-template-columns: 1fr;
    }
    .path-row {
      grid-template-columns: 2.125rem 1fr 1.125rem;
    }
    .progress-track,
    .path-count,
    .path-estimate {
      display: none;
    }
    .cluster-grid {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4xl) var(--space-0);
    }
    .site-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }
  @media (max-width: 33.75rem) {
    .search-control,
    .nav-links,
    .hero-copy,
    .system-map,
    .question-rail,
    .panel,
    .notes-index {
      max-width: var(--size-mobile-measure);
    }
    .hero-copy h1 {
      font-size: var(--type-display-min);
      max-width: var(--size-full);
    }
    .hero-copy p {
      max-width: var(--size-full);
    }
    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }
    .button {
      justify-content: center;
    }
    .system-map {
      min-height: var(--size-map-height-small);
    }
    .map-node {
      min-width: var(--size-node-mobile);
      white-space: normal;
      text-align: center;
    }
    .cluster-grid {
      grid-template-columns: 1fr;
    }
    .cluster-column,
    .cluster-column:first-child {
      border-left: var(--space-0);
      padding: var(--space-0);
    }
    .notes-list {
      columns: 1;
    }
  }`;
}

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

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return escapeHtml(s);
}
