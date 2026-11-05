import assert from 'node:assert/strict';

// A deliberately bounded scanner for this repository's authored HTML heads.
// It is not a sanitizer or a general HTML parser. Unsupported/malformed syntax
// fails the source audit rather than being repaired into apparent compliance.
// Read original spans only: deleting comments/raw text can synthesize new tags.
const space = character => character !== undefined && /[\t\n\f\r ]/.test(character);

function readTag(html, start) {
  const opening = /^<(\/?)([a-z][a-z0-9:-]*)/i.exec(html.slice(start));
  assert.ok(opening, 'Expected a complete HTML tag');
  const closing = opening[1] === '/';
  const name = opening[2].toLowerCase();
  const attrs = new Map();
  let cursor = start + opening[0].length;
  for (;;) {
    const separated = space(html[cursor]);
    while (space(html[cursor])) cursor++;
    if (html[cursor] === '>') return {name, attrs, closing, end: cursor + 1};
    if (html[cursor] === '/' && html[cursor + 1] === '>') {
      assert.ok(!closing, 'A closing tag cannot be self-closing');
      return {name, attrs, closing, selfClosing: true, end: cursor + 2};
    }
    assert.ok(!closing && separated, 'Malformed or unterminated tag: ' + name);
    const attribute = /^[^\t\n\f\r =/>"'<`\x00-\x1f]+/.exec(html.slice(cursor));
    assert.ok(attribute, 'Malformed attribute in ' + name);
    const key = attribute[0].toLowerCase();
    assert.ok(!attrs.has(key), 'Duplicate attribute: ' + key);
    cursor += attribute[0].length;
    const attributeEnd = cursor;
    while (space(html[cursor])) cursor++;
    let value = '';
    if (html[cursor] === '=') {
      cursor++;
      while (space(html[cursor])) cursor++;
      const quote = html[cursor];
      if (quote === '"' || quote === "'") {
        const end = html.indexOf(quote, cursor + 1);
        assert.ok(end >= 0, 'Unterminated quoted attribute');
        value = html.slice(cursor + 1, end);
        cursor = end + 1;
      } else {
        const unquoted = /^[^\t\n\f\r >"'<=`\x00-\x1f]+/.exec(html.slice(cursor));
        assert.ok(unquoted, 'Missing or malformed unquoted attribute value');
        value = unquoted[0];
        cursor += value.length;
      }
    } else {
      cursor = attributeEnd;
    }
    attrs.set(key, value);
  }
}

export function headMetaAttributes(html) {
  assert.ok(!html.includes('\0'), 'NUL is unsupported in authored HTML');
  let cursor = html.startsWith('\uFEFF') ? 1 : 0;
  let state = 'before-html';
  let doctype = false;
  const metas = [];
  while (cursor < html.length) {
    if (space(html[cursor])) { cursor++; continue; }
    if (html.startsWith('<!--', cursor)) {
      const end = html.indexOf('-->', cursor + 4);
      assert.ok(end >= 0, 'Unterminated comment');
      const content = html.slice(cursor + 4, end);
      assert.ok(!content.startsWith('>') && !content.startsWith('->') && !content.includes('--!>'),
        'Unsupported malformed comment');
      cursor = end + 3;
      continue;
    }
    const declaration = /^<!doctype\s+html\s*>/i.exec(html.slice(cursor));
    if (declaration) {
      assert.ok(state === 'before-html' && !doctype, 'Unexpected doctype');
      doctype = true;
      cursor += declaration[0].length;
      continue;
    }
    const tag = readTag(html, cursor);
    cursor = tag.end;
    if (state === 'before-html') {
      assert.ok(tag.name === 'html' && !tag.closing && !tag.selfClosing, 'Expected explicit html element');
      state = 'before-head';
      continue;
    }
    if (state === 'before-head') {
      assert.ok(tag.name === 'head' && !tag.closing && !tag.selfClosing, 'Expected explicit head element');
      state = 'in-head';
      continue;
    }
    if (tag.closing && tag.name === 'head') return metas;
    assert.ok(!tag.closing, 'Unexpected closing element in head: ' + tag.name);
    if (['meta', 'link', 'base'].includes(tag.name)) {
      if (tag.name === 'meta') {
        // Do not silently miss an encoded competing robots declaration.
        assert.ok(!(tag.attrs.get('name') ?? '').includes('&'), 'Encoded meta names are unsupported');
        if (tag.attrs.get('name')?.toLowerCase() === 'robots') {
          assert.ok(!(tag.attrs.get('content') ?? '').includes('&'), 'Encoded robots directives are unsupported');
        }
        metas.push(tag.attrs);
      }
      continue;
    }
    assert.ok(['title', 'script', 'style'].includes(tag.name), 'Unsupported element in head: ' + tag.name);
    assert.ok(!tag.selfClosing, 'Raw-text elements require an explicit closing tag');
    const close = new RegExp('</' + tag.name + '(?=[\\t\\n\\f\\r />])', 'ig');
    close.lastIndex = cursor;
    const match = close.exec(html);
    assert.ok(match, 'Unterminated head element: ' + tag.name);
    if (tag.name === 'script') {
      assert.ok(!html.slice(cursor, match.index).includes('<!--'), 'Escaped script states are unsupported');
    }
    const endTag = readTag(html, match.index);
    assert.ok(endTag.closing && endTag.name === tag.name, 'Invalid raw-text closing tag');
    cursor = endTag.end;
  }
  assert.fail('Expected explicit closing head element');
}

export function robotsDirectives(html) {
  const robots = headMetaAttributes(html).filter(attrs => attrs.get('name')?.toLowerCase() === 'robots');
  assert.equal(robots.length, 1, 'Expected one unambiguous robots meta element');
  return robots[0].get('content') ?? '';
}
