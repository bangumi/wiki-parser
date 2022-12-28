# 解析 bangumi 的 wiki 语法

https://github.com/bangumi/wiki-syntax-spec

## 安装

```shell
npm i @bgm38/wiki
```

## 使用

没有 cjs 导出，请使用 esm 导入。

```typescript
import parse from '@bgm38/wiki';
import { WikiSyntaxError } from '@bgm38/wiki';
import type { Wiki } from '@bgm38/wiki';

try {
  wiki('...');
} catch (error) {
  if (error instanceof WikiSyntaxError) {
    let l = '';
    if (error.line) {
      l = `line: ${error.line}`;
      if (error.lino) {
        l += `:${error.lino}`;
      }
    }

    if (l) {
      l = ' (' + l + ')';
    }

    console.log('bad wiki string', `${error.message}${l}`);
  }

  throw error;
}
```

## 测试

```shell
git clone --recursive https://github.com/bangumi/wiki-parser bangumi/wiki-parser
cd bangumi/wiki-parser
yarn
yarn test
```
