#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const failures = [];

if (/\sonclick=/i.test(html)) {
  failures.push('Do not use inline onclick handlers in generated HTML.');
}

for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
  if (!/\salt=(["']).*?\1/i.test(match[1])) {
    failures.push(`Image missing alt text: ${match[0]}`);
  }
}

for (const match of html.matchAll(/<input\b([^>]*)>/gi)) {
  const attrs = match[1];
  if (!/\s(?:aria-label|aria-labelledby|id)=/i.test(attrs)) {
    failures.push(`Input missing accessible label hook: ${match[0]}`);
  }
}

for (const match of html.matchAll(/\srole=(["'])(.*?)\1/gi)) {
  const role = match[2];
  if (['button', 'link'].includes(role)) {
    failures.push(`Avoid redundant/misused interactive role="${role}" in generated HTML.`);
  }
}

for (const match of html.matchAll(/\sclass=(["'])(.*?)\1/gi)) {
  const classValue = match[2];
  if (/\[[^\]]+\]/.test(classValue)) {
    failures.push(`Arbitrary utility-style class is not allowed: ${classValue}`);
  }
}

const css = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)]
  .map((match) => match[1])
  .join('\n');
const declaredTokens = new Set([...css.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((match) => match[1]));
const usedTokens = new Set([...css.matchAll(/var\(--([a-z0-9-]+)\)/gi)].map((match) => match[1]));

for (const token of declaredTokens) {
  if (!usedTokens.has(token)) {
    failures.push(`Unused CSS token: --${token}`);
  }
}

for (const token of usedTokens) {
  if (!declaredTokens.has(token)) {
    failures.push(`CSS token used but not declared: --${token}`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('generated HTML quality checks passed');
