import { makeRollupConfig } from '../../rollup.config.mjs'
import packageMeta from './package.json' with { type: 'json' }

export default makeRollupConfig({
  bannerTitle: 'LacusSoft :: cnpj-fmt',
  distFileName: 'cnpj-fmt',
  globalName: 'cnpjFmt',
  packageMeta,
})
