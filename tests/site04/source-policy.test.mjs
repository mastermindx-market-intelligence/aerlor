import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Source/configuration checks only: these do not establish deployed headers,
// provider configuration, product approval, or browser enforcement.
const read = path => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const vercel = JSON.parse(read('vercel.json'));
const manifest = JSON.parse(read('storefront-pages.json'));
const assuranceBranch = 'work/site/prelaunch-assurance-20261104';

function attributes(tag) {
  const result = new Map();
  // A slash adjoining an unquoted value is part of that value in HTML.
  const body = tag.replace(/^<\w+\b/, '').replace(/>$/, '');
  for (const match of body.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    const name = match[1].toLowerCase();
    assert.ok(!result.has(name), 'Duplicate attribute: ' + name);
    result.set(name, match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function assertNoIndex(value, label) {
  const directives = new Set(value.toLowerCase().split(/[\s,]+/).filter(Boolean));
  for (const required of ['noindex', 'nofollow']) {
    assert.ok(directives.has(required), label + ' must contain ' + required);
  }
  for (const conflicting of ['index', 'follow', 'all']) {
    assert.ok(!directives.has(conflicting), label + ' must not contain ' + conflicting);
  }
}

function policyHeaders(name) {
  const entries = (vercel.headers ?? []).flatMap(rule =>
    (rule.headers ?? []).filter(header => header.key.toLowerCase() === name.toLowerCase())
      .map(header => ({rule, value: header.value})),
  );
  assert.ok(entries.some(({rule}) => rule.source === '/(.*)' && !rule.has && !rule.missing),
    name + ' must have an unconditional catch-all rule');
  return entries;
}

test('this assurance branch alone is disabled in Vercel Git deployment configuration', () => {
  assert.deepEqual(vercel.git?.deploymentEnabled, {[assuranceBranch]: false},
    'Disable only this review branch; do not disable main, wildcard patterns, or other branches');
});

test('every storefront route declares noindex and nofollow in its HTML head', () => {
  assert.ok(manifest.pages.length > 1, 'Check the complete storefront manifest, not only the home page');
  for (const path of manifest.pages) {
    const html = read(path).replace(/<!--[\s\S]*?-->/g, '');
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head\s*>/i)?.[1];
    assert.ok(head, path + ' must have a head element');
    const markup = head.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
    const robots = [...markup.matchAll(/<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)]
      .map(([tag]) => attributes(tag))
      .filter(attrs => attrs.get('name')?.toLowerCase() === 'robots');
    assert.equal(robots.length, 1, path + ' must have one unambiguous robots meta element');
    assertNoIndex(robots[0].get('content') ?? '', path);
  }
});

test('Vercel config applies noindex headers globally without an indexing override', () => {
  for (const {rule, value} of policyHeaders('X-Robots-Tag')) {
    assertNoIndex(value, 'X-Robots-Tag at ' + rule.source);
  }
});

test('Vercel CSP blocks native form submission on every configured policy', () => {
  // R3 may use approved fetch-based adapters; form-action governs native forms.
  for (const {rule, value} of policyHeaders('Content-Security-Policy')) {
    const formActions = value.split(';').map(part => part.trim().split(/\s+/))
      .filter(([name]) => name.toLowerCase() === 'form-action');
    assert.equal(formActions.length, 1, rule.source + ' must define one form-action directive');
    assert.deepEqual(formActions[0].slice(1), ["'none'"],
      rule.source + ' must not allow native form destinations');
  }
});
