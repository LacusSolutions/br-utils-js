import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-fmt',
  creationYear: 2021,
  umdGlobalName: 'CnpjFmt',
  umdDistFileName: 'cnpj-fmt',
  packageMeta,
});
