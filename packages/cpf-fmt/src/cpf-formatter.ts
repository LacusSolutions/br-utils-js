import { escapeHTML } from '@lacussoft/utils';

import { CPF_LENGTH, CpfFormatterOptions } from './cpf-formatter-options';
import { CpfFormatterInputLengthException, CpfFormatterInputTypeError } from './exceptions';
import type { CpfFormatterOptionsInput, CpfInput } from './types';

/**
 * @typedef {import('./exceptions').CpfFormatterOptionsTypeError} CpfFormatterOptionsTypeError
 *
 *
 * @typedef {import('./exceptions').CpfFormatterOptionsHiddenRangeInvalidException} CpfFormatterOptionsHiddenRangeInvalidException
 */

/**
 * A rarely-used 1-length character that is replaced with `hiddenKey` when
 * `hidden` is `true`.
 */
const HIDDEN_KEY_PLACEHOLDER = CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS[0];

/**
 * Formatter for CPF (Cadastro de Pessoa Física) identifiers. It normalizes and
 * optionally masks, HTML-escapes, or URL-encodes 11-digit CPF input. Accepts a
 * string or array of strings; non-numeric characters are stripped. Invalid
 * input type is handled by throwing; invalid length is handled via the
 * configured `onFail` callback instead of throwing.
 */
export class CpfFormatter {
  private _options: CpfFormatterOptions;

  /**
   * Creates a new `CpfFormatter` with optional default options.
   *
   * Default options apply to every call to `format` unless overridden by the
   * per-call `options` argument. Options control masking, HTML escaping, URL
   * encoding, and the callback used when formatting fails.
   *
   * When `defaultOptions` is a `CpfFormatterOptions` instance, that instance is
   * used directly (no copy is created). Mutating it later (e.g. via the
   * `options` getter or the original reference) affects future `format` calls
   * that do not pass per-call options. When a plain object or nothing is
   * passed, a new `CpfFormatterOptions` instance is created from it.
   *
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public constructor(defaultOptions?: CpfFormatterOptionsInput) {
    this._options =
      defaultOptions instanceof CpfFormatterOptions
        ? defaultOptions
        : new CpfFormatterOptions(defaultOptions);
  }

  /**
   * Returns the default options used by this formatter when per-call options
   * are not provided.
   *
   * The returned object is the same instance used internally; mutating it (e.g.
   * via setters on `CpfFormatterOptions`) affects future `format` calls that do
   * not pass `options`.
   */
  public get options(): CpfFormatterOptions {
    return this._options;
  }

  /**
   * Formats a CPF value into a normalized 11-digit string.
   *
   * Input is normalized by stripping non-numeric characters. If the result
   * length is not exactly 11, the configured `onFail` callback is invoked with
   * the string value and an error; its return value is used as the result. If
   * the input is not a string or array of strings, this method throws.
   *
   * When valid, the result may be further transformed according to options:
   *
   * - If `hidden` is `true`, digits between `hiddenStart` and `hiddenEnd`
   *   (inclusive) are replaced with `hiddenKey`.
   * - If `escape` is `true`, HTML special characters are escaped.
   * - If `encode` is `true`, the string is passed through `encodeURIComponent`.
   *
   * Per-call `options` are merged over the instance default options for this
   * call only; the instance defaults are unchanged.
   *
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   * @throws {CpfFormatterInputTypeError} If the input is not a string or array
   *   of strings.
   */
  public format(cpfInput: CpfInput, options?: CpfFormatterOptionsInput): string {
    const actualInput = this._toStringInput(cpfInput);
    const actualOptions = options ? new CpfFormatterOptions(this._options, options) : this._options;

    const digitsOnly = actualInput.replace(/\D/g, '');
    let formattedCpf = digitsOnly;

    if (formattedCpf.length !== CPF_LENGTH) {
      const exception = new CpfFormatterInputLengthException(cpfInput, formattedCpf, CPF_LENGTH);

      return actualOptions.onFail(cpfInput, exception);
    }

    if (actualOptions.hidden) {
      const startingPart = formattedCpf.slice(0, actualOptions.hiddenStart);
      const endingPart = formattedCpf.slice(actualOptions.hiddenEnd + 1);
      const hiddenPartLength = actualOptions.hiddenEnd - actualOptions.hiddenStart + 1;
      const hiddenPart = HIDDEN_KEY_PLACEHOLDER.repeat(hiddenPartLength);

      formattedCpf = startingPart + hiddenPart + endingPart;
    }

    formattedCpf =
      formattedCpf.slice(0, 3) +
      actualOptions.dotKey +
      formattedCpf.slice(3, 6) +
      actualOptions.dotKey +
      formattedCpf.slice(6, 9) +
      actualOptions.dashKey +
      formattedCpf.slice(9, 11);
    formattedCpf = formattedCpf.replace(
      new RegExp(HIDDEN_KEY_PLACEHOLDER, 'g'),
      actualOptions.hiddenKey,
    );

    if (actualOptions.escape) {
      formattedCpf = escapeHTML(formattedCpf);
    }

    if (actualOptions.encode) {
      formattedCpf = encodeURIComponent(formattedCpf);
    }

    return formattedCpf;
  }

  /**
   * Normalizes the input to a string.
   *
   * @throws {CpfFormatterInputTypeError} If the input is not a string or array
   *   of strings.
   */
  private _toStringInput(cpfInput: unknown): string {
    if (typeof cpfInput === 'string') {
      return cpfInput;
    }

    if (Array.isArray(cpfInput)) {
      for (const item of cpfInput) {
        if (typeof item !== 'string') {
          throw new CpfFormatterInputTypeError(cpfInput, 'string or string[]');
        }
      }

      return cpfInput.join('');
    }

    throw new CpfFormatterInputTypeError(cpfInput, 'string or string[]');
  }
}

Object.freeze(CpfFormatter);
