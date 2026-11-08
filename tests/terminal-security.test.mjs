import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('inline application JavaScript parses', () => {
  const scripts = [...html.matchAll(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1]).filter((s) => s.trim());
  assert.ok(scripts.length > 0, 'expected at least one inline script');
  for (const s of scripts) assert.doesNotThrow(() => new Function(s));
});

test('page loads no third-party resources', () => {
  assert.doesNotMatch(html, /<script[^>]*src=["']https?:\/\//i);
  assert.doesNotMatch(html, /<link[^>]*rel=["']stylesheet["'][^>]*href=["']https?:\/\//i);
  assert.doesNotMatch(html, /<img[^>]*src=["']https?:\/\//i);
  assert.doesNotMatch(html, /@import|url\(\s*["']?https?:\/\//i);
});

test('page is indexable (no noindex)', () => {
  assert.doesNotMatch(html, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i);
});

test('canonical is an https URL, not a repository page', () => {
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  assert.ok(m, 'canonical link present');
  assert.match(m[1], /^https:\/\//i);
  assert.doesNotMatch(m[1], /github\.com\/belentani7/i);
});

test('no inline event handlers (reduced XSS surface)', () => {
  assert.doesNotMatch(html, /\son(?:error|click|load|mouseover|mouseout|submit)\s*=/i);
});

test('structured data block is valid JSON', () => {
  const m = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (m) assert.doesNotThrow(() => JSON.parse(m[1]));
});
