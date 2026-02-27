import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: utils',
  creationYear: 2026,
  umdGlobalName: 'lacusUtils',
  umdDistFileName: 'utils',
  packageMeta,
});
