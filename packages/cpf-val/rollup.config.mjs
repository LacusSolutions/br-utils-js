import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-val',
  creationYear: 2021,
  cjsEntryPoint: 'src/index.cjs.ts',
  esmEntryPoint: 'src/index.esm.ts',
  umdEntryPoint: 'src/index.umd.ts',
  umdGlobalName: 'cpfVal',
  umdDistFileName: 'cpf-val',
  packageMeta,
});
