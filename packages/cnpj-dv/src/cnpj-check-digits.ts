import {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from './exceptions';
import { type CnpjInput } from './types';

export const CNPJ_MIN_LENGTH = 12;
export const CNPJ_MAX_LENGTH = 14;

const DELTA_FACTOR = '0'.charCodeAt(0);

/**
 * Class to calculate CNPJ check digits.
 */
export class CnpjCheckDigits {
  private readonly cnpjChars: string[];
  private cachedFirstDigit: number | undefined = undefined;
  private cachedSecondDigit: number | undefined = undefined;

  public constructor(cnpjInput: CnpjInput) {
    let parsedInput: string[];

    if (typeof cnpjInput === 'string') {
      parsedInput = this.handleStringInput(cnpjInput);
    } else if (Array.isArray(cnpjInput)) {
      parsedInput = this.handleArrayInput(cnpjInput);
    } else {
      throw new CnpjCheckDigitsInputTypeError(cnpjInput);
    }

    this.validateLength(parsedInput, cnpjInput);

    this.cnpjChars = parsedInput.slice(0, CNPJ_MIN_LENGTH);
  }

  public get first(): string {
    if (this.cachedFirstDigit === undefined) {
      const baseCharsSequence = [...this.cnpjChars];

      this.cachedFirstDigit = this.calculate(baseCharsSequence);
    }

    return this.cachedFirstDigit.toString();
  }

  public get second(): string {
    if (this.cachedSecondDigit === undefined) {
      const baseCharsSequence = [...this.cnpjChars, this.first];

      this.cachedSecondDigit = this.calculate(baseCharsSequence);
    }

    return this.cachedSecondDigit.toString();
  }

  public get both(): string {
    return this.first + this.second;
  }

  public get cnpj(): string {
    return [...this.cnpjChars, this.both].join('');
  }

  private handleStringInput(cnpjString: string): string[] {
    const alphanumericOnly = cnpjString.replace(/[^0-9A-Z]/gi, '');
    const alphanumericUpper = alphanumericOnly.toUpperCase();
    const alphanumericArray = alphanumericUpper.split('');

    return alphanumericArray;
  }

  private handleArrayInput(cnpjArray: unknown[]): string[] {
    if (cnpjArray.length === 0) {
      return [];
    }

    const isStringArray = cnpjArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CnpjCheckDigitsInputTypeError(cnpjArray);
    }

    return this.handleStringInput(cnpjArray.join(''));
  }

  private validateLength(cnpjChars: string[], originalInput: CnpjInput): void {
    const charsCount = cnpjChars.length;

    if (charsCount < CNPJ_MIN_LENGTH || charsCount > CNPJ_MAX_LENGTH) {
      throw new CnpjCheckDigitsInputLengthException(
        originalInput,
        cnpjChars.join(''),
        CNPJ_MIN_LENGTH,
        CNPJ_MAX_LENGTH,
      );
    }
  }

  protected calculate(cnpjSequence: string[]): number {
    const minLength = CNPJ_MIN_LENGTH;
    const maxLength = CNPJ_MAX_LENGTH - 1;
    const sequenceLength = cnpjSequence.length;

    if (sequenceLength < minLength || sequenceLength > maxLength) {
      throw new CnpjCheckDigitsCalculationException(cnpjSequence);
    }

    const sequenceValues: number[] = [];

    for (let i = 0; i < sequenceLength; i++) {
      const charCode = cnpjSequence[i].charCodeAt(0);
      const charValue = charCode - DELTA_FACTOR;

      sequenceValues.push(charValue);
    }

    let factor = 2;
    let sumResult = 0;

    for (let i = sequenceLength - 1; i >= 0; i--) {
      sumResult += sequenceValues[i] * factor;
      factor = factor === 9 ? 2 : factor + 1;
    }

    const remainder = sumResult % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}

export default CnpjCheckDigits;
