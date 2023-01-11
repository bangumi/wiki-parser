import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import yaml from 'js-yaml';
import { describe, test, expect } from 'vitest';

import parse, { stringify } from '../src';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const testsDir = path.resolve(__dirname, 'wiki-syntax-spec/tests/');

const validTestDir = path.resolve(testsDir, 'valid');
const invalidTestDir = path.resolve(testsDir, 'invalid');

const validTestFiles = fs.readdirSync(validTestDir);
const inValidTestFiles = fs.readdirSync(invalidTestDir);

describe('Wiki syntax parser expected to be valid', () => {
  for (const file of validTestFiles) {
    const [prefix, suffix] = file.split('.');
    if (suffix !== 'wiki') {
      continue;
    }

    if (!prefix) {
      throw new Error('BUG: undefined file path prefix');
    }

    test(`${prefix} should be valid`, () => {
      const testFilePath = path.resolve(validTestDir, file);
      const expectedFilePath = path.resolve(validTestDir, `${prefix}.yaml`);

      const testContent = fs.readFileSync(testFilePath, 'utf8');
      const expectedContent = fs.readFileSync(expectedFilePath, 'utf8');

      const result = parse(testContent);
      const expected = yaml.load(expectedContent);

      expect(result).toEqual(expected);
    });
  }
});

describe('Wiki syntax parser expected to be inValid', () => {
  for (const file of inValidTestFiles) {
    const prefix = file.split('.')[0];
    if (!prefix) {
      throw new Error('BUG: undefined file path prefix');
    }

    test(`${prefix} should be invalid`, () => {
      const testFilePath = path.resolve(invalidTestDir, file);
      const testContent = fs.readFileSync(testFilePath, 'utf8');

      expect(() => parse(testContent)).toThrowError();
    });
  }
});

describe('Wiki stringify', () => {
  for (const file of validTestFiles) {
    const [prefix, suffix] = file.split('.');
    if (suffix !== 'wiki') {
      continue;
    }

    if (!prefix) {
      throw new Error('BUG: undefined file path prefix');
    }

    test(`${prefix} should stringify correct`, () => {
      const testFilePath = path.resolve(validTestDir, file);
      const expectedFilePath = path.resolve(validTestDir, `${prefix}.yaml`);

      const testContent = fs.readFileSync(testFilePath, 'utf8');
      const expectedContent = fs.readFileSync(expectedFilePath, 'utf8');
      const wiki = parse(testContent);
      const res = stringify(wiki);

      const result = parse(res);
      const expected = yaml.load(expectedContent);

      expect(result).toEqual(expected);
    });
  }
});
