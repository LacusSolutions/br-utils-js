import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  umdEntryPoint: 'src/dist.ts',
  modulesEntryPoint: 'src/module.ts',
  bannerTitle: 'cpf-utils',
  distFileName: 'cpf-utils',
  globalName: 'cpfUtils',
  cjsExports: 'named',
  packageMeta,
});
