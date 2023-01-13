import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import { describe, test, expect } from '@jest/globals';
import yaml from 'js-yaml';

import { parse, parseToMap, stringify, WikiArrayItem, WikiItem } from '../src';
import { stringifyMap } from '../src/stringify';

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

describe('parse map', () => {
  const item = new WikiItem('A', '', 'array');

  item.values = [new WikiArrayItem(undefined, 'b'), new WikiArrayItem(undefined, 'c')];

  const expected = { type: '', data: new Map([['A', item]]) };

  test('should merge keys', () => {
    const o = parseToMap(`{{Infobox
|A= b
| A=c
}}
`);

    expect(o).toEqual(expected);
  });

  test('should merge previous array keys', () => {
    const o = parseToMap(`{{Infobox
|A= {
[b]
}
| A=c
}}
`);

    expect(o).toEqual(expected);
  });

  test('should merge next array keys', () => {
    const parsed = parseToMap(`{{Infobox
|A= {
[1|b]
}
|c=e
| A=c
| A={
[2|b]
}
|q=
}}
`);

    expect(parsed).toMatchSnapshot();
    expect(stringifyMap(parsed)).toMatchSnapshot();
  });
});
