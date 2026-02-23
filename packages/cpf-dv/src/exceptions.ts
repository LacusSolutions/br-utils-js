import { describeType } from '@lacussoft/utils';

import { type CpfInput } from './types';

/**
 * Base error for all `cpf-dv` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the `CpfCheckDigits`. It ensures proper
 * prototype chain setup and automatically sets the error name from the
 * constructor.
 */
export abstract class CpfCheckDigitsTypeError extends TypeError {
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
 * Error raised when the input provided to `CpfCheckDigits` is not of the
 * expected type ({@link CpfInput}). The error message includes both the actual
 * type of the input and the expected type.
 */
export class CpfCheckDigitsInputTypeError extends CpfCheckDigitsTypeError {
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
 * Base exception for all `cpf-dv` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CpfCheckDigits`. It is suitable for
 * validation errors, range errors, and other business logic exceptions that are
 * not strictly type-related. It ensures proper prototype chain setup and
 * automatically sets the error name from the constructor.
 */
export abstract class CpfCheckDigitsException extends Error {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when the input `{@link CpfInput}` (after optional processing)
 * does not have the required length to calculate the check digits. A valid CPF
 * input must contain between 9 and 11 numeric characters. The error message
 * distinguishes between the original input and the evaluated one (which strips
 * punctuation characters).
 */
export class CpfCheckDigitsInputLengthException extends CpfCheckDigitsException {
  public readonly actualInput: CpfInput;
  public readonly evaluatedInput: string;
  public readonly minExpectedLength: number;
  public readonly maxExpectedLength: number;

  public constructor(
    actualInput: CpfInput,
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
      `CPF input ${fmtActualInput} does not contain ${minExpectedLength} to ${maxExpectedLength} digits. Got ${fmtEvaluatedInput}.`,
    );
    this.actualInput = actualInput;
    this.evaluatedInput = evaluatedInput;
    this.minExpectedLength = minExpectedLength;
    this.maxExpectedLength = maxExpectedLength;
  }
}

/**
 * Exception raised when the CPF input contains invalid character sequences,
 * like all digits are repeated. This is a business logic exception and it is
 * highly recommended that users of the library catch it and handle it
 * appropriately.
 */
export class CpfCheckDigitsInputInvalidException extends CpfCheckDigitsException {
  public readonly actualInput: CpfInput;
  public readonly reason: string;

  public constructor(actualInput: CpfInput, reason: string) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);

    super(`CPF input ${fmtActualInput} is invalid. ${reason}`);
    this.actualInput = actualInput;
    this.reason = reason;
  }
}
