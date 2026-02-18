import { type CnpjType } from './types';

const NUMERIC_CHARACTERS = '0123456789';
const ALPHABETIC_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUMERIC_CHARACTERS = NUMERIC_CHARACTERS + ALPHABETIC_CHARACTERS;

/**
 * Generates a random character sequence of the given length and type (numeric,
 * alphabetic, or alphanumeric).
 *
 * @example
 *   randomSequence(10, 'numeric'); // e.g. '9956000611'
 *   randomSequence(6, 'alphabetic'); // e.g. 'AXQMZB'
 *   randomSequence(8, 'alphanumeric'); // e.g. '8ZFB2K09'
 */
export function randomSequence(size: number, type: CnpjType): string {
  const charactersSequence: string[] = [];
  let charactersRange = ALPHANUMERIC_CHARACTERS;

  if (type === 'numeric') {
    charactersRange = NUMERIC_CHARACTERS;
  } else if (type === 'alphabetic') {
    charactersRange = ALPHABETIC_CHARACTERS;
  }

  while (charactersSequence.length < size) {
    const random = Math.random();
    const randomFloat = random * charactersRange.length;
    const randomInteger = Math.floor(randomFloat);
    const randomCharacter = charactersRange[randomInteger];

    charactersSequence.push(randomCharacter);
  }

  return charactersSequence.join('');
}

/**
 * Returns a human-readable description of a value's type, suitable for use in
 * error messages.
 *
 * @example
 *   describeType(null); // 'null'
 *   describeType(undefined); // 'undefined'
 *   describeType('hello'); // 'string'
 *   describeType(true); // 'boolean'
 *   describeType(42); // 'integer number'
 *   describeType(3.14); // 'float number'
 *   describeType(NaN); // 'NaN'
 *   describeType(Infinity); // 'Infinity'
 *   describeType([]); // 'Array (empty)'
 *   describeType([1, 2, 3]); // 'number[]'
 *   describeType([1, 'a', 2]); // '(number | string)[]'
 *   describeType({}); // 'object'
 */
export function describeType(value: unknown): string {
  if (!Array.isArray(value)) {
    if (typeof value === 'number') {
      if (isNaN(value)) {
        return 'NaN';
      }

      if (!isFinite(value)) {
        return 'Infinity';
      }

      if (Number.isInteger(value)) {
        return 'integer number';
      }

      return 'float number';
    }

    if (typeof value !== 'object') {
      return typeof value;
    }

    if (value === null) {
      return 'null';
    }

    return typeof value;
  }

  if (value.length === 0) {
    return 'Array (empty)';
  }

  const uniqueTypesSet = new Set(value.map((item) => typeof item));
  const uniqueTypes = Array.from(uniqueTypesSet);

  if (uniqueTypes.length === 1) {
    return `${uniqueTypes[0]}[]`;
  }

  return `(${uniqueTypes.join(' | ')})[]`;
}
