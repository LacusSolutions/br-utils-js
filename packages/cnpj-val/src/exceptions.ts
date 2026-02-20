import type { CnpjValidatorOptionsType } from './types';
import { describeType } from './utils';

/**
 * Base error class for all `cnpj-val` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CNPJ validator. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjValidatorTypeError extends TypeError {
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
 * Error raised when the input provided to the CNPJ validator is not of the
 * expected type {@link CnpjInput}. The error message includes both the actual
 * input type and the expected type.
 */
export class CnpjValidatorInputTypeError extends CnpjValidatorTypeError {
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
 * Error raised when a specific option in the validator configuration has an
 * invalid type. The error message includes the option name, the actual input
 * type and the expected type.
 */
export class CnpjValidatorOptionsTypeError extends CnpjValidatorTypeError {
  public readonly optionName: keyof CnpjValidatorOptionsType;

  public constructor(
    optionName: keyof CnpjValidatorOptionsType,
    actualInput: unknown,
    expectedType: string,
  ) {
    const actualInputType = describeType(actualInput);

    super(
      actualInput,
      actualInputType,
      expectedType,
      `CNPJ validator option "${optionName}" must be of type ${expectedType}. Got ${actualInputType}.`,
    );
    this.optionName = optionName;
  }
}

/**
 * Base exception for all `cnpj-val` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CnpjValidator` and its dependencies. It is
 * suitable for validation errors, range errors, and other business logic
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjValidatorException extends Error {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception raised when the CNPJ option `type` is given a value that is not one
 * of the allowed values. The option must be one of the enumerated values of
 * {@link CnpjType}. This is a business logic exception and it is highly
 * recommended that users of the library catch it and handle it appropriately.
 */
export class CnpjValidatorOptionTypeInvalidException extends CnpjValidatorException {
  public readonly actualInput: string;
  public readonly expectedValues: readonly string[];

  public constructor(actualInput: string, expectedValues: readonly string[]) {
    super(
      `CNPJ validator option "type" accepts only the following values: "${expectedValues.join('", "')}". Got "${actualInput}".`,
    );
    this.actualInput = actualInput;
    this.expectedValues = expectedValues;
  }
}
