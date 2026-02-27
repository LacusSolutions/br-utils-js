import { describe, expect, it } from 'bun:test';

import {
  CnpjFormatterException,
  CnpjFormatterInputLengthException,
  CnpjFormatterInputTypeError,
  CnpjFormatterOptionsForbiddenKeyCharacterException,
  CnpjFormatterOptionsHiddenRangeInvalidException,
  CnpjFormatterOptionsTypeError,
  CnpjFormatterTypeError,
} from '../src/exceptions';

describe('CnpjFormatterTypeError', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CnpjFormatterTypeError {}

    it('is an instance of TypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', () => {
      const error = new TestClass(123, 'number', 'string', 'some error');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
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

describe('CnpjFormatterInputTypeError', () => {
  describe('when instantiated', () => {
    it('is an instance of TypeError', () => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', () => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
    });

    it('has the correct name', () => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error.name).toBe('CnpjFormatterInputTypeError');
    });

    it('sets the `actualInput` property', () => {
      const input = 123;
      const error = new CnpjFormatterInputTypeError(input, 'string');

      expect(error.actualInput).toBe(input);
    });

    it('sets the `actualType` property', () => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', () => {
      const error = new CnpjFormatterInputTypeError(123, 'string or string[]');

      expect(error.expectedType).toBe('string or string[]');
    });

    it('generates a message describing the error', () => {
      const actualInput = 123;
      const actualType = 'integer number';
      const expectedType = 'string[]';
      const actualMessage = `CNPJ input must be of type ${expectedType}. Got ${actualType}.`;

      const error = new CnpjFormatterInputTypeError(actualInput, expectedType);

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterOptionsTypeError', () => {
  describe('when instantiated', () => {
    it('is an instance of TypeError', () => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', () => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
    });

    it('has the correct name', () => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error.name).toBe('CnpjFormatterOptionsTypeError');
    });

    it('sets the `optionName` property', () => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.optionName).toBe('hiddenKey');
    });

    it('sets the `actualInput` property', () => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `actualType` property', () => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.actualType).toBe('integer number');
    });

    it('sets the `expectedType` property', () => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', () => {
      const optionName = 'hiddenKey';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CNPJ formatting option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CnpjFormatterOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterException', () => {
  describe('when instantiated through a subclass', () => {
    class TestClass extends CnpjFormatterException {}

    it('is an instance of Error', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', () => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjFormatterException);
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

describe('CnpjFormatterInputLengthException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception).toBeInstanceOf(CnpjFormatterException);
    });

    it('has the correct name', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.name).toBe('CnpjFormatterInputLengthException');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `evaluatedInput` property', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.evaluatedInput).toBe('12345');
    });

    it('sets the `expectedLength` property', () => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.expectedLength).toBe(14);
    });

    it('generates a message describing the exception', () => {
      const actualInput = '1.2.3.4.5';
      const evaluatedInput = '12345';
      const expectedLength = 14;
      const actualMessage = `CNPJ input "${actualInput}" does not contain ${expectedLength} characters. Got ${evaluatedInput.length} in "${evaluatedInput}".`;

      const exception = new CnpjFormatterInputLengthException(
        actualInput,
        evaluatedInput,
        expectedLength,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterOptionsHiddenRangeInvalidException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception).toBeInstanceOf(CnpjFormatterException);
    });

    it('has the correct name', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.name).toBe('CnpjFormatterOptionsHiddenRangeInvalidException');
    });

    it('sets the `optionName` property', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.optionName).toBe('hiddenStart');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.actualInput).toBe(20);
    });

    it('sets the `minExpectedValue` property', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.minExpectedValue).toBe(5);
    });

    it('sets the maxExpectedValue property', () => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.maxExpectedValue).toBe(13);
    });

    it('generates a message describing the exception', () => {
      const optionName = 'hiddenStart';
      const actualInput = 20;
      const minExpectedValue = 5;
      const maxExpectedValue = 13;
      const actualMessage = `CNPJ formatting option "${optionName}" must be an integer between ${minExpectedValue} and ${maxExpectedValue}. Got ${actualInput}.`;

      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        optionName,
        actualInput,
        minExpectedValue,
        maxExpectedValue,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterOptionsForbiddenKeyCharacterException', () => {
  describe('when instantiated', () => {
    it('is an instance of Error', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception).toBeInstanceOf(CnpjFormatterException);
    });

    it('has the correct name', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('dotKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception.name).toBe('CnpjFormatterOptionsForbiddenKeyCharacterException');
    });

    it('sets the `optionName` property', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('hiddenKey', 'x', [
        'x',
      ]);

      expect(exception.optionName).toBe('hiddenKey');
    });

    it('sets the `actualInput` property', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('slashKey', '/', [
        '/',
      ]);

      expect(exception.actualInput).toBe('/');
    });

    it('sets the `forbiddenCharacters` property', () => {
      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException('dashKey', 'å', [
        'å',
        'ë',
        'ï',
        'ð',
      ]);

      expect(exception.forbiddenCharacters).toEqual(['å', 'ë', 'ï', 'ð']);
    });

    it('generates a message describing the exception', () => {
      const optionName = 'dotKey';
      const actualInput = 'å';
      const forbiddenCharacters = ['å', 'ë', 'ï', 'ð'];
      const actualMessage = `Value "${actualInput}" for CNPJ formatting option "${optionName}" contains disallowed characters ("${forbiddenCharacters.join('", "')}").`;

      const exception = new CnpjFormatterOptionsForbiddenKeyCharacterException(
        optionName,
        actualInput,
        forbiddenCharacters,
      );

      expect(exception.message).toBe(actualMessage);
    });
  });
});
