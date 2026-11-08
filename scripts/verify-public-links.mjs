import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * Contract for the module destinations published from this origin.
 *
 * The landing page replaced the old terminal palette, so the destinations are
 * plain anchors now — but the guarantee is the same one that commit
 * "fix(portal): connect JUDAS, Manos, CV and DUCK to live apps" introduced:
 * every module must open its verified application URL, and no obsolete
 * repository or insecure origin may leak back into the page.
 */
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const destinations = new Map([
  ["JUDAS", "https://judas-experience-v3.vercel.app/"],
  ["MANOS", "https://myopenhands.vercel.app/"],
  ["CV", "https://belentani-cv-ai.vercel.app/"],
  ["DUCK", "https://heyduck.vercel.app/"],
  ["OMEGA", "https://belentani.es/"],
]);
const section = html.slice(html.indexOf('id="modulos"'), html.indexOf("</section>", html.indexOf('id="modulos"')));
assert.ok(section.length > 0, "the landing page must publish a modules section");

for (const [command, url] of destinations) {
  assert.ok(
    section.includes('href="' + url + '"'),
    command + " must open the verified application URL, not an obsolete repository",
  );
  assert.ok(
    new RegExp('class="mod-id">' + command + '<').test(section),
    command + " must be labelled in the modules section",
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
