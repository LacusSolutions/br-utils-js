import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cpf-val',
  distFileName: 'cpf-val',
  globalName: 'cpfVal',
  packageMeta,
});
