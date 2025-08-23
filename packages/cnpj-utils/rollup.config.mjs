import { makeRollupConfig } from '../../rollup.config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  creationYear: 2021,
  umdEntryPoint: 'src/dist.ts',
  modulesEntryPoint: 'src/module.ts',
  bannerTitle: 'cnpj-utils',
  distFileName: 'cnpj-utils',
  globalName: 'cnpjUtils',
  cjsExports: 'named',
  packageMeta,
});
