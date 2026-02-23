import { type Nullable } from '@lacussoft/utils';

import {
  CpfFormatterOptionsForbiddenKeyCharacterException,
  CpfFormatterOptionsHiddenRangeInvalidException,
  CpfFormatterOptionsTypeError,
} from './exceptions';
import type { CpfFormatterOptionsInput, CpfFormatterOptionsType, OnFailCallback } from './types';

/**
 * The standard length of a CPF (Cadastro de Pessoa Física) identifier (11
 * digits).
 */
export const CPF_LENGTH = 11;

/**
 * Minimum valid index for the hidden range (inclusive). Must be between 0 and
 * CPF_LENGTH - 1.
 */
const MIN_HIDDEN_RANGE = 0;

/**
 * Maximum valid index for the hidden range (inclusive). Must be between 0 and
 * CPF_LENGTH - 1.
 */
const MAX_HIDDEN_RANGE = CPF_LENGTH - 1;

/**
 * Class to store the options for the CPF formatter. This class provides a
 * centralized way to configure how CPF numbers are formatted, including
 * delimiters, hidden digit ranges, HTML escaping, URL encoding, and error
 * handling callbacks.
 */
export class CpfFormatterOptions {
  /**
   * Default value for the `hidden` option. When `false`, all CPF digits are
   * displayed.
   */
  public static readonly DEFAULT_HIDDEN = false;

  /**
   * Default string used to replace hidden CPF digits.
   */
  public static readonly DEFAULT_HIDDEN_KEY = '*';

  /**
   * Default start index (inclusive) for hiding CPF digits. Digits from this
   * index onwards will be replaced with the `hiddenKey` value.
   */
  public static readonly DEFAULT_HIDDEN_START = 3;

  /**
   * Default end index (inclusive) for hiding CPF digits. Digits up to and
   * including this index will be replaced with the `hiddenKey` value.
   */
  public static readonly DEFAULT_HIDDEN_END = 10;

  /**
   * Default string used as the dot delimiter in formatted CPF. Used to separate
   * the first groups of digits (XXX.XXX.XXX).
   */
  public static readonly DEFAULT_DOT_KEY = '.';

  /**
   * Default string used as the dash delimiter in formatted CPF. Used to
   * separate the first group of digits from the check digits at the end (-XX).
   */
  public static readonly DEFAULT_DASH_KEY = '-';

  /**
   * Default value for the `escape` option. When `false`, HTML special
   * characters are not escaped.
   */
  public static readonly DEFAULT_ESCAPE = false;

  /**
   * Default value for the `encode` option. When `false`, the CPF string is not
   * URL-encoded.
   */
  public static readonly DEFAULT_ENCODE = false;

  /**
   * Default callback function executed when formatting fails. Returns an empty
   * string by default.
   */
  public static readonly DEFAULT_ON_FAIL: OnFailCallback = function DEFAULT_ON_FAIL(): string {
    return '';
  };

  /**
   * Characters that are not allowed in key options (`hiddenKey`, `dotKey`,
   * `dashKey`). They are reserved for internal formatting logic.
   *
   * For now, it's only used to replace the hidden key placeholder in the
   * CpfFormatter class. However, this set of characters is reserved for future
   * use already.
   */
  public static readonly DISALLOWED_KEY_CHARACTERS = Object.freeze([
    '\u00e5',
    '\u00eb',
    '\u00ef',
    '\u00f6',
  ]);

  private _options = {} as CpfFormatterOptionsType;

  /**
   * Creates a new instance of `CpfFormatterOptions`.
   *
   * Options can be provided in multiple ways:
   *
   * 1. As a single options object or another `CpfFormatterOptions` instance.
   * 2. As multiple override objects that are merged in order (later overrides take
   *    precedence)
   *
   * All options are optional and will default to their predefined values if not
   * provided. The `hiddenStart` and `hiddenEnd` options are validated to ensure
   * they are within the valid range [0, CPF_LENGTH - 1] and will be swapped if
   * `hiddenStart > hiddenEnd`.
   *
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If any key
   *   option (`hiddenKey`, `dotKey`, `dashKey`) contains a disallowed
   *   character.
   */
  public constructor(
    defaultOptions?: CpfFormatterOptionsInput,
    ...overrides: CpfFormatterOptionsInput[]
  ) {
    this.hidden = defaultOptions?.hidden;
    this.hiddenKey = defaultOptions?.hiddenKey;
    this.dotKey = defaultOptions?.dotKey;
    this.dashKey = defaultOptions?.dashKey;
    this.escape = defaultOptions?.escape;
    this.encode = defaultOptions?.encode;
    this.onFail = defaultOptions?.onFail;

    this.setHiddenRange(defaultOptions?.hiddenStart, defaultOptions?.hiddenEnd);

    for (const override of overrides) {
      this.set(override);
    }
  }

  /**
   * Returns a shallow copy of all current options, frozen to prevent
   * modification. This is useful for creating immutable snapshots of the
   * current configuration.
   */
  public get all(): CpfFormatterOptionsType {
    const options = { ...this._options };

    return Object.freeze(options);
  }

  /**
   * Gets whether hidden digit replacement is enabled. When `true`, digits
   * within the `hiddenStart` to `hiddenEnd` range will be replaced with the
   * `hiddenKey` character.
   */
  public get hidden(): boolean {
    return this._options.hidden;
  }

  /**
   * Sets whether hidden digit replacement is enabled. When set to `true`,
   * digits within the `hiddenStart` to `hiddenEnd` range will be replaced with
   * the `hiddenKey` character. The value is converted to a boolean using
   * `Boolean()`, so truthy/falsy values are handled appropriately.
   */
  public set hidden(value: Nullable<boolean>) {
    let actualHidden = value ?? CpfFormatterOptions.DEFAULT_HIDDEN;

    actualHidden = Boolean(actualHidden);
    this._options.hidden = actualHidden;
  }

  /**
   * Gets the string used to replace hidden CPF digits. This string is used when
   * `hidden` is `true` to mask digits in the range from `hiddenStart` to
   * `hiddenEnd` (inclusive).
   */
  public get hiddenKey(): string {
    return this._options.hiddenKey;
  }

  /**
   * Sets the string used to replace hidden CPF digits. This string is used when
   * `hidden` is `true` to mask digits in the range from `hiddenStart` to
   * `hiddenEnd` (inclusive).
   *
   * @throws {CpfFormatterOptionsTypeError} If the value is not a string.
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If the value
   *   contains any disallowed key character.
   */
  public set hiddenKey(value: Nullable<string>) {
    const actualHiddenKey = value ?? CpfFormatterOptions.DEFAULT_HIDDEN_KEY;

    if (typeof actualHiddenKey !== 'string') {
      throw new CpfFormatterOptionsTypeError('hiddenKey', actualHiddenKey, 'string');
    }

    this._assertNoDisallowedKeyCharacters('hiddenKey', actualHiddenKey);

    this._options.hiddenKey = actualHiddenKey;
  }

  /**
   * Gets the start index (inclusive) for hiding CPF digits. This is the first
   * position in the CPF string where digits will be replaced with the
   * `hiddenKey` string when `hidden` is `true`. Must be between `0` and `10`
   * (`CPF_LENGTH - 1`).
   */
  public get hiddenStart(): number {
    return this._options.hiddenStart;
  }

  /**
   * Sets the start index (inclusive) for hiding CPF digits. This is the first
   * position in the CPF string where digits will be replaced with the
   * `hiddenKey` when `hidden` is `true`. The value is validated and will be
   * swapped with `hiddenEnd` if necessary to ensure `hiddenStart <=
   * hiddenEnd`.
   *
   * @throws {CpfFormatterOptionsTypeError} If the value is not an integer.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If the value is
   *   out of valid range [0, CPF_LENGTH - 1]
   */
  public set hiddenStart(value: Nullable<number>) {
    this.setHiddenRange(value, this._options.hiddenEnd);
  }

  /**
   * Gets the end index (inclusive) for hiding CPF digits. This is the last
   * position in the CPF string where digits will be replaced with the
   * `hiddenKey` string when `hidden` is `true`. Must be between `0` and `10`
   * (`CPF_LENGTH - 1`).
   */
  public get hiddenEnd(): number {
    return this._options.hiddenEnd;
  }

  /**
   * Sets the end index (inclusive) for hiding CPF digits. This is the last
   * position in the CPF string where digits will be replaced with the
   * `hiddenKey` when `hidden` is `true`. The value is validated and will be
   * swapped with `hiddenStart` if necessary to ensure `hiddenStart <=
   * hiddenEnd`.
   *
   * @throws {CpfFormatterOptionsTypeError} If the value is not an integer.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If the value is
   *   out of valid range [`0`, `CPF_LENGTH - 1`]
   */
  public set hiddenEnd(value: Nullable<number>) {
    this.setHiddenRange(this._options.hiddenStart, value);
  }

  /**
   * Gets the string used as the dot delimiter. This string is used to separate
   * the first groups of digits in the formatted CPF (e.g., `"."` in
   * "123.456.789-10").
   */
  public get dotKey(): string {
    return this._options.dotKey;
  }

  /**
   * Sets the string used as the dot delimiter. This string is used to separate
   * the first groups of digits in the formatted CPF (e.g., `"."` in
   * `"123.456.789-10"`).
   *
   * @throws {CpfFormatterOptionsTypeError} If the value is not a string.
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If the value
   *   contains any disallowed key character.
   */
  public set dotKey(value: Nullable<string>) {
    const actualDotKey = value ?? CpfFormatterOptions.DEFAULT_DOT_KEY;

    if (typeof actualDotKey !== 'string') {
      throw new CpfFormatterOptionsTypeError('dotKey', actualDotKey, 'string');
    }

    this._assertNoDisallowedKeyCharacters('dotKey', actualDotKey);

    this._options.dotKey = actualDotKey;
  }

  /**
   * Gets the string used as the dash delimiter. This string is used to separate
   * the check digits at the end in the formatted CPF (e.g., `"-"` in
   * `"123.456.789-10"`).
   */
  public get dashKey(): string {
    return this._options.dashKey;
  }

  /**
   * Sets the string used as the dash delimiter. This string is used to separate
   * the check digits at the end in the formatted CPF (e.g., `"-"` in
   * `"123.456.789-10"`).
   *
   * @throws {CpfFormatterOptionsTypeError} If the value is not a string.
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If the value
   *   contains any disallowed key character.
   */
  public set dashKey(value: Nullable<string>) {
    const actualDashKey = value ?? CpfFormatterOptions.DEFAULT_DASH_KEY;

    if (typeof actualDashKey !== 'string') {
      throw new CpfFormatterOptionsTypeError('dashKey', actualDashKey, 'string');
    }

    this._assertNoDisallowedKeyCharacters('dashKey', actualDashKey);

    this._options.dashKey = actualDashKey;
  }

  /**
   * Gets whether HTML escaping is enabled. When `true`, HTML special characters
   * (like `<`, `>`, `&`, etc.) in the formatted CPF string will be escaped.
   * This is useful when using custom delimiters that may contain HTML
   * characters or when displaying CPF in HTML.
   */
  public get escape(): boolean {
    return this._options.escape;
  }

  /**
   * Sets whether HTML escaping is enabled. When set to `true`, HTML special
   * characters (like `<`, `>`, `&`, etc.) in the formatted CPF string will be
   * escaped. This is useful when using custom delimiters that may contain HTML
   * characters or when displaying CPF in HTML. The value is converted to a
   * boolean using `Boolean()`, so truthy/falsy values are handled
   * appropriately.
   */
  public set escape(value: Nullable<boolean>) {
    let actualEscape = value ?? CpfFormatterOptions.DEFAULT_ESCAPE;

    actualEscape = Boolean(actualEscape);
    this._options.escape = actualEscape;
  }

  /**
   * Gets whether URL encoding is enabled. When `true`, the formatted CPF string
   * will be URL-encoded, making it safe to use in URL query parameters or path
   * segments.
   */
  public get encode(): boolean {
    return this._options.encode;
  }

  /**
   * Sets whether URL encoding is enabled. When set to `true`, the formatted CPF
   * string will be URL-encoded, making it safe to use in URL query parameters
   * or path segments. The value is converted to a boolean using `Boolean()`, so
   * truthy/falsy values are handled appropriately.
   */
  public set encode(value: Nullable<boolean>) {
    let actualEncode = value ?? CpfFormatterOptions.DEFAULT_ENCODE;

    actualEncode = Boolean(actualEncode);
    this._options.encode = actualEncode;
  }

  /**
   * Gets the callback function executed when formatting fails. This function is
   * called when the formatter encounters an error (e.g., invalid input, invalid
   * options). It receives the input value and an optional error object, and
   * should return a string to use as the fallback output.
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
   * @throws {CpfFormatterOptionsTypeError} If the value is not a function.
   */
  public set onFail(value: Nullable<OnFailCallback>) {
    const actualOnFail = value ?? CpfFormatterOptions.DEFAULT_ON_FAIL;

    if (typeof actualOnFail !== 'function') {
      throw new CpfFormatterOptionsTypeError('onFail', value, 'function');
    }

    this._options.onFail = actualOnFail;
  }

  /**
   * Sets the hiddenStart and hiddenEnd options with proper validation and
   * sanitization. This method validates that both indices are integers within
   * the valid range [`0`, `CPF_LENGTH - 1`]. If `hiddenStart > hiddenEnd`, the
   * values are automatically swapped to ensure a valid range. This method is
   * used internally by the `hiddenStart` and `hiddenEnd` setters to maintain
   * consistency.
   *
   * @throws {CpfFormatterOptionsTypeError} If either value is not an integer.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If either value is
   *   out of valid range [`0`, `CPF_LENGTH - 1`]
   */
  public setHiddenRange(hiddenStart: Nullable<number>, hiddenEnd: Nullable<number>): this {
    let actualHiddenStart = hiddenStart ?? CpfFormatterOptions.DEFAULT_HIDDEN_START;
    let actualHiddenEnd = hiddenEnd ?? CpfFormatterOptions.DEFAULT_HIDDEN_END;

    if (typeof actualHiddenStart !== 'number' || !Number.isInteger(actualHiddenStart)) {
      throw new CpfFormatterOptionsTypeError('hiddenStart', actualHiddenStart, 'integer');
    }

    if (typeof actualHiddenEnd !== 'number' || !Number.isInteger(actualHiddenEnd)) {
      throw new CpfFormatterOptionsTypeError('hiddenEnd', actualHiddenEnd, 'integer');
    }

    if (actualHiddenStart < MIN_HIDDEN_RANGE || actualHiddenStart > MAX_HIDDEN_RANGE) {
      throw new CpfFormatterOptionsHiddenRangeInvalidException(
        'hiddenStart',
        actualHiddenStart,
        MIN_HIDDEN_RANGE,
        MAX_HIDDEN_RANGE,
      );
    }

    if (actualHiddenEnd < MIN_HIDDEN_RANGE || actualHiddenEnd > MAX_HIDDEN_RANGE) {
      throw new CpfFormatterOptionsHiddenRangeInvalidException(
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
   * a partial options object or another `CpfFormatterOptions` instance.
   *
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If any key
   *   option (`hiddenKey`, `dotKey`, `dashKey`) contains a disallowed
   *   character.
   */
  public set(options: CpfFormatterOptionsInput): this {
    this.hidden = options.hidden ?? this.hidden;
    this.hiddenKey = options.hiddenKey ?? this.hiddenKey;
    this.dotKey = options.dotKey ?? this.dotKey;
    this.dashKey = options.dashKey ?? this.dashKey;
    this.escape = options.escape ?? this.escape;
    this.encode = options.encode ?? this.encode;
    this.onFail = options.onFail ?? this.onFail;

    this.setHiddenRange(
      options.hiddenStart ?? this.hiddenStart,
      options.hiddenEnd ?? this.hiddenEnd,
    );

    return this;
  }

  /**
   * Throws if the given string contains any disallowed key character.
   *
   * @throws {CpfFormatterOptionsForbiddenKeyCharacterException} If `value`
   *   contains any character from `getDisallowedKeyCharacters()`.
   */
  private _assertNoDisallowedKeyCharacters(
    optionName: keyof CpfFormatterOptionsType,
    value: string,
  ): void {
    const forbiddenChars = CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS;
    const hasForbiddenChars = forbiddenChars.some((ch) => value.includes(ch));

    if (hasForbiddenChars) {
      throw new CpfFormatterOptionsForbiddenKeyCharacterException(
        optionName,
        value,
        forbiddenChars,
      );
    }
  }
}

Object.freeze(CpfFormatterOptions);
