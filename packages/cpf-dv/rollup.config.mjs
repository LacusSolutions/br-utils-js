import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-dv',
  creationYear: 2026,
  umdGlobalName: 'CpfCheckDigits',
  umdDistFileName: 'cpf-dv',
  packageMeta,
});
