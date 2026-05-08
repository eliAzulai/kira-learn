/**
 * Render the clean-grid homepage (Variant A — `/`).
 * Pure function — takes article list, returns full HTML string.
 *
 * @param {Array<{title:string,hook:string,date:string,slug:string}>} articles
 * @returns {string} complete HTML document
 */
export function renderIndex(articles) {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const cards = sorted.map(renderCard).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kira Learn — Notes on the systems behind tools you use</title>
<meta name="description" content="Plain-English explainers on the systems behind tools you use, by Kira.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #08090a;
    color: #d0d6e0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: "cv01", "ss03";
    line-height: 1.6;
    min-height: 100vh;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 5rem 1.5rem; }
  header { margin-bottom: 4rem; }
  h1 {
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 600;
    color: #f7f8f8;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }
  .subtitle { color: #8a8f98; font-size: 1.05rem; }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .card {
    display: block;
    text-decoration: none;
    color: inherit;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.5rem;
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: rgba(94,106,210,0.4);
    background: rgba(255,255,255,0.04);
  }
  .card .date {
    font-size: 0.78rem;
    color: #8a8f98;
    font-variant-numeric: tabular-nums;
    margin-bottom: 0.75rem;
  }
  .card h2 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #f7f8f8;
    margin-bottom: 0.5rem;
    line-height: 1.35;
  }
  .card p {
    color: #8a8f98;
    font-size: 0.92rem;
    line-height: 1.5;
  }
  footer {
    margin-top: 6rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    color: #8a8f98;
    font-size: 0.88rem;
    display: flex;
    gap: 2rem;
  }
  footer a { color: #7170ff; text-decoration: none; }
  footer a:hover { color: #5e6ad2; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>Kira Learn</h1>
    <p class="subtitle">Plain-English notes on the systems behind tools you use.</p>
  </header>
  <main class="grid">
${cards}
  </main>
  <footer>
    <a href="/sharp">Sharp view →</a>
    <span>${articles.length} ${articles.length === 1 ? 'article' : 'articles'}</span>
  </footer>
</div>
</body>
</html>
`;
}

function renderCard({ title, hook, date, slug }) {
  return `    <a class="card" href="/articles/${escapeAttr(slug)}">
      <div class="date">${escapeHtml(formatDate(date))}</div>
      <h2>${escapeHtml(title)}</h2>
      ${hook ? `<p>${escapeHtml(hook)}</p>` : ''}
    </a>`;
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
