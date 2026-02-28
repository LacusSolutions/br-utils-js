import { type Nullable } from '@lacussoft/utils';

import {
  CpfFormatter,
  type CpfFormatterInput,
  type CpfFormatterOptionsInput,
} from './cpf-formatter';
import { CpfGenerator, type CpfGeneratorOptionsInput } from './cpf-generator';
import { CpfValidator, type CpfValidatorInput } from './cpf-validator';
import { type CpfUtilsSettingsInput } from './types';

/**
 * Unified API for CPF (Cadastro da Pessoa Física) formatting, generation, and
 * validation. Wraps a configurable formatter, generator, and validator so you
 * can format, generate, and validate CPF values from a single instance.
 */
export class CpfUtils {
  private _formatter: CpfFormatter;
  private _generator: CpfGenerator;
  private _validator: CpfValidator;

  /**
   * Creates a new `CpfUtils` with customized options. Each of formatter,
   * generator, and validator can be omitted (defaults are used), or provided as
   * an instance or as an options object.
   *
   * @throws {CpfFormatterOptionsTypeError} If formatter options have an invalid
   *   type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If formatter
   *   `hiddenStart` or `hiddenEnd` are out of valid range.
   * @throws {CpfGeneratorOptionsTypeError} If generator options have an invalid
   *   type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If generator `prefix` is
   *   invalid.
   * @throws {CpfGeneratorOptionTypeInvalidException} If generator `type` is not
   *   allowed.
   * @throws {CpfValidatorOptionsTypeError} If validator options have an invalid
   *   type.
   * @throws {CpfValidatorOptionTypeInvalidException} If validator `type` is not
   *   allowed.
   */
  public constructor(defaultSettings?: CpfUtilsSettingsInput) {
    this._formatter =
      defaultSettings?.formatter instanceof CpfFormatter
        ? defaultSettings.formatter
        : new CpfFormatter(defaultSettings?.formatter);
    this._generator =
      defaultSettings?.generator instanceof CpfGenerator
        ? defaultSettings.generator
        : new CpfGenerator(defaultSettings?.generator);
    this._validator =
      defaultSettings?.validator instanceof CpfValidator
        ? defaultSettings.validator
        : new CpfValidator();
  }

  /**
   * Gets the formatter used by the utils instance.
   */
  public get formatter(): CpfFormatter {
    return this._formatter;
  }

  /**
   * Sets the active formatter used by the utils instance.
   *
   * It is flexible and can handle any of these inputs:
   *
   * 1. A complete new instance of `CpfFormatter`
   * 2. An instance of `CpfFormatterOptions`
   * 3. A partial object with options to the formatter options.
   * 4. `null` or `undefined` will create a brand new instance of `CpfFormatter`
   *    with the default options.
   *
   * Note that this resets the formatter instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the formatter's
   * setters and methods (e.g. `utils.formatter.hidden = true`).
   *
   * @throws {CpfFormatterOptionsTypeError} If options have an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public set formatter(value: Nullable<CpfUtilsSettingsInput['formatter']>) {
    this._formatter = value instanceof CpfFormatter ? value : new CpfFormatter(value ?? undefined);
  }

  /**
   * Gets the generator used by the utils instance.
   */
  public get generator(): CpfGenerator {
    return this._generator;
  }

  /**
   * Sets the active generator used by the utils instance.
   *
   * It is flexible and can handle any of these inputs:
   *
   * 1. A complete new instance of `CpfGenerator`
   * 2. An instance of `CpfGeneratorOptions`
   * 3. A partial object with options to the generator options.
   * 4. `null` or `undefined` will create a brand new instance of `CpfGenerator`
   *    with the default options.
   *
   * Note that this resets the generator instance completely. Any previous
   * options will be overridden. To alter only a single option or a few options
   * of the existing instance, access it directly and use the generator's
   * setters and methods (e.g. `utils.generator.type = 'numeric'`).
   *
   * @throws {CpfGeneratorOptionsTypeError} If options have an invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If `prefix` is invalid.
   * @throws {CpfGeneratorOptionTypeInvalidException} If `type` is not allowed.
   */
  public set generator(value: Nullable<CpfUtilsSettingsInput['generator']>) {
    this._generator = value instanceof CpfGenerator ? value : new CpfGenerator(value ?? undefined);
  }

  /**
   * Gets the validator used by the utils instance.
   */
  public get validator(): CpfValidator {
    return this._validator;
  }

  /**
   * Sets the active validator used by the utils instance.
   *
   * It is flexible and can handle any of these inputs:
   *
   * 1. A complete new instance of `CpfValidator`
   * 2. `null` or `undefined` will create a brand new instance of `CpfValidator`
   *    with the default options.
   *
   * Note that this resets the validator instance completely. To alter options
   * of the existing instance, access it directly and use the validator's
   * setters and methods (e.g. `utils.validator.type = 'numeric'`).
   */
  public set validator(value: Nullable<CpfUtilsSettingsInput['validator']>) {
    this._validator = value instanceof CpfValidator ? value : new CpfValidator();
  }

  /**
   * Formats a CPF value: normalizes and optionally masks, escapes, or
   * URL-encodes it. Delegates to the instance formatter; per-call options
   * override the formatter's defaults for this call only.
   *
   * @throws {CpfFormatterInputTypeError} If the input is not a string or array
   *   of strings.
   * @throws {CpfFormatterOptionsTypeError} If any option has an invalid type.
   * @throws {CpfFormatterOptionsHiddenRangeInvalidException} If `hiddenStart`
   *   or `hiddenEnd` are out of valid range.
   */
  public format(cpfInput: CpfFormatterInput, options?: CpfFormatterOptionsInput): string {
    return this.formatter.format(cpfInput, options);
  }

  /**
   * Generates a valid CPF string (11 digits; 14 characters when formatted as
   * XXX.XXX.XXX-XX). Optionally accepts a prefix and formatting. Delegates to
   * the instance generator; per-call options override the generator's defaults
   * for this call only.
   *
   * @throws {CpfGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If `prefix` is invalid.
   * @throws {CpfGeneratorOptionTypeInvalidException} If `type` is not allowed.
   */
  public generate(options?: CpfGeneratorOptionsInput): string {
    return this.generator.generate(options);
  }

  /**
   * Returns whether the given value is a valid CPF. Delegates to the instance
   * validator.
   *
   * @throws {CpfValidatorInputTypeError} If the input is not a string or array
   *   of strings.
   */
  public isValid(cpfInput: CpfValidatorInput): boolean {
    return this.validator.isValid(cpfInput);
  }
}

Object.freeze(CpfUtils);
