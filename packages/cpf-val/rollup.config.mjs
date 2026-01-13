import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-val',
  creationYear: 2020,
  umdGlobalName: 'cpfVal',
  umdDistFileName: 'cpf-val',
  packageMeta,
});
