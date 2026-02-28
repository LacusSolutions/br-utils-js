export {
  cpfFmt,
  CpfFormatter,
  CpfFormatterException,
  CpfFormatterInputLengthException,
  CpfFormatterInputTypeError,
  CpfFormatterOptions,
  CpfFormatterOptionsForbiddenKeyCharacterException,
  CpfFormatterOptionsHiddenRangeInvalidException,
  CpfFormatterOptionsTypeError,
  CpfFormatterTypeError,
} from '@lacussoft/cpf-fmt';
export type {
  CpfInput as CpfFormatterInput,
  OnFailCallback as CpfFormatterOnFailCallback,
  CpfFormatterOptionsInput,
  CpfFormatterOptionsType,
} from '@lacussoft/cpf-fmt';
