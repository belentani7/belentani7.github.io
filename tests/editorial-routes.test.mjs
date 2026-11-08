import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const load = (p) => readFile(new URL(p, root), 'utf8');

for (const path of ['artista/index.html', 'prensa/index.html']) {
  test(`${path} is a noindex redirect to belentani.es`, async () => {
    const html = await load(path);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<meta\s+http-equiv=["']refresh["'][^>]*url=["']https:\/\/belentani\.es\/?["']/i);
    assert.match(html, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i);
    assert.match(html, /<link\s+rel=["']canonical["'][^>]*href=["']https:\/\/belentani\.es\/?["']/i);
  });
}

test('redirect stubs carry no scripts or images', async () => {
  for (const path of ['artista/index.html', 'prensa/index.html']) {
    const html = await load(path);
    assert.doesNotMatch(html, /<script\b/i);
    assert.doesNotMatch(html, /<img\b/i);
    assert.doesNotMatch(html, /on(?:error|click|load)\s*=/i);
  }
});
