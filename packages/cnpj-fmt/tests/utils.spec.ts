import { describe, expect, it } from 'bun:test';

import { describeType, escapeHTML } from '../src/utils';

describe('describeType', (): void => {
  describe('when given `null`', (): void => {
    it('returns "null"', (): void => {
      const result = describeType(null);

      expect(result).toBe('null');
    });
  });

  describe('when given `undefined`', (): void => {
    it('returns "undefined"', (): void => {
      const result = describeType(undefined);

      expect(result).toBe('undefined');
    });
  });

  describe('when given a string', (): void => {
    it('returns "string" for a non-empty string', (): void => {
      const result = describeType('hello');

      expect(result).toBe('string');
    });

    it('returns "string" for an empty string', (): void => {
      const result = describeType('');

      expect(result).toBe('string');
    });

    it('returns "string" for a string with whitespace', (): void => {
      const result = describeType('   ');

      expect(result).toBe('string');
    });
  });

  describe('when given a number', (): void => {
    it('returns "integer" for a positive integer', (): void => {
      const result = describeType(42);

      expect(result).toBe('integer number');
    });

    it('returns "integer" for a negative integer', (): void => {
      const result = describeType(42);

      expect(result).toBe('integer number');
    });

    it('returns "integer" for zero', (): void => {
      const result = describeType(0);

      expect(result).toBe('integer number');
    });

    it('returns "float" for a positive float', (): void => {
      const result = describeType(3.14);

      expect(result).toBe('float number');
    });

    it('returns "float" for a negative float', (): void => {
      const result = describeType(-3.14);

      expect(result).toBe('float number');
    });

    it('returns "NaN" for `NaN`', (): void => {
      const result = describeType(NaN);

      expect(result).toBe('NaN');
    });

    it('returns "Infinity" for positive `Infinity`', (): void => {
      const result = describeType(Infinity);

      expect(result).toBe('Infinity');
    });

    it('returns "-Infinity" for negative `Infinity`', (): void => {
      const result = describeType(-Infinity);

      expect(result).toBe('Infinity');
    });
  });

  describe('when given a boolean', (): void => {
    it('returns "boolean" for `true`', (): void => {
      const result = describeType(true);

      expect(result).toBe('boolean');
    });

    it('returns "boolean" for `false`', (): void => {
      const result = describeType(false);

      expect(result).toBe('boolean');
    });
  });

  describe('when given a bigint', (): void => {
    it('returns "bigint" for a positive `bigint`', (): void => {
      const result = describeType(BigInt(123));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for a negative `bigint`', (): void => {
      const result = describeType(BigInt(-123));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for zero `bigint`', (): void => {
      const result = describeType(BigInt(0));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for a large `bigint`', (): void => {
      const result = describeType(BigInt('9007199254740991000'));

      expect(result).toBe('bigint');
    });
  });

  describe('when given a symbol', (): void => {
    it('returns "symbol" for a named `symbol`', (): void => {
      const result = describeType(Symbol('test'));

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for an anonymous symbol', (): void => {
      const result = describeType(Symbol());

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for Symbol.for', (): void => {
      const result = describeType(Symbol.for('global'));

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for well-known symbols', (): void => {
      const result = describeType(Symbol.iterator);

      expect(result).toBe('symbol');
    });
  });

  describe('when given a function', (): void => {
    it('returns "function" for an arrow function', (): void => {
      const result = describeType(() => {});

      expect(result).toBe('function');
    });

    it('returns "function" for a regular function', (): void => {
      const result = describeType(function test() {});

      expect(result).toBe('function');
    });

    it('returns "function" for an async function', (): void => {
      const result = describeType(async () => {});

      expect(result).toBe('function');
    });

    it('returns "function" for a class', (): void => {
      const result = describeType(class TestClass {});

      expect(result).toBe('function');
    });
  });

  describe('when given non-array objects', (): void => {
    it('returns "object" for a plain object', (): void => {
      const result = describeType({ key: 'value' });

      expect(result).toBe('object');
    });

    it('returns "object" for a literal empty object', (): void => {
      const result = describeType({});

      expect(result).toBe('object');
    });

    it('returns "object" for a Date', (): void => {
      const result = describeType(new Date());

      expect(result).toBe('object');
    });

    it('returns "object" for a RegExp', (): void => {
      const result = describeType(/test/);

      expect(result).toBe('object');
    });

    it('returns "object" for an Error', (): void => {
      const result = describeType(new Error('test'));

      expect(result).toBe('object');
    });

    it('returns "object" for a Promise', (): void => {
      const result = describeType(Promise.resolve());

      expect(result).toBe('object');
    });

    it('returns "object" for a WeakMap', (): void => {
      const result = describeType(new WeakMap());

      expect(result).toBe('object');
    });

    it('returns "object" for a WeakSet', (): void => {
      const result = describeType(new WeakSet());

      expect(result).toBe('object');
    });

    it('returns "object" for a Set', (): void => {
      const result = describeType(new Set());

      expect(result).toBe('object');
    });

    it('returns "object" for a Map', (): void => {
      const result = describeType(new Map());

      expect(result).toBe('object');
    });
  });

  describe('when given an empty array', (): void => {
    it('returns "Array (empty)"', (): void => {
      const result = describeType([]);

      expect(result).toBe('Array (empty)');
    });
  });

  describe('when given a homogeneous array', (): void => {
    it('returns "string[]" for an array of strings', (): void => {
      const result = describeType(['a', 'b', 'c']);

      expect(result).toBe('string[]');
    });

    it('returns "number[]" for an array of numbers', (): void => {
      const result = describeType([1, 2, 3]);

      expect(result).toBe('number[]');
    });

    it('returns "boolean[]" for an array of booleans', (): void => {
      const result = describeType([true, false, true]);

      expect(result).toBe('boolean[]');
    });

    it('returns "object[]" for an array of objects', (): void => {
      const result = describeType([{}, { a: 1 }, null]);

      expect(result).toBe('object[]');
    });

    it('returns "undefined[]" for an array of undefined values', (): void => {
      const result = describeType([undefined, undefined]);

      expect(result).toBe('undefined[]');
    });

    it('returns "bigint[]" for an array of bigints', (): void => {
      const result = describeType([BigInt(1), BigInt(2), BigInt(3)]);

      expect(result).toBe('bigint[]');
    });

    it('returns "symbol[]" for an array of symbols', (): void => {
      const result = describeType([Symbol('a'), Symbol('b')]);

      expect(result).toBe('symbol[]');
    });

    it('returns "function[]" for an array of functions', (): void => {
      const result = describeType([(): void => {}, function test(): void {}]);

      expect(result).toBe('function[]');
    });
  });

  describe('when given a heterogeneous array', (): void => {
    it('returns "(number | string)[]" for mixed numbers and strings', (): void => {
      const result = describeType([1, 'a', 2, 'b']);

      expect(result).toBe('(number | string)[]');
    });

    it('returns "(string | number | boolean)[]" for mixed types', (): void => {
      const result = describeType(['hello', 42, true]);

      expect(result).toBe('(string | number | boolean)[]');
    });

    it('returns "(number | object)[]" for numbers and objects', (): void => {
      const result = describeType([1, {}, 2, { a: 1 }]);

      expect(result).toBe('(number | object)[]');
    });

    it('returns "(string | undefined)[]" for strings and undefined', (): void => {
      const result = describeType(['a', undefined, 'b']);

      expect(result).toBe('(string | undefined)[]');
    });
  });
});

describe('escapeHTML', (): void => {
  describe('when given a "&" character', (): void => {
    it('returns "&amp;"', (): void => {
      const result = escapeHTML('&');

      expect(result).toBe('&amp;');
    });
  });

  describe('when given a "<" character', (): void => {
    it('returns "&lt;"', (): void => {
      const result = escapeHTML('<');

      expect(result).toBe('&lt;');
    });
  });

  describe('when given a ">" character', (): void => {
    it('returns "&gt;"', (): void => {
      const result = escapeHTML('>');

      expect(result).toBe('&gt;');
    });
  });

  describe("when given a '\"' character", (): void => {
    it('returns "&quot;"', (): void => {
      const result = escapeHTML('"');

      expect(result).toBe('&quot;');
    });
  });

  describe('when given a "\'" character', (): void => {
    it('returns "&#039;"', (): void => {
      const result = escapeHTML("'");

      expect(result).toBe('&#039;');
    });
  });

  describe('when given a "\'" character', (): void => {
    it('returns "&#039;"', (): void => {
      const result = escapeHTML("'");

      expect(result).toBe('&#039;');
    });
  });
});
