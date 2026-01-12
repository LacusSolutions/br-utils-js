import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cpf-dv',
  distFileName: 'cpf-dv',
  globalName: 'CpfCheckDigits',
  cjsExports: 'named',
  packageMeta,
});
