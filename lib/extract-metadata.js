/**
 * Extract article metadata from a raw HTML string.
 * Pure function — no I/O, no side effects.
 *
 * @param {object} params
 * @param {string} params.html - raw HTML file contents
 * @param {string} params.slug - filename without .html
 * @param {Date} params.mtime - file modification time (fallback for date)
 * @returns {{title: string, hook: string, date: string, slug: string}}
 */
export function extractMetadata({ html, slug, mtime }) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  const hookMatch = html.match(/<p\s+class=["']hook["']>([^<]*)<\/p>/i);
  const hook = hookMatch ? hookMatch[1].trim() : '';

  const metaMatch = html.match(/<meta\s+name=["']article:published["']\s+content=["']([^"']+)["']/i);
  const date = metaMatch ? metaMatch[1].trim() : toIsoDate(mtime);

  return { title, hook, date, slug };
}

function toIsoDate(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
