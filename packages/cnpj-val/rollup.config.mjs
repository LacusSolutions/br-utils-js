import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-val',
  creationYear: 2021,
  esmExports: 'named',
  umdGlobalName: 'cnpjVal',
  umdDistFileName: 'cnpj-val',
  packageMeta,
});
