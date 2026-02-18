import type { CnpjGeneratorOptionsType } from './types';
import { describeType } from './utils';

/**
 * Base error class for all `cnpj-gen` type-related errors.
 *
 * This abstract class extends the native `TypeError` and serves as the base for
 * all type validation errors in the CNPJ generator. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjGeneratorTypeError extends TypeError {
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
 * Error raised when a specific option in the generator configuration has an
 * invalid type. The error message includes the option name, the actual input
 * type and the expected type.
 */
export class CnpjGeneratorOptionsTypeError extends CnpjGeneratorTypeError {
  public readonly optionName: keyof CnpjGeneratorOptionsType;

  public constructor(
    optionName: keyof CnpjGeneratorOptionsType,
    actualInput: unknown,
    expectedType: string,
  ) {
    const actualInputType = describeType(actualInput);

    super(
      actualInput,
      actualInputType,
      expectedType,
      `CNPJ generator option "${optionName}" must be of type ${expectedType}. Got ${actualInputType}.`,
    );
    this.optionName = optionName;
  }
}

/**
 * Base exception for all `cnpj-gen` rules-related errors.
 *
 * This abstract class extends the native `Error` and serves as the base for all
 * non-type-related errors in the `CnpjGenerator` and its dependencies. It is
 * suitable for validation errors, range errors, and other business logic
 * exceptions that are not strictly type-related. It ensures proper prototype
 * chain setup and automatically sets the error name from the constructor.
 */
export abstract class CnpjGeneratorException extends Error {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Exception raised when the CNPJ option `prefix` is invalid. This is a business
 * logic exception and it is highly recommended that users of the library catch
 * it and handle it appropriately.
 */
export class CnpjGeneratorOptionPrefixInvalidException extends CnpjGeneratorException {
  public readonly actualInput: string;
  public readonly reason: string;

  public constructor(actualInput: string, reason: string) {
    super(`CNPJ generator option "prefix" with value "${actualInput}" is invalid. ${reason}`);
    this.actualInput = actualInput;
    this.reason = reason;
  }
}

/**
 * Exception raised when the CNPJ option `type` is given a value that is not one
 * of the allowed values. The option must be one of the enumerated values of
 * {@link CnpjType}. This is a business logic exception and it is highly
 * recommended that users of the library catch it and handle it appropriately.
 */
export class CnpjGeneratorOptionTypeInvalidException extends CnpjGeneratorException {
  public readonly actualInput: string;
  public readonly expectedValues: readonly string[];

  public constructor(actualInput: string, expectedValues: readonly string[]) {
    super(
      `CNPJ generator option "type" accepts only the following values: "${expectedValues.join('", "')}". Got "${actualInput}".`,
    );
    this.actualInput = actualInput;
    this.expectedValues = expectedValues;
  }
}
