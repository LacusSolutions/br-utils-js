import type { CnpjFormatterOptionsType } from './types';
import { describeType } from './utils';

/**
 * Base error class for all `cnpj-fmt` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CNPJ formatter. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 *
 * @abstract
 * @extends {TypeError}
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 */
export abstract class CnpjFormatterTypeError extends TypeError {
  /**
   * The name of the error class, automatically set from the constructor name.
   *
   * @readonly
   */
  public readonly name: string;

  /**
   * Creates a new instance of `CnpjFormatterTypeError`.
   *
   * @param {string} message - The error message describing the type error.
   */
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when the CNPJ formatter input does not match the expected type.
 *
 * This error is thrown when the input provided to the CNPJ formatter is not of
 * the expected type (typically `string` or `string[]`). The error message
 * includes both the expected type and the actual type of the input value.
 *
 * @extends {CnpjFormatterTypeError}
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 * @property {unknown} actualInput - The actual input value that caused the
 *   error. This preserves the original value for debugging purposes.
 * @property {string} expectedType - A human-readable description of the
 *   expected type (e.g., "string or string[]").
 */
export class CnpjFormatterInputTypeError extends CnpjFormatterTypeError {
  /**
   * The actual input value that caused the error.
   *
   * @readonly
   */
  public readonly actualInput: unknown;

  /**
   * A human-readable description of the expected type.
   *
   * @readonly
   */
  public readonly expectedType: string;

  /**
   * Creates a new instance of `CnpjFormatterInputTypeError`.
   *
   * @param {unknown} actualInput - The actual input value that does not match
   *   the expected type.
   * @param {string} expectedType - A human-readable description of the expected
   *   type (e.g., "string" or "string[]").
   */
  public constructor(actualInput: unknown, expectedType: string) {
    const actualInputType = describeType(actualInput);

    super(`CNPJ input must be of type ${expectedType}. Got ${actualInputType}.`);
    this.actualInput = actualInput;
    this.expectedType = expectedType;
  }
}

/**
 * Error raised when a CNPJ formatter option does not match the expected type.
 *
 * This error is thrown when a specific option in the formatter configuration
 * has an invalid type. The error message includes the option name, expected
 * type, and the actual type of the provided value.
 *
 * @extends {CnpjFormatterTypeError}
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 * @property {keyof CnpjFormatterOptionsType} optionName - The name of the
 *   option that has an invalid type (e.g., "hidden", "hiddenKey", "dotKey").
 * @property {unknown} actualInput - The actual value provided for the option
 *   that caused the error.
 * @property {string} expectedType - A human-readable description of the
 *   expected type for this option (e.g., "boolean", "string", "number").
 */
export class CnpjFormatterOptionsTypeError extends CnpjFormatterTypeError {
  /**
   * The name of the option that has an invalid type.
   *
   * @readonly
   */
  public readonly optionName: keyof CnpjFormatterOptionsType;

  /**
   * The actual value provided for the option that caused the error.
   *
   * @readonly
   */
  public readonly actualInput: unknown;

  /**
   * A human-readable description of the expected type for this option.
   *
   * @readonly
   */
  public readonly expectedType: string;

  /**
   * Creates a new instance of `CnpjFormatterOptionsTypeError`.
   *
   * @param {keyof CnpjFormatterOptionsType} optionName - The name of the option
   *   that has an invalid type.
   * @param {unknown} actualInput - The actual value provided for the option
   *   that does not match the expected type.
   * @param {string} expectedType - A human-readable description of the expected
   *   type for this option.
   */
  public constructor(
    optionName: keyof CnpjFormatterOptionsType,
    actualInput: unknown,
    expectedType: string,
  ) {
    const actualInputType = describeType(actualInput);

    super(
      `CNPJ formatting option "${optionName}" must be of type ${expectedType}. Got ${actualInputType}.`,
    );
    this.optionName = optionName;
    this.actualInput = actualInput;
    this.expectedType = expectedType;
  }
}

/**
 * Base exception class for all `cnpj-fmt` related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the CNPJ formatter. Unlike
 * `CnpjFormatterTypeError`, this class extends `Error` rather than `TypeError`,
 * making it suitable for validation errors, range errors, and other runtime
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 *
 * @abstract
 * @extends {Error}
 *
 * @property {string} name - The name of the exception class, automatically set
 *   from the constructor name.
 */
export abstract class CnpjFormatterException extends Error {
  /**
   * The name of the exception class, automatically set from the constructor name.
   *
   * @readonly
   */
  public readonly name: string;

  /**
   * Creates a new instance of `CnpjFormatterException`.
   *
   * @param {string} message - The error message describing the exception.
   */
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception raised when a range value (`hiddenStart` or `hiddenEnd`) is out of
 * bounds.
 *
 * This exception is thrown when the `hiddenStart` or `hiddenEnd` option values
 * are outside the valid range for CNPJ formatting. The valid range is typically
 * between 0 and 13 (inclusive), representing the indices of the 14-character
 * CNPJ string.
 *
 * @extends {CnpjFormatterException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {keyof CnpjFormatterOptionsType} optionName - The name of the
 *   option that has an invalid range value (must be "hiddenStart" or
 *   "hiddenEnd").
 * @property {number} actualInput - The actual numeric value provided for the
 *   option that is out of bounds.
 * @property {number} minExpectedValue - The minimum allowed value for the
 *   option.
 * @property {number} maxExpectedValue - The maximum allowed value for the
 *   option.
 */
export class CnpjFormatterOptionsHiddenRangeInvalidException extends CnpjFormatterException {
  /**
   * The name of the option that has an invalid range value.
   *
   * @readonly
   */
  public readonly optionName: keyof CnpjFormatterOptionsType;

  /**
   * The actual numeric value provided for the option that is out of bounds.
   *
   * @readonly
   */
  public readonly actualInput: number;

  /**
   * The minimum allowed value for the option.
   *
   * @readonly
   */
  public readonly minExpectedValue: number;

  /**
   * The maximum allowed value for the option.
   *
   * @readonly
   */
  public readonly maxExpectedValue: number;

  /**
   * Creates a new instance of `CnpjFormatterOptionsHiddenRangeInvalidException`.
   *
   * @param {keyof CnpjFormatterOptionsType} optionName - The name of the option
   *   that has an invalid range value (must be `hiddenStart` or `hiddenEnd`).
   * @param {number} actualInput - The actual numeric value provided for the
   *   option that is out of bounds.
   * @param {number} minExpectedValue - The minimum allowed value for the
   *   option.
   * @param {number} maxExpectedValue - The maximum allowed value for the
   *   option.
   */
  public constructor(
    optionName: keyof CnpjFormatterOptionsType,
    actualInput: number,
    minExpectedValue: number,
    maxExpectedValue: number,
  ) {
    super(
      `CNPJ formatting option "${optionName}" must be an integer between ${minExpectedValue} and ${maxExpectedValue}. Got ${actualInput}.`,
    );
    this.optionName = optionName;
    this.actualInput = actualInput;
    this.minExpectedValue = minExpectedValue;
    this.maxExpectedValue = maxExpectedValue;
  }
}

/**
 * Exception raised when a CNPJ string does not contain the expected number of
 * characters.
 *
 * This exception is thrown when the input CNPJ string (after optional
 * processing) does not have the required length. A valid CNPJ must contain
 * exactly 14 numeric characters. The error message distinguishes between the
 * original input and the evaluated input (which may have formatting characters
 * removed).
 *
 * @extends {CnpjFormatterException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {string} actualInput - The original input string provided to the
 *   formatter. This may contain formatting characters like dots, slashes or
 *   dashes.
 * @property {string} evaluatedInput - The input string after processing
 *   (typically with formatting characters removed). This is the string whose
 *   length is being validated.
 * @property {number} expectedLength - The expected number of characters
 *   (typically 14 for a CNPJ).
 */
export class CnpjFormatterInputLengthException extends CnpjFormatterException {
  /**
   * The original input string provided to the formatter.
   *
   * @readonly
   */
  public readonly actualInput: string;

  /**
   * The input string after processing (typically with formatting characters
   * removed).
   *
   * @readonly
   */
  public readonly evaluatedInput: string;

  /**
   * The expected number of characters in the CNPJ string.
   *
   * @readonly
   */
  public readonly expectedLength: number;

  /**
   * Creates a new instance of `CnpjFormatterInputLengthException`.
   *
   * @param {string} actualInput - The original input string provided to the
   *   formatter. This may contain formatting characters.
   * @param {string} evaluatedInput - The input string after processing
   *   (typically with formatting characters removed). This is the string whose
   *   length is being validated.
   * @param {number} expectedLength - The expected number of characters
   *   (typically 14 for a CNPJ).
   */
  public constructor(actualInput: string, evaluatedInput: string, expectedLength: number) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);
    const fmtEvaluatedInput =
      actualInput === evaluatedInput
        ? `${evaluatedInput.length}`
        : `${evaluatedInput.length} in "${evaluatedInput}"`;

    super(
      `CNPJ input ${fmtActualInput} does not contain ${expectedLength} characters. Got ${fmtEvaluatedInput}.`,
    );
    this.actualInput = actualInput;
    this.evaluatedInput = evaluatedInput;
    this.expectedLength = expectedLength;
  }
}
