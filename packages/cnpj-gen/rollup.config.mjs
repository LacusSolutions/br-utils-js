import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-gen',
  creationYear: 2021,
  umdGlobalName: 'CnpjGen',
  umdDistFileName: 'cnpj-gen',
  packageMeta,
});
