import { describeType } from '@lacussoft/utils';

import type { CnpjFormatterOptionsType, CnpjInput } from './types';

/**
 * Base error class for all `cnpj-fmt` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CNPJ formatter. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjFormatterTypeError extends TypeError {
  public readonly name: string;
  public readonly actualInput: unknown;
  public readonly actualType: string;
  public readonly expectedType: string;

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
 * Error raised when the input provided to the CNPJ formatter is not of the
 * expected type {@link CnpjInput}. The error message includes both the actual
 * input type and the expected type.
 */
export class CnpjFormatterInputTypeError extends CnpjFormatterTypeError {
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
 * Error raised when a specific option in the formatter configuration has an
 * invalid type. The error message includes the option name, the actual input
 * type and the expected type.
 */
export class CnpjFormatterOptionsTypeError extends CnpjFormatterTypeError {
  public readonly optionName: keyof CnpjFormatterOptionsType;

  public constructor(
    optionName: keyof CnpjFormatterOptionsType,
    actualInput: unknown,
    expectedType: string,
  ) {
    const actualInputType = describeType(actualInput);

    super(
      actualInput,
      actualInputType,
      expectedType,
      `CNPJ formatting option "${optionName}" must be of type ${expectedType}. Got ${actualInputType}.`,
    );
    this.optionName = optionName;
  }
}

/**
 * Base exception for all `cnpj-fmt` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CnpjFormatter` and its dependencies. It is
 * suitable for validation errors, range errors, and other business logic
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjFormatterException extends Error {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception raised when `hiddenStart` or `hiddenEnd` option values are outside
 * the valid range for CNPJ formatting. The valid range bounds are typically
 * between 0 and 13 (inclusive), representing the indices of the 14-character
 * CNPJ string. The error message includes the option name, the actual input
 * value, and the expected range bounds.
 */
export class CnpjFormatterOptionsHiddenRangeInvalidException extends CnpjFormatterException {
  public readonly optionName: keyof CnpjFormatterOptionsType;
  public readonly actualInput: number;
  public readonly minExpectedValue: number;
  public readonly maxExpectedValue: number;

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
 * Exception raised when a character is not allowed to be used as a key
 * character on options.
 */
export class CnpjFormatterOptionsForbiddenKeyCharacterException extends CnpjFormatterException {
  public readonly optionName: keyof CnpjFormatterOptionsType;
  public readonly actualInput: string;
  public readonly forbiddenCharacters: readonly string[];

  public constructor(
    optionName: keyof CnpjFormatterOptionsType,
    actualInput: string,
    forbiddenCharacters: readonly string[],
  ) {
    super(
      `Value "${actualInput}" for CNPJ formatting option "${optionName}" contains disallowed characters ("${forbiddenCharacters.join('", "')}").`,
    );
    this.optionName = optionName;
    this.actualInput = actualInput;
    this.forbiddenCharacters = forbiddenCharacters;
  }
}

/**
 * Exception raised when the CNPJ string input (after optional processing) does
 * not have the required length. A valid CNPJ must contain exactly 14
 * alphanumeric characters. The error message distinguishes between the original
 * input and the evaluated one (which strips punctuation characters).
 */
export class CnpjFormatterInputLengthException extends CnpjFormatterException {
  public readonly actualInput: CnpjInput;
  public readonly evaluatedInput: string;
  public readonly expectedLength: number;

  public constructor(actualInput: CnpjInput, evaluatedInput: string, expectedLength: number) {
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
