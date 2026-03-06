import { describe, expect, it } from 'bun:test';

import {
  CpfGeneratorException,
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorOptionsTypeError,
  CpfGeneratorTypeError,
} from '../src/exceptions';

describe('CpfGeneratorTypeError', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CpfGeneratorTypeError {}

    it('is an instance of TypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfGeneratorTypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CpfGeneratorTypeError);
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

describe('CpfGeneratorOptionsTypeError', () => {
  describe('when instantiated', () => {
    it('is an instance of TypeError', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfGeneratorTypeError', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(CpfGeneratorTypeError);
    });

    it('has the correct name', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error.name).toBe('CpfGeneratorOptionsTypeError');
    });

    it('sets the `optionName` property', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.optionName).toBe('format');
    });

    it('sets the `actualInput` property', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', () => {
      const error = new CpfGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', () => {
      const optionName = 'format';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CPF generator option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CpfGeneratorOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CpfGeneratorException', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CpfGeneratorException {}

    it('is an instance of Error', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfGeneratorException', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CpfGeneratorException);
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

describe('CpfGeneratorOptionPrefixInvalidException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CpfGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfGeneratorException', () => {
      const exception = new CpfGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(CpfGeneratorException);
    });

    it('has the correct name', () => {
      const exception = new CpfGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.name).toBe('CpfGeneratorOptionPrefixInvalidException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CpfGeneratorOptionPrefixInvalidException('77777777', 'repeated digits');

      expect(exception.actualInput).toBe('77777777');
    });

    it('sets the `reason` property', () => {
      const exception = new CpfGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.reason).toBe('repeated digits');
    });

    it('generates a message describing the exception', () => {
      const actualInput = '1.2.3.4.5';
      const reason = 'repeated digits';
      const actualMessage = `CPF generator option "prefix" with value "${actualInput}" is invalid. ${reason}`;

      const exception = new CpfGeneratorOptionPrefixInvalidException(actualInput, reason);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
