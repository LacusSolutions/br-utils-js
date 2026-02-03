import { describe, expect, it } from 'bun:test';

import {
  CpfFormatterException,
  CpfFormatterInputLengthException,
  CpfFormatterInputTypeError,
  CpfFormatterOptionsForbiddenKeyCharacterException,
  CpfFormatterOptionsHiddenRangeInvalidException,
  CpfFormatterOptionsTypeError,
  CpfFormatterTypeError,
} from '../src/exceptions';

describe('CpfFormatterTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CpfFormatterTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfFormatterTypeError', (): void => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CpfFormatterTypeError);
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

describe('CpfFormatterInputTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CpfFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfFormatterTypeError', (): void => {
      const error = new CpfFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(CpfFormatterTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CpfFormatterInputTypeError(123, 'string');

      expect(error.name).toBe('CpfFormatterInputTypeError');
    });

    it('sets the `actualInput` property', (): void => {
      const input = 123;
      const error = new CpfFormatterInputTypeError(input, 'string');

      expect(error.actualInput).toBe(input);
    });

    it('sets the `actualType` property', (): void => {
      const error = new CpfFormatterInputTypeError(123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CpfFormatterInputTypeError(123, 'string or string[]');

      expect(error.expectedType).toBe('string or string[]');
    });

    it('generates a message describing the error', (): void => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string[]';
      const actualMessage = `CPF input must be of type ${expectedType}. Got ${actualType}.`;

      const error = new CpfFormatterInputTypeError(actualInput, expectedType);

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CpfFormatterOptionsTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CpfFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CpfFormatterTypeError', (): void => {
      const error = new CpfFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(CpfFormatterTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CpfFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error.name).toBe('CpfFormatterOptionsTypeError');
    });

    it('sets the `optionName` property', (): void => {
      const error = new CpfFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.optionName).toBe('hiddenKey');
    });

    it('sets the `actualInput` property', (): void => {
      const error = new CpfFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', (): void => {
      const error = new CpfFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CpfFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', (): void => {
      const optionName = 'hiddenKey';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CPF formatting option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CpfFormatterOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CpfFormatterException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CpfFormatterException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfFormatterException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CpfFormatterException);
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

describe('CpfFormatterInputLengthException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfFormatterException', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception).toBeInstanceOf(CpfFormatterException);
    });

    it('has the correct name', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception.name).toBe('CpfFormatterInputLengthException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `evaluatedInput` property', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception.evaluatedInput).toBe('12345');
    });

    it('sets the `expectedLength` property', (): void => {
      const exception = new CpfFormatterInputLengthException('1.2.3.4.5', '12345', 11);

      expect(exception.expectedLength).toBe(11);
    });

    it('generates a message describing the exception', (): void => {
      const actualInput = '1.2.3.4.5';
      const evaluatedInput = '12345';
      const expectedLength = 11;
      const actualMessage = `CPF input "${actualInput}" does not contain ${expectedLength} digits. Got ${evaluatedInput.length} in "${evaluatedInput}".`;

      const exception = new CpfFormatterInputLengthException(
        actualInput,
        evaluatedInput,
        expectedLength,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CpfFormatterOptionsHiddenRangeInvalidException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfFormatterException', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception).toBeInstanceOf(CpfFormatterException);
    });

    it('has the correct name', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception.name).toBe('CpfFormatterOptionsHiddenRangeInvalidException');
    });

    it('sets the `optionName` property', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception.optionName).toBe('hiddenStart');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception.actualInput).toBe(20);
    });

    it('sets the `minExpectedValue` property', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception.minExpectedValue).toBe(0);
    });

    it('sets the maxExpectedValue property', (): void => {
      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        0,
        10,
      );

      expect(exception.maxExpectedValue).toBe(10);
    });

    it('generates a message describing the exception', (): void => {
      const optionName = 'hiddenStart';
      const actualInput = 20;
      const minExpectedValue = 0;
      const maxExpectedValue = 10;
      const actualMessage = `CPF formatting option "${optionName}" must be an integer between ${minExpectedValue} and ${maxExpectedValue}. Got ${actualInput}.`;

      const exception = new CpfFormatterOptionsHiddenRangeInvalidException(
        optionName,
        actualInput,
        minExpectedValue,
        maxExpectedValue,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CpfFormatterOptionsForbiddenKeyCharacterException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CpfFormatterException', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception).toBeInstanceOf(CpfFormatterException);
    });

    it('has the correct name', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception.name).toBe('CpfFormatterOptionsForbiddenKeyCharacterException');
    });

    it('sets the `optionName` property', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('hiddenKey', 'x', [
        'x',
      ]);

      expect(exception.optionName).toBe('hiddenKey');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('dotKey', '/', ['/']);

      expect(exception.actualInput).toBe('/');
    });

    it('sets the `forbiddenCharacters` property', (): void => {
      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException('dashKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception.forbiddenCharacters).toEqual(['å', 'ë', 'ï', 'ð']);
    });

    it('generates a message describing the exception', (): void => {
      const optionName = 'dotKey';
      const actualInput = 'å';
      const forbiddenCharacters = ['å', 'ë', 'ï', 'ð'];
      const actualMessage = `Value "${actualInput}" for CPF formatting option "${optionName}" contains disallowed characters ("${forbiddenCharacters.join('", "')}").`;

      const exception = new CpfFormatterOptionsForbiddenKeyCharacterException(
        optionName,
        actualInput,
        forbiddenCharacters,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});
