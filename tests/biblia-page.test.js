"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const page = require("../scripts/extract-biblia-inline.js");

const allTerms = () => page.categories.flatMap((category) => category.querySelectorAll(".term:not([hidden])"));
const findTerm = (id) => page.categories.flatMap((category) => category.querySelectorAll(".term:not([hidden])")).find((term) => term.dataset.txt.startsWith(id.toLowerCase() + " "));

test("la interfaz genera una entrada visible por término en cada categoría y actualiza el índice", () => {
  assert.equal(page.categories.length, 23);
  assert.ok(allTerms().length > 1000);
  assert.equal(page.elements.get("cTerms").textContent, "1105");
  assert.equal(page.elements.get("cUnique").textContent, "953");
  assert.equal(page.elements.get("cCats").textContent, "23");
  assert.equal(page.elements.get("edition").textContent, "4.0");
  assert.ok(page.elements.get("indice").children.length === page.categories.length);
  assert.ok(findTerm("mvp"), "se conserva el MVP de producto");
});

test("la búsqueda encuentra el texto ampliado y no distingue acentos ni mayúsculas", () => {
  page.dispatchSearch("gobernanza");
  assert.ok(allTerms().some((term) => term.dataset.txt.includes("gobernanza")));
  assert.ok(Number(page.elements.get("fTerms").textContent.replace(/\./g, "")) > 0);
  assert.ok(page.categories.every((category) => category.hidden || category.querySelector(".term:not([hidden])")));

  page.dispatchSearch("ARQUITECTURA DE LA INFORMACIÓN");
  assert.ok(allTerms().some((term) => term.dataset.txt.includes("arquitectura de la informacion")));
  assert.equal(page.elements.get("vacio").hidden, true);
});

test("la búsqueda de MVP distingue contexto de producto y patrón arquitectónico", () => {
  page.dispatchSearch("MVP");
  const visible = allTerms().filter((term) => term.dataset.txt.startsWith("mvp "));
  assert.equal(visible.length, 3);
  assert.ok(visible.some((term) => term.dataset.txt.includes("model-view-presenter")));
  assert.ok(visible.some((term) => term.dataset.txt.includes("minimum viable product")));
});

test("una consulta sin resultados muestra el estado vacío y limpiar restaura el índice", () => {
  page.dispatchSearch("zxy-ningun-termino-real");
  assert.equal(allTerms().length, 0);
  assert.equal(page.elements.get("vacio").hidden, false);
  assert.ok(page.elements.get("indice").children.every((item) => item.hidden));

  page.dispatchSearch("");
  assert.equal(page.elements.get("vacio").hidden, true);
  assert.ok(allTerms().length > 1000);
  assert.ok(page.elements.get("indice").children.every((item) => !item.hidden));
});
