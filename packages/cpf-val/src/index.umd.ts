import { cpfVal as baseCpfVal } from './cpf-val';
import { CPF_LENGTH as baseCpfLength, CpfValidator as BaseCpfValidator } from './cpf-validator';
import {
  CpfValidatorException as BaseCpfValidatorException,
  CpfValidatorInputTypeError as BaseCpfValidatorInputTypeError,
  CpfValidatorTypeError as BaseCpfValidatorTypeError,
} from './exceptions';
import type { CpfInput as BaseCpfInput } from './types';

function cpfVal(cpfInput: BaseCpfInput): boolean {
  return baseCpfVal(cpfInput);
}

namespace cpfVal {
  // Runtime values (re-exported with original names)
  export const CPF_LENGTH = baseCpfLength;
  export const CpfValidator = BaseCpfValidator;
  export const CpfValidatorTypeError = BaseCpfValidatorTypeError;
  export const InputTypeError = BaseCpfValidatorInputTypeError;
  export const CpfValidatorException = BaseCpfValidatorException;

  // Type aliases
  export type CpfInput = BaseCpfInput;
}

export default cpfVal;
