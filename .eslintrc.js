/* eslint-env node */

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'lacussoft',
  ],
  ignorePatterns: [
    'build/',
    'dist/',
    '**/*.d.ts',
    '!.babelrc.js',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-magic-numbers': ['warn', { ignore: [0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 18, 25] }],
    'semi': ['error', 'always'],
    'semi-style': ['error', 'last'],
  },
};
