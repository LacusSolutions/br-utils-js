/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import type { SequenceType } from '@lacussoft/utils';

import type { CnpjGeneratorOptions } from './cnpj-generator-options';

/**
 * Character type for the generated CNPJ sequence.
 *
 * - `alphanumeric` (default): Generates a sequence of alphanumeric characters
 *   (`0-9A-Z`).
 * - `numeric`: Generates a sequence of numbers-only characters (`0-9`).
 * - `alphabetic`: Generates a sequence of alphabetic characters (`A-Z`).
 */
export type CnpjType = SequenceType;

/**
 * A utility type that represents a value that can be `null`, `undefined`, or
 * the specified type `T`. This type is used for optional parameters and
 * properties that can be explicitly set to `null` or left `undefined` to use
 * default values.
 */
export type Nullable<T> = null | T | undefined;

/**
 * Configuration type for CNPJ (Cadastro Nacional da Pessoa Jurídica) generation
 * options. Defines the resolved options used internally: format (standard
 * formatting), prefix (partial start string), and type (character set). All
 * properties have default values when creating a `CnpjGeneratorOptions`
 * instance.
 */
export interface CnpjGeneratorOptionsType {
  /**
   * Whether to format the generated CNPJ string with the standard formatting
   * (`00.000.000/0000-00`).
   *
   * @default false
   */
  format: boolean;

  /**
   * A partial string containing 0 to 12 alphanumeric characters to use as the
   * start of the generated CNPJ. Only alphanumeric characters are kept; the
   * rest is stripped. If provided, only the missing characters are generated
   * randomly. For example, if the prefix `AAABBB` (6 characters) is given, only
   * the next 8 characters are randomly generated and concatenated to the
   * prefix.
   *
   * A common use case is to provide a base ID (first 8 characters) and let the
   * library generate the branch ID (characters 9 to 12) for multiple runs. This
   * way you can gen multiple CNPJ's under the same "business umbrella".
   *
   * Note: If the evaluated prefix (after stripping non-alphanumeric characters)
   * is longer than 12 characters, the extra characters are ignored, because a
   * CNPJ has 12 base characters followed by 2 calculated check digits.
   *
   * @default ''
   */
  prefix: string;

  /**
   * The type of characters to generate for the CNPJ. If a `prefix` is provided,
   * only the remaining characters (those generated randomly) use this type.
   *
   * The options are:
   *
   * - `alphabetic`: Generates a sequence of alphabetic characters (`A-Z`).
   * - `alphanumeric`: Generates a sequence of alphanumeric characters (`0-9A-Z`).
   * - `numeric`: Generates a sequence of numbers-only characters (`0-9`).
   *
   * @default 'alphanumeric'
   */
  type: CnpjType;
}

export type CnpjGeneratorOptionsInput = CnpjGeneratorOptions | Partial<CnpjGeneratorOptionsType>;
