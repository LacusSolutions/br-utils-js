import { makeRollupConfig } from '../../build/rollup/config.mjs';
import packageMeta from './package.json' with { type: 'json' };

export default makeRollupConfig({
  bannerTitle: 'Lacus Solutions :: cnpj-utils',
  creationYear: 2020,
  cjsExports: 'named',
  cjsEntryPoint: 'src/module.ts',
  esmEntryPoint: 'src/module.ts',
  esmExports: 'named',
  umdEntryPoint: 'src/dist.ts',
  umdGlobalName: 'cnpjUtils',
  umdDistFileName: 'cnpj-utils',
  packageMeta,
});
