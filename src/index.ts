import {
  ArrayItemWrappedError,
  ArrayNoCloseError,
  ExpectingNewFieldError,
  ExpectingSignEqualError,
  GlobalPrefixError,
  GlobalSuffixError,
  WikiSyntaxError,
} from './error';
import { prefix, suffix } from './shared';
import type { Wiki, WikiItemType, WikiMap } from './types';
import { WikiArrayItem, WikiItem } from './types';

export * from './types';
export * from './error';
export { stringify } from './stringify';

/** 解析 wiki 文本，以 `Map` 类型返回解析结果。 会合并重复出现的 key */
export function parseToMap(s: string): WikiMap {
  const w = parse(s);

  const data = new Map<string, WikiItem>();

  for (let item of w.data) {
    const previous = data.get(item.key);
    if (!previous) {
      data.set(item.key, item);
      continue;
    }

    previous.push(item);
  }

  return { type: w.type, data };
}

export function parse(s: string): Wiki {
  const wiki: Wiki = {
    type: '',
    data: [],
  };

  const strTrim = s.trim().replace(/\r\n/g, '\n');

  if (strTrim === '') {
    return wiki;
  }

  if (!strTrim.startsWith(prefix)) {
    throw new WikiSyntaxError(null, null, GlobalPrefixError);
  }
  if (!strTrim.endsWith(suffix)) {
    throw new WikiSyntaxError(null, null, GlobalSuffixError);
  }

  const arr = strTrim.split('\n');
  if (arr[0]) {
    wiki.type = parseType(arr[0]);
  }

  /* split content between {{Infobox xxx and }} */
  const fields = arr.slice(1, -1);

  let inArray = false;
  for (let i = 0; i < fields.length; ++i) {
    const line = fields[i]?.trim();
    const lino = i + 2;

    if (!line) {
      continue;
    }
    /* new field */
    if (line.startsWith('|')) {
      if (inArray) {
        throw new WikiSyntaxError(lino, line, ArrayNoCloseError);
      }
      const meta = parseNewField(lino, line);
      inArray = meta[2] === 'array';
      const field = new WikiItem(...meta);
      wiki.data.push(field);
      /* is Array item */
    } else if (inArray) {
      if (line.startsWith('}')) {
        inArray = false;
        continue;
      }
      if (i === fields.length - 1) {
        throw new WikiSyntaxError(lino, line, ArrayNoCloseError);
      }
      wiki.data[wiki.data.length - 1]?.values?.push(
        new WikiArrayItem(...parseArrayItem(lino, line)),
      );
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
  const str = line.slice(1);
  const index = str.indexOf('=');

  if (index === -1) {
    throw new WikiSyntaxError(lino, line, ExpectingSignEqualError);
  }

  const key = str.slice(0, index).trim();
  const value = str.slice(index + 1).trim();
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
