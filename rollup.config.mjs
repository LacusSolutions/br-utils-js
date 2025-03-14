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
 * @param {string} buildParams.globalName
 * @param {string} buildParams.distFileName
 * @param {string} [buildParams.umdEntryPoint]
 * @param {string} [buildParams.modulesEntryPoint]
 * @param {'default' | 'named'} [buildParams.cjsExports]
 */
export function makeRollupConfig({
  modulesEntryPoint = 'src/index.ts',
  umdEntryPoint = 'src/index.ts',
  cjsExports = 'default',
  distFileName,
  bannerTitle,
  globalName,
  packageMeta: { author, license, version, ...packageMeta },
}) {
  if (!author || !license || !version) {
    throw new Error('Missing build params in `package.json`.');
  }

  const bundleBanner = `/**
 * ${bannerTitle} v${version}
 *
 * @author ${author}.
 * @license ${license} - 2021-${new Date().getFullYear()}
 */
`;

  return defineConfig([
    // UMD for legacy browsers
    {
      input: umdEntryPoint,
      output: [
        {
          name: globalName,
          file: `dist/${distFileName}.js`,
          format: 'umd',
          sourcemap: 'inline',
          banner: bundleBanner,
        },
        {
          name: globalName,
          file: `dist/${distFileName}.min.js`,
          format: 'umd',
          sourcemap: 'inline',
          banner: bundleBanner,
          plugins: [terserPlugin()],
        },
      ],
      plugins: [
        deletePlugin({
          targets: ['build/*', 'dist/*'],
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

    // CommonJS & ES Module
    {
      input: modulesEntryPoint,
      output: [
        {
          file: 'build/index.cjs.js',
          format: 'cjs',
          sourcemap: 'inline',
          exports: cjsExports,
          banner: bundleBanner,
        },
        {
          file: 'build/index.esm.js',
          format: 'es',
          sourcemap: 'inline',
          exports: 'named',
          banner: bundleBanner,
        },
      ],
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
    },

    // Types declarations files
    {
      input: modulesEntryPoint,
      output: {
        file: 'build/index.d.ts',
        format: 'es',
      },
      plugins: [declarationsPlugin()],
    },
  ]);
}
