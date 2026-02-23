/**
 * Character type for the generated CNPJ sequence.
 *
 * - `alphanumeric` (default): Generates a sequence of alphanumeric characters
 *   (`0-9A-Z`).
 * - `numeric`: Generates a sequence of numbers-only characters (`0-9`).
 * - `alphabetic`: Generates a sequence of alphabetic characters (`A-Z`).
 */
export type CnpjType = 'alphabetic' | 'alphanumeric' | 'numeric';
