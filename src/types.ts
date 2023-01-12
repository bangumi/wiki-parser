export interface Wiki {
  type: string;
  data: WikiItem[];
}

export type WikiItemType = 'array' | 'object';

export class WikiArrayItem {
  k?: string;
  v?: string;
  readonly _key = Symbol();

  constructor(k?: string, v?: string) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.k = k || undefined;
    this.v = v;
  }
}

export class WikiItem {
  key?: string;
  value?: string;
  array?: boolean;
  values?: WikiArrayItem[];
  readonly _key = Symbol();

  constructor(key?: string, value?: string, type: WikiItemType = 'object') {
    this.key = key;
    switch (type) {
      case 'array': {
        this.array = true;
        this.values = [];
        break;
      }
      case 'object': {
        this.value = value;
        break;
      }
    }
  }
}
