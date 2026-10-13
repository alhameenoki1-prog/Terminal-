#!/usr/bin/env node
/**
 * Minimal, dependency-free renderer for the Handlebars subset used by the
 * document-notification templates. Supports:
 *   {{var}}                  HTML-escaped (html mode) or raw (text mode)
 *   {{nl2br var}}            escaped, newlines become <br> (html) / kept (text)
 *   {{#if var}} ... {{else}} ... {{/if}}   nested, truthiness = non-empty value
 *
 * Usage:
 *   node render.mjs <template> <data.json> [--text] > output
 *
 * It exists so the template can be previewed and its fallbacks exercised without
 * a backend. In production, use the real Handlebars library (or your provider's
 * engine) with escaping ON. Anything this script rejects, Handlebars would also
 * treat as a template error, so keep the template inside this subset.
 */
import { readFileSync } from 'node:fs';

const [,, templatePath, dataPath, ...flags] = process.argv;
if (!templatePath || !dataPath) {
  console.error('usage: node render.mjs <template> <data.json> [--text]');
  process.exit(2);
}
const textMode = flags.includes('--text');
const template = readFileSync(templatePath, 'utf8');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/=/g, '&#x3D;');

const truthy = (v) => !(v === undefined || v === null || v === false || v === '' || v === 0);

// Tokenise into text and tag tokens.
const tokens = [];
const re = /{{\s*(#if\s+([\w.]+)|else|\/if|nl2br\s+([\w.]+)|([\w.]+))\s*}}/g;
let last = 0, m;
while ((m = re.exec(template))) {
  if (m.index > last) tokens.push({ t: 'text', v: template.slice(last, m.index) });
  if (m[1].startsWith('#if')) tokens.push({ t: 'if', v: m[2] });
  else if (m[1] === 'else') tokens.push({ t: 'else' });
  else if (m[1] === '/if') tokens.push({ t: 'endif' });
  else if (m[3]) tokens.push({ t: 'nl2br', v: m[3] });
  else tokens.push({ t: 'var', v: m[4] });
  last = re.lastIndex;
}
if (last < template.length) tokens.push({ t: 'text', v: template.slice(last) });

// Handlebars "standalone" rule: a block tag alone on its line (only whitespace
// around it) removes the whole line, so block tags never leave blank lines behind.
for (let i = 0; i < tokens.length; i++) {
  if (!['if', 'else', 'endif'].includes(tokens[i].t)) continue;
  const prev = tokens[i - 1], next = tokens[i + 1];
  const prevOk = !prev ? true : (prev.t === 'text' && /(^|\n)[ \t]*$/.test(prev.v));
  const nextOk = !next ? true : (next.t === 'text' && /^[ \t]*(\r?\n|$)/.test(next.v));
  if (!prevOk || !nextOk) continue;
  if (prev) prev.v = prev.v.replace(/[ \t]*$/, '');
  if (next) next.v = next.v.replace(/^[ \t]*(\r?\n)?/, '');
}

// Reject anything that looks like a tag we did not parse (e.g. triple-stash).
const leftover = template.replace(re, '').match(/{{[^]*?}}|{{{|}}}/);
if (leftover) { console.error('Unsupported template expression:', leftover[0]); process.exit(1); }

let pos = 0;
function renderBlock(stopAt) {
  let out = '';
  while (pos < tokens.length) {
    const tok = tokens[pos];
    if (stopAt.includes(tok.t)) return out;
    pos++;
    if (tok.t === 'text') out += tok.v;
    else if (tok.t === 'var') {
      const v = data[tok.v];
      if (v === undefined) missing.add(tok.v);
      out += v == null ? '' : (textMode ? String(v) : escapeHtml(v));
    } else if (tok.t === 'nl2br') {
      const v = data[tok.v] == null ? '' : String(data[tok.v]);
      out += textMode ? v : escapeHtml(v).replace(/\r?\n/g, '<br>');
    } else if (tok.t === 'if') {
      const cond = truthy(data[tok.v]);
      const yes = renderBlock(['else', 'endif']);
      let no = '';
      if (tokens[pos]?.t === 'else') { pos++; no = renderBlock(['endif']); }
      if (tokens[pos]?.t !== 'endif') { console.error('Unclosed {{#if ' + tok.v + '}}'); process.exit(1); }
      pos++;
      out += cond ? yes : no;
    } else { console.error('Unexpected ' + tok.t); process.exit(1); }
  }
  return out;
}
const missing = new Set();
const output = renderBlock([]);
if (pos !== tokens.length) { console.error('Stray {{else}} or {{/if}}'); process.exit(1); }
if (missing.size) console.error('warning: undefined variables rendered as empty: ' + [...missing].join(', '));
process.stdout.write(output);
