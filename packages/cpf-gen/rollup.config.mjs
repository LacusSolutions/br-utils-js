import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cpf-gen',
  distFileName: 'cpf-gen',
  globalName: 'cpfGen',
  packageMeta,
});
