/* eslint-env node */
module.exports = {
  env: {
    'shared-node-browser': true,
    'es6': true,
    'jest': true,
  },
  extends: [
    'lacussoft',
    'lacussoft/typescript',
  ],
  ignorePatterns: [
    'build/',
    'dist/',
    '!.babelrc.js',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-magic-numbers': ['warn', { ignore: [0, 1, 2, 5, 8, 9, 10, 11, 12, 13, 14, 18, 25] }],
  },
}
