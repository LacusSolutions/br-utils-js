/**
 * Represents valid input types for CNPJ check digits.
 *
 * A CNPJ can be provided as:
 * - A string containing alphanumeric characters (with or without formatting)
 * - An array of strings, where each string represents a alphanumeric character
 *   or group of alphanumeric characters
 */
export type CnpjInput = string | string[];
