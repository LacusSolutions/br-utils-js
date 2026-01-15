import {
  CnpjCheckDigitsCalculationException,
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from './exceptions';
import { type CnpjInput } from './types';

export const CNPJ_MIN_LENGTH = 12;
export const CNPJ_MAX_LENGTH = 14;

const CNPJ_BASE_ID_LENGTH = 8;
const CNPJ_BASE_ID_LAST_INDEX = CNPJ_BASE_ID_LENGTH - 1;
const CNPJ_INVALID_BASE_ID = '0'.repeat(CNPJ_BASE_ID_LENGTH);

const CNPJ_BRANCH_ID_LENGTH = 4;
const CNPJ_BRANCH_ID_LAST_INDEX = CNPJ_BASE_ID_LAST_INDEX + CNPJ_BRANCH_ID_LENGTH;
const CNPJ_INVALID_BRANCH_ID = '0'.repeat(CNPJ_BRANCH_ID_LENGTH);

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
    this.validateBaseId(parsedInput, cnpjInput);
    this.validateBranchId(parsedInput, cnpjInput);

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

  private validateBaseId(cnpjIntArray: string[], originalInput: CnpjInput): void {
    const cnpjBaseIdArray = cnpjIntArray.slice(0, CNPJ_BASE_ID_LAST_INDEX + 1);
    const cnpjBaseIdString = cnpjBaseIdArray.join('');

    if (cnpjBaseIdString === CNPJ_INVALID_BASE_ID) {
      throw new CnpjCheckDigitsInputInvalidException(
        originalInput,
        `Base ID "${CNPJ_INVALID_BASE_ID}" is not eligible.`,
      );
    }
  }

  private validateBranchId(cnpjIntArray: string[], originalInput: CnpjInput): void {
    const cnpjBranchIdArray = cnpjIntArray.slice(
      CNPJ_BASE_ID_LENGTH,
      CNPJ_BRANCH_ID_LAST_INDEX + 1,
    );
    const cnpjBranchIdString = cnpjBranchIdArray.join('');

    if (cnpjBranchIdString === CNPJ_INVALID_BRANCH_ID) {
      throw new CnpjCheckDigitsInputInvalidException(
        originalInput,
        `Branch ID "${CNPJ_INVALID_BRANCH_ID}" is not eligible.`,
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

    let factor = 2;
    let sumResult = 0;

    for (let i = sequenceLength - 1; i >= 0; i--) {
      const charCode = cnpjSequence[i].charCodeAt(0);
      const charValue = charCode - DELTA_FACTOR;

      sumResult += charValue * factor;
      factor = factor === 9 ? 2 : factor + 1;
    }

    const remainder = sumResult % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}

export default CnpjCheckDigits;
