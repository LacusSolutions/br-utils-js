import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: br-utils',
  creationYear: 2025,
  umdGlobalName: 'brUtils',
  umdDistFileName: 'br-utils',
  packageMeta,
});
