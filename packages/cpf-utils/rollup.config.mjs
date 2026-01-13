import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-utils',
  creationYear: 2020,
  cjsExports: 'named',
  umdGlobalName: 'cpfUtils',
  umdDistFileName: 'cpf-utils',
  packageMeta,
});
