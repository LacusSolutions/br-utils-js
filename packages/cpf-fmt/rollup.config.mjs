import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-fmt',
  creationYear: 2021,
  umdGlobalName: 'cpfFmt',
  umdDistFileName: 'cpf-fmt',
  packageMeta,
});
