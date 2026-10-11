"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const biblia = require("../biblia.js");

const todos = biblia.categorias.flatMap((categoria) => categoria.terminos);
const ids = todos.map(([id]) => id);

test("el total publicado cuenta términos únicos y no apariciones duplicadas", () => {
  assert.equal(new Set(ids).size, biblia.meta.unicos);
  assert.equal(todos.length, biblia.meta.total);
  assert.equal(biblia.meta.apariciones, biblia.meta.total);
  assert.equal(biblia.meta.total - biblia.meta.unicos, biblia.meta.contextos);
  assert.ok(biblia.meta.total > 0);
});

test("todas las categorías y definiciones están completas", () => {
  assert.ok(biblia.categorias.length >= 20);
  for (const categoria of biblia.categorias) {
    assert.ok(categoria.id && categoria.nombre);
    assert.ok(categoria.terminos.length > 0, `Categoría vacía: ${categoria.nombre}`);
    for (const [id, nombre, definicion] of categoria.terminos) {
      assert.ok(id.trim(), `Sigla vacía en ${categoria.nombre}`);
      assert.ok(nombre.trim(), `Nombre completo vacío para ${id}`);
      assert.ok(definicion.trim(), `Definición vacía para ${id}`);
    }
  }
});

test("las definiciones ampliadas tienen los cuatro campos de referencia", () => {
  const deep = require("../biblia.deep.js");
  assert.ok(Object.keys(deep).length > 0);
  for (const [id, definicion] of Object.entries(deep)) {
    assert.ok(ids.includes(id), `Definición ampliada sin término visible: ${id}`);
    for (const campo of ["es", "porque", "matiz", "ejemplo"]) {
      assert.ok(definicion[campo]?.trim(), `Falta ${campo} en ${id}`);
    }
  }
});

test("las siglas ambiguas conservan una definición por contexto", () => {
  const porSigla = new Map();
  for (const [id, nombre, definicion] of todos) {
    if (!porSigla.has(id)) porSigla.set(id, []);
    porSigla.get(id).push({ nombre, definicion });
  }
  assert.ok(porSigla.get("MVP").some(({ nombre }) => nombre === "Minimum Viable Product"));
  assert.ok(porSigla.get("MVP").some(({ nombre }) => nombre === "Model-View-Presenter"));
  const dns = todos.find(([id]) => id === "DNS");
  const tcp = todos.find(([id]) => id === "TCP");
  const gr = todos.find(([id]) => id === "gRPC");
  assert.match(dns[1], /Domain Name System/);
  assert.match(tcp[1], /Transmission Control Protocol/);
  assert.match(tcp[2], /flujo de bytes ordenado/);
  assert.match(gr[1], /gRPC Remote Procedure Calls/);
});

test("las definiciones ampliadas más detalladas prevalecen sin cambiar el orden inicial", () => {
  const duplicado = todos.findIndex(([id]) => id === "Embedding");
  assert.notEqual(duplicado, -1);
  assert.ok(todos[duplicado][2].length > 50, "Embedding conserva una definición contextual, no la etiqueta inicial");
  assert.equal(biblia.meta.version, "4.0");
});
