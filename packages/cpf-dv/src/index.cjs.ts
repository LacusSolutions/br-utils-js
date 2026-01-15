import {
  CPF_MAX_LENGTH,
  CPF_MIN_LENGTH,
  CpfCheckDigits as CpfCheckDigitsBase,
} from './cpf-check-digits';
import {
  CpfCheckDigitsException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
  CpfCheckDigitsTypeError,
} from './exceptions';

export default class CpfCheckDigits extends CpfCheckDigitsBase {
  public static readonly CPF_MAX_LENGTH = CPF_MAX_LENGTH;
  public static readonly CPF_MIN_LENGTH = CPF_MIN_LENGTH;

  public static readonly CpfCheckDigits = CpfCheckDigitsBase;
  public static readonly CpfCheckDigitsException = CpfCheckDigitsException;
  public static readonly CpfCheckDigitsTypeError = CpfCheckDigitsTypeError;
  public static readonly CpfCheckDigitsInputInvalidException = CpfCheckDigitsInputInvalidException;
  public static readonly CpfCheckDigitsInputLengthException = CpfCheckDigitsInputLengthException;
  public static readonly CpfCheckDigitsInputTypeError = CpfCheckDigitsInputTypeError;
}
