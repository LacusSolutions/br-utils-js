/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import type { CnpjValidatorOptions } from './cnpj-validator-options';

/**
 * Valid input types for CNPJ validation.
 *
 * A CNPJ may be given as:
 *
 * - A string of alphanumeric characters (with or without formatting), or.
 * - An array of strings, each representing one or more alphanumeric characters.
 */
export type CnpjInput = readonly string[] | string;

/**
 * Character set for CNPJ values (generation or validation).
 *
 * - `alphanumeric` (default): digits and letters (`0-9A-Z`)
 * - `numeric`: digits only (`0-9`)
 */
export type CnpjType = 'alphanumeric' | 'numeric';

/**
 * Utility type for values that may be `null`, `undefined`, or `T`. Used for
 * optional parameters and properties that can be set to `null` or left
 * `undefined` to use defaults.
 */
export type Nullable<T> = null | T | undefined;

/**
 * Resolved CNPJ (Cadastro Nacional da Pessoa Jurídica) validator/generator
 * options used internally. All properties have defaults when creating a
 * `CnpjValidatorOptions` instance.
 */
export interface CnpjValidatorOptionsType {
  /**
   * Whether validation is case-sensitive. Example: for a valid CNPJ
   * `AB.123.CDE/FGHI-45`, if `caseSensitive` is `false`, `ab.123.cde/fghi-45`
   * is also considered valid.
   *
   * @default true
   */
  caseSensitive: boolean;

  /**
   * Character set used to determine valid CNPJ characters (and for generation
   * when applicable).
   *
   * - `alphanumeric`: alphanumeric CNPJ format.
   * - `numeric`: numeric-only (legacy) CNPJ format.
   *
   * @default 'alphanumeric'
   */
  type: CnpjType;
}

export type CnpjValidatorOptionsInput = CnpjValidatorOptions | Partial<CnpjValidatorOptionsType>;
