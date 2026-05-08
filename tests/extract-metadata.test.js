import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMetadata } from '../lib/extract-metadata.js';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = join(__dirname, 'fixtures');

test('extracts title, hook, and meta-published date when present', async () => {
  const path = join(fixtures, 'with-meta.html');
  const html = await readFile(path, 'utf-8');
  const fileStat = await stat(path);
  const meta = extractMetadata({ html, slug: 'how-dns-works', mtime: fileStat.mtime });

  assert.equal(meta.title, 'How DNS Works');
  assert.equal(meta.hook, "The internet's phone book, decoded.");
  assert.equal(meta.date, '2026-05-01');
  assert.equal(meta.slug, 'how-dns-works');
});

test('falls back to mtime when no meta-published tag', async () => {
  const path = join(fixtures, 'no-meta.html');
  const html = await readFile(path, 'utf-8');
  const mtime = new Date('2026-04-15T10:00:00Z');
  const meta = extractMetadata({ html, slug: 'ssh-keys', mtime });

  assert.equal(meta.title, 'SSH Keys');
  assert.equal(meta.hook, 'Login without typing passwords.');
  assert.equal(meta.date, '2026-04-15');
});

test('returns empty hook when no .hook paragraph present', async () => {
  const path = join(fixtures, 'missing-hook.html');
  const html = await readFile(path, 'utf-8');
  const mtime = new Date('2026-04-20T10:00:00Z');
  const meta = extractMetadata({ html, slug: 'webhooks', mtime });

  assert.equal(meta.title, 'Webhooks');
  assert.equal(meta.hook, '');
});
