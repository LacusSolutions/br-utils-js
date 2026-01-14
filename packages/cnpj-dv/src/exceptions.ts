import { type CnpjInput } from './types';
import { describeType } from './utils';

/**
 * Base error for all `cnpj-dv` type-related errors.
 */
export abstract class CnpjCheckDigitsTypeError extends TypeError {
  public readonly name: string;

  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Raised when the class input does not match the expected type.
 */
export class CnpjCheckDigitsInputTypeError extends CnpjCheckDigitsTypeError {
  public readonly actualInput: unknown;

  public constructor(actualInput: unknown) {
    const actualInputType = describeType(actualInput);

    super(`CNPJ input must be of type string or string[]. Got ${actualInputType}.`);
    this.actualInput = actualInput;
  }
}

/**
 * Base exception for all `cnpj-dv` related errors.
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
 * Raised when the class input does not contain the expected number of digits.
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
 * Raised when the calculation of the CNPJ check digits fails.
 */
export class CnpjCheckDigitsCalculationException extends CnpjCheckDigitsException {
  public readonly actualSequence: string[];

  public constructor(actualSequence: string[]) {
    super(
      `Failed to calculate CNPJ check digits for the sequence: [${actualSequence.join(', ')}].`,
    );
    this.actualSequence = actualSequence;
  }
}
