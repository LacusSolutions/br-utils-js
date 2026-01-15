/**
 * Base exception for all cnpj-fmt related errors.
 */
export class CnpjFormatterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CnpjFormatterError';
  }
}

/**
 * Raised when a CNPJ string does not contain the expected number of digits.
 */
export class CnpjFormatterInvalidLengthError extends CnpjFormatterError {
  cnpjString: string;
  expectedLength: number;
  actualLength: number;

  constructor(cnpjString: string, expectedLength: number, actualLength: number) {
    super(
      `Parameter "${cnpjString}" does not contain ${expectedLength} digits. ` +
        `Found ${actualLength} digit(s).`,
    );
    this.name = 'CnpjFormatterInvalidLengthError';
    this.cnpjString = cnpjString;
    this.expectedLength = expectedLength;
    this.actualLength = actualLength;
  }
}

/**
 * Raised when a range value (hiddenStart or hiddenEnd) is out of bounds.
 */
export class CnpjFormatterHiddenRangeError extends CnpjFormatterError {
  optionName: string;
  value: number;
  minVal: number;
  maxVal: number;

  constructor(optionName: string, value: number, minVal: number, maxVal: number) {
    super(
      `Option "${optionName}" must be an integer between ${minVal} and ${maxVal}. ` +
        `Got ${value}.`,
    );
    this.name = 'CnpjFormatterHiddenRangeError';
    this.optionName = optionName;
    this.value = value;
    this.minVal = minVal;
    this.maxVal = maxVal;
  }
}
