import { describe, expect, it } from 'bun:test';

import {
  CnpjCheckDigitsException,
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputTypeError,
  CnpjCheckDigitsTypeError,
} from '../src/exceptions';

describe('CnpjCheckDigitsTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjCheckDigitsTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjCheckDigitsTypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CnpjCheckDigitsTypeError);
    });

    it('has the correct name', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.name).toBe('TestClass');
    });

    it('sets the `actualInput` property', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');
      expect(error.actualType).toBe('number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.expectedType).toBe('string');
    });

    it('has a `message` property', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.message).toBe('some error');
    });
  });
});

describe('CnpjCheckDigitsInputTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CnpjCheckDigitsInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjCheckDigitsTypeError', (): void => {
      const error = new CnpjCheckDigitsInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(CnpjCheckDigitsTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CnpjCheckDigitsInputTypeError(123, 'string');

      expect(error.name).toBe('CnpjCheckDigitsInputTypeError');
    });

    it('sets the `actualInput` property', (): void => {
      const input = 123;
      const error = new CnpjCheckDigitsInputTypeError(input, 'string');

      expect(error.actualInput).toBe(input);
    });

    it('sets the `actualType` property', (): void => {
      const error = new CnpjCheckDigitsInputTypeError(123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CnpjCheckDigitsInputTypeError(123, 'string or string[]');

      expect(error.expectedType).toBe('string or string[]');
    });

    it('generates a message describing the error', (): void => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string[]';
      const actualMessage = `CNPJ input must be of type ${expectedType}. Got ${actualType}.`;

      const error = new CnpjCheckDigitsInputTypeError(actualInput, expectedType);

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjCheckDigitsException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjCheckDigitsException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjCheckDigitsException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjCheckDigitsException);
    });

    it('has the correct name', (): void => {
      const exception = new TestClass('some error');

      expect(exception.name).toBe('TestClass');
    });

    it('has a `message` property', (): void => {
      const exception = new TestClass('some error');

      expect(exception.message).toBe('some error');
    });
  });
});

describe('CnpjCheckDigitsInputLengthException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjCheckDigitsException', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception).toBeInstanceOf(CnpjCheckDigitsException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.name).toBe('CnpjCheckDigitsInputLengthException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `evaluatedInput` property', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.evaluatedInput).toBe('12345');
    });

    it('sets the `minExpectedLength` property', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.minExpectedLength).toBe(12);
    });

    it('sets the `maxExpectedLength` property', (): void => {
      const exception = new CnpjCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.maxExpectedLength).toBe(14);
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = '1.2.3.4.5';
      const evaluatedInput = '12345';
      const minExpectedLength = 12;
      const maxExpectedLength = 14;
      const actualMessage = `CNPJ input "${actualInput}" does not contain ${minExpectedLength} to ${maxExpectedLength} digits. Got ${evaluatedInput.length} in "${evaluatedInput}".`;

      const exception = new CnpjCheckDigitsInputLengthException(
        actualInput,
        evaluatedInput,
        minExpectedLength,
        maxExpectedLength,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjCheckDigitsInputInvalidException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjCheckDigitsException', (): void => {
      const exception = new CnpjCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception).toBeInstanceOf(CnpjCheckDigitsException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.name).toBe('CnpjCheckDigitsInputInvalidException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `reason` property', (): void => {
      const exception = new CnpjCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.reason).toBe('repeated digits');
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = '1.2.3.4.5';
      const reason = 'repeated digits';
      const actualMessage = `CNPJ input "${actualInput}" is invalid. ${reason}`;

      const exception = new CnpjCheckDigitsInputInvalidException(actualInput, reason);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
