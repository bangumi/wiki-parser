import {
  ArrayItemWrappedError,
  ArrayNoCloseError,
  ExpectingNewFieldError,
  ExpectingSignEqualError,
  GlobalPrefixError,
  GlobalSuffixError,
  WikiSyntaxError,
} from './error.js';
import { prefix, suffix } from './shared.js';
import type { Wiki, WikiItemType, WikiMap } from './types.js';
import { WikiArrayItem, WikiItem } from './types.js';

export * from './types.js';
export * from './error.js';
export { stringify, stringifyMap } from './stringify.js';

export function parseToMap2(s: string): [null, WikiMap] | [WikiSyntaxError, null] {
  try {
    return [null, parseToMap(s)];
  } catch (error) {
    if (error instanceof WikiSyntaxError) {
      return [error, null];
    }

    throw error;
  }
}

/** 解析 wiki 文本，以 `Map` 类型返回解析结果。 会合并重复出现的 key */
export function parseToMap(s: string): WikiMap {
  const w = parse(s);

  const data = new Map<string, string | WikiArrayItem[]>();

  for (const item of w.data) {
    let previous = data.get(item.key);
    if (previous) {
      if (typeof previous === 'string') {
        previous = [new WikiArrayItem(undefined, previous)];
      }
      if (item.array) {
        previous.push(...(item.values as WikiArrayItem[]));
      } else {
        previous.push(new WikiArrayItem(undefined, item.value));
      }
      data.set(item.key, previous);
      continue;
    }

    if (item.array) {
      data.set(item.key, item.values ?? []);
    } else {
      data.set(item.key, item.value as string);
    }
  }

  return { type: w.type, data };
}

function processInput(s: string): [string, number] {
  let offset = 2;
  s = s.replaceAll('\r\n', '\n');

  for (const char of s) {
    if (char === '\n') {
      offset++;
      continue;
    }

    if (char === ' ' || char === '\t') {
      continue;
    }

    return [s.trim(), offset];
  }

  return [s.trim(), offset];
}

export function parse2(s: string): [null, Wiki] | [WikiSyntaxError, null] {
  try {
    return [null, parse(s)];
  } catch (error) {
    if (error instanceof WikiSyntaxError) {
      return [error, null];
    }

    throw error;
  }
}

export function parse(s: string): Wiki {
  const wiki: Wiki = {
    type: '',
    data: [],
  };

  const [stringTrim, offset] = processInput(s);

  if (stringTrim === '') {
    return wiki;
  }

  if (!stringTrim.startsWith(prefix)) {
    throw new WikiSyntaxError(offset - 1, null, GlobalPrefixError);
  }

  if (!stringTrim.endsWith(suffix)) {
    throw new WikiSyntaxError((s.match(/\n/g)?.length ?? -2) + 1, null, GlobalSuffixError);
  }

  const array = stringTrim.split('\n');
  if (array[0]) {
    wiki.type = parseType(array[0]);
  }

  /* split content between {{Infobox xxx and }} */
  const fields = array.slice(1, -1);

  let isInArray = false;
  for (let index = 0; index < fields.length; ++index) {
    const line = fields[index]?.trim();

    if (!line) {
      continue;
    }
    const lino = offset + index;
    /* new field */
    if (line.startsWith('|')) {
      if (isInArray) {
        throw new WikiSyntaxError(lino, line, ArrayNoCloseError);
      }
      const meta = parseNewField(lino, line);
      isInArray = meta[2] === 'array';
      const field = new WikiItem(...meta);
      wiki.data.push(field);
      /* is Array item */
    } else if (isInArray) {
      if (line.startsWith('}')) {
        isInArray = false;
        continue;
      }
      if (index === fields.length - 1) {
        throw new WikiSyntaxError(lino, line, ArrayNoCloseError);
      }
      wiki.data.at(-1)?.values?.push(new WikiArrayItem(...parseArrayItem(lino, line)));
    } else {
      throw new WikiSyntaxError(lino, line, ExpectingNewFieldError);
    }
  }
  return wiki;
}

const parseType = (line: string): string => {
  if (!line.includes('}}')) {
    return line.slice(prefix.length).trim();
  }
  return line.slice(prefix.length, line.indexOf('}}')).trim();
};

const parseNewField = (lino: number, line: string): [string, string, WikiItemType] => {
  const content = line.slice(1);
  const index = content.indexOf('=');

  if (index === -1) {
    throw new WikiSyntaxError(lino, line, ExpectingSignEqualError);
  }

  const key = content.slice(0, index).trim();
  const value = content.slice(index + 1).trim();
  switch (value) {
    case '{': {
      return [key, '', 'array'];
    }
    default: {
      return [key, value, 'object'];
    }
  }
};

const parseArrayItem = (lino: number, line: string): [string, string] => {
  if (!line.startsWith('[') || !line.endsWith(']')) {
    throw new WikiSyntaxError(lino, line, ArrayItemWrappedError);
  }
  const content = line.slice(1, -1);
  const index = content.indexOf('|');
  if (index === -1) {
    return ['', content.trim()];
  }
  return [content.slice(0, index).trim(), content.slice(index + 1).trim()];
};
