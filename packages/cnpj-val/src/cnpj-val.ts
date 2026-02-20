import { CnpjValidator } from './cnpj-validator';
import type { CnpjInput, CnpjValidatorOptionsInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CnpjValidator} class.
 *
 * If no options are provided, it validates a CNPJ string or array of strings
 * using default settings. If options are provided, they control case
 * sensitivity and the type of characters to be validated.
 *
 * @throws {CnpjValidatorInputTypeError} If the input is not a string or array
 *   of strings.
 * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
 * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is not
 *   one of the allowed values.
 * @see CnpjValidator for detailed option descriptions.
 */
export function cnpjVal(cnpjInput: CnpjInput, options?: CnpjValidatorOptionsInput): boolean {
  return new CnpjValidator(options).isValid(cnpjInput);
}
