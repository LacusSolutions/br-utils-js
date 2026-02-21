import CpfCheckDigits, { CpfCheckDigitsException } from '@lacussoft/cpf-dv';

import { CPF_PREFIX_MAX_LENGTH, CpfGeneratorOptions } from './cpf-generator-options';
import type { CpfGeneratorOptionsInput } from './types';
import { randomSequence } from './utils';

/**
 * @typedef {import('./exceptions').CpfGeneratorOptionsTypeError} CpfGeneratorOptionsTypeError
 *
 *
 * @typedef {import('./exceptions').CpfGeneratorOptionPrefixInvalidException} CpfGeneratorOptionPrefixInvalidException
 */

const CPF_DOT_KEY = '.';
const CPF_DASH_KEY = '-';

/**
 * Generator for CPF (Cadastro de Pessoa Física) identifiers. Builds valid
 * 11-digit CPF values by combining an optional prefix with a randomly generated
 * sequence and computed check digits. Options control prefix and whether the
 * result is formatted (`000.000.000-00`).
 */
export class CpfGenerator {
  private _options: CpfGeneratorOptions;

  /**
   * Creates a new `CpfGenerator` with optional default options.
   *
   * Default options apply to every call to `generate` unless overridden by the
   * per-call `options` argument. Options control prefix and whether the
   * generated CPF is formatted.
   *
   * When `defaultOptions` is a `CpfGeneratorOptions` instance, that instance is
   * used directly (no copy is created). Mutating it later (e.g. via the
   * `options` getter or the original reference) affects future `generate` calls
   * that do not pass per-call options. When a plain object or nothing is
   * passed, a new `CpfGeneratorOptions` instance is created from it.
   *
   * @throws {CpfGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of digits.
   */
  public constructor(defaultOptions?: CpfGeneratorOptionsInput) {
    this._options =
      defaultOptions instanceof CpfGeneratorOptions
        ? defaultOptions
        : new CpfGeneratorOptions(defaultOptions);
  }

  /**
   * Returns the default options used by this generator when per-call options
   * are not provided.
   *
   * The returned object is the same instance used internally; mutating it (e.g.
   * via setters on `CpfGeneratorOptions`) affects future `generate` calls that
   * do not pass `options`.
   */
  public get options(): CpfGeneratorOptions {
    return this._options;
  }

  /**
   * Generates a valid CPF value.
   *
   * Builds a 9-digit CPF from the configured prefix (if any), a random sequence
   * of digits, and two computed check digits. If formatting is enabled, the
   * result is returned as `000.000.000-00`.
   *
   * Per-call `options` are merged over the instance default options for this
   * call only; the instance defaults are unchanged.
   *
   * @throws {CpfGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of digits.
   */
  public generate(options?: CpfGeneratorOptionsInput): string {
    const actualOptions = options ? new CpfGeneratorOptions(this._options, options) : this._options;
    const digitsToGenerate = CPF_PREFIX_MAX_LENGTH - actualOptions.prefix.length;
    const generatedDigits = randomSequence(digitsToGenerate);
    let generatedCpf = actualOptions.prefix + generatedDigits;

    try {
      const cpfCheckDigits = new CpfCheckDigits(generatedCpf);

      generatedCpf = cpfCheckDigits.cpf;
    } catch (error) {
      if (error instanceof CpfCheckDigitsException) {
        return this.generate(options);
      }

      throw error;
    }

    if (actualOptions.format) {
      generatedCpf =
        generatedCpf.slice(0, 3) +
        CPF_DOT_KEY +
        generatedCpf.slice(3, 6) +
        CPF_DOT_KEY +
        generatedCpf.slice(6, 9) +
        CPF_DASH_KEY +
        generatedCpf.slice(9, 11);
    }

    return generatedCpf;
  }
}

Object.freeze(CpfGenerator);
