import { defineConfig } from 'rollup';

import { makeCommonJSRollupConfig } from './build-cjs.js';
import { makeESModuleRollupConfig } from './build-esm.js';
import { makeUMDRollupConfig } from './build-umd.js';

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
  cjsEntryPoint = 'src/index.cjs.ts',
  cjsExports = 'default',
  esmEntryPoint = 'src/index.esm.ts',
  esmExports = 'auto',
  umdDistFileName,
  umdEntryPoint = 'src/index.umd.ts',
  umdGlobalName,
}) {
  if (!bannerTitle || !creationYear) {
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

  const externalDependencies = [
    ...Object.keys(packageMeta.dependencies || {}),
    ...Object.keys(packageMeta.devDependencies || {}),
    ...Object.keys(packageMeta.peerDependencies || {}),
  ];

  return defineConfig([
    ...makeUMDRollupConfig({
      banner: bundleBanner,
      entryPoint: umdEntryPoint,
      distFileName: umdDistFileName,
      globalName: umdGlobalName,
    }),
    ...makeCommonJSRollupConfig({
      banner: bundleBanner,
      entryPoint: cjsEntryPoint,
      exportType: cjsExports,
      externalDependencies,
    }),
    ...makeESModuleRollupConfig({
      banner: bundleBanner,
      entryPoint: esmEntryPoint,
      exportType: esmExports,
      externalDependencies,
    }),
  ]);
}
