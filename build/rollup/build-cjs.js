import typeScriptPlugin from '@rollup/plugin-typescript';
import { FixDtsDefaultCjsExportsPlugin as fixDtsDefaultCjsExportsPlugin } from 'fix-dts-default-cjs-exports/rollup';
import { defineConfig } from 'rollup';
import declarationsPlugin from 'rollup-plugin-dts';

/**
 * @param {Object} buildParams
 * @param {string} buildParams.banner
 * @param {string} buildParams.entryPoint
 * @param {'default' | 'named'} buildParams.exportType
 * @param {string[]} buildParams.externalDependencies
 */
export function makeCommonJSRollupConfig({ banner, entryPoint, exportType, externalDependencies }) {
  if (!banner || !entryPoint || !exportType) {
    throw new Error('Missing build params in CJS `makeRollupConfig`.');
  }

  return defineConfig([
    {
      input: entryPoint,
      output: {
        file: 'dist/index.cjs',
        format: 'cjs',
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
        file: 'dist/index.d.cts',
        format: 'es',
        banner,
      },
      plugins: [declarationsPlugin(), fixDtsDefaultCjsExportsPlugin()],
    },
  ]);
}
