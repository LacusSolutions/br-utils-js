import { type CpfInput } from './types';

/**
 * Base error for all `cpf-dv` type-related errors.
 */
export abstract class CpfCheckDigitsTypeError extends TypeError {
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
export class CpfCheckDigitsInputTypeError extends CpfCheckDigitsTypeError {
  public readonly actualInput: unknown;

  public constructor(actualInput: unknown) {
    const isInputNull = actualInput === null;
    const isInputArray = !isInputNull && Array.isArray(actualInput);
    const arrayTypesSet = isInputArray
      ? actualInput.reduce((set, item) => set.add(typeof item), new Set<string>())
      : new Set<string>();
    const actualInputType = isInputNull
      ? 'null'
      : !isInputArray
        ? typeof actualInput
        : arrayTypesSet.size === 1
          ? `${arrayTypesSet.values().next().value}[]`
          : `(${[...arrayTypesSet.values()].join(' | ')})[]`;

    super(`CPF input must be of type string or string[]. Got ${actualInputType}.`);
    this.actualInput = actualInput;
  }
}

/**
 * Base exception for all `cpf-dv` related errors.
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
 * Raised when the class input does not contain the expected number of digits.
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
 * Raised when the class input is not valid (e.g., repeated digits).
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

/**
 * Raised when the calculation of the CPF check digits fails.
 */
export class CpfCheckDigitsCalculationException extends CpfCheckDigitsException {
  public readonly actualSequence: number[];

  public constructor(actualSequence: number[]) {
    super(`Failed to calculate CPF check digits for the sequence: [${actualSequence.join(', ')}].`);
    this.actualSequence = actualSequence;
  }
}
