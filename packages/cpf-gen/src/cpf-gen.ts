import { CpfGenerator } from './cpf-generator';
import type { CpfGeneratorOptionsInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CpfGenerator} class.
 *
 * If no options are provided, it generates an 11-digit unformatted numeric CPF
 * (e.g., `12345678901`) using default settings. If options are provided, they
 * control prefix and whether the result is formatted.
 *
 * @throws {CpfGeneratorOptionsTypeError} If any option has an invalid type.
 * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
 *   contains an invalid combination of digits.
 * @see CpfGenerator for detailed option descriptions.
 */
export function cpfGen(options?: CpfGeneratorOptionsInput): string {
  return new CpfGenerator(options).generate();
}
