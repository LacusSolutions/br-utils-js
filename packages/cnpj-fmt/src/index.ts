export { default as cnpjFmt, default } from './cnpj-fmt';
export type { CnpjFormatOptions } from './cnpj-fmt';
export { CnpjFormatter } from './cnpj-formatter';
export { CnpjFormatterOptions, CNPJ_LENGTH } from './cnpj-formatter-options';
export type { OnFailCallback } from './cnpj-formatter-options';
export {
  CnpjFormatterError,
  CnpjFormatterHiddenRangeError,
  CnpjFormatterInvalidLengthError,
} from './exceptions';
