const path = require('path');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:n/recommended',
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'unicorn', 'tsdoc', 'unused-imports'],
  ignorePatterns: ['**/dist/*', 'lib/generated/**/*', 'coverage/**/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaVersion: 2022,
  },
  env: {
    browser: false,
    node: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    curly: ['error'],
    'tsdoc/syntax': 'error',
    'no-new-object': 'error',
    'no-console': 'error',
    'no-new-wrappers': 'error',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/better-regex': 'error',
    'unicorn/prefer-ternary': 'off',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/no-new-array': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-unnecessary-await': 'error',
    'unicorn/throw-new-error': 'error',
    'unicorn/no-useless-promise-resolve-reject': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-regexp-test': 'error',
    'unicorn/prefer-module': 'error',
    'unicorn/prefer-modern-math-apis': 'error',
    'unicorn/prefer-includes': 'error',
    quotes: 'off',
    '@typescript-eslint/quotes': 'off',
    'n/no-missing-import': 'off',
    'linebreak-style': ['error', 'unix'],
    indent: 'off',
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],
    '@typescript-eslint/restrict-plus-operands': ['error', { checkCompoundAssignments: true }],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      },
    ],
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@typescript-eslint/semi': ['error', 'always'],
    semi: ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'import/first': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      varsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
          // orderImportKind: 'asc', enable this after new version of eslint-plugin-import
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['index', 'sibling', 'parent'], 'object'],
      },
    ],
    'no-restricted-syntax': [
      'error',
      // ban just non-const enums
      {
        selector: 'TSEnumDeclaration:not([const=true])',
        message: 'use \'const enum\'',
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['tests/**/*', '*.test.ts'],
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['lib/rest/api/**/*'],
      rules: {
        'import/no-unused-modules': 'off',
      },
    },
  ],
};
