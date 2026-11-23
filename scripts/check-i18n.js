/**
 * Checks that every complete locale has the same keys as the English source,
 * the same placeholders, linked messages and HTML tags, no empty value
 * (unless the source is empty),
 * and that every message compiles with the vue-i18n message compiler.
 *
 * Usage: node scripts/check-i18n.js
 */
const fs = require('fs');
const path = require('path');
const { baseCompile } = require('@intlify/message-compiler');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'core', 'plugins', 'i18n', 'locales');
const SOURCE = 'en';
const COMPLETE_LOCALES = ['fr', 'es', 'de', 'it'];

function flatten(obj, prefix = '', out = {}) {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object') {
      flatten(value, fullKey, out);
    } else {
      out[fullKey] = value;
    }
  });

  return out;
}

function load(locale) {
  return flatten(JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${locale}.json`), 'utf8')));
}

const placeholders = (value) => (value.match(/\{[^{}]*\}/g) || []).sort();
const linked = (value) => (value.match(/@[.:][\w.:]+/g) || []).sort();
const tags = (value) => (value.match(/<\/?[a-zA-Z][^>]*>/g) || []).map((tag) => tag.replace(/\s.*$/, '')).sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function compileErrors(value) {
  const errors = [];

  baseCompile(value, { onError: (error) => errors.push(error.message) });

  return errors;
}

const source = load(SOURCE);
const errors = [];

Object.entries(source).forEach(([key, value]) => {
  compileErrors(value).forEach((message) => errors.push(`[${SOURCE}] ${key}: ${message}`));
});

COMPLETE_LOCALES.forEach((locale) => {
  const target = load(locale);

  Object.keys(source).forEach((key) => {
    if (!(key in target)) {
      errors.push(`[${locale}] missing key: ${key}`);

      return;
    }

    const expected = source[key];
    const actual = target[key];

    if (typeof actual !== 'string' || (actual.trim() === '' && expected.trim() !== '')) {
      errors.push(`[${locale}] empty value: ${key}`);

      return;
    }

    if (!same(placeholders(expected), placeholders(actual))) {
      errors.push(`[${locale}] placeholders differ: ${key}`);
    }

    if (!same(linked(expected), linked(actual))) {
      errors.push(`[${locale}] linked messages differ: ${key}`);
    }

    if (!same(tags(expected), tags(actual))) {
      errors.push(`[${locale}] HTML tags differ: ${key}`);
    }

    if ((expected.match(/\|/g) || []).length !== (actual.match(/\|/g) || []).length) {
      errors.push(`[${locale}] plural forms differ: ${key}`);
    }

    compileErrors(actual).forEach((message) => errors.push(`[${locale}] ${key}: ${message}`));
  });

  Object.keys(target)
    .filter((key) => !(key in source))
    .forEach((key) => errors.push(`[${locale}] unknown key: ${key}`));
});

if (errors.length) {
  errors.forEach((error) => console.error(error));
  console.error(`\n${errors.length} i18n error(s) found.`);
  process.exit(1);
}

console.log(`i18n OK: ${Object.keys(source).length} keys checked for ${COMPLETE_LOCALES.join(', ')}.`);
