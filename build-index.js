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
const STATIC_ASSETS = ['favicon.svg', 'robots.txt'];

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
    await cp(join(__dirname, asset), join(DIST_DIR, asset));
  }

  await writeFile(join(DIST_DIR, 'index.html'), renderIndex(articles), 'utf-8');
  await writeFile(join(DIST_DIR, 'sharp.html'), renderSharp(articles), 'utf-8');

  console.log(`built dist/ from ${articles.length} articles`);
}

main().catch((err) => {
  console.error('build-index.js failed:', err.message);
  process.exit(1);
});
