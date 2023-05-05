module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['@typescript-eslint', 'vue'],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    'standard-with-typescript',
    'eslint:recommended',
  ],
  overrides: [
  ],
  rules: {
    semi: 0,
    'comma-dangle': 0,
    'prefer-const': 0,
    'eol-last': 0,
    'no-unused-vars': 1,
    'space-before-function-paren': 1,
    quotes: 1,

    'vue/max-attributes-per-line': [1, {
      singleline: {
        max: 3
      },
      multiline: {
        max: 3
      }
    }],
    'vue/multi-word-component-names': 0,
    'vue/html-self-closing': 0,
    'vue/require-default-prop': 0,

    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/prefer-optional-chain': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/promise-function-async': 0,
    '@typescript-eslint/no-unused-vars': 1,

    'import/no-duplicates': 0,
  }
}
