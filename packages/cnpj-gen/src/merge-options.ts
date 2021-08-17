import mergeDeep from 'deepmerge'

export type ActualCnpjGeneratorOptions = {
  format: boolean
  prefix: string
}

export type CnpjGeneratorOptions = Partial<ActualCnpjGeneratorOptions>

const defaultOptions = {
  format: false,
  prefix: '',
}

/**
 * Merge custom options to the default ones.
 */
function mergeOptions(customOptions: CnpjGeneratorOptions = {}) {
  return mergeDeep(defaultOptions, customOptions) as ActualCnpjGeneratorOptions
}

export default mergeOptions
