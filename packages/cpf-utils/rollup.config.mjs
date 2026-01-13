import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cpf-utils',
  creationYear: 2020,
  cjsExports: 'named',
  cjsEntryPoint: 'src/module.ts',
  esmEntryPoint: 'src/module.ts',
  umdEntryPoint: 'src/dist.ts',
  umdGlobalName: 'cpfUtils',
  umdDistFileName: 'cpf-utils',
  packageMeta,
});
