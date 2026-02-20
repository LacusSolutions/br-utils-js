import CpfCheckDigits from '@lacussoft/cpf-dv';

import { CpfValidatorInputTypeError } from './exceptions';
import type { CpfInput } from './types';

/**
 * The standard length of a CPF (Cadastro de Pessoa Física) identifier (11
 * digits).
 */
export const CPF_LENGTH = 11;

/**
 * Validator for CPF (Cadastro de Pessoa Física) identifiers. Validates CPF
 * strings according to the Brazilian CPF validation algorithm.
 */
export class CpfValidator {
  /**
   * Validates a CPF input.
   *
   * @throws {CpfValidatorInputTypeError} If input is not string or string[].
   */
  public isValid(cpfInput: CpfInput): boolean {
    const actualInput = cpfInput as unknown;
    const nonArrayInput = Array.isArray(actualInput) ? actualInput.join('') : actualInput;

    if (typeof nonArrayInput !== 'string') {
      throw new CpfValidatorInputTypeError(cpfInput, 'string or string[]');
    }

    const sanitizedCpf = nonArrayInput.replace(/\D/g, '');

    if (sanitizedCpf.length !== CPF_LENGTH) {
      return false;
    }

    try {
      const cpfCheckDigits = new CpfCheckDigits(sanitizedCpf);

      return sanitizedCpf === cpfCheckDigits.cpf;
    } catch {
      return false;
    }
  }
}

Object.freeze(CpfValidator);
