import { describe, expect, it } from 'bun:test';

import {
  CpfValidatorException,
  CpfValidatorInputTypeError,
  CpfValidatorTypeError,
} from '../src/exceptions';

describe('CpfValidatorTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CpfValidatorTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfValidatorTypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CpfValidatorTypeError);
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

describe('CpfValidatorInputTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfValidatorTypeError', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception).toBeInstanceOf(CpfValidatorTypeError);
    });

    it('has the correct name', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception.name).toBe('CpfValidatorInputTypeError');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const exception = new CpfValidatorInputTypeError(123, 'string');

      expect(exception.expectedType).toBe('string');
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string';
      const actualMessage = `CPF input must be of type ${expectedType}. Got ${actualType}.`;

      const exception = new CpfValidatorInputTypeError(actualInput, expectedType);

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CpfValidatorException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CpfValidatorException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfValidatorException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CpfValidatorException);
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
