import { cnpjGen as baseCnpjGen } from './cnpj-gen';
import { CnpjGenerator as BaseCnpjGenerator } from './cnpj-generator';
import {
  CnpjGeneratorOptions as BaseCnpjGeneratorOptions,
  CNPJ_LENGTH as BaseCnpjLength,
  CNPJ_PREFIX_MAX_LENGTH as BaseCnpjPrefixMaxLength,
} from './cnpj-generator-options';
import {
  CnpjGeneratorException as BaseCnpjGeneratorException,
  CnpjGeneratorOptionPrefixInvalidException as BaseCnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionsTypeError as BaseCnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionTypeInvalidException as BaseCnpjGeneratorOptionTypeInvalidException,
  CnpjGeneratorTypeError as BaseCnpjGeneratorTypeError,
} from './exceptions';
import type {
  CnpjGeneratorOptionsInput as BaseCnpjGeneratorOptionsInput,
  CnpjGeneratorOptionsType as BaseCnpjGeneratorOptionsType,
  CnpjType as BaseCnpjType,
} from './types';

function cnpjGen(options?: BaseCnpjGeneratorOptionsInput): string {
  return baseCnpjGen(options);
}

namespace cnpjGen {
  // Runtime values (re-exported with original names)
  export const CNPJ_LENGTH = BaseCnpjLength;
  export const CNPJ_PREFIX_MAX_LENGTH = BaseCnpjPrefixMaxLength;
  export const CnpjGenerator = BaseCnpjGenerator;
  export const CnpjGeneratorOptions = BaseCnpjGeneratorOptions;
  export const CnpjGeneratorTypeError = BaseCnpjGeneratorTypeError;
  export const CnpjGeneratorOptionsTypeError = BaseCnpjGeneratorOptionsTypeError;
  export const CnpjGeneratorException = BaseCnpjGeneratorException;
  export const CnpjGeneratorOptionPrefixInvalidException =
    BaseCnpjGeneratorOptionPrefixInvalidException;
  export const CnpjGeneratorOptionTypeInvalidException =
    BaseCnpjGeneratorOptionTypeInvalidException;

  // Type aliases
  export type CnpjType = BaseCnpjType;
  export type CnpjGeneratorOptionsInput = BaseCnpjGeneratorOptionsInput;
  export type CnpjGeneratorOptionsType = BaseCnpjGeneratorOptionsType;
}

export default cnpjGen;
