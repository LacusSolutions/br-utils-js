/* eslint-env node */
import * as path from 'path'
import { babel as babelPlugin } from '@rollup/plugin-babel'
import { terser as terserPlugin } from 'rollup-plugin-terser'
import nodeResolvePlugin from '@rollup/plugin-node-resolve'
import commonJsPlugin from '@rollup/plugin-commonjs'
import typeScriptPlugin from 'rollup-plugin-typescript2'
import declarationsPlugin from 'rollup-plugin-dts'
import deletePlugin from 'rollup-plugin-delete'
import packageMeta from './package.json'

const inputFileName = 'src/index.ts'
const bundleBanner = `/**
 * LacusSoft :: cnpj-fmt v${packageMeta.version}
 *
 * @author ${packageMeta.author}.
 * @license ${packageMeta.license} - ${new Date().getFullYear()}
 */
`

const commonPlugins = (browser = false) => [
  typeScriptPlugin(),
  commonJsPlugin({ extensions: ['.js', '.ts'] }),
  nodeResolvePlugin({ browser }),
  babelPlugin({
    babelHelpers: 'bundled',
    configFile: path.resolve(__dirname, '.babelrc.js'),
  }),
]

export default [
  { // UMD
    input: inputFileName,
    output: [
      {
        name: 'cnpjFmt',
        file: 'dist/cnpj-fmt.js',
        format: 'umd',
        sourcemap: 'inline',
        banner: bundleBanner,
      },
      {
        name: 'cnpjFmt',
        file: 'dist/cnpj-fmt.min.js',
        format: 'umd',
        sourcemap: 'inline',
        banner: bundleBanner,
        plugins: [
          terserPlugin(),
        ],
      },
    ],
    plugins: [
      deletePlugin({
        targets: ['dist/*', 'build/*'],
      }),
      ...commonPlugins(true),
    ],
  },
  { // CommonJS & ES Module
    input: inputFileName,
    output: [
      {
        file: 'build/index.cjs.js',
        format: 'cjs',
        sourcemap: 'inline',
        banner: bundleBanner,
        exports: 'default',
      },
      {
        file: 'build/index.esm.js',
        format: 'es',
        sourcemap: 'inline',
        banner: bundleBanner,
        exports: 'named',
      },
    ],
    external: [
      ...Object.keys(packageMeta.dependencies || {}),
      ...Object.keys(packageMeta.devDependencies || {}),
      ...Object.keys(packageMeta.peerDependencies || {}),
    ],
    plugins: commonPlugins(),
  },
  { // Types declarations files
    input: 'src/index.ts',
    output: [{ file: 'build/index.d.ts', format: 'es' }],
    plugins: [declarationsPlugin({})],
  },
]
