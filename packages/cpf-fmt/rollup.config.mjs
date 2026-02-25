import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-fmt',
  creationYear: 2021,
  cjsEntryPoint: 'src/index.cjs.ts',
  esmEntryPoint: 'src/index.esm.ts',
  umdEntryPoint: 'src/index.umd.ts',
  umdGlobalName: 'cpfFmt',
  umdDistFileName: 'cpf-fmt',
  packageMeta,
});
