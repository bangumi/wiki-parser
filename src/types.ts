
export interface Wiki {
  type: string;
  data: WikiItem[];
}

export interface WikiMap {
  type: string;
  /** JS 的 map 会按照插入顺序排序 */
  data: Map<string, WikiItem>;
}

export type WikiItemType = 'array' | 'object' | 'nested';

export class WikiArrayItem {
  k?: string;
  v?: string;

  constructor(k?: string, v?: string) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.k = k || undefined;
    this.v = v;
  }
}

export class WikiItem {
  key: string;
  value?: string;
  array?: boolean;
  map?: Map<string, string>;
  values?: WikiArrayItem[];

  constructor(key: string, value: string | Map<string, string>, type: WikiItemType) {
    this.key = key;
    switch (type) {
      case 'array': {
        this.array = true;
        this.values = [];
        break;
      }
      case 'nested': {
        if (!(value instanceof Map)) {
          throw new TypeError('unexpected non map input as nested object');
        }

        this.map = value;
        break;
      }
      case 'object': {
        if (typeof value !== 'string') {
          throw new TypeError('unexpected non map input as nested object');
        }

        this.value = value;
        break;
      }
    }
  }

  private convertToArray() {
    if (this.array) {
      return;
    }

    this.array = true;
    this.values ??= [];

    this.values.push(new WikiArrayItem(undefined, this.value));
    this.value = undefined;
  }

  push(item: WikiItem) {
    this.convertToArray();

    if (item.array) {
      this.values?.push(...(item.values ?? []));
    } else {
      this.values?.push(new WikiArrayItem(undefined, item.value));
    }
  }
}
