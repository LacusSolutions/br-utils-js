/**
 * Valid input types for CPF validation.
 *
 * A CPF may be given as:
 *
 * - A string of numeric characters (with or without formatting).
 * - An array of strings, each representing one or more alphanumeric characters.
 */
export type CpfInput = readonly string[] | string;
