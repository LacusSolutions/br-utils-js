import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-utils',
  creationYear: 2021,
  cjsExports: 'named',
  umdGlobalName: 'cnpjUtils',
  umdDistFileName: 'cnpj-utils',
  packageMeta,
});
