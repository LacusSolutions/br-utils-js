import typeScriptPlugin from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import declarationsPlugin from 'rollup-plugin-dts';

/**
 * @param {Object} buildParams
 * @param {string} buildParams.banner
 * @param {string} buildParams.entryPoint
 * @param {'default' | 'named'} buildParams.exportType
 * @param {string[]} buildParams.externalDependencies
 */
export function makeESModuleRollupConfig({ banner, entryPoint, exportType, externalDependencies }) {
  if (!banner || !entryPoint || !exportType) {
    throw new Error('Missing build params in ESM `makeRollupConfig`.');
  }

  return defineConfig([
    {
      input: entryPoint,
      output: {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: 'inline',
        exports: exportType,
        banner,
      },
      plugins: [typeScriptPlugin()],
      external: externalDependencies,
    },
    {
      input: entryPoint,
      output: {
        file: 'dist/index.d.ts',
        format: 'es',
        banner,
      },
      plugins: [declarationsPlugin()],
    },
  ]);
}
