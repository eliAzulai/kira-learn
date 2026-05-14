#!/usr/bin/env node
/**
 * Scan articles/, extract metadata, write a deploy-ready dist/ tree.
 * Called by the /kira-learn skill after writing a new article, and by Vercel
 * via the buildCommand in vercel.json.
 */
import { readdir, readFile, writeFile, stat, mkdir, rm, cp } from 'node:fs/promises';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractMetadata } from './lib/extract-metadata.js';
import { renderIndex } from './lib/render-index.js';
import { renderSharp } from './lib/render-sharp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, 'articles');
const DIST_DIR = join(__dirname, 'dist');
const STATIC_ASSETS = ['favicon.svg', 'robots.txt', 'privacy.html', 'terms.html', 'assets/og-image.png'];
const BASE_URL = 'https://kiralearn.space';

function renderSitemap(articles) {
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/sharp`, priority: '0.6', changefreq: 'weekly' },
    { loc: `${BASE_URL}/privacy`, priority: '0.2', changefreq: 'yearly' },
    { loc: `${BASE_URL}/terms`, priority: '0.2', changefreq: 'yearly' },
  ];
  const articleUrls = articles.map((a) => ({
    loc: `${BASE_URL}/articles/${a.slug}`,
    lastmod: a.date,
    priority: '0.8',
    changefreq: 'monthly',
  }));
  const allUrls = [...staticUrls, ...articleUrls];
  const urlEntries = allUrls.map(({ loc, lastmod, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : `\n    <lastmod>${today}</lastmod>`}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

async function main() {
  const entries = await readdir(ARTICLES_DIR);
  const htmlFiles = entries.filter((f) => extname(f) === '.html');

  const articles = [];
  for (const filename of htmlFiles) {
    const path = join(ARTICLES_DIR, filename);
    try {
      const html = await readFile(path, 'utf-8');
      const fileStat = await stat(path);
      const slug = basename(filename, '.html');
      articles.push(extractMetadata({ html, slug, mtime: fileStat.mtime }));
    } catch (err) {
      console.warn(`warn: skipping ${filename}: ${err.message}`);
    }
  }

  // Rebuild dist/ from scratch so removed articles don't linger.
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });

  await cp(ARTICLES_DIR, join(DIST_DIR, 'articles'), { recursive: true });
  for (const asset of STATIC_ASSETS) {
    const target = join(DIST_DIR, asset);
    await mkdir(dirname(target), { recursive: true });
    await cp(join(__dirname, asset), target);
  }

  await writeFile(join(DIST_DIR, 'index.html'), renderIndex(articles), 'utf-8');
  await writeFile(join(DIST_DIR, 'sharp.html'), renderSharp(articles), 'utf-8');
  await writeFile(join(DIST_DIR, 'sitemap.xml'), renderSitemap(articles), 'utf-8');

  console.log(`built dist/ from ${articles.length} articles (sitemap: ${articles.length + 4} urls)`);
}

main().catch((err) => {
  console.error('build-index.js failed:', err.message);
  process.exit(1);
});
