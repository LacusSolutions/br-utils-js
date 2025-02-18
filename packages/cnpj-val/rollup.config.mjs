import { makeRollupConfig } from '../../rollup.config.mjs'
import packageMeta from './package.json' with { type: 'json' }

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cnpj-val',
  distFileName: 'cnpj-val',
  globalName: 'cnpjVal',
  packageMeta,
})
