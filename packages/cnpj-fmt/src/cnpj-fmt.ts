import { CnpjFormatter } from './cnpj-formatter';
import type { CnpjFormatterOptionsInput, CnpjInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CnpjFormatter} class.
 *
 * Formats a CNPJ string according to the given options. With no options,
 * returns the traditional CNPJ format (e.g. `12.345.678/0009-10`). Invalid
 * input or length is handled by the configured `onFail` callback instead of
 * throwing.
 *
 * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type.
 * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart` or
 *   `hiddenEnd` are out of valid range.
 * @see CnpjFormatter for detailed option descriptions.
 */
export function cnpjFmt(cnpjInput: CnpjInput, options?: CnpjFormatterOptionsInput): string {
  return new CnpjFormatter(options).format(cnpjInput);
}
