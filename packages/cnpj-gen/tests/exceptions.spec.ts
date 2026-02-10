import { describe, expect, it } from 'bun:test';

import {
  CnpjGeneratorException,
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionTypeInvalidException,
  CnpjGeneratorTypeError,
} from '../src/exceptions';

describe('CnpjGeneratorTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjGeneratorTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjGeneratorTypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CnpjGeneratorTypeError);
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

describe('CnpjGeneratorOptionsTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjGeneratorTypeError', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error).toBeInstanceOf(CnpjGeneratorTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'boolean');

      expect(error.name).toBe('CnpjGeneratorOptionsTypeError');
    });

    it('sets the `optionName` property', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.optionName).toBe('format');
    });

    it('sets the `actualInput` property', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CnpjGeneratorOptionsTypeError('format', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', (): void => {
      const optionName = 'format';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CNPJ generator option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CnpjGeneratorOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjGeneratorException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjGeneratorException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
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

describe('CnpjGeneratorOptionPrefixInvalidException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', (): void => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.name).toBe('CnpjGeneratorOptionPrefixInvalidException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '77777777',
        'repeated digits',
      );

      expect(exception.actualInput).toBe('77777777');
    });

    it('sets the `reason` property', (): void => {
      const exception = new CnpjGeneratorOptionPrefixInvalidException(
        '000000000000',
        'repeated digits',
      );

      expect(exception.reason).toBe('repeated digits');
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = '1.2.3.4.5';
      const reason = 'repeated digits';
      const actualMessage = `CNPJ generator option "prefix" with value "${actualInput}" is invalid. ${reason}`;

      const exception = new CnpjGeneratorOptionPrefixInvalidException(actualInput, reason);

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjGeneratorOptionTypeInvalidException', (): void => {
  const expectedValues = ['alphabetic', 'alphanumeric', 'numeric'];

  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjGeneratorException', (): void => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(CnpjGeneratorException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.name).toBe('CnpjGeneratorOptionTypeInvalidException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.actualInput).toBe('boolean');
    });

    it('sets the `expectedValues` property', (): void => {
      const exception = new CnpjGeneratorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.expectedValues).toBe(expectedValues);
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = 'boolean';
      const actualMessage = `CNPJ generator option "type" accepts only the following values: "${expectedValues.join('", "')}". Got "${actualInput}".`;

      const exception = new CnpjGeneratorOptionTypeInvalidException(actualInput, expectedValues);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
