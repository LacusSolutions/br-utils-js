import { describeType } from '@lacussoft/utils';

/**
 * Base error class for all `cpf-val` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CPF validator. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CpfValidatorTypeError extends TypeError {
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
    this.name = this.constructor.name;
    this.actualInput = actualInput;
    this.actualType = actualType;
    this.expectedType = expectedType;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error raised when the input provided to the CPF validator is not of the
 * expected type {@link CpfInput}. The error message includes both the actual
 * input type and the expected type.
 */
export class CpfValidatorInputTypeError extends CpfValidatorTypeError {
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
 * Base exception for all `cpf-val` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CpfValidator` and its dependencies. It is
 * suitable for validation errors, range errors, and other business logic
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CpfValidatorException extends Error {
  public override readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
