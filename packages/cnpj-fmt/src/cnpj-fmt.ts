import { CnpjFormatter } from './cnpj-formatter';
import type { CnpjFormatterOptionsInput, CnpjInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CnpjFormatter} class.
 *
 * Formats a CNPJ string according to the given options. With no options, returns
 * the traditional CNPJ format (e.g. `91.415.732/0007-93`). Invalid input or
 * length is handled by the configured `onFail` callback instead of throwing.
 *
 * @param {CnpjInput} cnpjInput - CNPJ as a string or array of strings (e.g. raw
 *   digits or preformatted). Arrays are joined with no separator before
 *   processing.
 * @param {CnpjFormatterOptionsInput} [options] - Optional formatting options
 *   (delimiters, masking, HTML escape, URL encode, `onFail` callback).
 * @returns {string}
 */
export function cnpjFmt(cnpjInput: CnpjInput, options?: CnpjFormatterOptionsInput): string {
  return new CnpjFormatter(options).format(cnpjInput);
}
