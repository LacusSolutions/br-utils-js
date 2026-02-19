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
