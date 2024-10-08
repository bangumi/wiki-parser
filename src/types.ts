export interface Wiki {
  type: string;
  data: WikiItem[];
}

/** JS 的 map 会按照插入顺序排序 */
export interface WikiMap {
  type: string;
  data: Map<string, string | WikiArrayItem[]>;
}

export type WikiItemType = 'array' | 'object';

export class WikiArrayItem {
  k?: string;
  v?: string;

  constructor(k?: string, v?: string) {
    this.k = k || undefined;
    this.v = v;
  }
}

export class WikiItem {
  key: string;
  value?: string;
  array?: boolean;
  values?: WikiArrayItem[];

  constructor(key: string, value: string, type: WikiItemType) {
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
