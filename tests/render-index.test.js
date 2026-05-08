import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderIndex } from '../lib/render-index.js';

const sampleArticles = [
  { title: 'How DNS Works', hook: 'Internet phonebook.', date: '2026-05-01', slug: 'how-dns-works' },
  { title: 'SSH Keys', hook: 'Login without passwords.', date: '2026-04-15', slug: 'ssh-keys' },
  { title: 'Webhooks', hook: '', date: '2026-04-20', slug: 'webhooks' },
];

test('renderIndex returns a complete HTML document', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<\/html>\s*$/);
});

test('renderIndex includes site title', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /Kira Learn/);
});

test('renderIndex links to every article', () => {
  const html = renderIndex(sampleArticles);
  for (const article of sampleArticles) {
    assert.match(html, new RegExp(`href="/articles/${article.slug}"`));
    assert.ok(html.includes(article.title), `missing title: ${article.title}`);
  }
});

test('renderIndex orders articles newest first by date', () => {
  const html = renderIndex(sampleArticles);
  const dnsIdx = html.indexOf('How DNS Works');
  const webhooksIdx = html.indexOf('Webhooks');
  const sshIdx = html.indexOf('SSH Keys');
  assert.ok(dnsIdx < webhooksIdx, 'DNS (May) should appear before Webhooks (Apr 20)');
  assert.ok(webhooksIdx < sshIdx, 'Webhooks (Apr 20) should appear before SSH (Apr 15)');
});

test('renderIndex links to /sharp variant', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /href="\/sharp"/);
});

test('renderIndex escapes HTML in title and hook', () => {
  const articles = [{ title: '<script>alert(1)</script>', hook: 'a & b', date: '2026-05-01', slug: 'xss' }];
  const html = renderIndex(articles);
  assert.ok(!html.includes('<script>alert(1)</script>'), 'raw script tag should be escaped');
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /a &amp; b/);
});
