import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-gen',
  creationYear: 2021,
  esmExports: 'named',
  umdGlobalName: 'cpfGen',
  umdDistFileName: 'cpf-gen',
  packageMeta,
});
