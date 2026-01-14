import {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from './exceptions';
import { type CnpjInput } from './types';

export const CNPJ_MIN_LENGTH = 12;
export const CNPJ_MAX_LENGTH = 14;

/**
 * Class to calculate CNPJ check digits.
 */
export class CnpjCheckDigits {
  private readonly cnpjDigits: number[];
  private cachedFirstDigit: number | undefined = undefined;
  private cachedSecondDigit: number | undefined = undefined;

  public constructor(cnpjInput: CnpjInput) {
    let parsedInput: number[];

    if (typeof cnpjInput === 'string') {
      parsedInput = this.handleStringInput(cnpjInput);
    } else if (Array.isArray(cnpjInput)) {
      parsedInput = this.handleArrayInput(cnpjInput);
    } else {
      throw new CnpjCheckDigitsInputTypeError(cnpjInput);
    }

    this.validateLength(parsedInput, cnpjInput);

    this.cnpjDigits = parsedInput.slice(0, CNPJ_MIN_LENGTH);
  }

  public get first(): string {
    if (this.cachedFirstDigit === undefined) {
      const baseDigitsSequence = [...this.cnpjDigits];

      this.cachedFirstDigit = this.calculate(baseDigitsSequence);
    }

    return this.cachedFirstDigit.toString();
  }

  public get second(): string {
    if (this.cachedSecondDigit === undefined) {
      const baseDigitsSequence = [...this.cnpjDigits, Number(this.first)];

      this.cachedSecondDigit = this.calculate(baseDigitsSequence);
    }

    return this.cachedSecondDigit.toString();
  }

  public get both(): string {
    return this.first + this.second;
  }

  public get cnpj(): string {
    return [...this.cnpjDigits, this.both].join('');
  }

  private handleStringInput(cnpjString: string): number[] {
    const stringDigitsOnly = cnpjString.replace(/\D/g, '');
    const stringDigitsArray = stringDigitsOnly.split('');
    const numberDigitsArray = stringDigitsArray.map(Number);

    return numberDigitsArray;
  }

  private handleArrayInput(cnpjArray: unknown[]): number[] {
    if (cnpjArray.length === 0) {
      return [];
    }

    const isStringArray = cnpjArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CnpjCheckDigitsInputTypeError(cnpjArray);
    }

    return this.handleStringInput(cnpjArray.join(''));
  }

  private validateLength(cnpjIntArray: number[], originalInput: CnpjInput): void {
    const digitsCount = cnpjIntArray.length;

    if (digitsCount < CNPJ_MIN_LENGTH || digitsCount > CNPJ_MAX_LENGTH) {
      throw new CnpjCheckDigitsInputLengthException(
        originalInput,
        cnpjIntArray.join(''),
        CNPJ_MIN_LENGTH,
        CNPJ_MAX_LENGTH,
      );
    }
  }

  protected calculate(cnpjSequence: number[]): number {
    const minLength = CNPJ_MIN_LENGTH;
    const maxLength = CNPJ_MAX_LENGTH - 1;
    const sequenceLength = cnpjSequence.length;

    if (sequenceLength < minLength || sequenceLength > maxLength) {
      throw new CnpjCheckDigitsCalculationException(cnpjSequence);
    }

    let factor = 2;
    let sumResult = 0;

    for (let i = sequenceLength - 1; i >= 0; i--) {
      sumResult += cnpjSequence[i] * factor;
      factor = factor === 9 ? 2 : factor + 1;
    }

    const remainder = sumResult % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}

export default CnpjCheckDigits;
