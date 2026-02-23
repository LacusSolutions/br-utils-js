import { CnpjCheckDigits, CnpjCheckDigitsException } from '@lacussoft/cnpj-dv';
import { generateRandomSequence } from '@lacussoft/utils';

import { CNPJ_PREFIX_MAX_LENGTH, CnpjGeneratorOptions } from './cnpj-generator-options';
import type { CnpjGeneratorOptionsInput } from './types';

/**
 * @typedef {import('./exceptions').CnpjGeneratorOptionsTypeError} CnpjGeneratorOptionsTypeError
 *
 *
 * @typedef {import('./exceptions').CnpjGeneratorOptionPrefixInvalidException} CnpjGeneratorOptionPrefixInvalidException
 *
 *
 * @typedef {import('./exceptions').CnpjGeneratorOptionTypeInvalidException} CnpjGeneratorOptionTypeInvalidException
 */

const CNPJ_DOT_KEY = '.';
const CNPJ_SLASH_KEY = '/';
const CNPJ_DASH_KEY = '-';

/**
 * Generator for CNPJ (Cadastro Nacional da Pessoa Jurídica) identifiers. Builds
 * valid 14-character CNPJ values by combining an optional prefix with a
 * randomly generated sequence and computed check digits. Options control
 * prefix, character type (numeric, alphabetic, or alphanumeric), and whether
 * the result is formatted (`00.000.000/0000-00`).
 */
export class CnpjGenerator {
  private _options: CnpjGeneratorOptions;

  /**
   * Creates a new `CnpjGenerator` with optional default options.
   *
   * Default options apply to every call to `generate` unless overridden by the
   * per-call `options` argument. Options control prefix, character type, and
   * whether the generated CNPJ is formatted.
   *
   * When `defaultOptions` is a `CnpjGeneratorOptions` instance, that instance
   * is used directly (no copy is created). Mutating it later (e.g. via the
   * `options` getter or the original reference) affects future `generate` calls
   * that do not pass per-call options. When a plain object or nothing is
   * passed, a new `CnpjGeneratorOptions` instance is created from it.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of characters.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public constructor(defaultOptions?: CnpjGeneratorOptionsInput) {
    this._options =
      defaultOptions instanceof CnpjGeneratorOptions
        ? defaultOptions
        : new CnpjGeneratorOptions(defaultOptions);
  }

  /**
   * Returns the default options used by this generator when per-call options
   * are not provided.
   *
   * The returned object is the same instance used internally; mutating it (e.g.
   * via setters on `CnpjGeneratorOptions`) affects future `generate` calls that
   * do not pass `options`.
   */
  public get options(): CnpjGeneratorOptions {
    return this._options;
  }

  /**
   * Generates a valid CNPJ value.
   *
   * Builds a 14-character CNPJ from the configured prefix (if any), a random
   * sequence of the configured character type, and two computed check digits.
   * If formatting is enabled, the result is returned as `00.000.000/0000-00`.
   *
   * Per-call `options` are merged over the instance default options for this
   * call only; the instance defaults are unchanged.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of characters.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public generate(options?: CnpjGeneratorOptionsInput): string {
    const actualOptions = options
      ? new CnpjGeneratorOptions(this._options, options)
      : this._options;
    const charactersToGenerate = CNPJ_PREFIX_MAX_LENGTH - actualOptions.prefix.length;
    const generatedCharacters = generateRandomSequence(charactersToGenerate, actualOptions.type);
    let generatedCnpj = actualOptions.prefix + generatedCharacters;

    try {
      const cnpjCheckDigits = new CnpjCheckDigits(generatedCnpj);

      generatedCnpj = cnpjCheckDigits.cnpj;
    } catch (error) {
      if (error instanceof CnpjCheckDigitsException) {
        return this.generate(options);
      }

      throw error;
    }

    if (actualOptions.format) {
      generatedCnpj =
        generatedCnpj.slice(0, 2) +
        CNPJ_DOT_KEY +
        generatedCnpj.slice(2, 5) +
        CNPJ_DOT_KEY +
        generatedCnpj.slice(5, 8) +
        CNPJ_SLASH_KEY +
        generatedCnpj.slice(8, 12) +
        CNPJ_DASH_KEY +
        generatedCnpj.slice(12, 14);
    }

    return generatedCnpj;
  }
}

Object.freeze(CnpjGenerator);
