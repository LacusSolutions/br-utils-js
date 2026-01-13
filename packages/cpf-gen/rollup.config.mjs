import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-gen',
  creationYear: 2020,
  umdGlobalName: 'cpfGen',
  umdDistFileName: 'cpf-gen',
  packageMeta,
});
