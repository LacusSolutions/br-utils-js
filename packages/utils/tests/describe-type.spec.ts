import { describe, expect, it } from 'bun:test';

import { describeType } from '../src/describe-type';

describe('describeType', () => {
  describe('when given `null`', () => {
    it('returns "null"', () => {
      const result = describeType(null);

      expect(result).toBe('null');
    });
  });

  describe('when given `undefined`', () => {
    it('returns "undefined"', () => {
      const result = describeType(undefined);

      expect(result).toBe('undefined');
    });
  });

  describe('when given a string', () => {
    it('returns "string" for a non-empty string', () => {
      const result = describeType('hello');

      expect(result).toBe('string');
    });

    it('returns "string" for an empty string', () => {
      const result = describeType('');

      expect(result).toBe('string');
    });

    it('returns "string" for a string with whitespace', () => {
      const result = describeType('   ');

      expect(result).toBe('string');
    });
  });

  describe('when given a number', () => {
    it('returns "integer" for a positive integer', () => {
      const result = describeType(42);

      expect(result).toBe('integer number');
    });

    it('returns "integer" for a negative integer', () => {
      const result = describeType(-42);

      expect(result).toBe('integer number');
    });

    it('returns "integer" for zero', () => {
      const result = describeType(0);

      expect(result).toBe('integer number');
    });

    it('returns "float" for a positive float', () => {
      const result = describeType(3.14);

      expect(result).toBe('float number');
    });

    it('returns "float" for a negative float', () => {
      const result = describeType(-3.14);

      expect(result).toBe('float number');
    });

    it('returns "NaN" for `NaN`', () => {
      const result = describeType(NaN);

      expect(result).toBe('NaN');
    });

    it('returns "Infinity" for positive `Infinity`', () => {
      const result = describeType(Infinity);

      expect(result).toBe('Infinity');
    });

    it('returns "Infinity" for negative `Infinity`', () => {
      const result = describeType(-Infinity);

      expect(result).toBe('Infinity');
    });
  });

  describe('when given a boolean', () => {
    it('returns "boolean" for `true`', () => {
      const result = describeType(true);

      expect(result).toBe('boolean');
    });

    it('returns "boolean" for `false`', () => {
      const result = describeType(false);

      expect(result).toBe('boolean');
    });
  });

  describe('when given a bigint', () => {
    it('returns "bigint" for a positive `bigint`', () => {
      const result = describeType(BigInt(123));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for a negative `bigint`', () => {
      const result = describeType(BigInt(-123));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for zero `bigint`', () => {
      const result = describeType(BigInt(0));

      expect(result).toBe('bigint');
    });

    it('returns "bigint" for a large `bigint`', () => {
      const result = describeType(BigInt('9007199254740991000'));

      expect(result).toBe('bigint');
    });
  });

  describe('when given a symbol', () => {
    it('returns "symbol" for a named `symbol`', () => {
      const result = describeType(Symbol('test'));

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for an anonymous symbol', () => {
      const result = describeType(Symbol());

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for Symbol.for', () => {
      const result = describeType(Symbol.for('global'));

      expect(result).toBe('symbol');
    });

    it('returns "symbol" for well-known symbols', () => {
      const result = describeType(Symbol.iterator);

      expect(result).toBe('symbol');
    });
  });

  describe('when given a function', () => {
    it('returns "function" for an arrow function', () => {
      const result = describeType(() => {});

      expect(result).toBe('function');
    });

    it('returns "function" for a regular function', () => {
      const result = describeType(function test() {});

      expect(result).toBe('function');
    });

    it('returns "function" for an async function', () => {
      const result = describeType(async () => {});

      expect(result).toBe('function');
    });

    it('returns "function" for a class', () => {
      const result = describeType(class TestClass {});

      expect(result).toBe('function');
    });
  });

  describe('when given non-array objects', () => {
    it('returns "object" for a plain object', () => {
      const result = describeType({ key: 'value' });

      expect(result).toBe('object');
    });

    it('returns "object" for a literal empty object', () => {
      const result = describeType({});

      expect(result).toBe('object');
    });

    it('returns "object" for a Date', () => {
      const result = describeType(new Date());

      expect(result).toBe('object');
    });

    it('returns "object" for a RegExp', () => {
      const result = describeType(/test/);

      expect(result).toBe('object');
    });

    it('returns "object" for an Error', () => {
      const result = describeType(new Error('test'));

      expect(result).toBe('object');
    });

    it('returns "object" for a Promise', () => {
      const result = describeType(Promise.resolve());

      expect(result).toBe('object');
    });

    it('returns "object" for a WeakMap', () => {
      const result = describeType(new WeakMap());

      expect(result).toBe('object');
    });

    it('returns "object" for a WeakSet', () => {
      const result = describeType(new WeakSet());

      expect(result).toBe('object');
    });

    it('returns "object" for a Set', () => {
      const result = describeType(new Set());

      expect(result).toBe('object');
    });

    it('returns "object" for a Map', () => {
      const result = describeType(new Map());

      expect(result).toBe('object');
    });
  });

  describe('when given an empty array', () => {
    it('returns "Array (empty)"', () => {
      const result = describeType([]);

      expect(result).toBe('Array (empty)');
    });
  });

  describe('when given a homogeneous array', () => {
    it('returns "string[]" for an array of strings', () => {
      const result = describeType(['a', 'b', 'c']);

      expect(result).toBe('string[]');
    });

    it('returns "number[]" for an array of numbers', () => {
      const result = describeType([1, 2, 3]);

      expect(result).toBe('number[]');
    });

    it('returns "boolean[]" for an array of booleans', () => {
      const result = describeType([true, false, true]);

      expect(result).toBe('boolean[]');
    });

    it('returns "object[]" for an array of objects', () => {
      const result = describeType([{}, { a: 1 }, null]);

      expect(result).toBe('object[]');
    });

    it('returns "undefined[]" for an array of undefined values', () => {
      const result = describeType([undefined, undefined]);

      expect(result).toBe('undefined[]');
    });

    it('returns "bigint[]" for an array of bigints', () => {
      const result = describeType([BigInt(1), BigInt(2), BigInt(3)]);

      expect(result).toBe('bigint[]');
    });

    it('returns "symbol[]" for an array of symbols', () => {
      const result = describeType([Symbol('a'), Symbol('b')]);

      expect(result).toBe('symbol[]');
    });

    it('returns "function[]" for an array of functions', () => {
      const result = describeType([(): void => {}, function test(): void {}]);

      expect(result).toBe('function[]');
    });
  });

  describe('when given a heterogeneous array', () => {
    it('returns "(number | string)[]" for mixed numbers and strings', () => {
      const result = describeType([1, 'a', 2, 'b']);

      expect(result).toBe('(number | string)[]');
    });

    it('returns "(string | number | boolean)[]" for mixed types', () => {
      const result = describeType(['hello', 42, true]);

      expect(result).toBe('(string | number | boolean)[]');
    });

    it('returns "(number | object)[]" for numbers and objects', () => {
      const result = describeType([1, {}, 2, { a: 1 }]);

      expect(result).toBe('(number | object)[]');
    });

    it('returns "(string | undefined)[]" for strings and undefined', () => {
      const result = describeType(['a', undefined, 'b']);

      expect(result).toBe('(string | undefined)[]');
    });
  });
});
