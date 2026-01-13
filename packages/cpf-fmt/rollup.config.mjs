import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-fmt',
  creationYear: 2020,
  umdGlobalName: 'cpfFmt',
  umdDistFileName: 'cpf-fmt',
  packageMeta,
});
