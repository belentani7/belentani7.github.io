"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const biblia = require("../biblia.js");
const deep = require("../biblia.deep.js");

const pagePath = path.join(__dirname, "..", "biblia", "index.html");
const html = fs.readFileSync(pagePath, "utf8");
const inlineScripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))
  .map((match) => match[1].trim())
  .filter(Boolean);

if (inlineScripts.length !== 1) throw new Error(`Se esperaba 1 script inline y se encontraron ${inlineScripts.length}`);

class Element {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.dataset = {};
    this.style = { cssText: "" };
    this.className = "";
    this.id = "";
    this.textContent = "";
    this.hidden = false;
    this.value = "";
    this._listeners = {};
    this._innerHTML = "";
    this.classList = {
      toggle: (name, force) => {
        const shouldAdd = force === undefined ? !this.className.split(/\s+/).includes(name) : Boolean(force);
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        if (shouldAdd) classes.add(name); else classes.delete(name);
        this.className = Array.from(classes).join(" ");
        return shouldAdd;
      },
    };
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this.children = [];
    const tags = this._innerHTML.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi);
    for (const match of tags) {
      const child = new Element(match[1]);
      const className = match[2].match(/class=["']([^"']+)["']/i);
      if (className) child.className = className[1];
      const id = match[2].match(/id=["']([^"']+)["']/i);
      if (id) child.id = id[1];
      this.appendChild(child);
    }
  }

  get innerHTML() { return this._innerHTML; }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    if (child.tagName === "SECTION" && this === doc) categories.push(child);
    return child;
  }

  addEventListener(type, callback) { (this._listeners[type] ||= []).push(callback); }
  dispatch(type) { for (const callback of this._listeners[type] || []) callback({ target: this }); }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (selector === "a" && child.tagName === "A") matches.push(child);
        if (selector === "span" && child.tagName === "SPAN") matches.push(child);
        if (selector === ".term:not([hidden])" && child.className === "term" && !child.hidden) matches.push(child);
        if (selector === "section.cat" && child.tagName === "SECTION" && child.className === "cat") matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }

  querySelector(selector) {
    if (selector === ".n") return this.querySelectorAll("span").find((node) => node.className === "n") || null;
    return this.querySelectorAll(selector)[0] || null;
  }
}

const elements = new Map();
const categories = [];
const index = new Element("ol");
const doc = new Element("div");
const documentElement = new Element("html");

for (const id of ["doc", "indice", "vacio", "edition", "cTerms", "cUnique", "cCats", "cDeep", "fTerms", "fDeep", "fPal", "nDup", "notaDedup", "q"]) {
  elements.set(id, new Element(id === "indice" ? "ol" : "div"));
}
elements.set("doc", doc);
elements.set("indice", index);

function findElement(node, id) {
  for (const child of node.children) {
    if (child.id === id) return child;
    const found = findElement(child, id);
    if (found) return found;
  }
  return null;
}

const document = {
  getElementById(id) { return elements.get(id) || findElement(doc, id); },
  createElement: (tagName) => new Element(tagName),
  querySelectorAll(selector) {
    if (selector === "section.cat") return categories;
    return doc.querySelectorAll(selector);
  },
  documentElement,
};
const window = {
  BIBLIA: biblia,
  BIBLIA_DEEP: deep,
  IntersectionObserver: class { observe() {} },
};

const immediateTimer = (callback) => { callback(); return 0; };
vm.runInNewContext(inlineScripts[0], { window, document, IntersectionObserver: window.IntersectionObserver, setTimeout: immediateTimer, clearTimeout: () => {} }, { filename: pagePath });

function dispatchSearch(term) {
  const input = elements.get("q");
  input.value = term;
  input.dispatch("input");
}

module.exports = { categories, dispatchSearch, elements, html, window };
