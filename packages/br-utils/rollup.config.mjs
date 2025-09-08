import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  creationYear: 2025,
  umdEntryPoint: 'src/dist.ts',
  modulesEntryPoint: 'src/module.ts',
  bannerTitle: 'br-utils',
  distFileName: 'br-utils',
  globalName: 'brUtils',
  cjsExports: 'named',
  packageMeta,
});
