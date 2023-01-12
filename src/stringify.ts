/* eslint-disable unicorn/no-array-reduce */
import { prefix, suffix } from './shared';
import type { Wiki, WikiArrayItem } from './types';

const stringifyArray = (arr: WikiArrayItem[] | undefined) => {
  if (!arr) {
    return '';
  }
  return arr.reduce((pre, item) => `${pre}\n[${item.k ? `${item.k}|` : ''}${item.v ?? ''}]`, '');
};

export function stringify(wiki: Wiki): string {
  const body = wiki.data.reduce((pre, item) => {
    if (item.key === undefined) {
      return pre;
    }
    if (item.array === true) {
      return `${pre}\n|${item.key} = {${stringifyArray(item.values)}\n}`;
    }
    return `${pre}\n|${item.key} = ${item.value ?? ''}`;
  }, '');
  return `${prefix} ${wiki.type}${body}\n${suffix}`;
}
