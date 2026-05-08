/**
 * Render the typographic-feed homepage (Variant C — `/sharp`).
 * Single column, large titles, generous vertical rhythm, hairline dividers.
 *
 * @param {Array<{title:string,hook:string,date:string,slug:string}>} articles
 * @returns {string} complete HTML document
 */
export function renderSharp(articles) {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const entries = sorted.map(renderEntry).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kira Learn — Sharp</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #08090a;
    color: #d0d6e0;
    font-family: 'Inter', -apple-system, sans-serif;
    font-feature-settings: "cv01", "ss03";
    line-height: 1.5;
    min-height: 100vh;
  }
  .container { max-width: 720px; margin: 0 auto; padding: 6rem 1.5rem; }
  header { margin-bottom: 5rem; }
  .site-name {
    font-size: 0.85rem;
    color: #8a8f98;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  main { display: flex; flex-direction: column; }
  .entry {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 2rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .entry:last-child { border-bottom: none; }
  .entry .date {
    font-size: 0.75rem;
    color: #8a8f98;
    font-variant-numeric: tabular-nums;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.85rem;
  }
  .entry h2 {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 600;
    color: #f7f8f8;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
    transition: color 0.2s ease;
  }
  .entry:hover h2 { color: #7170ff; }
  .entry .hook { color: #8a8f98; font-size: 1rem; }
  footer {
    margin-top: 5rem;
    padding-top: 2rem;
    color: #8a8f98;
    font-size: 0.85rem;
    display: flex;
    gap: 2rem;
  }
  footer a { color: #7170ff; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <header>
    <div class="site-name">Kira Learn</div>
  </header>
  <main>
${entries}
  </main>
  <footer>
    <a href="/">← Grid view</a>
  </footer>
</div>
</body>
</html>
`;
}

function renderEntry({ title, hook, date, slug }) {
  return `    <a class="entry" href="/articles/${escapeAttr(slug)}">
      <div class="date">${escapeHtml(formatDate(date))}</div>
      <h2>${escapeHtml(title)}</h2>
      ${hook ? `<p class="hook">${escapeHtml(hook)}</p>` : ''}
    </a>`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) { return escapeHtml(s); }
