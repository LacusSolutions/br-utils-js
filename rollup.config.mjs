import babelPlugin from '@rollup/plugin-babel';
import commonJsPlugin from '@rollup/plugin-commonjs';
import nodeResolvePlugin from '@rollup/plugin-node-resolve';
import terserPlugin from '@rollup/plugin-terser';
import typeScriptPlugin from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import deletePlugin from 'rollup-plugin-delete';
import declarationsPlugin from 'rollup-plugin-dts';
import esBuildPlugin from 'rollup-plugin-esbuild';

/**
 * @param {Object} buildParams
 * @param {any} buildParams.packageMeta
 * @param {string} buildParams.bannerTitle
 * @param {string} [buildParams.cjsEntryPoint]
 * @param {'default' | 'named'} [buildParams.cjsExports]
 * @param {string} [buildParams.esmEntryPoint]
 * @param {'default' | 'named'} [buildParams.esmExports]
 * @param {string} buildParams.umdDistFileName
 * @param {string} [buildParams.umdEntryPoint]
 * @param {string} buildParams.umdGlobalName
 */
export function makeRollupConfig({
  bannerTitle,
  packageMeta: { author, license, version, ...packageMeta },
  creationYear,
  cjsEntryPoint = 'src/index.ts',
  cjsExports = 'default',
  esmEntryPoint = 'src/index.ts',
  esmExports = 'named',
  umdDistFileName,
  umdEntryPoint = 'src/index.ts',
  umdGlobalName,
}) {
  if (!bannerTitle || !creationYear || !umdGlobalName || !umdDistFileName) {
    throw new Error('Missing build params in `makeRollupConfig`.');
  }

  if (!author?.name || !license || !version) {
    throw new Error('Missing build params in `package.json`.');
  }

  const currentYear = new Date().getFullYear();
  const licenseCoveragePeriod =
    currentYear === creationYear ? currentYear : `${creationYear}-${currentYear}`;
  const bundleBanner = `/**
 * ${bannerTitle} v${version}
 *
 * @author ${author.name}.
 * @license ${license} - ${licenseCoveragePeriod}
 */
`;

  /** @type {import('rollup').RollupOptions} */
  const commonModulesOptions = {
    plugins: [
      nodeResolvePlugin(),
      commonJsPlugin(),
      esBuildPlugin({
        target: 'esnext',
      }),
    ],
    external: [
      ...Object.keys(packageMeta.dependencies || {}),
      ...Object.keys(packageMeta.devDependencies || {}),
      ...Object.keys(packageMeta.peerDependencies || {}),
    ],
  };

  return defineConfig([
    // UMD for legacy browsers
    {
      input: umdEntryPoint,
      output: [
        {
          name: umdGlobalName,
          file: `dist/${umdDistFileName}.js`,
          format: 'umd',
          sourcemap: 'inline',
          banner: bundleBanner,
        },
        {
          name: umdGlobalName,
          file: `dist/${umdDistFileName}.min.js`,
          format: 'umd',
          sourcemap: 'inline',
          banner: bundleBanner,
          plugins: [terserPlugin()],
        },
      ],
      plugins: [
        deletePlugin({
          targets: ['dist/*'],
        }),
        nodeResolvePlugin(),
        commonJsPlugin(),
        typeScriptPlugin(),
        babelPlugin({
          babelHelpers: 'bundled',
          presets: [['@babel/preset-env', { targets: '> 0.25%, not dead' }]],
          extensions: ['.ts', '.js'],
        }),
      ],
    },

    // CommonJS
    {
      input: cjsEntryPoint,
      output: [
        {
          file: 'dist/index.cjs',
          format: 'cjs',
          sourcemap: 'inline',
          exports: cjsExports,
        },
        {
          file: 'dist/index.mjs',
          format: 'es',
          sourcemap: 'inline',
          exports: esmExports,
        },
      ],
      ...commonModulesOptions,
    },

    // ES Module
    {
      input: esmEntryPoint,
      output: [
        {
          file: 'dist/index.mjs',
          format: 'es',
          sourcemap: 'inline',
          exports: esmExports,
        },
      ],
      ...commonModulesOptions,
    },

    // Types declaration
    {
      input: esmEntryPoint,
      output: {
        file: 'dist/index.d.ts',
        format: 'es',
        exports: esmExports,
      },
      plugins: [declarationsPlugin()],
    },
  ]);
}
