import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderSharp } from '../lib/render-sharp.js';

const sampleArticles = [
  { title: 'How DNS Works', hook: 'Internet phonebook.', date: '2026-05-01', slug: 'how-dns-works' },
  { title: 'SSH Keys', hook: 'Login without passwords.', date: '2026-04-15', slug: 'ssh-keys' },
];

test('renderSharp returns a complete HTML document', () => {
  const html = renderSharp(sampleArticles);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<\/html>\s*$/);
});

test('renderSharp links to every article and back to /', () => {
  const html = renderSharp(sampleArticles);
  for (const article of sampleArticles) {
    assert.match(html, new RegExp(`href="/articles/${article.slug}"`));
  }
  assert.match(html, /href="\/"/);
});

test('renderSharp orders newest first', () => {
  const html = renderSharp(sampleArticles);
  assert.ok(html.indexOf('How DNS Works') < html.indexOf('SSH Keys'));
});

test('renderSharp escapes HTML in title and hook', () => {
  const articles = [{ title: '<x>', hook: 'a & b', date: '2026-05-01', slug: 's' }];
  const html = renderSharp(articles);
  assert.ok(!html.includes('<x>'));
  assert.match(html, /&lt;x&gt;/);
  assert.match(html, /a &amp; b/);
});
