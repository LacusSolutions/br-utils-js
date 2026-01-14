import {
  CNPJ_MAX_LENGTH,
  CNPJ_MIN_LENGTH,
  CnpjCheckDigits as CnpjCheckDigitsBase,
} from './cnpj-check-digits';
import {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
  CnpjCheckDigitsTypeError,
} from './exceptions';

export default class CnpjCheckDigits extends CnpjCheckDigitsBase {
  public static readonly CNPJ_MAX_LENGTH = CNPJ_MAX_LENGTH;
  public static readonly CNPJ_MIN_LENGTH = CNPJ_MIN_LENGTH;

  public static readonly Exception = CnpjCheckDigitsException;
  public static readonly TypeError = CnpjCheckDigitsTypeError;
  public static readonly CalculationException = CnpjCheckDigitsCalculationException;
  public static readonly InputLengthException = CnpjCheckDigitsInputLengthException;
  public static readonly InputTypeError = CnpjCheckDigitsInputTypeError;
}
