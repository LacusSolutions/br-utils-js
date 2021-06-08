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
    'no-magic-numbers': ['warn', { ignore: [0, 2, 5, 8, 11, 13, 14] }],
    'semi': ['error', 'always'],
    'semi-style': ['error', 'last'],
  },
};
