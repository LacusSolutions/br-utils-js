import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: br-utils',
  creationYear: 2025,
  cjsExports: 'named',
  cjsEntryPoint: 'src/module.ts',
  esmEntryPoint: 'src/module.ts',
  umdEntryPoint: 'src/dist.ts',
  umdGlobalName: 'brUtils',
  umdDistFileName: 'br-utils',
  packageMeta,
});
