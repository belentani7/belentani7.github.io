import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const destinations = new Map([
  ["JUDAS", "https://www.belentani.es/judas"],
  ["MUSIC", "https://www.belentani.es/music"],
  ["AI LAB", "https://www.belentani.es/ai-lab"],
  ["ACADEMIA", "https://www.belentani.es/school"],
  ["ARCHIVE", "https://www.belentani.es/archive"],
]);
const sectionStart = html.indexOf('id="modulos"');
const sectionEnd = html.indexOf("</section>", sectionStart);
const section = html.slice(sectionStart, sectionEnd);
assert.ok(section.length > 0, "the platform door section must exist");

for (const [label, url] of destinations) {
  assert.ok(section.includes('href="' + url + '"'), label + " must open a real platform route");
  assert.ok(section.includes('class="module-id">' + label + "<"), label + " must be labelled");
}

assert.equal((html.match(/<!doctype html>/gi) || []).length, 1);
assert.equal((html.match(/<main\b/gi) || []).length, 1);
assert.equal((html.match(/<footer\b/gi) || []).length, 1);
assert.doesNotMatch(html, /<a\s*>/i);
assert.doesNotMatch(html, /Producto completo con hero shader|repo-superpowers-audit|repo-cursor-superpowers/i);
assert.ok(html.includes('<link rel="canonical" href="https://www.belentani.es/">'));
console.log("Platform portal links OK:", destinations.size);
