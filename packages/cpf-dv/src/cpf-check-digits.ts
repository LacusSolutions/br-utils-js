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
  private readonly cpfDigits: number[];
  private cachedFirstDigit: number | undefined = undefined;
  private cachedSecondDigit: number | undefined = undefined;

  public constructor(cpfInput: CpfInput) {
    let parsedInput: number[];

    if (typeof cpfInput === 'string') {
      parsedInput = this.handleStringInput(cpfInput);
    } else if (Array.isArray(cpfInput)) {
      parsedInput = this.handleArrayInput(cpfInput);
    } else {
      throw new CpfCheckDigitsInputTypeError(cpfInput);
    }

    this.validateLength(parsedInput, cpfInput);
    this.validateNonRepeatedDigits(parsedInput, cpfInput);

    this.cpfDigits = parsedInput.slice(0, CPF_MIN_LENGTH);
  }

  public get first(): string {
    if (this.cachedFirstDigit === undefined) {
      const baseDigitsSequence = [...this.cpfDigits];

      this.cachedFirstDigit = this.calculate(baseDigitsSequence);
    }

    return this.cachedFirstDigit.toString();
  }

  public get second(): string {
    if (this.cachedSecondDigit === undefined) {
      const baseDigitsSequence = [...this.cpfDigits, Number(this.first)];

      this.cachedSecondDigit = this.calculate(baseDigitsSequence);
    }

    return this.cachedSecondDigit.toString();
  }

  public get both(): string {
    return this.first + this.second;
  }

  public get cpf(): string {
    return [...this.cpfDigits, this.both].join('');
  }

  private handleStringInput(cpfString: string): number[] {
    const stringDigitsOnly = cpfString.replace(/\D/g, '');
    const stringDigitsArray = stringDigitsOnly.split('');
    const numberDigitsArray = stringDigitsArray.map(Number);

    return numberDigitsArray;
  }

  private handleArrayInput(cpfArray: unknown[]): number[] {
    if (cpfArray.length === 0) {
      return [];
    }

    const isStringArray = cpfArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CpfCheckDigitsInputTypeError(cpfArray);
    }

    return this.handleStringInput(cpfArray.join(''));
  }

  private validateLength(cpfIntArray: number[], originalInput: CpfInput): void {
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

  private validateNonRepeatedDigits(cpfIntArray: number[], originalInput: CpfInput): void {
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
