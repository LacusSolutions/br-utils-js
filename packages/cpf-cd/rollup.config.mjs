import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cpf-cd',
  distFileName: 'cpf-cd',
  globalName: 'CpfCheckDigits',
  cjsExports: 'named',
  packageMeta,
});
