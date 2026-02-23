import { cpfGen as baseCpfGen } from './cpf-gen';
import { CpfGenerator as BaseCpfGenerator } from './cpf-generator';
import {
  CpfGeneratorOptions as BaseCpfGeneratorOptions,
  CPF_LENGTH as BaseCpfLength,
  CPF_PREFIX_MAX_LENGTH as BaseCpfPrefixMaxLength,
} from './cpf-generator-options';
import {
  CpfGeneratorException as BaseCpfGeneratorException,
  CpfGeneratorOptionPrefixInvalidException as BaseCpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorOptionsTypeError as BaseCpfGeneratorOptionsTypeError,
  CpfGeneratorTypeError as BaseCpfGeneratorTypeError,
} from './exceptions';
import type {
  CpfGeneratorOptionsInput as BaseCpfGeneratorOptionsInput,
  CpfGeneratorOptionsType as BaseCpfGeneratorOptionsType,
} from './types';

function cpfGen(options?: BaseCpfGeneratorOptionsInput): string {
  return baseCpfGen(options);
}

namespace cpfGen {
  // Runtime values (re-exported with original names)
  export const CPF_LENGTH = BaseCpfLength;
  export const CPF_PREFIX_MAX_LENGTH = BaseCpfPrefixMaxLength;
  export const CpfGenerator = BaseCpfGenerator;
  export const CpfGeneratorOptions = BaseCpfGeneratorOptions;
  export const CpfGeneratorTypeError = BaseCpfGeneratorTypeError;
  export const CpfGeneratorOptionsTypeError = BaseCpfGeneratorOptionsTypeError;
  export const CpfGeneratorException = BaseCpfGeneratorException;
  export const CpfGeneratorOptionPrefixInvalidException =
    BaseCpfGeneratorOptionPrefixInvalidException;

  // Type aliases
  export type CpfGeneratorOptionsInput = BaseCpfGeneratorOptionsInput;
  export type CpfGeneratorOptionsType = BaseCpfGeneratorOptionsType;
}

export default cpfGen;
