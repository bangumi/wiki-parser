# 解析 bangumi 的 wiki 语法

[![](https://img.shields.io/npm/v/@bgm38/wiki)](https://npmjs.com/package/@bgm38/wiki)

https://github.com/bangumi/wiki-syntax-spec

## 安装

```shell
npm i @bgm38/wiki
```

## 使用

没有 cjs 导出，请使用 esm 导入。

```typescript
import type { Wiki } from '@bgm38/wiki';
import { parse, WikiSyntaxError } from '@bgm38/wiki';

try {
  let w: Wiki = parse('...');
} catch (error) {
  if (error instanceof WikiSyntaxError) {
    console.log('bad wiki string', `${error.message}`);
  }

  throw error;
}
```

## 开发

下载代码

```shell
git clone --recursive https://github.com/bangumi/wiki-parser bangumi/wiki-parser
cd bangumi/wiki-parser
```

### 安装依赖

```shell
pnpm i
```

### 测试

```shell
pnpm test
```
