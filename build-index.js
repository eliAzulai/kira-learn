#!/usr/bin/env node
/**
 * Scan articles/, extract metadata, regenerate index.html and sharp.html.
 * Called by the /kira-learn skill after writing a new article.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractMetadata } from './lib/extract-metadata.js';
import { renderIndex } from './lib/render-index.js';
import { renderSharp } from './lib/render-sharp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, 'articles');
const OUT_INDEX = join(__dirname, 'index.html');
const OUT_SHARP = join(__dirname, 'sharp.html');

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

  await writeFile(OUT_INDEX, renderIndex(articles), 'utf-8');
  await writeFile(OUT_SHARP, renderSharp(articles), 'utf-8');

  console.log(`built index.html and sharp.html from ${articles.length} articles`);
}

main().catch((err) => {
  console.error('build-index.js failed:', err.message);
  process.exit(1);
});
