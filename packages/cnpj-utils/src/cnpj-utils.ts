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
 * TODO: describe.
 */
export class CnpjUtils {
  private _formatter: CnpjFormatter;
  private _generator: CnpjGenerator;
  private _validator: CnpjValidator;

  /**
   * Creates a new `CnpjUtils` with customized options.
   *
   * TODO: describe further.
   *
   * @throws TODO: add list of exceptions and errors.
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
   * @throws TODO: add list of exceptions and errors.
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
   * @throws TODO: add list of exceptions and errors.
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
   * @throws TODO: add list of exceptions and errors.
   */
  public set validator(value: Nullable<CnpjUtilsSettingsInput['validator']>) {
    this._validator =
      value instanceof CnpjValidator ? value : new CnpjValidator(value ?? undefined);
  }

  /**
   * TODO: describe.
   *
   * @throws TODO: add list of exceptions and errors.
   */
  public format(cnpjInput: CnpjFormatterInput, options?: CnpjFormatterOptionsInput): string {
    return this.formatter.format(cnpjInput, options);
  }

  /**
   * TODO: describe.
   *
   * @throws TODO: add list of exceptions and errors.
   */
  public generate(options?: CnpjGeneratorOptionsInput): string {
    return this.generator.generate(options);
  }

  /**
   * TODO: describe.
   *
   * @throws TODO: add list of exceptions and errors.
   */
  public isValid(cnpjInput: CnpjValidatorInput, options?: CnpjValidatorOptionsInput): boolean {
    return this.validator.isValid(cnpjInput, options);
  }
}

Object.freeze(CnpjUtils);
