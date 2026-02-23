/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import type { CpfGeneratorOptions } from './cpf-generator-options';

/**
 * Configuration type for CPF (Cadastro de Pessoa Física) generation options.
 * Defines the resolved options used internally: format (standard formatting)
 * and prefix (partial start string). All properties have default values when
 * creating a `CpfGeneratorOptions` instance.
 */
export interface CpfGeneratorOptionsType {
  /**
   * Whether to format the generated CPF string with the standard formatting
   * (`000.000.000-00`).
   *
   * @default false
   */
  format: boolean;

  /**
   * A partial string containing 0 to 9 digits to use as the start of the
   * generated CPF. Only digits are kept; the rest is stripped. If provided,
   * only the missing digits are generated randomly. For example, if the prefix
   * `123456` (6 digits) is given, only the next 3 digits are randomly generated
   * and concatenated to the prefix.
   *
   * Note: If the evaluated prefix (after stripping non-digit characters) is
   * longer than 9 digits, the extra digits are ignored, because a CPF has 9
   * base digits followed by 2 calculated check digits.
   *
   * @default ''
   */
  prefix: string;
}

export type CpfGeneratorOptionsInput = CpfGeneratorOptions | Partial<CpfGeneratorOptionsType>;
