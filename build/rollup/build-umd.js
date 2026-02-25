import babelPlugin from '@rollup/plugin-babel';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import terserPlugin from '@rollup/plugin-terser';
import typeScriptPlugin from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import deletePlugin from 'rollup-plugin-delete';

/**
 * @param {Object} buildParams
 * @param {string} buildParams.banner
 * @param {string} buildParams.entryPoint
 * @param {string} buildParams.distFileName
 * @param {string} buildParams.globalName
 */
export function makeUMDRollupConfig({ entryPoint, distFileName, banner, globalName }) {
  if (!entryPoint || !distFileName || !banner || !globalName) {
    throw new Error('Missing build params in UMD `makeRollupConfig`.');
  }

  return defineConfig([
    {
      input: entryPoint,
      output: [
        {
          file: `dist/${distFileName}.js`,
          format: 'umd',
          sourcemap: 'inline',
          name: globalName,
          banner,
        },
        {
          file: `dist/${distFileName}.min.js`,
          format: 'umd',
          sourcemap: 'hidden',
          name: globalName,
          banner,
          plugins: [terserPlugin()],
        },
      ],
      plugins: [
        deletePlugin({ targets: 'dist/' }),
        nodeResolvePlugin(),
        typeScriptPlugin(),
        babelPlugin({
          babelHelpers: 'bundled',
          extensions: ['.ts', '.js'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { ie: '11' },
                loose: true,
                modules: false,
              },
            ],
          ],
        }),
      ],
    },
  ]);
}
