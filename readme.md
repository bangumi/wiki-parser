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
import { parse2, WikiSyntaxError } from '@bgm38/wiki';

const [error, w] = parse2('...');
if (error) {
  console.log('bad wiki string', `${error.message}`);
} else {
  console.log('wiki', w);
}
```

## 在用户脚本中使用（在 bangumi 组件中不起效）：

```javascript
// ==UserScript==
// @name        new user script
// @version     0.0.1
// @match       https://example.com/*
// @require     https://cdn.jsdelivr.net/npm/@bgm38/wiki@0.3.2
// ==/UserScript==

(() => {
  console.log(bangumiWikiParser.parse2('...'));
})();
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
