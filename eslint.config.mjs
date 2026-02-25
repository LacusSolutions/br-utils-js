import anyConfig from 'eslint-config-any';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**'],
  },
  ...anyConfig.sharedNodeAndBrowser.slice(1),
]);
