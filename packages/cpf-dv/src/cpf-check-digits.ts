import {
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
} from './exceptions';
import { type CpfInput } from './types';

/**
 * Minimum number of digits required for the CPF check digits calculation.
 */
export const CPF_MIN_LENGTH = 9;

/**
 * Maximum number of digits accepted as input for the CPF check digits
 * calculation.
 */
export const CPF_MAX_LENGTH = 11;

/**
 * Calculates and exposes CPF check digits from a valid base input. Validates
 * length and rejects repeated-digit sequences.
 */
export class CpfCheckDigits {
  private readonly _cpfDigits: number[];
  private _cachedFirstDigit: number | undefined = undefined;
  private _cachedSecondDigit: number | undefined = undefined;

  /**
   * Creates a calculator for the given CPF base (9 to 11 digits).
   *
   * @throws {CpfCheckDigitsInputTypeError} When input is not a string or
   *   string[].
   * @throws {CpfCheckDigitsInputLengthException} When digit count is not
   *   between 9 and 11.
   * @throws {CpfCheckDigitsInputInvalidException} When all digits are the same
   *   (repeated digits, e.g. `777.777.777-...`).
   */
  public constructor(cpfInput: CpfInput) {
    let parsedInput: number[];

    if (typeof cpfInput === 'string') {
      parsedInput = this._handleStringInput(cpfInput);
    } else if (Array.isArray(cpfInput)) {
      parsedInput = this._handleArrayInput(cpfInput);
    } else {
      throw new CpfCheckDigitsInputTypeError(cpfInput, 'string or string[]');
    }

    this._validateLength(parsedInput, cpfInput);
    this._validateNonRepeatedDigits(parsedInput, cpfInput);

    this._cpfDigits = parsedInput.slice(0, CPF_MIN_LENGTH);
  }

  /**
   * First check digit (10th digit of the full CPF).
   */
  public get first(): string {
    if (this._cachedFirstDigit === undefined) {
      const baseDigitsSequence = [...this._cpfDigits];

      this._cachedFirstDigit = this._calculate(baseDigitsSequence);
    }

    return this._cachedFirstDigit.toString();
  }

  /**
   * Second check digit (11th digit of the full CPF).
   */
  public get second(): string {
    if (this._cachedSecondDigit === undefined) {
      const baseDigitsSequence = [...this._cpfDigits, Number(this.first)];

      this._cachedSecondDigit = this._calculate(baseDigitsSequence);
    }

    return this._cachedSecondDigit.toString();
  }

  /**
   * Both check digits concatenated (10th and 11th digits).
   */
  public get both(): string {
    return this.first + this.second;
  }

  /**
   * Full 11-digit CPF (base 9 digits concatenated with the 2 check digits).
   */
  public get cpf(): string {
    return [...this._cpfDigits, this.both].join('');
  }

  /**
   * Parses a string into an array of numbers.
   */
  private _handleStringInput(cpfString: string): number[] {
    const stringDigitsOnly = cpfString.replace(/\D/g, '');
    const stringDigitsArray = stringDigitsOnly.split('');
    const numberDigitsArray = stringDigitsArray.map(Number);

    return numberDigitsArray;
  }

  /**
   * Normalizes array input to a string array and delegates to number parsing.
   */
  private _handleArrayInput(cpfArray: unknown[]): number[] {
    if (cpfArray.length === 0) {
      return [];
    }

    const isStringArray = cpfArray.every((item) => typeof item === 'string');

    if (!isStringArray) {
      throw new CpfCheckDigitsInputTypeError(cpfArray, 'string or string[]');
    }

    return this._handleStringInput(cpfArray.join(''));
  }

  /**
   * Ensures digit count is between {@link CPF_MIN_LENGTH} and
   * {@link CPF_MAX_LENGTH}.
   */
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

  /**
   * Rejects inputs where all first 9 digits are the same.
   */
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

  /**
   * Computes a single check digit using the standard CPF modulo-11 algorithm.
   */
  protected _calculate(cpfSequence: number[]): number {
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

Object.freeze(CpfCheckDigits);
