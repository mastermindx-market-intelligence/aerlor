import test from 'node:test';
import assert from 'node:assert/strict';
import {headMetaAttributes, robotsDirectives} from './head-policy.mjs';

const robots = '<meta name="robots" content="noindex,nofollow">';
const document = head => '<!doctype html><html lang="en"><head>' + head + '</head><body></body></html>';

for (const [name, markup] of [
  ['ordinary declaration', robots],
  ['uppercase and reordered attributes', '<META CONTENT="noindex,nofollow" NAME="ROBOTS"/>'],
  ['single-quoted values', "<meta name='robots' content='noindex,nofollow'>"],
  ['unquoted values', '<meta name=robots content=noindex,nofollow >'],
  ['boolean attributes before other attributes', '<link disabled rel="stylesheet" href="/style.css">' + robots],
  ['quoted greater-than and fake meta tag', '<link title=\'> <meta name="robots" content="index,follow">\'>' + robots],
  ['commented robots declarations', '<!--<meta name="robots" content="index,follow">-->' + robots],
  ['raw script containing fake robots and head close', '<script>const x = \'</head><meta name="robots" content="index,follow">\';</script>' + robots],
  ['raw style containing fake robots and head close', '<style>x::after { content: \'</head><meta name="robots">\'; }</style>' + robots],
  ['title containing tag-like text', '<title>Text </head><meta name="robots"></title>' + robots],
  ['raw close-tag prefix is not a closing tag', '<script>const x = "</scripture>";</script>' + robots],
]) {
  test('reads original spans: ' + name, () => {
    assert.equal(robotsDirectives(document(markup)), 'noindex,nofollow');
  });
}

test('ignores apparent heads in html attributes and comments', () => {
  const html = '<!--<head><meta name="robots" content="index"></head>--><html data-x=\'<head><meta name="robots" content="index">\'><head>' + robots + '</head>';
  assert.equal(robotsDirectives(html), 'noindex,nofollow');
});

test('does not read robots declarations after the explicit head', () => {
  assert.throws(() => robotsDirectives('<html><head></head><body>' + robots), /one unambiguous/);
});

test('a slash adjoining an unquoted value remains part of that value', () => {
  assert.equal(robotsDirectives(document('<meta name=robots content=noindex,nofollow/>')), 'noindex,nofollow/');
});

test('does not silently decode a competing meta name', () => {
  assert.throws(() => robotsDirectives(document(robots + '<meta name="rob&#111;ts" content="index">')), /Encoded meta names/);
});

test('keeps non-robots meta attributes intact', () => {
  const metas = headMetaAttributes(document('<meta charset="utf-8">' + robots));
  assert.equal(metas.length, 2);
  assert.equal(metas[0].get('charset'), 'utf-8');
});

for (const [name, html] of [
  ['comment-spliced fake tag', document('<me<!--x-->ta name="robots" content="noindex,nofollow">')],
  ['duplicate robots declaration', document(robots + robots)],
  ['duplicate attribute', document('<meta name="robots" NAME="description" content="noindex,nofollow">')],
  ['adjacent quoted attributes', document('<meta name="robots"content="noindex,nofollow">')],
  ['missing attribute value', document('<meta name="robots" content=>')],
  ['template insertion mode', document('<template>' + robots + '</template>')],
  ['noscript insertion mode', document('<noscript>' + robots + '</noscript>')],
  ['body markup before robots', document('<body>' + robots)],
  ['implicit head close through a div', document('<div>' + robots + '</div>')],
  ['text that implicitly closes the head', document('unexpected text' + robots)],
  ['unterminated comment', '<html><head><!-- ' + robots],
  ['early malformed comment close', document('<!--> ' + robots + ' -->')],
  ['alternate malformed comment close', document('<!-- --!>' + robots + '-->')],
  ['unterminated tag', '<html><head><meta name="robots"'],
  ['unterminated quote', '<html><head><meta name="robots" content="noindex,nofollow>'],
  ['unterminated raw-text element', '<html><head><script>' + robots + '</head>'],
  ['unimplemented escaped script state', document('<script><!--<script>text</script>--></script>' + robots)],
  ['self-closing script', document('<script/>' + robots)],
  ['encoded robots directives', document('<meta name="robots" content="noindex&#44;nofollow">')],
  ['missing html element', '<head>' + robots + '</head>'],
  ['missing closing head', '<html><head>' + robots],
  ['NUL replacement ambiguity', document('<meta name="rob\0ots" content="index">' + robots)],
]) {
  test('fails closed: ' + name, () => assert.throws(() => robotsDirectives(html)));
}
