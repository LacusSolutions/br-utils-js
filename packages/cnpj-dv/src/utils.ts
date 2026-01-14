/**
 * Describes the type of a value for error messages.
 *
 * @param value - The value to describe
 * @returns A human-readable type description
 *
 * @example
 * describeType(null)           // 'null'
 * describeType(undefined)      // 'undefined'
 * describeType(42)             // 'number'
 * describeType('hello')        // 'string'
 * describeType([])             // 'Array (empty)'
 * describeType([1, 2, 3])      // 'number[]'
 * describeType([1, 'a', 2])    // '(number | string)[]'
 * describeType(new Set())      // 'Set'
 * describeType(new Map())      // 'Map'
 * describeType({})             // 'object'
 */
export function describeType(value: unknown): string {
  if (!Array.isArray(value)) {
    if (typeof value !== 'object') {
      return typeof value;
    }

    if (value === null) {
      return 'null';
    }

    if (value instanceof Set) {
      return 'Set';
    }

    if (value instanceof Map) {
      return 'Map';
    }

    return typeof value;
  }

  if (value.length === 0) {
    return 'Array (empty)';
  }

  const uniqueTypes = Array.from(new Set(value.map((item) => typeof item)));

  if (uniqueTypes.length === 1) {
    return `${uniqueTypes[0]}[]`;
  }

  return `(${uniqueTypes.join(' | ')})[]`;
}
