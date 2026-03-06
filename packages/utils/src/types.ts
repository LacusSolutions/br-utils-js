/**
 * A utility type that represents a value that can be `null`, `undefined`, or
 * the specified type `T`. This type is used for optional parameters and
 * properties that can be explicitly set to `null` or left `undefined` to use
 * default values.
 */
export type Nullable<T> = null | T | undefined;

/**
 * Character type for the generated sequence.
 *
 * - `alphanumeric` (default): Generates a sequence of alphanumeric characters
 *   (`0-9A-Z`).
 * - `numeric`: Generates a sequence of numbers-only characters (`0-9`).
 * - `alphabetic`: Generates a sequence of alphabetic characters (`A-Z`).
 */
export type SequenceType = 'alphabetic' | 'alphanumeric' | 'numeric';
