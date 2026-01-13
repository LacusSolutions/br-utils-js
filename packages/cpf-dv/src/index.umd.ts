import {
  CPF_MAX_LENGTH,
  CPF_MIN_LENGTH,
  CpfCheckDigits as CpfCheckDigitsBase,
} from './cpf-check-digits';
import {
  CpfCheckDigitsCalculationException,
  CpfCheckDigitsException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
  CpfCheckDigitsTypeError,
} from './exceptions';

export default class CpfCheckDigits extends CpfCheckDigitsBase {
  public static readonly CPF_MAX_LENGTH = CPF_MAX_LENGTH;
  public static readonly CPF_MIN_LENGTH = CPF_MIN_LENGTH;

  public static readonly Exception = CpfCheckDigitsException;
  public static readonly TypeError = CpfCheckDigitsTypeError;
  public static readonly CalculationException = CpfCheckDigitsCalculationException;
  public static readonly InputInvalidException = CpfCheckDigitsInputInvalidException;
  public static readonly InputLengthException = CpfCheckDigitsInputLengthException;
  public static readonly InputTypeError = CpfCheckDigitsInputTypeError;
}
