import {
  CNPJ_MAX_LENGTH,
  CNPJ_MIN_LENGTH,
  CnpjCheckDigits as CnpjCheckDigitsBase,
} from './cnpj-check-digits';
import {
  CnpjCheckDigitsException,
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
  CnpjCheckDigitsTypeError,
} from './exceptions';

export default class CnpjCheckDigits extends CnpjCheckDigitsBase {
  public static readonly CNPJ_MAX_LENGTH = CNPJ_MAX_LENGTH;
  public static readonly CNPJ_MIN_LENGTH = CNPJ_MIN_LENGTH;

  public static readonly CnpjCheckDigits = CnpjCheckDigitsBase;
  public static readonly CnpjCheckDigitsException = CnpjCheckDigitsException;
  public static readonly CnpjCheckDigitsTypeError = CnpjCheckDigitsTypeError;
  public static readonly CnpjCheckDigitsInputInvalidException =
    CnpjCheckDigitsInputInvalidException;
  public static readonly CnpjCheckDigitsInputLengthException = CnpjCheckDigitsInputLengthException;
  public static readonly CnpjCheckDigitsInputTypeError = CnpjCheckDigitsInputTypeError;
}
