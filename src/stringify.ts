/* eslint-disable unicorn/no-array-reduce */
import { prefix, suffix } from './shared.js';
import type { Wiki, WikiArrayItem, WikiMap } from './types.js';

const stringifyArray = (arr: WikiArrayItem[] | undefined) => {
  if (!arr) {
    return '';
  }
  return arr.reduce((pre, item) => `${pre}\n[${item.k ? `${item.k}|` : ''}${item.v ?? ''}]`, '');
};

export function stringify(wiki: Wiki): string {
  const type = wiki.type ? ' ' + wiki.type : '';

  const lines = [`${prefix}${type}`];

  for (const item of wiki.data) {
    if (item.array) {
      lines.push(`|${item.key} = {${stringifyArray(item.values)}\n}`);
      continue;
    }
    if (item.map) {
      lines.push(`|${item.key} = {`);
      for (const [key, value] of item.map.entries()) {
        lines.push(`  | ${value} = ${key}`);
      }
      lines.push('}');
      continue;
    }

    lines.push(`|${item.key} = ${item.value ?? ''}`);
  }

  lines.push(suffix);

  return lines.join('\n');
}

export function stringifyMap(wiki: WikiMap): string {
  const body = [...wiki.data]
    .map(([_key, item]) => {
      if (item.array) {
        return `|${item.key} = {${stringifyArray(item.values)}\n}`;
      }

      return `|${item.key} = ${item.value ?? ''}`;
    })
    .join('\n');

  const type = wiki.type ? ' ' + wiki.type : '';

  return `${prefix}${type}\n${body}\n${suffix}`;
}
