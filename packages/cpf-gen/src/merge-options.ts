import mergeDeep from 'deepmerge';

export interface ActualCpfGeneratorOptions {
  format: boolean;
  prefix: string;
}

export type CpfGeneratorOptions = Partial<ActualCpfGeneratorOptions>;

const defaultOptions = {
  format: false,
  prefix: '',
};

/**
 * Merge custom options to the default ones.
 */
function mergeOptions(customOptions: CpfGeneratorOptions = {}): ActualCpfGeneratorOptions {
  return mergeDeep(defaultOptions, customOptions);
}

export default mergeOptions;
