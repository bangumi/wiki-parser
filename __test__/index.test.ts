import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import yaml from 'js-yaml';
import { describe, test, expect } from 'vitest';

import { parse, parse2, parseToMap, stringify, WikiArrayItem } from '../src/index.js';
import { stringifyMap } from '../src/stringify.js';

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

      const [error] = parse2(testContent);

      expect(error).not.toBe(null);
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
  const expected = {
    type: '',
    data: new Map([['A', [new WikiArrayItem(undefined, 'b'), new WikiArrayItem(undefined, 'c')]]]),
  };

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

    expect(parsed).toMatchInlineSnapshot(`
      {
        "data": Map {
          "A" => [
            WikiArrayItem {
              "k": "1",
              "v": "b",
            },
            WikiArrayItem {
              "k": undefined,
              "v": "c",
            },
            WikiArrayItem {
              "k": "2",
              "v": "b",
            },
          ],
          "c" => "e",
          "q" => "",
        },
        "type": "",
      }
    `);
    expect(stringifyMap(parsed)).toMatchInlineSnapshot(`
      "{{Infobox
      |A = {
      [1|b]
      [c]
      [2|b]
      }
      |c = e
      |q = 
      }}"
    `);
  });
});

test('should throw syntax error', () => {
  expect(() => parse(`{{`)).toThrowErrorMatchingInlineSnapshot(
    `[Error: WikiSyntaxError: missing prefix '{{Infobox' at the start, line 1]`,
  );
  expect(() => parse(`\n{{`)).toThrowErrorMatchingInlineSnapshot(
    `[Error: WikiSyntaxError: missing prefix '{{Infobox' at the start, line 2]`,
  );
  expect(() => parse('{{Infobox  \n\n\n')).toThrowErrorMatchingInlineSnapshot(
    `[Error: WikiSyntaxError: missing suffix '}}' at the end, line 4]`,
  );
  expect(() => parse(`{{Infobox  \n 1 \n\n\n\n`)).toThrowErrorMatchingInlineSnapshot(
    `[Error: WikiSyntaxError: missing suffix '}}' at the end, line 6]`,
  );
});
