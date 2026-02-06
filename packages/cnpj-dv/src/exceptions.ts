import { type CnpjInput } from './types';
import { describeType } from './utils';

/**
 * Base error for all `cnpj-dv` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the `CnpjCheckDigits`. It ensures proper
 * prototype chain setup and automatically sets the error name from the
 * constructor.
 */
export abstract class CnpjCheckDigitsTypeError extends TypeError {
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
 * Error raised when the input provided to `CnpjCheckDigits` is not of the
 * expected type (`{@link CnpjInput}`). The error message includes both the
 * actual type of the input and the expected type.
 */
export class CnpjCheckDigitsInputTypeError extends CnpjCheckDigitsTypeError {
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
 * Base exception for all `cnpj-dv` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CnpjCheckDigits`. It is suitable for
 * validation errors, range errors, and other business logic exceptions that are
 * not strictly type-related. It ensures proper prototype chain setup and
 * automatically sets the error name from the constructor.
 */
export abstract class CnpjCheckDigitsException extends Error {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when the input `{@link CnpjInput}` (after optional processing)
 * does not have the required length to calculate the check digits. A valid CNPJ
 * input must contain between 12 and 14 alphanumeric characters. The error
 * message distinguishes between the original input and the evaluated one (which
 * strips punctuation characters).
 */
export class CnpjCheckDigitsInputLengthException extends CnpjCheckDigitsException {
  public readonly actualInput: CnpjInput;
  public readonly evaluatedInput: string;
  public readonly minExpectedLength: number;
  public readonly maxExpectedLength: number;

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
 * Exception raised when the CNPJ input contains invalid character sequences,
 * like all digits are repeated. This is a business logic exception and it is
 * highly recommended that users of the library catch it and handle it
 * appropriately.
 */
export class CnpjCheckDigitsInputInvalidException extends CnpjCheckDigitsException {
  public readonly actualInput: CnpjInput;
  public readonly reason: string;

  public constructor(actualInput: CnpjInput, reason: string) {
    const fmtActualInput =
      typeof actualInput === 'string' ? `"${actualInput}"` : JSON.stringify(actualInput);

    super(`CNPJ input ${fmtActualInput} is invalid. ${reason}`);
    this.actualInput = actualInput;
    this.reason = reason;
  }
}
