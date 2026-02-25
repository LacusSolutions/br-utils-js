import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-gen',
  creationYear: 2021,
  esmExports: 'named',
  umdGlobalName: 'cnpjGen',
  umdDistFileName: 'cnpj-gen',
  packageMeta,
});
