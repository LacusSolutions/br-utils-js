import { describe, expect, it } from 'bun:test';

import {
  CpfCheckDigitsException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputTypeError,
  CpfCheckDigitsTypeError,
} from '../src/exceptions';

describe('CpfCheckDigitsTypeError', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CpfCheckDigitsTypeError {}

    it('is an instance of TypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfCheckDigitsTypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CpfCheckDigitsTypeError);
    });

    it('has the correct name', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.name).toBe('TestClass');
    });

    it('sets the `actualInput` property', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');
      expect(error.actualType).toBe('number');
    });

    it('sets the `expectedType` property', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.expectedType).toBe('string');
    });

    it('has a `message` property', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error.message).toBe('some error');
    });
  });
});

describe('CpfCheckDigitsInputTypeError', () => {
  describe('when instantiated', () => {
    it('is an instance of TypeError', () => {
      const error = new CpfCheckDigitsInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfCheckDigitsTypeError', () => {
      const error = new CpfCheckDigitsInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(CpfCheckDigitsTypeError);
    });

    it('has the correct name', () => {
      const error = new CpfCheckDigitsInputTypeError(123, 'string');

      expect(error.name).toBe('CpfCheckDigitsInputTypeError');
    });

    it('sets the `actualInput` property', () => {
      const input = 123;
      const error = new CpfCheckDigitsInputTypeError(input, 'string');

      expect(error.actualInput).toBe(input);
    });

    it('sets the `actualType` property', () => {
      const error = new CpfCheckDigitsInputTypeError(123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', () => {
      const error = new CpfCheckDigitsInputTypeError(123, 'string or string[]');

      expect(error.expectedType).toBe('string or string[]');
    });

    it('generates a message describing the error', () => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string[]';
      const actualMessage = `CPF input must be of type ${expectedType}. Got ${actualType}.`;

      const error = new CpfCheckDigitsInputTypeError(actualInput, expectedType);

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CpfCheckDigitsException', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CpfCheckDigitsException {}

    it('is an instance of Error', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfCheckDigitsException', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CpfCheckDigitsException);
    });

    it('has the correct name', () => {
      const exception = new TestClass('some error');

      expect(exception.name).toBe('TestClass');
    });

    it('has a `message` property', () => {
      const exception = new TestClass('some error');

      expect(exception.message).toBe('some error');
    });
  });
});

describe('CpfCheckDigitsInputLengthException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfCheckDigitsException', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception).toBeInstanceOf(CpfCheckDigitsException);
    });

    it('has the correct name', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.name).toBe('CpfCheckDigitsInputLengthException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `evaluatedInput` property', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.evaluatedInput).toBe('12345');
    });

    it('sets the `minExpectedLength` property', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.minExpectedLength).toBe(12);
    });

    it('sets the `maxExpectedLength` property', () => {
      const exception = new CpfCheckDigitsInputLengthException('1.2.3.4.5', '12345', 12, 14);

      expect(exception.maxExpectedLength).toBe(14);
    });

    it('generates a message describing the exception', () => {
      const actualInput = '1.2.3.4.5';
      const evaluatedInput = '12345';
      const minExpectedLength = 12;
      const maxExpectedLength = 14;
      const actualMessage = `CPF input "${actualInput}" does not contain ${minExpectedLength} to ${maxExpectedLength} digits. Got ${evaluatedInput.length} in "${evaluatedInput}".`;

      const exception = new CpfCheckDigitsInputLengthException(
        actualInput,
        evaluatedInput,
        minExpectedLength,
        maxExpectedLength,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CpfCheckDigitsInputInvalidException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CpfCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfCheckDigitsException', () => {
      const exception = new CpfCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception).toBeInstanceOf(CpfCheckDigitsException);
    });

    it('has the correct name', () => {
      const exception = new CpfCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.name).toBe('CpfCheckDigitsInputInvalidException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CpfCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `reason` property', () => {
      const exception = new CpfCheckDigitsInputInvalidException('1.2.3.4.5', 'repeated digits');

      expect(exception.reason).toBe('repeated digits');
    });

    it('generates a message describing the exception', () => {
      const actualInput = '1.2.3.4.5';
      const reason = 'repeated digits';
      const actualMessage = `CPF input "${actualInput}" is invalid. ${reason}`;

      const exception = new CpfCheckDigitsInputInvalidException(actualInput, reason);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
