import { type Nullable } from '@lacussoft/utils';

import { CnpjUtils } from './cnpj-utils';
import { CpfUtils } from './cpf-utils';
import { type BrUtilsSettingsInput } from './types';

/**
 * @typedef {import('./cnpj-utils').CnpjFormatterOptionsTypeError} CnpjFormatterOptionsTypeError
 *
 *
 * @typedef {import('./cnpj-utils').CnpjFormatterOptionsHiddenRangeInvalidException} CnpjFormatterOptionsHiddenRangeInvalidException
 *
 *
 * @typedef {import('./cnpj-utils').CnpjGeneratorOptionsTypeError} CnpjGeneratorOptionsTypeError
 *
 *
 * @typedef {import('./cnpj-utils').CnpjGeneratorOptionPrefixInvalidException} CnpjGeneratorOptionPrefixInvalidException
 *
 *
 * @typedef {import('./cnpj-utils').CnpjGeneratorOptionTypeInvalidException} CnpjGeneratorOptionTypeInvalidException
 *
 *
 * @typedef {import('./cnpj-utils').CnpjValidatorOptionsTypeError} CnpjValidatorOptionsTypeError
 *
 *
 * @typedef {import('./cnpj-utils').CnpjValidatorOptionTypeInvalidException} CnpjValidatorOptionTypeInvalidException
 *
 *
 * @typedef {import('./cpf-utils').CpfFormatterOptionsTypeError} CpfFormatterOptionsTypeError
 *
 *
 * @typedef {import('./cpf-utils').CpfFormatterOptionsHiddenRangeInvalidException} CpfFormatterOptionsHiddenRangeInvalidException
 *
 *
 * @typedef {import('./cpf-utils').CpfGeneratorOptionsTypeError} CpfGeneratorOptionsTypeError
 *
 *
 * @typedef {import('./cpf-utils').CpfGeneratorOptionPrefixInvalidException} CpfGeneratorOptionPrefixInvalidException
 */

/**
 * Unified API for Brazilian-related data, like CPF (Cadastro de Pessoa Física)
 * and CNPJ (Cadastro Nacional da Pessoa Jurídica).
 */
export class BrUtils {
  private _cnpjUtils: CnpjUtils;
  private _cpfUtils: CpfUtils;

  /**
   * Creates a new `BrUtils` instance with customized options. All options are
   * optional. If any option is omitted, it falls back to its default value.
   *
   * @throws {CnpjFormatterOptionsTypeError} If CNPJ formatter options have an
   *   invalid type.
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If CNPJ formatter
   *   `hiddenStart` or `hiddenEnd` are out of valid range.
   * @throws {CnpjGeneratorOptionsTypeError} If CNPJ generator options have an
   *   invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If CNPJ generator
   *   `prefix` is invalid.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If CNPJ generator `type`
   *   is not allowed.
   * @throws {CnpjValidatorOptionsTypeError} If CNPJ validator options have an
   *   invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If CNPJ validator `type`
   *   is not allowed.
   * @throws {CpfFormatterOptionsTypeError} If CPF formatter options have an
   *   invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If CPF formatter
   *   `hiddenStart` or `hiddenEnd` are out of valid range.
   * @throws {CpfGeneratorOptionsTypeError} If CPF generator options have an
   *   invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If CPF generator
   *   `prefix` is invalid.
   */
  public constructor(defaultSettings?: BrUtilsSettingsInput) {
    this._cnpjUtils =
      defaultSettings?.cnpj instanceof CnpjUtils
        ? defaultSettings.cnpj
        : new CnpjUtils(defaultSettings?.cnpj);
    this._cpfUtils =
      defaultSettings?.cpf instanceof CpfUtils
        ? defaultSettings.cpf
        : new CpfUtils(defaultSettings?.cpf);
  }

  /**
   * Access the CNPJ utilities instance.
   */
  public get cnpj(): CnpjUtils {
    return this._cnpjUtils;
  }

  /**
   * Sets the active CNPJ utilities instance.
   *
   * It is flexible and can handle any of this inputs:
   *
   * 1. A complete new instance of `CnpjUtils`
   * 2. An instance of `CnpjUtilsSettingsInput`
   * 3. A partial object with options to the CNPJ utilities options.
   * 4. `null` or `undefined` will create a brand new instance of `CnpjUtils` with
   *    the default options.
   *
   * Note that this resets the CNPJ utilities instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the CNPJ utilities'
   * setters and methods (e.g. `utils.cnpj.generator.type = 'numeric'`).
   *
   * @throws {CnpjFormatterOptionsTypeError} If formatter options have an
   *   invalid type.
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If formatter
   *   `hiddenStart` or `hiddenEnd` are out of valid range.
   * @throws {CnpjGeneratorOptionsTypeError} If generator options have an
   *   invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If generator `prefix`
   *   is invalid.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If generator `type` is
   *   not allowed.
   * @throws {CnpjValidatorOptionsTypeError} If validator options have an
   *   invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If validator `type` is
   *   not allowed.
   */
  public set cnpj(value: Nullable<BrUtilsSettingsInput['cnpj']>) {
    this._cnpjUtils = value instanceof CnpjUtils ? value : new CnpjUtils(value ?? undefined);
  }

  /**
   * Access the CPF utilities instance.
   */
  public get cpf(): CpfUtils {
    return this._cpfUtils;
  }

  /**
   * Sets the active CPF utilities instance.
   *
   * It is flexible and can handle any of this inputs:
   *
   * 1. A complete new instance of `CpfUtils`
   * 2. An instance of `CpfUtilsSettingsInput`
   * 3. A partial object with options to the CPF utilities options.
   * 4. `null` or `undefined` will create a brand new instance of `CpfUtils` with
   *    the default options.
   *
   * Note that this resets the CPF utilities instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the CPF utilities'
   * setters and methods (e.g. `utils.cpf.formatter.hidden = true`).
   *
   * @throws {CpfFormatterOptionsTypeError} If formatter options have an invalid
   *   type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If formatter
   *   `hiddenStart` or `hiddenEnd` are out of valid range.
   * @throws {CpfGeneratorOptionsTypeError} If generator options have an invalid
   *   type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If generator `prefix` is
   *   invalid.
   */
  public set cpf(value: Nullable<BrUtilsSettingsInput['cpf']>) {
    this._cpfUtils = value instanceof CpfUtils ? value : new CpfUtils(value ?? undefined);
  }
}

Object.freeze(BrUtils);
