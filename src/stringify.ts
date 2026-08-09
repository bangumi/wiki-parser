import { prefix, suffix } from './shared.js';
import type { Wiki, WikiArrayItem, WikiMap } from './types.js';

const stringifyArray = (array: WikiArrayItem[] | undefined) => {
  if (!array) {
    return '';
  }
  return array.reduce((pre, item) => `${pre}\n[${item.k ? `${item.k}|` : ''}${item.v ?? ''}]`, '');
};

export function stringify(wiki: Wiki): string {
  const body = wiki.data.reduce((pre, item) => {
    if (item.array) {
      return `${pre}\n|${item.key} = {${stringifyArray(item.values)}\n}`;
    }
    return `${pre}\n|${item.key} = ${item.value ?? ''}`;
  }, '');

  const type = wiki.type ? ' ' + wiki.type : '';

  return `${prefix}${type}${body}\n${suffix}`;
}

export function stringifyMap(wiki: WikiMap): string {
  const body = [...wiki.data]
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `|${key} = ${value ?? ''}`;
      }

      return `|${key} = {${stringifyArray(value)}\n}`;
    })
    .join('\n');

  const type = wiki.type ? ' ' + wiki.type : '';

  return `${prefix}${type}\n${body}\n${suffix}`;
}
