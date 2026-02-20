import { CpfValidator } from './cpf-validator';
import type { CpfInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CpfValidator} class.
 *
 * @throws {CpfValidatorInputTypeError} If input is not string or string[].
 */
export function cpfVal(cpfInput: CpfInput): boolean {
  return new CpfValidator().isValid(cpfInput);
}
