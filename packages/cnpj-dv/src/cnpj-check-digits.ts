import {
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
} from './exceptions';
import { type CnpjInput } from './types';

/**
 * Minimum number of characters required for the CNPJ check digits calculation.
 */
export const CNPJ_MIN_LENGTH = 12;

/**
 * Maximum number of characters accepted as input for the CNPJ check digits
 * calculation.
 */
export const CNPJ_MAX_LENGTH = 14;

const CNPJ_BASE_ID_LENGTH = 8;
const CNPJ_BASE_ID_LAST_INDEX = CNPJ_BASE_ID_LENGTH - 1;
const CNPJ_INVALID_BASE_ID = '0'.repeat(CNPJ_BASE_ID_LENGTH);

const CNPJ_BRANCH_ID_LENGTH = 4;
const CNPJ_BRANCH_ID_LAST_INDEX = CNPJ_BASE_ID_LAST_INDEX + CNPJ_BRANCH_ID_LENGTH;
const CNPJ_INVALID_BRANCH_ID = '0'.repeat(CNPJ_BRANCH_ID_LENGTH);

const DELTA_FACTOR = '0'.charCodeAt(0);

/**
 * Calculates and exposes CNPJ check digits from a valid base input. Validates
 * length, base ID, branch ID and rejects repeated-character sequences.
 */
export class CnpjCheckDigits {
  private readonly _cnpjChars: string[];
  private _cachedFirstDigit: number | undefined = undefined;
  private _cachedSecondDigit: number | undefined = undefined;

  /**
   * Creates a calculator for the given CNPJ base (12 to 14 characters).
   *
   * @throws {CnpjCheckDigitsInputTypeError} When input is not a string or
   *   string[].
   * @throws {CnpjCheckDigitsInputLengthException} When character count is not
   *   between 12 and 14.
   * @throws {CnpjCheckDigitsInputInvalidException} When base ID is all zero
   *   (`00.000.000`), branch ID is all zero (`0000`) or all digits are the same
   *   (repeated digits, e.g. `77.777.777/7777-...`).
   */
  public constructor(cnpjInput: CnpjInput) {
    let parsedInput: string[];

    if (typeof cnpjInput === 'string') {
      parsedInput = this._handleStringInput(cnpjInput);
    } else if (Array.isArray(cnpjInput)) {
      parsedInput = this._handleArrayInput(cnpjInput);
    } else {
      throw new CnpjCheckDigitsInputTypeError(cnpjInput, 'string or string[]');
    }

    this._validateLength(parsedInput, cnpjInput);
    this._validateBaseId(parsedInput, cnpjInput);
    this._validateBranchId(parsedInput, cnpjInput);
    this._validateNonRepeatedDigits(parsedInput, cnpjInput);

    this._cnpjChars = parsedInput.slice(0, CNPJ_MIN_LENGTH);
  }

  /**
   * First check digit (13th character of the full CNPJ).
   */
  public get first(): string {
    if (this._cachedFirstDigit === undefined) {
      const baseCharsSequence = [...this._cnpjChars];

      this._cachedFirstDigit = this._calculate(baseCharsSequence);
    }

    return this._cachedFirstDigit.toString();
  }

  /**
   * Second check digit (14th character of the full CNPJ).
   */
  public get second(): string {
    if (this._cachedSecondDigit === undefined) {
      const baseCharsSequence = [...this._cnpjChars, this.first];

      this._cachedSecondDigit = this._calculate(baseCharsSequence);
    }

    return this._cachedSecondDigit.toString();
  }

  /**
   * Both check digits concatenated (13th and 14th characters).
   */
  public get both(): string {
    return this.first + this.second;
  }

  /**
   * Full 14-character CNPJ (base 12 characters concatenated with the 2 check
   * digits).
   */
  public get cnpj(): string {
    return [...this._cnpjChars, this.both].join('');
  }

  /**
   * Parses a string into an array of alphanumeric characters.
   */
  private _handleStringInput(cnpjString: string): string[] {
    const alphanumericOnly = cnpjString.replace(/[^0-9A-Z]/gi, '');
    const alphanumericUpper = alphanumericOnly.toUpperCase();
    const alphanumericArray = alphanumericUpper.split('');

    return alphanumericArray;
  }

  /**
   * Normalizes array input to a string array and delegates to string parsing.
   */
  private _handleArrayInput(cnpjArray: unknown[]): string[] {
    if (cnpjArray.length === 0) {
      return [];
    }

    const isStringArray = cnpjArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CnpjCheckDigitsInputTypeError(cnpjArray, 'string or string[]');
    }

    return this._handleStringInput(cnpjArray.join(''));
  }

  /**
   * Ensures character count is between {@link CNPJ_MIN_LENGTH} and
   * {@link CNPJ_MAX_LENGTH}.
   */
  private _validateLength(cnpjChars: string[], originalInput: CnpjInput): void {
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

  /**
   * Rejects base ID (first 8 digits) when it is all zeros.
   */
  private _validateBaseId(cnpjIntArray: string[], originalInput: CnpjInput): void {
    const cnpjBaseIdArray = cnpjIntArray.slice(0, CNPJ_BASE_ID_LAST_INDEX + 1);
    const cnpjBaseIdString = cnpjBaseIdArray.join('');

    if (cnpjBaseIdString === CNPJ_INVALID_BASE_ID) {
      throw new CnpjCheckDigitsInputInvalidException(
        originalInput,
        `Base ID "${CNPJ_INVALID_BASE_ID}" is not eligible.`,
      );
    }
  }

  /**
   * Rejects branch ID (digits 9–12) when it is all zeros.
   */
  private _validateBranchId(cnpjIntArray: string[], originalInput: CnpjInput): void {
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

  /**
   * Rejects inputs where all first 12 characters are the same.
   */
  private _validateNonRepeatedDigits(cnpjIntArray: string[], originalInput: CnpjInput): void {
    const eligibleCnpjIntArray = cnpjIntArray.slice(0, CNPJ_MIN_LENGTH);
    const uniqueCharacters = new Set(eligibleCnpjIntArray);

    if (uniqueCharacters.size === 1 && /^\d$/.test(eligibleCnpjIntArray[0] ?? '')) {
      throw new CnpjCheckDigitsInputInvalidException(
        originalInput,
        'Repeated digits are not considered valid.',
      );
    }
  }

  /**
   * Computes a single check digit using the standard CNPJ modulo-11 algorithm.
   */
  protected _calculate(cnpjSequence: string[]): number {
    let factor = 2;
    let sumResult = 0;

    for (let i = cnpjSequence.length - 1; i >= 0; i--) {
      const charCode = cnpjSequence[i]!.charCodeAt(0);
      const charValue = charCode - DELTA_FACTOR;

      sumResult += charValue * factor;
      factor = factor === 9 ? 2 : factor + 1;
    }

    const remainder = sumResult % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  }
}

Object.freeze(CnpjCheckDigits);
