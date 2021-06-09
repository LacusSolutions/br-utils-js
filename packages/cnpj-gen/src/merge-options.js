
const DEFAULT_OPTIONS = {
  format: false,
  prefix: '',
};

/**
 * Merge custom options to the default ones.
 *
 * @param {CnpjGeneratorOptions} options
 * @return {CnpjGeneratorOptions}
 */
function mergeOptions(options) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

export default mergeOptions;
