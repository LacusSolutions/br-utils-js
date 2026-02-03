import type { CpfFormatterOptionsType, CpfInput } from './types';
import { describeType } from './utils';

/**
 * Base error class for all `cpf-fmt` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CPF formatter. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 *
 * @abstract
 * @extends {TypeError}
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
export abstract class CpfFormatterTypeError extends TypeError {
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
   * Creates a new instance of `CpfFormatterTypeError`.
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
 * Error raised when the CPF formatter input does not match the expected type.
 *
 * This error is thrown when the input provided to the CPF formatter is not of
 * the expected type (typically `string` or `string[]`). The error message
 * includes both the expected type and the actual type of the input value.
 *
 * @extends {CpfFormatterTypeError}
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
export class CpfFormatterInputTypeError extends CpfFormatterTypeError {
  /**
   * Creates a new instance of `CpfFormatterInputTypeError`.
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
      `CPF input must be of type ${expectedType}. Got ${actualInputType}.`,
    );
  }
}

/**
 * Error raised when a CPF formatter option does not match the expected type.
 *
 * This error is thrown when a specific option in the formatter configuration
 * has an invalid type. The error message includes the option name, expected
 * type, and the actual type of the provided value.
 *
 * @extends {CpfFormatterTypeError}
 *
 * @property {string} name - The name of the error class, automatically set from
 *   the constructor name.
 * @property {keyof CpfFormatterOptionsType} optionName - The name of the
 *   option that has an invalid type (e.g., `"hidden"`, `"hiddenKey"`,
 *   `"dotKey"`, `"escape"`, `"encode"`, `"onFail"`).
 * @property {unknown} actualInput - The actual value provided for the option
 *   that caused the error.
 * @property {string} actualType - A human-readable description of the actual
 *   input type.
 * @property {string} expectedType - A human-readable description of the
 *   expected type for this option (e.g., `"boolean"`, `"string"`, `"number"`).
 */
export class CpfFormatterOptionsTypeError extends CpfFormatterTypeError {
  /**
   * The name of the option that has an invalid type.
   *
   * @readonly
   */
  public readonly optionName: keyof CpfFormatterOptionsType;

  /**
   * Creates a new instance of `CpfFormatterOptionsTypeError`.
   *
   * @param {keyof CpfFormatterOptionsType} optionName - The name of the option
   *   that has an invalid type.
   * @param {unknown} actualInput - The actual value provided for the option
   *   that does not match the expected type.
   * @param {string} actualInputType - A human-readable description of the actual
   *   input type.
   * @param {string} expectedType - A human-readable description of the expected
   *   type for this option.
   */
  public constructor(
    optionName: keyof CpfFormatterOptionsType,
    actualInput: unknown,
    expectedType: string,
  ) {
    const actualInputType = describeType(actualInput);

    super(
      actualInput,
      actualInputType,
      expectedType,
      `CPF formatting option "${optionName}" must be of type ${expectedType}. Got ${actualInputType}.`,
    );
    this.optionName = optionName;
  }
}

/**
 * Base exception class for all `cpf-fmt` related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the CPF formatter. Unlike
 * `CpfFormatterTypeError`, this class extends `Error` rather than `TypeError`,
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
export abstract class CpfFormatterException extends Error {
  /**
   * The name of the exception class, automatically set from the constructor name.
   *
   * @readonly
   */
  public readonly name: string;

  /**
   * Creates a new instance of `CpfFormatterException`.
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
 * are outside the valid range for CPF formatting. The valid range is typically
 * between 0 and 10 (inclusive), representing the indices of the 11-digit CPF
 * string.
 *
 * @extends {CpfFormatterException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {keyof CpfFormatterOptionsType} optionName - The name of the
 *   option that has an invalid range value (e.g., `"hiddenStart"`,
 *   `"hiddenEnd"`, `"dotKey"`, `"encode"`, `"escape"`, `"onFail"`).
 * @property {number} actualInput - The actual numeric value provided for the
 *   option that is out of bounds.
 * @property {number} minExpectedValue - The minimum allowed value for the
 *   option.
 * @property {number} maxExpectedValue - The maximum allowed value for the
 *   option.
 */
export class CpfFormatterOptionsHiddenRangeInvalidException extends CpfFormatterException {
  /**
   * The name of the option that has an invalid range value.
   *
   * @readonly
   */
  public readonly optionName: keyof CpfFormatterOptionsType;

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
   * Creates a new instance of `CpfFormatterOptionsHiddenRangeInvalidException`.
   *
   * @param {keyof CpfFormatterOptionsType} optionName - The name of the option
   *   that has an invalid range value (must be `hiddenStart` or `hiddenEnd`).
   * @param {number} actualInput - The actual numeric value provided for the
   *   option that is out of bounds.
   * @param {number} minExpectedValue - The minimum allowed value for the
   *   option.
   * @param {number} maxExpectedValue - The maximum allowed value for the
   *   option.
   */
  public constructor(
    optionName: keyof CpfFormatterOptionsType,
    actualInput: number,
    minExpectedValue: number,
    maxExpectedValue: number,
  ) {
    super(
      `CPF formatting option "${optionName}" must be an integer between ${minExpectedValue} and ${maxExpectedValue}. Got ${actualInput}.`,
    );
    this.optionName = optionName;
    this.actualInput = actualInput;
    this.minExpectedValue = minExpectedValue;
    this.maxExpectedValue = maxExpectedValue;
  }
}

/**
 * Exception raised when a character is not allowed to be used as a key
 * character on options.
 *
 * @extends {CpfFormatterException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {keyof CpfFormatterOptionsType} optionName - The name of the
 *   option whose value contains a forbidden key character (e.g., `"hiddenKey"`,
 *   `"dotKey"`, `"dashKey"`).
 * @property {string} actualInput - The actual string value that was provided
 *   to the option that contains an invalid character.
 * @property {string[]} forbiddenCharacters - The list of forbidden characters
 *   that are not allowed to be used as key characters on options like
 *   `hiddenKey`, `dotKey` or `dashKey`.
 */
export class CpfFormatterOptionsForbiddenKeyCharacterException extends CpfFormatterException {
  /**
   * The name of the option whose value contains a forbidden key character.
   *
   * @readonly
   */
  public readonly optionName: keyof CpfFormatterOptionsType;

  /**
   * The actual string value that was provided to the option that contains an
   * invalid character.
   *
   * @readonly
   */
  public readonly actualInput: string;

  /**
   * The list of forbidden characters that are not allowed to be used as key
   * characters on options like `hiddenKey`, `dotKey` or `dashKey`.
   *
   * @readonly
   */
  public readonly forbiddenCharacters: readonly string[];

  /**
   * Creates a new instance of `CpfFormatterOptionsForbiddenKeyCharacterException`.
   *
   * @param {keyof CpfFormatterOptionsType} optionName - The name of the option
   *   whose value contains a forbidden key character.
   * @param {string} actualInput - The actual string value that was provided
   *   to the option that contains an invalid character.
   * @param {readonly string[]} forbiddenCharacters - The list of forbidden characters
   *   that are not allowed to be used as key characters on options like
   *   `hiddenKey`, `dotKey` or `dashKey`.
   */
  public constructor(
    optionName: keyof CpfFormatterOptionsType,
    actualInput: string,
    forbiddenCharacters: readonly string[],
  ) {
    super(
      `Value "${actualInput}" for CPF formatting option "${optionName}" contains disallowed characters ("${forbiddenCharacters.join('", "')}").`,
    );
    this.optionName = optionName;
    this.actualInput = actualInput;
    this.forbiddenCharacters = forbiddenCharacters;
  }
}

/**
 * Exception raised when a CPF string does not contain the expected number of
 * digits.
 *
 * This exception is thrown when the input CPF string (after optional
 * processing) does not have the required length. A valid CPF must contain
 * exactly 11 digits. The error message distinguishes between the original
 * input and the evaluated input (which may have formatting characters removed).
 *
 * @extends {CpfFormatterException}
 *
 * @property {string} name - The name of the exception class, automatically set from
 *   the constructor name.
 * @property {CpfInput} actualInput - The original input provided to the
 *   formatter. This may contain formatting characters like dots or dashes.
 * @property {string} evaluatedInput - The input string after processing
 *   (typically with formatting characters removed). This is the string whose
 *   length is being validated.
 * @property {number} expectedLength - The expected number of digits (typically
 *   11 for a CPF).
 */
export class CpfFormatterInputLengthException extends CpfFormatterException {
  /**
   * The original input provided to the formatter.
   *
   * @readonly
   */
  public readonly actualInput: CpfInput;

  /**
   * The input string after processing (typically with formatting characters
   * removed).
   *
   * @readonly
   */
  public readonly evaluatedInput: string;

  /**
   * The expected number of digits in the CPF string.
   *
   * @readonly
   */
  public readonly expectedLength: number;

  /**
   * Creates a new instance of `CpfFormatterInputLengthException`.
   *
   * @param {CpfInput} actualInput - The original input provided to the
   *   formatter. This may contain formatting characters.
   * @param {string} evaluatedInput - The input string after processing
   *   (typically with formatting characters removed). This is the string whose
   *   length is being validated.
   * @param {number} expectedLength - The expected number of digits (typically
   *   11 for a CPF).
   */
  public constructor(actualInput: CpfInput, evaluatedInput: string, expectedLength: number) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);
    const fmtEvaluatedInput =
      actualInput === evaluatedInput
        ? `${evaluatedInput.length}`
        : `${evaluatedInput.length} in "${evaluatedInput}"`;

    super(
      `CPF input ${fmtActualInput} does not contain ${expectedLength} digits. Got ${fmtEvaluatedInput}.`,
    );
    this.actualInput = actualInput;
    this.evaluatedInput = evaluatedInput;
    this.expectedLength = expectedLength;
  }
}
