import { CnpjFormatter } from './cnpj-formatter';
import type { CnpjFormatterOptionsInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CnpjFormatter} class.
 *
 * Formats a CNPJ string according to the given options. With no options, returns
 * the traditional CNPJ format (e.g. `91.415.732/0007-93`). Invalid input or
 * length is handled by the configured `onFail` callback instead of throwing.
 *
 * @param {string} cnpjString - Raw or already formatted CNPJ (14 alphanumeric
 *   chars after sanitization).
 * @param {CnpjFormatterOptionsInput} [options] - Optional formatting options
 *   (delimiters, masking, HTML escape, URL encode, `onFail` callback).
 * @returns {string}
 */
export function cnpjFmt(cnpjString: string, options?: CnpjFormatterOptionsInput): string {
  return new CnpjFormatter(options).format(cnpjString);
}
