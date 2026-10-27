import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const inline = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
const logSource = html.slice(html.indexOf('function stamp()'), html.indexOf('const NODE_NAMES'));
const commandSource = html.slice(html.indexOf('function runCommand(raw)'), html.indexOf('termInput.addEventListener'));

function harness() {
  const htmlWrites = [];
  const document = {
    createElement(tag) {
      return {
        tag, className: '', children: [],
        appendChild(child) { this.children.push(child); },
        insertAdjacentHTML(position, value) { htmlWrites.push(String(value)); }
      };
    },
    createTextNode(value) { return { nodeType: 3, textContent: String(value) }; }
  };
  const syslog = {
    children: [], scrollHeight: 0, scrollTop: 0,
    appendChild(child) { this.children.push(child); },
    removeChild(child) { this.children.splice(this.children.indexOf(child), 1); },
    get firstChild() { return this.children[0]; }
  };
  const { log, escapeHtml } = new Function('document', 'syslog', logSource + ';return {log,escapeHtml};')(document, syslog);
  const state = { name: null, gems: [], visited: [], secrets: [], visits: 1, zion: false };
  const runCommand = new Function(
    'log', 'state', 'byCmd', 'saveState', 'whisperSoon', 'pick', 'HELP_TXT',
    'syslog', 'MODULES', '$', 'toggleDrone', 'openModule', 'escapeHtml',
    commandSource + ';return runCommand;'
  )(log, state, {}, () => {}, message => log(message, 'whisper'),
    values => values[0], 'HELP', syslog, [], () => ({ textContent: '432' }),
    () => {}, () => {}, escapeHtml);
  return { log, runCommand, state, htmlWrites, syslog };
}

test('inline application JavaScript parses', () => {
  assert.doesNotThrow(() => new Function(inline));
});

test('untrusted terminal output is text, not HTML', () => {
  const { log, htmlWrites, syslog } = harness();
  const payload = '<svg/onload=alert(1)>';
  log(payload, 'sys');
  assert.equal(htmlWrites.length, 0);
  assert.equal(syslog.children.at(-1).children[1].textContent, payload);
});

test('explicitly trusted terminal markup retains formatting', () => {
  const { log, htmlWrites } = harness();
  log('<span class="ok">READY</span>', 'ok', true);
  assert.deepEqual(htmlWrites, ['<span class="ok">READY</span>']);
});

test('NAME and WHOAMI escape HTML while keeping the visitor name', () => {
  const { runCommand, state, htmlWrites } = harness();
  const payload = '<svg/onload=alert(1)>';
  runCommand('NAME ' + payload);
  assert.equal(state.name, payload);
  runCommand('WHOAMI');
  assert.ok(htmlWrites.some(value => value.includes('&lt;svg')));
  assert.ok(htmlWrites.some(value => value.includes('&lt;SVG')));
  assert.ok(htmlWrites.every(value => !/<svg\b/i.test(value)));
});

test('greeting with a stored name uses a text node', () => {
  const { runCommand, state, syslog } = harness();
  state.name = '<img src=x onerror=alert(1)>';
  runCommand('hello');
  assert.match(syslog.children.at(-1).children[1].textContent, /<IMG/);
});

test('STATUS escapes values restored from local storage', () => {
  const { runCommand, state, htmlWrites } = harness();
  state.visits = '<svg/onload=alert(1)>';
  runCommand('STATUS');
  assert.ok(htmlWrites.at(-1).includes('&lt;svg'));
  assert.ok(!htmlWrites.at(-1).includes('<svg'));
});

test('HELP preserves line breaks in trusted markup', () => {
  const { runCommand, htmlWrites } = harness();
  runCommand('HELP');
  assert.ok(htmlWrites.at(-1).includes('HELP'));
});
