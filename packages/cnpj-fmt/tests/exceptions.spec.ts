import { describe, expect, it } from 'bun:test';

import {
  CnpjFormatterException,
  CnpjFormatterInputLengthException,
  CnpjFormatterInputTypeError,
  CnpjFormatterOptionsHiddenRangeInvalidException,
  CnpjFormatterOptionsTypeError,
  CnpjFormatterTypeError,
} from '../src/exceptions';

describe('CnpjFormatterTypeError', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjFormatterTypeError {}

    it('is an instance of TypeError', (): void => {
      const error = new TestClass('some error');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', (): void => {
      const error = new TestClass('some error');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
    });

    it('has the correct name', (): void => {
      const error = new TestClass('some error');

      expect(error.name).toBe('TestClass');
    });

    it('has a `message` property', (): void => {
      const error = new TestClass('some error');

      expect(error.message).toBe('some error');
    });
  });
});

describe('CnpjFormatterInputTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', (): void => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CnpjFormatterInputTypeError(123, 'string');

      expect(error.name).toBe('CnpjFormatterInputTypeError');
    });

    it('sets the `actualInput` property', (): void => {
      const input = 123;
      const error = new CnpjFormatterInputTypeError(input, 'string');

      expect(error.actualInput).toBe(input);
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CnpjFormatterInputTypeError(123, 'string or string[]');

      expect(error.expectedType).toBe('string or string[]');
    });

    it('generates a message describing the error', (): void => {
      const actualInput = 123;
      const actualInputType = 'integer number';
      const expectedType = 'string[]';
      const actualMessage = `CNPJ input must be of type ${expectedType}. Got ${actualInputType}.`;

      const error = new CnpjFormatterInputTypeError(actualInput, expectedType);

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterOptionsTypeError', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of TypeError', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(TypeError);
    });

    it('is an instance of CnpjFormatterTypeError', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error).toBeInstanceOf(CnpjFormatterTypeError);
    });

    it('has the correct name', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

      expect(error.name).toBe('CnpjFormatterOptionsTypeError');
    });

    it('sets the `optionName` property', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.optionName).toBe('hiddenKey');
    });

    it('sets the `actualInput` property', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.actualInput).toBe(123);
    });

    it('sets the `expectedType` property', (): void => {
      const error = new CnpjFormatterOptionsTypeError('hiddenKey', 123, 'string');

      expect(error.expectedType).toBe('string');
    });

    it('generates a message describing the error', (): void => {
      const optionName = 'hiddenKey';
      const actualInput = 123;
      const actualInputType = 'integer number';
      const actualMessage = `CNPJ formatting option "${optionName}" must be of type string. Got ${actualInputType}.`;

      const error = new CnpjFormatterOptionsTypeError(optionName, actualInput, 'string');

      expect(error.message).toBe(actualMessage);
    });
  });
});

describe('CnpjFormatterException', (): void => {
  describe('when instantiated through a subclass', (): void => {
    class TestClass extends CnpjFormatterException {}

    it('is an instance of Error', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', (): void => {
      const exception = new TestClass('some error');

      expect(exception).toBeInstanceOf(CnpjFormatterException);
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

describe('CnpjFormatterInputLengthException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception).toBeInstanceOf(CnpjFormatterException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.name).toBe('CnpjFormatterInputLengthException');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.actualInput).toBe('1.2.3.4.5');
    });

    it('sets the `evaluatedInput` property', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.evaluatedInput).toBe('12345');
    });

    it('sets the `expectedLength` property', (): void => {
      const exception = new CnpjFormatterInputLengthException('1.2.3.4.5', '12345', 14);

      expect(exception.expectedLength).toBe(14);
    });

    it('generates a message describing the exception', (): void => {
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

describe('CnpjFormatterOptionsHiddenRangeInvalidException', (): void => {
  describe('when instantiated', (): void => {
    it('is an instance of Error', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception).toBeInstanceOf(Error);
    });

    it('is an instance of CnpjFormatterException', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception).toBeInstanceOf(CnpjFormatterException);
    });

    it('has the correct name', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.name).toBe('CnpjFormatterOptionsHiddenRangeInvalidException');
    });

    it('sets the `optionName` property', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.optionName).toBe('hiddenStart');
    });

    it('sets the `actualInput` property', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.actualInput).toBe(20);
    });

    it('sets the `minExpectedValue` property', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.minExpectedValue).toBe(5);
    });

    it('sets the maxExpectedValue property', (): void => {
      const exception = new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        20,
        5,
        13,
      );

      expect(exception.maxExpectedValue).toBe(13);
    });

    it('generates a message describing the exception', (): void => {
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
