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

test('renderIndex renders the live study console shell', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /Mapping the agentic systems stack/);
  assert.match(html, /A public study console for AI agents, orchestration, systems design, and the architecture patterns behind the tools\./);
  assert.match(html, /Open current map/);
  assert.match(html, /Read latest note/);
  assert.match(html, /Current question/);
  assert.match(html, /When does agent orchestration become product architecture\?/);
});

test('renderIndex renders system map labels', () => {
  const html = renderIndex(sampleArticles);
  for (const label of ['Agent loops', 'Orchestration', 'Tool protocols', 'Memory', 'Evaluation', 'Product systems']) {
    assert.ok(html.includes(label), `missing map label: ${label}`);
  }
});

test('renderIndex renders learning and research sections', () => {
  const html = renderIndex(sampleArticles);
  for (const label of ['Current mapping', 'Learning paths', 'Article clusters', 'Evolving diagrams', 'Notes index']) {
    assert.ok(html.includes(label), `missing section: ${label}`);
  }
});

test('renderIndex latest note CTA links to newest article', () => {
  const html = renderIndex(sampleArticles);
  assert.match(html, /href="\/articles\/how-dns-works"[^>]*>Read latest note/);
});

test('renderIndex escapes HTML in title and hook', () => {
  const articles = [{ title: '<script>alert(1)</script>', hook: 'a & b', date: '2026-05-01', slug: 'xss' }];
  const html = renderIndex(articles);
  assert.ok(!html.includes('<script>alert(1)</script>'), 'raw script tag should be escaped');
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /a &amp; b/);
});
