import {
  CnpjFormatterOptionsHiddenRangeInvalidException,
  CnpjFormatterOptionsTypeError,
} from './exceptions';
import type { CnpjFormatterOptionsType, Nullable, OnFailCallback } from './types';

/**
 * The standard length of a CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * identifier. A CNPJ consists of 14 alphanumeric characters.
 *
 * @constant
 * @type {number}
 */
export const CNPJ_LENGTH = 14;

/**
 * Default value for the `hidden` option. When `false`, all CNPJ characters are
 * displayed.
 *
 * @constant
 * @type {boolean}
 */
const DEFAULT_HIDDEN = false;

/**
 * Default string used to replace hidden CNPJ characters.
 *
 * @constant
 * @type {string}
 */
const DEFAULT_HIDDEN_KEY = '*';

/**
 * Default start index (inclusive) for hiding CNPJ characters. Characters from
 * this index onwards will be replaced with the `hiddenKey` value.
 *
 * @constant
 * @type {number}
 */
const DEFAULT_HIDDEN_START = 5;

/**
 * Default end index (inclusive) for hiding CNPJ characters. Characters up to and
 * including this index will be replaced with the `hiddenKey` value.
 *
 * @constant
 * @type {number}
 */
const DEFAULT_HIDDEN_END = 13;

/**
 * Default string used as the dot delimiter in formatted CNPJ. Used to separate
 * the first groups of characters (XX.XXX.XXX).
 *
 * @constant
 * @type {string}
 */
const DEFAULT_DOT_KEY = '.';

/**
 * Default string used as the slash delimiter in formatted CNPJ. Used to separate
 * the first group of characters from the branch identifier (XXXXXXXX/XXXX).
 *
 * @constant
 * @type {string}
 */
const DEFAULT_SLASH_KEY = '/';

/**
 * Default string used as the dash delimiter in formatted CNPJ. Used to separate
 * the branch identifier from the check digits at the end (XXXX-XX).
 *
 * @constant
 * @type {string}
 */
const DEFAULT_DASH_KEY = '-';

/**
 * Default value for the `escape` option. When `false`, HTML special characters
 * are not escaped.
 *
 * @constant
 * @type {boolean}
 */
const DEFAULT_ESCAPE = false;

/**
 * Default value for the `encode` option. When `false`, the CNPJ string is not
 * URL-encoded.
 *
 * @constant
 * @type {boolean}
 */
const DEFAULT_ENCODE = false;

/**
 * Default callback function executed when formatting fails. Returns an empty
 * string by default.
 *
 * @constant
 * @type {OnFailCallback}
 */
const DEFAULT_ON_FAIL: OnFailCallback = (): string => '';

/**
 * Minimum valid index for the hidden range (inclusive).
 * Must be between 0 and CNPJ_LENGTH - 1.
 *
 * @constant
 * @type {number}
 */
const MIN_HIDDEN_RANGE = 0;

/**
 * Maximum valid index for the hidden range (inclusive).
 * Must be between 0 and CNPJ_LENGTH - 1.
 *
 * @constant
 * @type {number}
 */
const MAX_HIDDEN_RANGE = CNPJ_LENGTH - 1;

/**
 * Class to store the options for the CNPJ formatter. This class provides a
 * centralized way to configure how CNPJ numbers are formatted, including
 * delimiters, hidden character ranges, HTML escaping, URL encoding, and error
 * handling callbacks.
 *
 * @example
 * ```typescript
 * // Create with default options
 * const options = new CnpjFormatterOptions();
 *
 * // Create with custom options
 * const customOptions = new CnpjFormatterOptions({
 *   hidden: true,
 *   hiddenKey: 'X',
 *   dotKey: ','
 * });
 *
 * // Create with multiple override layers
 * const layeredOptions = new CnpjFormatterOptions(
 *   { hidden: true },
 *   { hiddenKey: 'X' },
 *   { dotKey: ',' }
 * );
 * ```
 */
export class CnpjFormatterOptions {
  /**
   * Internal storage for all formatter options.
   *
   * @private
   * @type {CnpjFormatterOptionsType}
   */
  private _options = {} as CnpjFormatterOptionsType;

  /**
   * Creates a new instance of `CnpjFormatterOptions`.
   *
   * Options can be provided in multiple ways:
   * 1. As a single options object or another `CnpjFormatterOptions` instance
   * 2. As multiple override objects that are merged in order (later overrides
   *    take precedence)
   *
   * All options are optional and will default to their predefined values if not
   * provided. The `hiddenStart` and `hiddenEnd` options are validated to ensure
   * they are within the valid range [0, CNPJ_LENGTH - 1] and will be swapped if
   * `hiddenStart > hiddenEnd`.
   *
   * @param {CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>} [options] - Initial
   *   options object or another `CnpjFormatterOptions` instance
   * @param {...(CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>)[]} overrides - Additional
   *   option objects to merge, applied in order
   *
   * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range
   */
  public constructor(
    options?: CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>,
    ...overrides: (CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>)[]
  ) {
    this.hidden = options?.hidden;
    this.hiddenKey = options?.hiddenKey;
    this.dotKey = options?.dotKey;
    this.slashKey = options?.slashKey;
    this.dashKey = options?.dashKey;
    this.escape = options?.escape;
    this.encode = options?.encode;
    this.onFail = options?.onFail;

    this.setHiddenRange(options?.hiddenStart, options?.hiddenEnd);

    for (const override of overrides) {
      this.set(override);
    }
  }

  /**
   * Returns a shallow copy of all current options, frozen to prevent
   * modification. This is useful for creating immutable snapshots of the
   * current configuration.
   *
   * @returns {CnpjFormatterOptionsType}
   */
  public get all(): CnpjFormatterOptionsType {
    const options = { ...this._options };

    return Object.freeze(options);
  }

  /**
   * Gets whether hidden character replacement is enabled. When `true`,
   * characters within the `hiddenStart` to `hiddenEnd` range will be replaced
   * with the `hiddenKey` character.
   *
   * @returns {boolean}
   */
  public get hidden(): boolean {
    return this._options.hidden;
  }

  /**
   * Sets whether hidden character replacement is enabled. When set to `true`,
   * characters within the `hiddenStart` to `hiddenEnd` range will be replaced
   * with the `hiddenKey` character. The value is converted to a boolean using
   * `Boolean()`, so truthy/falsy values are handled appropriately.
   *
   * @param {Nullable<boolean>} value
   */
  public set hidden(value: Nullable<boolean>) {
    let actualHidden = value ?? DEFAULT_HIDDEN;

    actualHidden = Boolean(actualHidden);
    this._options.hidden = actualHidden;
  }

  /**
   * Gets the string used to replace hidden CNPJ characters. This string is
   * used when `hidden` is `true` to mask characters in the range from
   * `hiddenStart` to `hiddenEnd` (inclusive).
   *
   * @returns {string}
   */
  public get hiddenKey(): string {
    return this._options.hiddenKey;
  }

  /**
   * Sets the string used to replace hidden CNPJ characters. This string is
   * used when `hidden` is `true` to mask characters in the range from
   * `hiddenStart` to `hiddenEnd` (inclusive).
   *
   * @param {Nullable<string>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not a string
   */
  public set hiddenKey(value: Nullable<string>) {
    const actualHiddenKey = value ?? DEFAULT_HIDDEN_KEY;

    if (typeof actualHiddenKey !== 'string') {
      throw new CnpjFormatterOptionsTypeError('hiddenKey', actualHiddenKey, 'string');
    }

    this._options.hiddenKey = actualHiddenKey;
  }

  /**
   * Gets the start index (inclusive) for hiding CNPJ characters. This is the
   * first position in the CNPJ string where characters will be replaced with
   * the `hiddenKey` string when `hidden` is `true`. Must be between `0` and
   * `13` (`CNPJ_LENGTH - 1`).
   *
   * @returns {number}
   */
  public get hiddenStart(): number {
    return this._options.hiddenStart;
  }

  /**
   * Sets the start index (inclusive) for hiding CNPJ characters. This is the
   * first position in the CNPJ string where characters will be replaced with
   * the `hiddenKey` when `hidden` is `true`. The value is validated and will be
   * swapped with `hiddenEnd` if necessary to ensure `hiddenStart <= hiddenEnd`.
   *
   * @param {Nullable<number>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not an integer
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If the value is out of valid range [0, CNPJ_LENGTH - 1]
   */
  public set hiddenStart(value: Nullable<number>) {
    this.setHiddenRange(value, this._options.hiddenEnd);
  }

  /**
   * Gets the end index (inclusive) for hiding CNPJ characters. This is the last
   * position in the CNPJ string where characters will be replaced with the
   * `hiddenKey` string when `hidden` is `true`. Must be between `0` and
   * `13` (`CNPJ_LENGTH - 1`).
   *
   * @returns {number}
   */
  public get hiddenEnd(): number {
    return this._options.hiddenEnd;
  }

  /**
   * Sets the end index (inclusive) for hiding CNPJ characters. This is the last
   * position in the CNPJ string where characters will be replaced with the
   * `hiddenKey` when `hidden` is `true`. The value is validated and will be
   * swapped with `hiddenStart` if necessary to ensure `hiddenStart <= hiddenEnd`.
   *
   * @param {Nullable<number>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not an integer
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If the value is
   *   out of valid range [`0`, `CNPJ_LENGTH - 1`]
   */
  public set hiddenEnd(value: Nullable<number>) {
    this.setHiddenRange(this._options.hiddenStart, value);
  }

  /**
   * Gets the string used as the dot delimiter. This string is used to
   * separate the first groups of characters in the formatted CNPJ (e.g., `"."`
   * in "12.345.678/0001-90").
   *
   * @returns {string}
   */
  public get dotKey(): string {
    return this._options.dotKey;
  }

  /**
   * Sets the string used as the dot delimiter. This string is used to
   * separate the first groups of characters in the formatted CNPJ (e.g.,
   * `"."` in `"12.345.678/0001-90"`).
   *
   * @param {Nullable<string>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not a string
   */
  public set dotKey(value: Nullable<string>) {
    const actualDotKey = value ?? DEFAULT_DOT_KEY;

    if (typeof actualDotKey !== 'string') {
      throw new CnpjFormatterOptionsTypeError('dotKey', actualDotKey, 'string');
    }

    this._options.dotKey = actualDotKey;
  }

  /**
   * Gets the string used as the slash delimiter. This string is used to
   * separate the first group of characters from the branch identifier in the
   * formatted CNPJ (e.g., `"/"` in `"12.345.678/0001-90"`).
   *
   * @returns {string}
   */
  public get slashKey(): string {
    return this._options.slashKey;
  }

  /**
   * Sets the string used as the slash delimiter. This string is used to
   * separate the first group of characters from the branch identifier in the
   * formatted CNPJ (e.g., `"/"` in `"12.345.678/0001-90"`).
   *
   * @param {Nullable<string>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not a string
   */
  public set slashKey(value: Nullable<string>) {
    const actualSlashKey = value ?? DEFAULT_SLASH_KEY;

    if (typeof actualSlashKey !== 'string') {
      throw new CnpjFormatterOptionsTypeError('slashKey', actualSlashKey, 'string');
    }

    this._options.slashKey = actualSlashKey;
  }

  /**
   * Gets the string used as the dash delimiter. This string is used to
   * separate the check digits at the end in the formatted CNPJ (e.g., `"-"` in
   * `"12.345.678/0001-90"`).
   *
   * @returns {string}
   */
  public get dashKey(): string {
    return this._options.dashKey;
  }

  /**
   * Sets the string used as the dash delimiter. This string is used to
   * separate the check digits at the end in the formatted CNPJ (e.g., `"-"` in
   * `"12.345.678/0001-90"`).
   *
   * @param {Nullable<string>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not a string
   */
  public set dashKey(value: Nullable<string>) {
    const actualDashKey = value ?? DEFAULT_DASH_KEY;

    if (typeof actualDashKey !== 'string') {
      throw new CnpjFormatterOptionsTypeError('dashKey', actualDashKey, 'string');
    }

    this._options.dashKey = actualDashKey;
  }

  /**
   * Gets whether HTML escaping is enabled. When `true`, HTML special characters
   * (like `<`, `>`, `&`, etc.) in the formatted CNPJ string will be escaped.
   * This is useful when using custom delimiters that may contain HTML
   * characters or when displaying CNPJ in HTML.
   *
   * @returns {boolean}
   */
  public get escape(): boolean {
    return this._options.escape;
  }

  /**
   * Sets whether HTML escaping is enabled. When set to `true`, HTML special
   * characters (like `<`, `>`, `&`, etc.) in the formatted CNPJ string will be
   * escaped. This is useful when using custom delimiters that may contain HTML
   * characters or when displaying CNPJ in HTML. The value is converted to a
   * boolean using `Boolean()`, so truthy/falsy values are handled
   * appropriately.
   *
   * @param {Nullable<boolean>} value
   */
  public set escape(value: Nullable<boolean>) {
    let actualEscape = value ?? DEFAULT_ESCAPE;

    actualEscape = Boolean(actualEscape);
    this._options.escape = actualEscape;
  }

  /**
   * Gets whether URL encoding is enabled. When `true`, the formatted CNPJ
   * string will be URL-encoded, making it safe to use in URL query parameters
   * or path segments.
   *
   * @returns {boolean}
   */
  public get encode(): boolean {
    return this._options.encode;
  }

  /**
   * Sets whether URL encoding is enabled. When set to `true`, the formatted
   * CNPJ string will be URL-encoded, making it safe to use in URL query parameters
   * or path segments. The value is converted to a boolean using `Boolean()`, so
   * truthy/falsy values are handled appropriately.
   *
   * @param {Nullable<boolean>} value
   */
  public set encode(value: Nullable<boolean>) {
    let actualEncode = value ?? DEFAULT_ENCODE;

    actualEncode = Boolean(actualEncode);
    this._options.encode = actualEncode;
  }

  /**
   * Gets the callback function executed when formatting fails. This function is
   * called when the formatter encounters an error (e.g., invalid input, invalid
   * options). It receives the input value and an optional error object, and
   * should return a string to use as the fallback output.
   *
   * @returns {OnFailCallback}
   */
  public get onFail(): OnFailCallback {
    return this._options.onFail;
  }

  /**
   * Sets the callback function executed when formatting fails. This function is
   * called when the formatter encounters an error (e.g., invalid input, invalid
   * options). It receives the input value and an optional error object, and
   * should return a string to use as the fallback output.
   *
   * @param {Nullable<OnFailCallback>} value
   *
   * @throws {CnpjFormatterOptionsTypeError} If the value is not a function
   */
  public set onFail(value: Nullable<OnFailCallback>) {
    const actualOnFail = value ?? DEFAULT_ON_FAIL;

    if (typeof actualOnFail !== 'function') {
      throw new CnpjFormatterOptionsTypeError('onFail', value, 'function');
    }

    this._options.onFail = actualOnFail;
  }

  /**
   * Sets the hiddenStart and hiddenEnd options with proper validation and
   * sanitization. This method validates that both indices are integers within
   * the valid range [`0`, `CNPJ_LENGTH - 1`]. If `hiddenStart > hiddenEnd`, the
   * values are automatically swapped to ensure a valid range. This method is
   * used internally by the `hiddenStart` and `hiddenEnd` setters to maintain
   *
   * @param {Nullable<number>} hiddenStart - The start index (inclusive) for
   *   hiding characters, or `null`/`undefined` for default (5)
   * @param {Nullable<number>} hiddenEnd - The end index (inclusive) for hiding
   *   characters, or `null`/`undefined` for default (13)
   *
   * @returns {this}
   *
   * @throws {CnpjFormatterOptionsTypeError} If either value is not an integer
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If either value
   *   is out of valid range [`0`, `CNPJ_LENGTH - 1`]
   */
  public setHiddenRange(hiddenStart: Nullable<number>, hiddenEnd: Nullable<number>): this {
    let actualHiddenStart = hiddenStart ?? DEFAULT_HIDDEN_START;
    let actualHiddenEnd = hiddenEnd ?? DEFAULT_HIDDEN_END;

    if (typeof actualHiddenStart !== 'number' || !Number.isInteger(actualHiddenStart)) {
      throw new CnpjFormatterOptionsTypeError('hiddenStart', actualHiddenStart, 'integer');
    }

    if (typeof actualHiddenEnd !== 'number' || !Number.isInteger(actualHiddenEnd)) {
      throw new CnpjFormatterOptionsTypeError('hiddenEnd', actualHiddenEnd, 'integer');
    }

    if (actualHiddenStart < MIN_HIDDEN_RANGE || actualHiddenStart > MAX_HIDDEN_RANGE) {
      throw new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        actualHiddenStart,
        MIN_HIDDEN_RANGE,
        MAX_HIDDEN_RANGE,
      );
    }

    if (actualHiddenEnd < MIN_HIDDEN_RANGE || actualHiddenEnd > MAX_HIDDEN_RANGE) {
      throw new CnpjFormatterOptionsHiddenRangeInvalidException(
        'hiddenEnd',
        actualHiddenEnd,
        MIN_HIDDEN_RANGE,
        MAX_HIDDEN_RANGE,
      );
    }

    if (actualHiddenStart > actualHiddenEnd) {
      [actualHiddenStart, actualHiddenEnd] = [actualHiddenEnd, actualHiddenStart];
    }

    this._options.hiddenStart = actualHiddenStart;
    this._options.hiddenEnd = actualHiddenEnd;

    return this;
  }

  /**
   * Sets multiple options at once. This method allows you to update multiple
   * options in a single call. Only the provided options are updated; options
   * not included in the object retain their current values. You can pass either
   * a partial options object or another `CnpjFormatterOptions` instance.
   *
   * @param {CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>} options - An
   *   options object or another `CnpjFormatterOptions` instance
   *
   * @returns {this}
   *
   * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range
   */
  public set(options: CnpjFormatterOptions | Partial<CnpjFormatterOptionsType>): this {
    this.hidden = options.hidden ?? this.hidden;
    this.hiddenKey = options.hiddenKey ?? this.hiddenKey;
    this.dotKey = options.dotKey ?? this.dotKey;
    this.slashKey = options.slashKey ?? this.slashKey;
    this.dashKey = options.dashKey ?? this.dashKey;
    this.escape = options.escape ?? this.escape;
    this.encode = options.encode ?? this.encode;
    this.onFail = options.onFail ?? this.onFail;

    this.setHiddenRange(options.hiddenStart, options?.hiddenEnd);

    return this;
  }
}
