import CnpjCheckDigits from '@lacussoft/cnpj-dv';

import { CnpjValidatorOptions } from './cnpj-validator-options';
import { CnpjValidatorInputTypeError } from './exceptions';
import type { CnpjInput, CnpjValidatorOptionsInput } from './types';

/**
 * @typedef {import('./exceptions').CnpjValidatorOptionsTypeError} CnpjValidatorOptionsTypeError
 *
 *
 * @typedef {import('./exceptions').CnpjValidatorOptionTypeInvalidException} CnpjValidatorOptionTypeInvalidException
 */

/**
 * The standard length of a CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * identifier (14 alphanumeric characters).
 */
export const CNPJ_LENGTH = 14;

/**
 * Validator for CNPJ (Cadastro Nacional da Pessoa Jurídica) identifiers.
 * Validates CNPJ strings according to the Brazilian CNPJ validation algorithm.
 */
export class CnpjValidator {
  private _options: CnpjValidatorOptions;

  /**
   * Creates a new `CnpjValidator` with optional default options.
   *
   * Default options apply to every call to `isValid` unless overridden by the
   * per-call `options` argument. Options control case sensitivity and the type
   * of whether the CNPJ input is alphanumeric or numeric.
   *
   * When `defaultOptions` is a `CnpjValidatorOptions` instance, that instance
   * is used directly (no copy is created). Mutating it later (e.g. via the
   * `options` getter or the original reference) affects future `isValid` calls
   * that do not pass per-call options. When a plain object or nothing is
   * passed, a new `CnpjValidatorOptions` instance is created from it.
   *
   * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public constructor(defaultOptions?: CnpjValidatorOptionsInput) {
    this._options =
      defaultOptions instanceof CnpjValidatorOptions
        ? defaultOptions
        : new CnpjValidatorOptions(defaultOptions);
  }

  /**
   * Returns the default options used by this validator when per-call options
   * are not provided.
   *
   * The returned object is the same instance used internally; mutating it (e.g.
   * via setters on `CnpjValidatorOptions`) affects future `generate` calls that
   * do not pass `options`.
   */
  public get options(): CnpjValidatorOptions {
    return this._options;
  }

  /**
   * Validates a CNPJ input.
   *
   * Per-call `options` are merged over the instance default options for this
   * call only; the instance defaults are unchanged.
   *
   * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public isValid(cnpjInput: CnpjInput, options?: CnpjValidatorOptionsInput): boolean {
    const actualInput = cnpjInput as unknown;
    const nonArrayInput = Array.isArray(actualInput) ? actualInput.join('') : actualInput;
    const actualOptions = options
      ? new CnpjValidatorOptions(this._options, options)
      : this._options;

    if (typeof nonArrayInput !== 'string') {
      throw new CnpjValidatorInputTypeError(cnpjInput, 'string or string[]');
    }

    let sanitizedCnpj = nonArrayInput;

    if (!actualOptions.caseSensitive) {
      sanitizedCnpj = sanitizedCnpj.toUpperCase();
    }

    if (actualOptions.type === 'numeric') {
      sanitizedCnpj = sanitizedCnpj.replace(/\D/g, '');
    } else {
      sanitizedCnpj = sanitizedCnpj.replace(/[^0-9A-Z]/gi, '');
    }

    if (sanitizedCnpj.length !== CNPJ_LENGTH) {
      return false;
    }

    if (/\D{2}$/.test(sanitizedCnpj)) {
      return false;
    }

    try {
      const cnpjCheckDigits = new CnpjCheckDigits(sanitizedCnpj);

      return sanitizedCnpj === cnpjCheckDigits.cnpj;
    } catch {
      return false;
    }
  }
}

Object.freeze(CnpjValidator);
