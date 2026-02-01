import { CNPJ_LENGTH, CnpjFormatterOptions } from './cnpj-formatter-options';
import { CnpjFormatterInputLengthException, CnpjFormatterInputTypeError } from './exceptions';
import type { CnpjFormatterOptionsInput, CnpjInput } from './types';
import { escapeHTML } from './utils';

/**
 * @typedef {import('./exceptions').CnpjFormatterOptionsTypeError} CnpjFormatterOptionsTypeError
 *
 * @typedef {import('./exceptions').CnpjFormatterOptionsHiddenRangeInvalidException} CnpjFormatterOptionsHiddenRangeInvalidException
 */

/**
 * A rarely-used 1-length character that is replaced with `hiddenKey` when
 * `hidden` is `true`.
 *
 * @constant
 * @type {string}
 */
const HIDDEN_KEY_PLACEHOLDER = CnpjFormatterOptions.DISALLOWED_KEY_CHARACTERS[0];

/**
 * Formatter for CNPJ (Cadastro Nacional da Pessoa Jurídica) identifiers. It
 * normalizes and optionally masks, HTML-escapes, or URL-encodes 14-character
 * alphanumeric CNPJ input. Accepts a string or array of strings;
 * non-alphanumeric characters are stripped and the result is uppercased.
 * Invalid input or length is handled via the configured `onFail` callback
 * instead of throwing.
 */
export class CnpjFormatter {
  /**
   * Default options used when no per-call options are provided.
   *
   * @private
   * @type {CnpjFormatterOptions}
   */
  private _options: CnpjFormatterOptions;

  /**
   * Creates a new `CnpjFormatter` with optional default options.
   *
   * Default options apply to every call to `format` unless overridden by the
   * per-call `options` argument. Options control masking, HTML escaping, URL
   * encoding, and the callback used when formatting fails.
   *
   * When `defaultOptions` is a `CnpjFormatterOptions` instance, that instance
   * is used directly (no copy is created). Mutating it later (e.g. via the
   * `options` getter or the original reference) affects future `format` calls
   * that do not pass per-call options. When a plain object or nothing is
   * passed, a new `CnpjFormatterOptions` instance is created from it.
   *
   * @param {CnpjFormatterOptionsInput} [defaultOptions] - Initial options: a
   *   plain object (merged into a new `CnpjFormatterOptions`), a
   *   `CnpjFormatterOptions` instance (used as-is), or omitted for built-in
   *   defaults.
   *
   * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range
   */
  public constructor(defaultOptions?: CnpjFormatterOptionsInput) {
    this._options =
      defaultOptions instanceof CnpjFormatterOptions
        ? defaultOptions
        : new CnpjFormatterOptions(defaultOptions);
  }

  /**
   * Formats a CNPJ value into a normalized 14-character alphanumeric string.
   *
   * Input is normalized by stripping non-alphanumeric characters and converting
   * to uppercase. If the result length is not exactly 14, or if the input is
   * not a string or array of strings, the configured `onFail` callback is
   * invoked with the original value and an error; its return value is used as
   * the result.
   *
   * When valid, the result may be further transformed according to options:
   * - If `hidden` is `true`, characters between `hiddenStart` and `hiddenEnd`
   *   (inclusive) are replaced with `hiddenKey`.
   * - If `escape` is `true`, HTML special characters are escaped.
   * - If `encode` is `true`, the string is passed through `encodeURIComponent`.
   *
   * Per-call `options` are merged over the instance default options for this
   * call only; the instance defaults are unchanged.
   *
   * @param {CnpjInput} cnpjInput - CNPJ as a string or array of strings (e.g.
   *   raw digits or preformatted). Arrays are joined with no separator before
   *   processing.
   * @param {CnpjFormatterOptionsInput} [options] - Overrides for this call.
   *   Merged with instance defaults; omitted keys keep the default.
   * @returns {string}
   *
   * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range
   * @throws {CnpjFormatterInputTypeError} If the input is not a string or array
   *   of strings
   * @throws {CnpjFormatterInputLengthException} If the input length is not
   *   exactly 14 after sanitization
   */
  public format(cnpjInput: CnpjInput, options?: CnpjFormatterOptionsInput): string {
    const actualInput = cnpjInput as unknown;
    const nonArrayInput = Array.isArray(actualInput) ? actualInput.join('') : actualInput;
    const actualOptions = options
      ? new CnpjFormatterOptions(this._options, options)
      : this._options;

    if (typeof nonArrayInput !== 'string') {
      const error = new CnpjFormatterInputTypeError(cnpjInput, 'string or string[]');

      return actualOptions.onFail(nonArrayInput, error);
    }

    const alphanumericOnly = nonArrayInput.replace(/[^0-9A-Z]/gi, '');
    let formattedCnpj = alphanumericOnly.toUpperCase();

    if (formattedCnpj.length !== CNPJ_LENGTH) {
      const error = new CnpjFormatterInputLengthException(
        nonArrayInput,
        formattedCnpj,
        CNPJ_LENGTH,
      );

      return actualOptions.onFail(nonArrayInput, error);
    }

    if (actualOptions.hidden) {
      const startingPart = formattedCnpj.slice(0, actualOptions.hiddenStart);
      const endingPart = formattedCnpj.slice(actualOptions.hiddenEnd + 1);
      const hiddenPartLength = actualOptions.hiddenEnd - actualOptions.hiddenStart + 1;
      const hiddenPart = HIDDEN_KEY_PLACEHOLDER.repeat(hiddenPartLength);

      formattedCnpj = startingPart + hiddenPart + endingPart;
    }

    formattedCnpj =
      formattedCnpj.slice(0, 2) +
      actualOptions.dotKey +
      formattedCnpj.slice(2, 5) +
      actualOptions.dotKey +
      formattedCnpj.slice(5, 8) +
      actualOptions.slashKey +
      formattedCnpj.slice(8, 12) +
      actualOptions.dashKey +
      formattedCnpj.slice(12, 14);
    formattedCnpj = formattedCnpj.replace(
      new RegExp(HIDDEN_KEY_PLACEHOLDER, 'g'),
      actualOptions.hiddenKey,
    );

    if (actualOptions.escape) {
      formattedCnpj = escapeHTML(formattedCnpj);
    }

    if (actualOptions.encode) {
      formattedCnpj = encodeURIComponent(formattedCnpj);
    }

    return formattedCnpj;
  }

  /**
   * Returns the default options used by this formatter when per-call options
   * are not provided.
   *
   * The returned object is the same instance used internally; mutating it
   * (e.g. via setters on `CnpjFormatterOptions`) affects future `format`
   * calls that do not pass `options`.
   *
   * @returns {CnpjFormatterOptions}
   */
  public get options(): CnpjFormatterOptions {
    return this._options;
  }
}

Object.freeze(CnpjFormatter);
