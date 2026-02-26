import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-dv',
  creationYear: 2026,
  umdGlobalName: 'CnpjCheckDigits',
  umdDistFileName: 'cnpj-dv',
  packageMeta,
});
