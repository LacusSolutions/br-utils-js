import { describeType } from '@lacussoft/utils';

import type { CpfFormatterOptionsType, CpfInput } from './types';

/**
 * Base error class for all `cpf-fmt` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CPF formatter. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CpfFormatterTypeError extends TypeError {
  public override readonly name: string;

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

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.actualInput = actualInput;
    this.actualType = actualType;
    this.expectedType = expectedType;
  }
}

/**
 * Error raised when the input provided to the CPF formatter is not of the
 * expected type {@link CpfInput}. The error message includes both the actual
 * input type and the expected type.
 */
export class CpfFormatterInputTypeError extends CpfFormatterTypeError {
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
 * Error raised when a specific option in the formatter configuration has an
 * invalid type. The error message includes the option name, the actual input
 * type and the expected type.
 */
export class CpfFormatterOptionsTypeError extends CpfFormatterTypeError {
  public readonly optionName: keyof CpfFormatterOptionsType;

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
 * Base exception for all `cpf-fmt` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CpfFormatter` and its dependencies. It is
 * suitable for validation errors, range errors, and other business logic
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CpfFormatterException extends Error {
  public override readonly name: string;

  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
  }
}

/**
 * Exception raised when `hiddenStart` or `hiddenEnd` option values are outside
 * the valid range for CPF formatting. The valid range bounds are typically
 * between 0 and 10 (inclusive), representing the indices of the 11-digit CPF
 * string. The error message includes the option name, the actual input value,
 * and the expected range bounds.
 */
export class CpfFormatterOptionsHiddenRangeInvalidException extends CpfFormatterException {
  public readonly optionName: keyof CpfFormatterOptionsType;
  public readonly actualInput: number;
  public readonly minExpectedValue: number;
  public readonly maxExpectedValue: number;

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
 */
export class CpfFormatterOptionsForbiddenKeyCharacterException extends CpfFormatterException {
  public readonly optionName: keyof CpfFormatterOptionsType;
  public readonly actualInput: string;
  public readonly forbiddenCharacters: readonly string[];

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
 * Exception raised when the CPF string input (after optional processing) does
 * not have the required length. A valid CPF must contain exactly 11 digits. The
 * error message distinguishes between the original input and the evaluated one
 * (which strips punctuation characters).
 */
export class CpfFormatterInputLengthException extends CpfFormatterException {
  public readonly actualInput: CpfInput;
  public readonly evaluatedInput: string;
  public readonly expectedLength: number;

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
