import { CnpjGenerator } from './cnpj-generator';
import type { CnpjGeneratorOptionsInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CnpjGenerator} class.
 *
 * If no options are provided, it generates a 14-character unformatted
 * alphanumeric CNPJ (e.g., `AB123CDE000155`). using default settings. If
 * options are provided, they control prefix, type, and whether the result is
 * formatted.
 *
 * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
 * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
 *   contains an invalid combination of characters.
 * @throws {CnpjGeneratorOptionTypeInvalidException} If the `type` option is not
 *   one of the allowed values.
 * @see CnpjGenerator for detailed option descriptions.
 */
export function cnpjGen(options?: CnpjGeneratorOptionsInput): string {
  return new CnpjGenerator(options).generate();
}
