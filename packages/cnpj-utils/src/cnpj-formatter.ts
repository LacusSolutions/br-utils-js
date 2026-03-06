export {
  cnpjFmt,
  CnpjFormatter,
  CnpjFormatterException,
  CnpjFormatterInputLengthException,
  CnpjFormatterInputTypeError,
  CnpjFormatterOptions,
  CnpjFormatterOptionsForbiddenKeyCharacterException,
  CnpjFormatterOptionsHiddenRangeInvalidException,
  CnpjFormatterOptionsTypeError,
  CnpjFormatterTypeError,
} from '@lacussoft/cnpj-fmt';
export type {
  CnpjInput as CnpjFormatterInput,
  OnFailCallback as CnpjFormatterOnFailCallback,
  CnpjFormatterOptionsInput,
  CnpjFormatterOptionsType,
} from '@lacussoft/cnpj-fmt';
