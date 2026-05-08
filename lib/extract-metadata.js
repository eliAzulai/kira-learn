/**
 * Extract the article:published date from meta tags,
 * handling either attribute order (name/content or content/name).
 *
 * @param {string} html - raw HTML file contents
 * @returns {string|null} - ISO date string or null if not found
 */
function extractPublishedMeta(html) {
  const metaTagRegex = /<meta\s+([^>]+?)\s*\/?>/gi;
  for (const tag of html.matchAll(metaTagRegex)) {
    const attrs = tag[1];
    if (/name=["']article:published["']/i.test(attrs)) {
      const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
      if (contentMatch) return contentMatch[1].trim();
    }
  }
  return null;
}

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

  const publishedDate = extractPublishedMeta(html);
  const date = publishedDate ?? toIsoDate(mtime);

  return { title, hook, date, slug };
}

function toIsoDate(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
