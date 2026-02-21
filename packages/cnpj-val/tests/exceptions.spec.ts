import { describe, expect, it } from 'bun:test';

import {
  CnpjValidatorException,
  CnpjValidatorInputTypeError,
  CnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException,
  CnpjValidatorTypeError,
} from '../src/exceptions';

describe('CnpjValidatorTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjValidatorTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjValidatorTypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CnpjValidatorTypeError);
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

describe('CnpjValidatorInputTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjValidatorTypeError', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception).toBeInstanceOf(CnpjValidatorTypeError);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception.name).toBe('CnpjValidatorInputTypeError');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const exception = new CnpjValidatorInputTypeError(123, 'string');

      expect(exception.expectedType).toBe('string');
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string';
      const actualMessage = `CNPJ input must be of type ${expectedType}. Got ${actualType}.`;

      const exception = new CnpjValidatorInputTypeError(actualInput, expectedType);

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjValidatorOptionsTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjValidatorTypeError', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'boolean');

      expect(error).toBeInstanceOf(CnpjValidatorTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'boolean');

      expect(error.name).toBe('CnpjValidatorOptionsTypeError');
    });

    it('sets the `optionName` property', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'string');

      expect(error.optionName).toBe('type');
    });

    it('sets the `actualInput` property', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CnpjValidatorOptionsTypeError('type', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', (): void => {
      const optionName = 'type';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CNPJ validator option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CnpjValidatorOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjValidatorException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjValidatorException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjValidatorException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjValidatorException);
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

describe('CnpjValidatorOptionTypeInvalidException', (): void => {
  const expectedValues = ['alphabetic', 'alphanumeric', 'numeric'];

  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjValidatorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjValidatorException', (): void => {
      const exception = new CnpjValidatorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception).toBeInstanceOf(CnpjValidatorException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjValidatorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.name).toBe('CnpjValidatorOptionTypeInvalidException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjValidatorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.actualInput).toBe('boolean');
    });

    it('sets the `expectedValues` property', (): void => {
      const exception = new CnpjValidatorOptionTypeInvalidException('boolean', expectedValues);

      expect(exception.expectedValues).toBe(expectedValues);
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = 'boolean';
      const actualMessage = `CNPJ validator option "type" accepts only the following values: "${expectedValues.join('", "')}". Got "${actualInput}".`;

      const exception = new CnpjValidatorOptionTypeInvalidException(actualInput, expectedValues);

      expect(exception.message).toBe(actualMessage);
    });
  });
});
