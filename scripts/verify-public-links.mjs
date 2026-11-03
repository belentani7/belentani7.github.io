import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const destinations = new Map([
  ["JUDAS", "https://judas-experience-v3.vercel.app/"],
  ["MANOS", "https://myopenhands.vercel.app/"],
  ["CV", "https://belentani-cv-ai.vercel.app/"],
  ["DUCK", "https://heyduck.vercel.app/"],
  ["OMEGA", "https://belentani.es/"],
]);
const lines = html.split(/\r?\n/);
for (const [command, url] of destinations) {
  assert.ok(
    lines.some((line) => line.includes('cmd: "' + command + '"') && line.includes('url: "' + url + '"')),
    command + " must open the verified application URL, not an obsolete repository",
  );
}
for (const old of [
  "https://github.com/belentani7/judas-experience",
  "https://github.com/belentani7/ManosAbiertas",
  "https://github.com/belentani7/Belentani.cv-ai",
  "https://github.com/belentani7/duck-2026",
  "http://belentani.es/",
]) {
  assert.ok(!html.includes(old), "Outdated or insecure public link: " + old);
}
assert.ok(html.includes('<link rel="canonical" href="https://belentani.es/">'));
assert.ok(html.includes('href="https://judas-experience-v3.vercel.app/"'));
assert.ok(html.includes('href="https://myopenhands.vercel.app/"'));
console.log("Portal link contracts OK:", destinations.size, "module destinations and public footer links");
