/**
 * Represents valid input types for CPF check digits.
 *
 * A CPF can be provided as:
 *
 * - A string containing digits (with or without formatting)
 * - An array of strings, where each string represents a digit or group of digits.
 */
export type CpfInput = string | string[];
