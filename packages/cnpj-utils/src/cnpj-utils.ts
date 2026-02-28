import { type Nullable } from '@lacussoft/utils';

import {
  CnpjFormatter,
  type CnpjFormatterInput,
  type CnpjFormatterOptionsInput,
} from './cnpj-formatter';
import { CnpjGenerator, type CnpjGeneratorOptionsInput } from './cnpj-generator';
import {
  CnpjValidator,
  type CnpjValidatorInput,
  type CnpjValidatorOptionsInput,
} from './cnpj-validator';
import { type CnpjUtilsSettingsInput } from './types';

/**
 * Unified API for CNPJ (Cadastro Nacional da Pessoa Jurídica) formatting,
 * generation, and validation. Wraps a configurable formatter, generator, and
 * validator so you can format, generate, and validate CNPJ values from a single
 * instance.
 */
export class CnpjUtils {
  private _formatter: CnpjFormatter;
  private _generator: CnpjGenerator;
  private _validator: CnpjValidator;

  /**
   * Creates a new `CnpjUtils` with customized options. Each of formatter,
   * generator, and validator can be omitted (defaults are used), or provided as
   * an instance or as an options object.
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
  public constructor(defaultSettings?: CnpjUtilsSettingsInput) {
    this._formatter =
      defaultSettings?.formatter instanceof CnpjFormatter
        ? defaultSettings.formatter
        : new CnpjFormatter(defaultSettings?.formatter);
    this._generator =
      defaultSettings?.generator instanceof CnpjGenerator
        ? defaultSettings.generator
        : new CnpjGenerator(defaultSettings?.generator);
    this._validator =
      defaultSettings?.validator instanceof CnpjValidator
        ? defaultSettings.validator
        : new CnpjValidator(defaultSettings?.validator);
  }

  /**
   * Gets the formatter used by the utils instance.
   */
  public get formatter(): CnpjFormatter {
    return this._formatter;
  }

  /**
   * Sets the active formatter used by the utils instance.
   *
   * It is flexible and can handle any of this inputs:
   *
   * 1. A complete new instance of `CnpjFormatter`
   * 2. An instance of `CnpjFormatterOptions`
   * 3. A partial object with options to the formatter options.
   * 4. `null` or `undefined` will create a brand new instance of `CnpjFormatter`
   *    with the default options.
   *
   * Note that this resets the formatter instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the formatter's
   * setters and methods (e.g. `utils.formatter.hidden = true`).
   *
   * @throws {CnpjFormatterOptionsTypeError} If options have an invalid type.
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public set formatter(value: Nullable<CnpjUtilsSettingsInput['formatter']>) {
    this._formatter =
      value instanceof CnpjFormatter ? value : new CnpjFormatter(value ?? undefined);
  }

  /**
   * Gets the generator used by the utils instance.
   */
  public get generator(): CnpjGenerator {
    return this._generator;
  }

  /**
   * Sets the active generator used by the utils instance.
   *
   * It is flexible and can handle any of this inputs:
   *
   * 1. A complete new instance of `CnpjGenerator`
   * 2. An instance of `CnpjGeneratorOptions`
   * 3. A partial object with options to the generator options.
   * 4. `null` or `undefined` will create a brand new instance of `CnpjGenerator`
   *    with the default options.
   *
   * Note that this resets the generator instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the generator's
   * setters and methods (e.g. `utils.generator.type = 'numeric'`).
   *
   * @throws {CnpjGeneratorOptionsTypeError} If options have an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If `prefix` is invalid.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If `type` is not allowed.
   */
  public set generator(value: Nullable<CnpjUtilsSettingsInput['generator']>) {
    this._generator =
      value instanceof CnpjGenerator ? value : new CnpjGenerator(value ?? undefined);
  }

  /**
   * Gets the validator used by the utils instance.
   */
  public get validator(): CnpjValidator {
    return this._validator;
  }

  /**
   * Sets the active validator used by the utils instance.
   *
   * It is flexible and can handle any of this inputs:
   *
   * 1. A complete new instance of `CnpjValidator`
   * 2. An instance of `CnpjValidatorOptions`
   * 3. A partial object with options to the validator options.
   * 4. `null` or `undefined` will create a brand new instance of `CnpjValidator`
   *    with the default options.
   *
   * Note that this resets the validator instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the validator's
   * setters and methods (e.g. `utils.validator.type = 'numeric'`).
   *
   * @throws {CnpjValidatorOptionsTypeError} If options have an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If `type` is not allowed.
   */
  public set validator(value: Nullable<CnpjUtilsSettingsInput['validator']>) {
    this._validator =
      value instanceof CnpjValidator ? value : new CnpjValidator(value ?? undefined);
  }

  /**
   * Formats a CNPJ value: normalizes and optionally masks, escapes, or
   * URL-encodes it. Delegates to the instance formatter; per-call options
   * override the formatter's defaults for this call only.
   *
   * @throws {CnpjFormatterInputTypeError} If the input is not a string or array
   *   of strings.
   * @throws {CnpjFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public format(cnpjInput: CnpjFormatterInput, options?: CnpjFormatterOptionsInput): string {
    return this.formatter.format(cnpjInput, options);
  }

  /**
   * Generates a valid 14-character CNPJ, optionally with a prefix and
   * formatting. Delegates to the instance generator; per-call options override
   * the generator's defaults for this call only.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If `prefix` is invalid.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If `type` is not allowed.
   */
  public generate(options?: CnpjGeneratorOptionsInput): string {
    return this.generator.generate(options);
  }

  /**
   * Returns whether the given value is a valid CNPJ. Delegates to the instance
   * validator; per-call options override the validator's defaults for this call
   * only.
   *
   * @throws {CnpjValidatorInputTypeError} If the input is not a string or array
   *   of strings.
   * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is
   *   not allowed.
   */
  public isValid(cnpjInput: CnpjValidatorInput, options?: CnpjValidatorOptionsInput): boolean {
    return this.validator.isValid(cnpjInput, options);
  }
}

Object.freeze(CnpjUtils);
