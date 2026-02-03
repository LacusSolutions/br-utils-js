import { type CnpjInput } from './types';
import { describeType } from './utils';

/**
 * Base error for all `cnpj-dv` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CNPJ check digits. It ensures proper
 * prototype chain setup and automatically sets the error name from the
 * constructor.
 *
 * @abstract
 * @extends TypeError
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 * @property {unknown} actualInput - The actual input value that caused the
 *   error. This preserves the original value for debugging purposes.
 * @property {string} actualType - A human-readable description of the actual
 *   input type.
 * @property {string} expectedType - A human-readable description of the expected
 *   type.
 */
export abstract class CnpjCheckDigitsTypeError extends TypeError {
  /**
   * The name of the error class, automatically set from the constructor name.
   *
   * @readonly
   */
  public readonly name: string;

  /**
   * The actual input value that caused the error.
   *
   * @readonly
   */
  public readonly actualInput: unknown;

  /**
   * A human-readable description of the actual input type.
   *
   * @readonly
   */
  public readonly actualType: string;

  /**
   * A human-readable description of the expected type.
   *
   * @readonly
   */
  public readonly expectedType: string;

  /**
   * Creates a new instance of `CnpjCheckDigitsTypeError`.
   *
   * @param {string} actualInput - The actual input value that caused the error.
   * @param {string} actualType - A human-readable description of the actual
   *   input type.
   * @param {string} expectedType - A human-readable description of the expected
   *   type.
   * @param {string} message - The error message describing the type error.
   */
  public constructor(
    actualInput: unknown,
    actualType: string,
    expectedType: string,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.actualInput = actualInput;
    this.actualType = actualType;
    this.expectedType = expectedType;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when the CNPJ check digits input does not match the expected type.
 *
 * This error is thrown when the input provided to the CNPJ check digits is not
 * of the expected type (typically `string` or `string[]`). The error message
 * includes both the expected type and the actual type of the input value.
 *
 * @extends {CnpjCheckDigitsTypeError}
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 * @property {unknown} actualInput - The actual input value that caused the
 *   error. This preserves the original value for debugging purposes.
 * @property {string} actualType - A human-readable description of the actual
 *   input type.
 * @property {string} expectedType - A human-readable description of the
 *   expected type (e.g., `"string or string[]"`).
 */
export class CnpjCheckDigitsInputTypeError extends CnpjCheckDigitsTypeError {
  /**
   * Creates a new instance of `CnpjCheckDigitsInputTypeError`.
   *
   * @param {unknown} actualInput - The actual input value that does not match
   *   the expected type.
   * @param {string} expectedType - A human-readable description of the expected
   *   type (e.g., `"string"` or `"string[]"`).
   */
  public constructor(actualInput: unknown, expectedType: string) {
    const actualInputType = describeType(actualInput);

    super(
      actualInput,
      actualInputType,
      expectedType,
      `CNPJ input must be of type ${expectedType}. Got ${actualInputType}.`,
    );
  }
}

/**
 * Base exception class for all `cnpj-dv` related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the CNPJ check digits. Unlike
 * `CnpjCheckDigitsTypeError`, this class extends `Error` rather than `TypeError`,
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
export abstract class CnpjCheckDigitsException extends Error {
  /**
   * The name of the exception class, automatically set from the constructor name.
   *
   * @readonly
   */
  public readonly name: string;

  /**
   * Creates a new instance of `CnpjCheckDigitsException`.
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
 * Error raised when a CNPJ input does not contain the expected number of
 * characters.
 *
 * This exception is thrown when the input CNPJ string (after optional
 * processing) does not have the required length to calculate the check digits.
 * A valid CNPJ input must contain between 12 and 14 alphanumeric characters.
 * The error message distinguishes between the original input and the evaluated
 * input (which may have formatting characters removed).
 *
 * @extends {CnpjCheckDigitsException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {CnpjInput} actualInput - The original input provided to the
 *   formatter. This may contain formatting characters like dots, slashes or
 *   dashes.
 * @property {string} evaluatedInput - The input string after processing
 *   (typically with formatting characters removed). This is the string whose
 *   length is being validated.
 * @property {number} minExpectedLength - The minimum expected number of
 *   characters required for the check digits calculation.
 * @property {number} maxExpectedLength - The maximum expected number of
 *   characters allowed for the check digits calculation.
 */
export class CnpjCheckDigitsInputLengthException extends CnpjCheckDigitsException {
  /**
   * The original input provided to the formatter.
   *
   * @readonly
   */
  public readonly actualInput: CnpjInput;

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
  public readonly minExpectedLength: number;
  /**
   * The maximum expected number of characters allowed for the check digits calculation.
   *
   * @readonly
   */
  public readonly maxExpectedLength: number;

  /**
   * Creates a new instance of `CnpjCheckDigitsInputLengthException`.
   *
   * @param {CnpjInput} actualInput - The original input provided to the check
   *   digits. This may contain formatting characters.
   * @param {string} evaluatedInput - The input string after processing
   *   (typically with formatting characters removed). This is the string whose
   *   length is being validated.
   * @param {number} minExpectedLength - The minimum expected number of
   *   characters required for the check digits calculation.
   * @param {number} maxExpectedLength - The maximum expected number of
   *   characters allowed for the check digits calculation.
   */
  public constructor(
    actualInput: CnpjInput,
    evaluatedInput: string,
    minExpectedLength: number,
    maxExpectedLength: number,
  ) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);
    const fmtEvaluatedInput =
      actualInput === evaluatedInput
        ? `${evaluatedInput.length}`
        : `${evaluatedInput.length} in "${evaluatedInput}"`;

    super(
      `CNPJ input ${fmtActualInput} does not contain ${minExpectedLength} to ${maxExpectedLength} digits. Got ${fmtEvaluatedInput}.`,
    );
    this.actualInput = actualInput;
    this.evaluatedInput = evaluatedInput;
    this.minExpectedLength = minExpectedLength;
    this.maxExpectedLength = maxExpectedLength;
  }
}

/**
 * Exception raised when the CNPJ input is not valid (e.g., repeated digits).
 *
 * @extends CnpjCheckDigitsException
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {CnpjInput} actualInput - The original input provided to the check
 *   digits. This may contain formatting characters.
 * @property {string} reason - The reason why the input is invalid.
 */
export class CnpjCheckDigitsInputInvalidException extends CnpjCheckDigitsException {
  /**
   * The original input provided to the check digits.
   *
   * @readonly
   */
  public readonly actualInput: CnpjInput;

  /**
   * Short explanation of why the input was rejected.
   *
   * @readonly
   */
  public readonly reason: string;

  /**
   * Creates a new instance of `CnpjCheckDigitsInputInvalidException`.
   *
   * @param {CnpjInput} actualInput - The original input provided to the check
   *   digits. This may contain formatting characters.
   * @param {string} reason - Explanation of why the input is invalid.
   */
  public constructor(actualInput: CnpjInput, reason: string) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);

    super(`CNPJ input ${fmtActualInput} is invalid. ${reason}`);
    this.actualInput = actualInput;
    this.reason = reason;
  }
}
