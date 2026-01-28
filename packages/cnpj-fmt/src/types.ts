/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair, perfectionist/sort-interfaces */

/**
 * Represents valid input types for CNPJ formatting.
 *
 * A CNPJ can be provided as:
 * - A string containing alphanumeric characters (with or without formatting)
 * - An array of strings, where each string represents a alphanumeric character
 *   or group of alphanumeric characters
 */
export type CnpjInput = string | string[];

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
 * This function is invoked when the CNPJ formatter encounters an error during
 * formatting, such as invalid input, invalid options, or other formatting
 * issues. The callback receives the original input value and an optional error
 * object, and should return a string to use as the fallback output.
 */
export type OnFailCallback = (value: unknown, error?: Error) => string;

/**
 * Configuration interface for CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * formatting options. This interface defines all available options for
 * customizing how CNPJ numbers are formatted, including delimiter characters,
 * hidden character ranges, HTML escaping, URL encoding, and error handling. All
 * properties have default values and are optional when creating a new
 * `CnpjFormatterOptions` instance.
 */
export interface CnpjFormatterOptionsType {
  /**
   * Whether to replace some CNPJ digits with a wildcard character for privacy.
   * When `true`, digits within the range defined by `hiddenStart` and
   * `hiddenEnd` (inclusive) will be replaced with the character specified in
   * `hiddenKey`. This is useful for displaying CNPJ numbers in a partially
   * masked format for privacy or security purposes.
   *
   * @default false
   */
  hidden: boolean;

  /**
   * The string used to replace hidden CNPJ characters when `hidden` is `true`.
   * This string is used to mask characters in the range from `hiddenStart` to
   * `hiddenEnd` (inclusive) when the `hidden` option is enabled. Common choices
   * include `*`, `X`, `#`, etc.
   *
   * @default '*'
   */
  hiddenKey: string;

  /**
   * The start index (inclusive) for hiding CNPJ characters. This is the first
   * position (0-based) in the CNPJ string where characters will be replaced
   * with the `hiddenKey` character when `hidden` is `true`. Must be an integer
   * between `0` and `13` (`CNPJ_LENGTH - 1`).
   *
   * @default 5
   */
  hiddenStart: number;

  /**
   * The end index (inclusive) for hiding CNPJ characters. This is the last
   * position (0-based) in the CNPJ string where characters will be replaced
   * with the `hiddenKey` character when `hidden` is `true`. Must be an integer
   * between `0` and `13` (`CNPJ_LENGTH - 1`).
   *
   * @default 13
   */
  hiddenEnd: number;

  /**
   * The string used as the dot delimiter in formatted CNPJ. This string
   * separates the first groups of characters in the standard CNPJ format. In
   * `"12.345.678/0001-90"`, the dots (`.`) are replaced with this delimiter.
   *
   * @default '.'
   */
  dotKey: string;

  /**
   * The string used as the slash delimiter in formatted CNPJ. This string
   * separates the first group of characters from the branch identifier in the
   * standard CNPJ format. In `"12.345.678/0001-90"`, the slash (`/`) is
   * replaced with this delimiter.
   *
   * @default '/'
   */
  slashKey: string;

  /**
   * The string used as the dash delimiter in formatted CNPJ. This string
   * separates the branch identifier from the check digits at the end of the
   * CNPJ. In `"12.345.678/0001-90"`, the dash (`-`) is replaced with this
   * delimiter.
   *
   * @default '-'
   */
  dashKey: string;

  /**
   * Whether to escape HTML special characters in the formatted CNPJ string.
   * When `true`, HTML special characters (such as `<`, `>`, `&`, `"`, `'`) in
   * the formatted CNPJ string will be escaped to their HTML entity equivalents.
   * This is particularly useful when:
   * - Using custom delimiters that may contain HTML characters
   * - Displaying CNPJ numbers in HTML contexts where special characters could be
   *   interpreted as HTML markup
   * - Preventing XSS vulnerabilities when rendering user-provided CNPJ data
   *
   * @default false
   */
  escape: boolean;

  /**
   * Whether to URL-encode the formatted CNPJ string. When `true`, the formatted
   * CNPJ string will be URL-encoded using `encodeURIComponent`, making it safe
   * to use in URL query parameters, path segments, or other URL contexts. This
   * ensures that special characters like the `"/"` in the standard formatting
   * or in custom keys are properly encoded.
   *
   * @default false
   */
  encode: boolean;

  /**
   * Callback function executed when CNPJ formatting fails. This function is
   * invoked when the formatter encounters an error during formatting, such as:
   * - Invalid input (non-numeric characters, wrong length, etc.)
   * - Invalid options (out-of-range indices, wrong types, etc.)
   * - Other formatting errors
   *
   * The callback receives the original input value and an optional error
   * object, and should return a string that will be used as the fallback output
   * instead of throwing an error or returning an invalid result.
   *
   * @default () => ''
   */
  onFail: OnFailCallback;
}
