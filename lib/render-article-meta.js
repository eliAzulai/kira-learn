/**
 * Inject AEO/SEO metadata into an article's <head>:
 *   - description, canonical, og/twitter cards
 *   - JSON-LD: Article + Person (author) + WebSite (publisher)
 *
 * Pure function — takes raw article HTML + metadata, returns enriched HTML.
 * Idempotent: if a marker comment is present, skips re-injection.
 */

const SITE_URL = 'https://kiralearn.space';
const OG_IMAGE = `${SITE_URL}/assets/og-image.png`;
const MARKER = '<!-- aeo-meta-injected -->';

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJson(value) {
  // JSON.stringify handles quotes and backslashes; we only need to escape </script>.
  return JSON.stringify(value).replace(/<\/script/gi, '<\\/script');
}

function buildMetaBlock({ title, hook, date, slug }) {
  const url = `${SITE_URL}/articles/${slug}`;
  const description = hook || `Article on Kira Learn — ${title}.`;
  const datePublished = date;
  const dateModified = date; // single date stored per article; same value safe to use for both

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: title,
        description,
        url,
        datePublished,
        dateModified,
        inLanguage: 'en',
        mainEntityOfPage: url,
        author: { '@id': `${SITE_URL}/#author` },
        publisher: { '@id': `${SITE_URL}/#website` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        image: OG_IMAGE,
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#author`,
        name: 'Eli Azulai',
        url: SITE_URL,
        sameAs: ['https://github.com/eliAzulai'],
        knowsAbout: ['AI agents', 'agentic systems', 'orchestration', 'systems design', 'LLMs'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Kira Learn',
        url: `${SITE_URL}/`,
      },
    ],
  };

  return `${MARKER}
<meta name="description" content="${escapeAttr(description)}">
<meta name="author" content="Eli Azulai">
<link rel="canonical" href="${url}">
<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(description)}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Kira Learn">
<meta property="article:published_time" content="${datePublished}">
<meta property="article:modified_time" content="${dateModified}">
<meta property="article:author" content="Eli Azulai">
<!-- Twitter card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeAttr(title)}">
<meta name="twitter:description" content="${escapeAttr(description)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<!-- Structured data -->
<script type="application/ld+json">
${escapeJson(jsonLd)}
</script>`;
}

/**
 * @param {string} html  - raw article HTML
 * @param {object} meta  - { title, hook, date, slug } from extractMetadata
 * @returns {string} enriched HTML
 */
export function enrichArticleHtml(html, meta) {
  if (html.includes(MARKER)) return html; // idempotent

  const block = buildMetaBlock(meta);

  // Inject after the existing <title>...</title> tag.
  const titleClose = /<\/title>/i;
  if (titleClose.test(html)) {
    return html.replace(titleClose, `</title>\n${block}`);
  }

  // Fallback: inject right after <head>.
  return html.replace(/<head>/i, `<head>\n${block}`);
}
