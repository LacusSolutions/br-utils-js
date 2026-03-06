import { describe, expect, it } from 'bun:test';

import {
  CnpjGeneratorException,
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionTypeInvalidException,
  CnpjGeneratorTypeError,
} from '../src/exceptions';

describe('CnpjGeneratorTypeError', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CnpjGeneratorTypeError {}

    it('is an instance of TypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjGeneratorTypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CnpjGeneratorTypeError);
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

describe('CnpjGeneratorOptionsTypeError', () => {
  describe('when instantiated', () => {
    it('is an instance of TypeError', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjGeneratorTypeError', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(CnpjGeneratorTypeError);
    });

    it('has the correct name', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error.name).toBe('CnpjGeneratorOptionsTypeError');
    });

    it('sets the `optionName` property', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.optionName).toBe('format');
    });

    it('sets the `actualInput` property', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', () => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', () => {
      const optionName = 'format';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CNPJ generator option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CnpjGeneratorOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjGeneratorException', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CnpjGeneratorException {}

    it('is an instance of Error', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
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

describe('CnpjGeneratorOptionPrefixInvalidException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', () => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
    });

    it('has the correct name', () => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.name).toBe('CnpjGeneratorOptionPrefixInvalidException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '77777777',
        'repeated digits',
      );

      expect(exception.actualInput).toBe('77777777');
    });

    it('sets the `reason` property', () => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.reason).toBe('repeated digits');
    });

    it('generates a message describing the exception', () => {
      const actualInput = '1.2.3.4.5';
      const reason = 'repeated digits';
      const actualMessage = `CNPJ generator option "prefix" with value "${actualInput}" is invalid. ${reason}`;

      const exception = new CnpjGeneratorOptionPrefixInvalidException(actualInput, reason);

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjGeneratorOptionTypeInvalidException', () => {
  const expectedValues = ['alphabetic', 'alphanumeric', 'numeric'];

  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', () => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
    });

    it('has the correct name', () => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.name).toBe('CnpjGeneratorOptionTypeInvalidException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.actualInput).toBe('boolean');
    });

    it('sets the `expectedValues` property', () => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.expectedValues).toBe(expectedValues);
    });

    it('generates a message describing the exception', () => {
      const actualInput = 'boolean';
      const actualMessage = `CNPJ generator option "type" accepts only the following values: "${expectedValues.join('", "')}". Got "${actualInput}".`;

      const exception = new CnpjGeneratorOptionTypeInvalidException(actualInput, expectedValues);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
