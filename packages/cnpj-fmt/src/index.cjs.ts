import { cnpjFmt as baseCnpjFmt } from './cnpj-fmt';
import { CnpjFormatter as BaseCnpjFormatter } from './cnpj-formatter';
import {
  CnpjFormatterOptions as BaseCnpjFormatterOptions,
  CNPJ_LENGTH as BaseCnpjLength,
} from './cnpj-formatter-options';
import {
  CnpjFormatterException as BaseCnpjFormatterException,
  CnpjFormatterInputLengthException as BaseCnpjFormatterInputLengthException,
  CnpjFormatterInputTypeError as BaseCnpjFormatterInputTypeError,
  CnpjFormatterOptionsForbiddenKeyCharacterException as BaseCnpjFormatterOptionsForbiddenKeyCharacterException,
  CnpjFormatterOptionsHiddenRangeInvalidException as BaseCnpjFormatterOptionsHiddenRangeInvalidException,
  CnpjFormatterOptionsTypeError as BaseCnpjFormatterOptionsTypeError,
  CnpjFormatterTypeError as BaseCnpjFormatterTypeError,
} from './exceptions';
import type {
  CnpjFormatterOptionsInput as BaseCnpjFormatterOptionsInput,
  CnpjFormatterOptionsType as BaseCnpjFormatterOptionsType,
  CnpjInput as BaseCnpjInput,
  Nullable as BaseNullable,
  OnFailCallback as BaseOnFailCallback,
} from './types';

function cnpjFmt(cnpjString: string, options?: BaseCnpjFormatterOptionsInput): string {
  return baseCnpjFmt(cnpjString, options);
}

namespace cnpjFmt {
  // Runtime values (re-exported with original names)
  export const CNPJ_LENGTH = BaseCnpjLength;
  export const CnpjFormatter = BaseCnpjFormatter;
  export const CnpjFormatterOptions = BaseCnpjFormatterOptions;
  export const CnpjFormatterTypeError = BaseCnpjFormatterTypeError;
  export const CnpjFormatterInputTypeError = BaseCnpjFormatterInputTypeError;
  export const CnpjFormatterOptionsTypeError = BaseCnpjFormatterOptionsTypeError;
  export const CnpjFormatterException = BaseCnpjFormatterException;
  export const CnpjFormatterInputLengthException = BaseCnpjFormatterInputLengthException;
  export const CnpjFormatterOptionsHiddenRangeInvalidException =
    BaseCnpjFormatterOptionsHiddenRangeInvalidException;
  export const CnpjFormatterOptionsForbiddenKeyCharacterException =
    BaseCnpjFormatterOptionsForbiddenKeyCharacterException;

  // Type aliases
  export type CnpjInput = BaseCnpjInput;
  export type CnpjFormatterOptionsInput = BaseCnpjFormatterOptionsInput;
  export type CnpjFormatterOptionsType = BaseCnpjFormatterOptionsType;
  export type OnFailCallback = BaseOnFailCallback;
  export type Nullable<T> = BaseNullable<T>;
}

export default cnpjFmt;
