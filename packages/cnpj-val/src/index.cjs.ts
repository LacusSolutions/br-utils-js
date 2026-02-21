import { cnpjVal as baseCnpjVal } from './cnpj-val';
import {
  CNPJ_LENGTH as baseCnpjLength,
  CnpjValidator as BaseCnpjValidator,
} from './cnpj-validator';
import { CnpjValidatorOptions as BaseCnpjValidatorOptions } from './cnpj-validator-options';
import {
  CnpjValidatorException as BaseCnpjValidatorException,
  CnpjValidatorInputTypeError as BaseCnpjValidatorInputTypeError,
  CnpjValidatorOptionsTypeError as BaseCnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException as BaseCnpjValidatorOptionTypeInvalidException,
  CnpjValidatorTypeError as BaseCnpjValidatorTypeError,
} from './exceptions';
import type {
  CnpjInput as BaseCnpjInput,
  CnpjType as BaseCnpjType,
  CnpjValidatorOptionsInput as BaseCnpjValidatorOptionsInput,
  CnpjValidatorOptionsType as BaseCnpjValidatorOptionsType,
  Nullable as BaseNullable,
} from './types';

function cnpjVal(cnpjInput: BaseCnpjInput, options?: BaseCnpjValidatorOptionsInput): boolean {
  return baseCnpjVal(cnpjInput, options);
}

namespace cnpjVal {
  // Runtime values (re-exported with original names)
  export const CNPJ_LENGTH = baseCnpjLength;
  export const CnpjValidator = BaseCnpjValidator;
  export const CnpjValidatorOptions = BaseCnpjValidatorOptions;
  export const CnpjValidatorTypeError = BaseCnpjValidatorTypeError;
  export const CnpjValidatorInputTypeError = BaseCnpjValidatorInputTypeError;
  export const CnpjValidatorOptionsTypeError = BaseCnpjValidatorOptionsTypeError;
  export const CnpjValidatorException = BaseCnpjValidatorException;
  export const CnpjValidatorOptionTypeInvalidException =
    BaseCnpjValidatorOptionTypeInvalidException;

  // Type aliases
  export type CnpjInput = BaseCnpjInput;
  export type CnpjType = BaseCnpjType;
  export type CnpjValidatorOptionsInput = BaseCnpjValidatorOptionsInput;
  export type CnpjValidatorOptionsType = BaseCnpjValidatorOptionsType;
  export type Nullable<T> = BaseNullable<T>;
}

export default cnpjVal;
