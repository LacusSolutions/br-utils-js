import { cpfFmt as baseCpfFmt } from './cpf-fmt';
import { CpfFormatter as BaseCpfFormatter } from './cpf-formatter';
import {
  CpfFormatterOptions as BaseCpfFormatterOptions,
  CPF_LENGTH as BaseCpfLength,
} from './cpf-formatter-options';
import {
  CpfFormatterException as BaseCpfFormatterException,
  CpfFormatterInputLengthException as BaseCpfFormatterInputLengthException,
  CpfFormatterInputTypeError as BaseCpfFormatterInputTypeError,
  CpfFormatterOptionsForbiddenKeyCharacterException as BaseCpfFormatterOptionsForbiddenKeyCharacterException,
  CpfFormatterOptionsHiddenRangeInvalidException as BaseCpfFormatterOptionsHiddenRangeInvalidException,
  CpfFormatterOptionsTypeError as BaseCpfFormatterOptionsTypeError,
  CpfFormatterTypeError as BaseCpfFormatterTypeError,
} from './exceptions';
import type {
  CpfFormatterOptionsInput as BaseCpfFormatterOptionsInput,
  CpfFormatterOptionsType as BaseCpfFormatterOptionsType,
  CpfInput as BaseCpfInput,
  Nullable as BaseNullable,
  OnFailCallback as BaseOnFailCallback,
} from './types';

function cpfFmt(cpfInput: BaseCpfInput, options?: BaseCpfFormatterOptionsInput): string {
  return baseCpfFmt(cpfInput, options);
}

namespace cpfFmt {
  // Runtime values (re-exported with original names)
  export const CPF_LENGTH = BaseCpfLength;
  export const CpfFormatter = BaseCpfFormatter;
  export const CpfFormatterOptions = BaseCpfFormatterOptions;
  export const CpfFormatterTypeError = BaseCpfFormatterTypeError;
  export const InputTypeError = BaseCpfFormatterInputTypeError;
  export const OptionsTypeError = BaseCpfFormatterOptionsTypeError;
  export const CpfFormatterException = BaseCpfFormatterException;
  export const InputLengthException = BaseCpfFormatterInputLengthException;
  export const OptionsHiddenRangeInvalidException =
    BaseCpfFormatterOptionsHiddenRangeInvalidException;
  export const OptionsForbiddenKeyCharacterException =
    BaseCpfFormatterOptionsForbiddenKeyCharacterException;

  // Type aliases
  export type CpfInput = BaseCpfInput;
  export type OptionsInput = BaseCpfFormatterOptionsInput;
  export type CpfFormatterOptionsType = BaseCpfFormatterOptionsType;
  export type OnFailCallback = BaseOnFailCallback;
  export type Nullable<T> = BaseNullable<T>;
}

export default cpfFmt;
