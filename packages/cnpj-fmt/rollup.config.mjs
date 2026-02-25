import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-fmt',
  creationYear: 2021,
  cjsEntryPoint: 'src/index.cjs.ts',
  esmEntryPoint: 'src/index.esm.ts',
  umdEntryPoint: 'src/index.umd.ts',
  umdGlobalName: 'cnpjFmt',
  umdDistFileName: 'cnpj-fmt',
  packageMeta,
});
