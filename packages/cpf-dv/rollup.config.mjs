import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-dv',
  creationYear: 2026,
  cjsEntryPoint: 'src/index.cjs.ts',
  esmEntryPoint: 'src/index.esm.ts',
  umdEntryPoint: 'src/index.umd.ts',
  umdGlobalName: 'CpfCheckDigits',
  umdDistFileName: 'cpf-dv',
  packageMeta,
});
