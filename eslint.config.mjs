import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginTsDoc from 'eslint-plugin-tsdoc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default tsEslint.config(
  { ignores: ['dist/**'] },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  ...tsEslint.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginUnicorn.configs['flat/recommended'],
  {
    rules: {
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
    },
  },
  {
    plugins: {
      tsdoc: eslintPluginTsDoc,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
  },
  {
    rules: {
      'unused-imports/no-unused-imports': 'error',
      curly: ['error'],
      'tsdoc/syntax': 'error',
      'no-new-object': 'error',
      'no-console': 'error',
      'no-new-wrappers': 'error',
      '@typescript-eslint/quotes': 'off',
      'n/no-missing-import': 'off',
      'linebreak-style': ['error', 'unix'],
      'array-element-newline': ['error', 'consistent'],
      'array-bracket-newline': ['error', 'consistent'],
      '@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: false }],
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
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-restricted-syntax': [
        'error',
        // ban just non-const enums
        {
          selector: 'TSEnumDeclaration:not([const=true])',
          message: "use 'const enum'",
        },
      ],
    },
  },
  eslintConfigPrettier,
);
