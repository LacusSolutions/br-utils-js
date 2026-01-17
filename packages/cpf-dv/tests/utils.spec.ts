import { describe, expect, it } from 'bun:test';

import { describeType } from '../src/utils';

describe('describeType', (): void => {
  describe('when given null', (): void => {
    it('returns "null"', (): void => {
      expect(describeType(null)).toBe('null');
    });
  });

  describe('when given undefined', (): void => {
    it('returns "undefined"', (): void => {
      expect(describeType(undefined)).toBe('undefined');
    });
  });

  describe('when given a string', (): void => {
    it('returns "string" for a regular string', (): void => {
      expect(describeType('hello')).toBe('string');
    });

    it('returns "string" for an empty string', (): void => {
      expect(describeType('')).toBe('string');
    });

    it('returns "string" for a string with whitespace', (): void => {
      expect(describeType('   ')).toBe('string');
    });
  });

  describe('when given a number', (): void => {
    it('returns "number" for a positive integer', (): void => {
      expect(describeType(42)).toBe('number');
    });

    it('returns "number" for a negative integer', (): void => {
      expect(describeType(-42)).toBe('number');
    });

    it('returns "number" for zero', (): void => {
      expect(describeType(0)).toBe('number');
    });

    it('returns "number" for a float', (): void => {
      expect(describeType(3.14)).toBe('number');
    });

    it('returns "number" for NaN', (): void => {
      expect(describeType(NaN)).toBe('number');
    });

    it('returns "number" for Infinity', (): void => {
      expect(describeType(Infinity)).toBe('number');
    });

    it('returns "number" for -Infinity', (): void => {
      expect(describeType(-Infinity)).toBe('number');
    });
  });

  describe('when given a boolean', (): void => {
    it('returns "boolean" for true', (): void => {
      expect(describeType(true)).toBe('boolean');
    });

    it('returns "boolean" for false', (): void => {
      expect(describeType(false)).toBe('boolean');
    });
  });

  describe('when given a bigint', (): void => {
    it('returns "bigint" for a positive bigint', (): void => {
      expect(describeType(BigInt(123))).toBe('bigint');
    });

    it('returns "bigint" for a negative bigint', (): void => {
      expect(describeType(BigInt(-123))).toBe('bigint');
    });

    it('returns "bigint" for zero bigint', (): void => {
      expect(describeType(BigInt(0))).toBe('bigint');
    });

    it('returns "bigint" for a large bigint', (): void => {
      expect(describeType(BigInt('9007199254740991000'))).toBe('bigint');
    });
  });

  describe('when given a symbol', (): void => {
    it('returns "symbol" for a named symbol', (): void => {
      expect(describeType(Symbol('test'))).toBe('symbol');
    });

    it('returns "symbol" for an anonymous symbol', (): void => {
      expect(describeType(Symbol())).toBe('symbol');
    });

    it('returns "symbol" for Symbol.for', (): void => {
      expect(describeType(Symbol.for('global'))).toBe('symbol');
    });

    it('returns "symbol" for well-known symbols', (): void => {
      expect(describeType(Symbol.iterator)).toBe('symbol');
    });
  });

  describe('when given a function', (): void => {
    it('returns "function" for an arrow function', (): void => {
      expect(describeType(() => {})).toBe('function');
    });

    it('returns "function" for a regular function', (): void => {
      expect(describeType(function test() {})).toBe('function');
    });

    it('returns "function" for an async function', (): void => {
      expect(describeType(async () => {})).toBe('function');
    });

    it('returns "function" for a class', (): void => {
      expect(describeType(class TestClass {})).toBe('function');
    });
  });

  describe('when given non-array objects', (): void => {
    it('returns "object" for a plain object', (): void => {
      expect(describeType({ key: 'value' })).toBe('object');
    });

    it('returns "object" for an empty object', (): void => {
      expect(describeType({})).toBe('object');
    });

    it('returns "object" for a Date', (): void => {
      expect(describeType(new Date())).toBe('object');
    });

    it('returns "object" for a RegExp', (): void => {
      expect(describeType(/test/)).toBe('object');
    });

    it('returns "object" for an Error', (): void => {
      expect(describeType(new Error('test'))).toBe('object');
    });

    it('returns "object" for a Promise', (): void => {
      expect(describeType(Promise.resolve())).toBe('object');
    });

    it('returns "object" for a WeakMap', (): void => {
      expect(describeType(new WeakMap())).toBe('object');
    });

    it('returns "object" for a WeakSet', (): void => {
      expect(describeType(new WeakSet())).toBe('object');
    });
  });

  describe('when given a Set', (): void => {
    it('returns "Set" for an empty Set', (): void => {
      expect(describeType(new Set())).toBe('Set');
    });

    it('returns "Set" for a Set with numbers', (): void => {
      expect(describeType(new Set([1, 2, 3]))).toBe('Set');
    });

    it('returns "Set" for a Set with strings', (): void => {
      expect(describeType(new Set(['a', 'b', 'c']))).toBe('Set');
    });

    it('returns "Set" for a Set with mixed types', (): void => {
      expect(describeType(new Set([1, 'a', true]))).toBe('Set');
    });
  });

  describe('when given a Map', (): void => {
    it('returns "Map" for an empty Map', (): void => {
      expect(describeType(new Map())).toBe('Map');
    });

    it('returns "Map" for a Map with entries', (): void => {
      expect(describeType(new Map([['key', 'value']]))).toBe('Map');
    });

    it('returns "Map" for a Map with number keys', (): void => {
      expect(
        describeType(
          new Map([
            [1, 'one'],
            [2, 'two'],
          ]),
        ),
      ).toBe('Map');
    });

    it('returns "Map" for a Map with mixed value types', (): void => {
      expect(
        describeType(
          new Map<string, unknown>([
            ['a', 1],
            ['b', 'two'],
          ]),
        ),
      ).toBe('Map');
    });
  });

  describe('when given an empty array', (): void => {
    it('returns "Array (empty)"', (): void => {
      expect(describeType([])).toBe('Array (empty)');
    });
  });

  describe('when given a homogeneous array', (): void => {
    it('returns "string[]" for an array of strings', (): void => {
      expect(describeType(['a', 'b', 'c'])).toBe('string[]');
    });

    it('returns "number[]" for an array of numbers', (): void => {
      expect(describeType([1, 2, 3])).toBe('number[]');
    });

    it('returns "boolean[]" for an array of booleans', (): void => {
      expect(describeType([true, false, true])).toBe('boolean[]');
    });

    it('returns "object[]" for an array of objects', (): void => {
      expect(describeType([{}, { a: 1 }, null])).toBe('object[]');
    });

    it('returns "undefined[]" for an array of undefined values', (): void => {
      expect(describeType([undefined, undefined])).toBe('undefined[]');
    });

    it('returns "bigint[]" for an array of bigints', (): void => {
      expect(describeType([BigInt(1), BigInt(2), BigInt(3)])).toBe('bigint[]');
    });

    it('returns "symbol[]" for an array of symbols', (): void => {
      expect(describeType([Symbol('a'), Symbol('b')])).toBe('symbol[]');
    });

    it('returns "function[]" for an array of functions', (): void => {
      expect(describeType([(): void => {}, function test(): void {}])).toBe('function[]');
    });
  });

  describe('when given a heterogeneous array', (): void => {
    it('returns "(number | string)[]" for mixed numbers and strings', (): void => {
      expect(describeType([1, 'a', 2, 'b'])).toBe('(number | string)[]');
    });

    it('returns "(string | number | boolean)[]" for mixed types', (): void => {
      expect(describeType(['hello', 42, true])).toBe('(string | number | boolean)[]');
    });

    it('returns "(number | object)[]" for numbers and objects', (): void => {
      expect(describeType([1, {}, 2, { a: 1 }])).toBe('(number | object)[]');
    });

    it('returns "(string | undefined)[]" for strings and undefined', (): void => {
      expect(describeType(['a', undefined, 'b'])).toBe('(string | undefined)[]');
    });
  });
});
