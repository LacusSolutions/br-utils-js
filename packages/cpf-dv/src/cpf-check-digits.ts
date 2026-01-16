import {
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
} from './exceptions';
import { type CpfInput } from './types';

export const CPF_MIN_LENGTH = 9;
export const CPF_MAX_LENGTH = 11;

/**
 * Class to calculate CPF check digits.
 */
export class CpfCheckDigits {
  private readonly _cpfDigits: number[];
  private _cachedFirstDigit: number | undefined = undefined;
  private _cachedSecondDigit: number | undefined = undefined;

  public constructor(cpfInput: CpfInput) {
    let parsedInput: number[];

    if (typeof cpfInput === 'string') {
      parsedInput = this._handleStringInput(cpfInput);
    } else if (Array.isArray(cpfInput)) {
      parsedInput = this._handleArrayInput(cpfInput);
    } else {
      throw new CpfCheckDigitsInputTypeError(cpfInput);
    }

    this._validateLength(parsedInput, cpfInput);
    this._validateNonRepeatedDigits(parsedInput, cpfInput);

    this._cpfDigits = parsedInput.slice(0, CPF_MIN_LENGTH);
  }

  public get first(): string {
    if (this._cachedFirstDigit === undefined) {
      const baseDigitsSequence = [...this._cpfDigits];

      this._cachedFirstDigit = this.calculate(baseDigitsSequence);
    }

    return this._cachedFirstDigit.toString();
  }

  public get second(): string {
    if (this._cachedSecondDigit === undefined) {
      const baseDigitsSequence = [...this._cpfDigits, Number(this.first)];

      this._cachedSecondDigit = this.calculate(baseDigitsSequence);
    }

    return this._cachedSecondDigit.toString();
  }

  public get both(): string {
    return this.first + this.second;
  }

  public get cpf(): string {
    return [...this._cpfDigits, this.both].join('');
  }

  private _handleStringInput(cpfString: string): number[] {
    const stringDigitsOnly = cpfString.replace(/\D/g, '');
    const stringDigitsArray = stringDigitsOnly.split('');
    const numberDigitsArray = stringDigitsArray.map(Number);

    return numberDigitsArray;
  }

  private _handleArrayInput(cpfArray: unknown[]): number[] {
    if (cpfArray.length === 0) {
      return [];
    }

    const isStringArray = cpfArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CpfCheckDigitsInputTypeError(cpfArray);
    }

    return this._handleStringInput(cpfArray.join(''));
  }

  private _validateLength(cpfIntArray: number[], originalInput: CpfInput): void {
    const digitsCount = cpfIntArray.length;

    if (digitsCount < CPF_MIN_LENGTH || digitsCount > CPF_MAX_LENGTH) {
      throw new CpfCheckDigitsInputLengthException(
        originalInput,
        cpfIntArray.join(''),
        CPF_MIN_LENGTH,
        CPF_MAX_LENGTH,
      );
    }
  }

  private _validateNonRepeatedDigits(cpfIntArray: number[], originalInput: CpfInput): void {
    const eligibleCpfIntArray = cpfIntArray.slice(0, CPF_MIN_LENGTH);
    const uniqueDigits = new Set(eligibleCpfIntArray);

    if (uniqueDigits.size === 1) {
      throw new CpfCheckDigitsInputInvalidException(
        originalInput,
        'Repeated digits are not considered valid.',
      );
    }
  }

  protected calculate(cpfSequence: number[]): number {
    let factor = cpfSequence.length + 1;
    let sumResult = 0;

    for (const num of cpfSequence) {
      sumResult += num * factor;
      factor -= 1;
    }

    const remainder = 11 - (sumResult % 11);

    return remainder > 9 ? 0 : remainder;
  }
}

export default CpfCheckDigits;
