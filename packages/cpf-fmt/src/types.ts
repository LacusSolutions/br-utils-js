/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair, perfectionist/sort-interfaces */
import type { CpfFormatterOptions } from './cpf-formatter-options';

/**
 * Represents valid input types for CPF formatting.
 *
 * A CPF can be provided as:
 *
 * - A string containing digits (with or without formatting)
 * - An array of strings, where each string represents a digit or group of digits.
 */
export type CpfInput =
  | readonly (number | string)[]
  | readonly number[]
  | readonly string[]
  | string;

/**
 * A utility type that represents a value that can be `null`, `undefined`, or
 * the specified type `T`. This type is used for optional parameters and
 * properties that can be explicitly set to `null` or left `undefined` to use
 * default values.
 */
export type Nullable<T> = null | T | undefined;

/**
 * Callback function type for handling formatting failures.
 *
 * This function is invoked when the CPF formatter encounters an error during
 * formatting, such as invalid input, invalid options, or other formatting
 * issues. The callback receives the original input value and an optional error
 * object, and should return a string to use as the fallback output.
 */
export type OnFailCallback = (value: unknown, error?: Error) => string;

/**
 * Configuration interface for CPF (Cadastro de Pessoa Física) formatting
 * options. This interface defines all available options for customizing how CPF
 * digits are formatted, including delimiter characters, hidden digits range,
 * HTML escaping, URL encoding, and error handling. All properties have default
 * values and are optional when creating a new `CpfFormatterOptions` instance.
 */
export interface CpfFormatterOptionsType {
  /**
   * Whether to replace some CPF digits with a wildcard character for privacy.
   * When `true`, digits within the range defined by `hiddenStart` and
   * `hiddenEnd` (inclusive) will be replaced with the character specified in
   * `hiddenKey`. This is useful for displaying CPF numbers in a partially
   * masked format for privacy or security purposes.
   *
   * @default false
   */
  hidden: boolean;

  /**
   * The string used to replace hidden CPF digits when `hidden` is `true`. This
   * string is used to mask digits in the range from `hiddenStart` to
   * `hiddenEnd` (inclusive) when the `hidden` option is enabled. Common choices
   * include `*`, `X`, `#`, etc.
   *
   * @default '*'
   */
  hiddenKey: string;

  /**
   * The start index (inclusive) for hiding CPF digits. This is the first
   * position (0-based) in the CPF string where digits will be replaced with the
   * `hiddenKey` character when `hidden` is `true`. Must be an integer between
   * `0` and `10` (`CPF_LENGTH - 1`).
   *
   * @default 3
   */
  hiddenStart: number;

  /**
   * The end index (inclusive) for hiding CPF digits. This is the last position
   * (0-based) in the CPF string where digits will be replaced with the
   * `hiddenKey` character when `hidden` is `true`. Must be an integer between
   * `0` and `10` (`CPF_LENGTH - 1`).
   *
   * @default 10
   */
  hiddenEnd: number;

  /**
   * The string used as the dot delimiter in formatted CPF. This string
   * separates the first groups of digits in the standard CPF format. In
   * `"123.456.789-10"`, the dots (`.`) are replaced with this delimiter.
   *
   * @default '.'
   */
  dotKey: string;

  /**
   * The string used as the dash delimiter in formatted CPF. This string
   * separates the first group of digits from the check digits at the end of the
   * CPF. In `"123456789-10"`, the dash (`-`) is replaced with this delimiter.
   *
   * @default '-'
   */
  dashKey: string;

  /**
   * Whether to escape HTML special characters in the formatted CPF string. When
   * `true`, HTML special characters (such as `<`, `>`, `&`, `"`, `'`) in the
   * formatted CPF string will be escaped to their HTML entity equivalents. This
   * is particularly useful when:
   *
   * - Using custom delimiters that may contain HTML characters.
   * - Displaying CPF numbers in HTML contexts where special characters could be
   *   interpreted as HTML markup.
   * - Preventing XSS vulnerabilities when rendering user-provided CPF data.
   *
   * @default false
   */
  escape: boolean;

  /**
   * Whether to URL-encode the formatted CPF string. When `true`, the formatted
   * CPF string will be URL-encoded using `encodeURIComponent`, making it safe
   * to use in URL query parameters, path segments, or other URL contexts. This
   * ensures that special characters in custom keys are properly encoded.
   *
   * @default false
   */
  encode: boolean;

  /**
   * Callback function executed when CPF formatting fails. This function is
   * invoked when the formatter encounters an error during formatting, such as:
   *
   * - Invalid input (non-digit characters, wrong length, etc.)
   * - Invalid options (out-of-range indices, wrong types, etc.)
   * - Other formatting errors.
   *
   * The callback receives the original input value and an optional error
   * object, and should return a string that will be used as the fallback output
   * instead of throwing an error or returning an invalid result.
   *
   * @default () => ''
   */
  onFail: OnFailCallback;
}

export type CpfFormatterOptionsInput = CpfFormatterOptions | Partial<CpfFormatterOptionsType>;
