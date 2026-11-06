import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {robotsDirectives} from './head-policy.mjs';

// Source/configuration checks only: these do not establish deployed headers,
// provider configuration, product approval, or browser enforcement.
const read = path => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const vercel = JSON.parse(read('vercel.json'));
const manifest = JSON.parse(read('storefront-pages.json'));
const assuranceBranch = 'work/site/prelaunch-assurance-20261104';
const marketBranch = 'work/market/buying-routes-20261104';

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

test('only approved review branches are disabled in Vercel Git deployment configuration', () => {
  assert.deepEqual(vercel.git?.deploymentEnabled, {[assuranceBranch]: false, [marketBranch]: false},
    'Disable only the two approved review branches; do not disable main, wildcard patterns, or other branches');
});

test('every storefront route declares noindex and nofollow in its HTML head', () => {
  assert.ok(manifest.pages.length > 1, 'Check the complete storefront manifest, not only the home page');
  for (const path of manifest.pages) {
    assertNoIndex(robotsDirectives(read(path)), path);
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
