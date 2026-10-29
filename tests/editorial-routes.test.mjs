import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = new URL('../', import.meta.url);
const load = (path) => readFile(new URL(path, root), 'utf8');

for (const [path,canonical,required] of [
  ['artista/index.html','https://www.belentani.es/artista/','La música primero'],
  ['prensa/index.html','https://www.belentani.es/prensa/','Canales públicos'],
]) {
  test(path + ' is an accessible editorial page with a distinct canonical', async () => {
    const html = await load(path);
    assert.match(html, /<!doctype html>/i);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<main id="contenido">/);
    assert.match(html, /href="#contenido"/);
    assert.ok(html.includes('href="' + canonical + '"'));
    assert.ok(html.includes(required));
    assert.match(html, /href="\/editorial\.css"/);
    assert.match(html, /<nav\b[^>]*aria-label="Principal"/);
    assert.doesNotMatch(html, /<script\b|onerror=|onclick=/i);
    assert.doesNotMatch(html, /href="https?:\/\/[^"]+\/prensa"/i); // Internal press route is always local.
  });
}

test('the artist page uses an explicit image description and music destinations', async () => {
  const html = await load('artista/index.html');
  assert.match(html, /<img[^>]+alt="Retrato artístico de Belentani"/);
  assert.match(html, /open\.spotify\.com\/artist\//);
  assert.match(html, /href="\/prensa\/"/);
});

test('shared editorial CSS includes mobile and reduced-motion adaptations', async () => {
  const css = await load('editorial.css');
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /:focus-visible/);
});
