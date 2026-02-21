import {
  CnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException,
} from './exceptions';
import type {
  CnpjType,
  CnpjValidatorOptionsInput,
  CnpjValidatorOptionsType,
  Nullable,
} from './types';

const CNPJ_TYPE_OPTIONS: readonly CnpjType[] = ['alphanumeric', 'numeric'];

/**
 * Class to store the options for the CNPJ validator. This class provides a
 * centralized way to configure how CNPJs are validated, including case
 * sensitivity and the type of format that should be considered valid (`numeric`
 * or `alphanumeric`).
 */
export class CnpjValidatorOptions {
  /**
   * Default value for the `caseSensitive` option. When `false` and alphanumeric
   * CNPJ is being validated, lowercase characters are also considered valid.
   * Example: for a valid CNPJ `AB.123.CDE/FGHI-45`, if `caseSensitive` is
   * `false`, `ab.123.cde/fghi-45` is also considered valid.
   */
  public static readonly DEFAULT_CASE_SENSITIVE = true;

  /**
   * Default type of characters to validate for the CNPJ.
   */
  public static readonly DEFAULT_TYPE: CnpjType = 'alphanumeric';

  private _options = {} as CnpjValidatorOptionsType;

  /**
   * Creates a new instance of `CnpjValidatorOptions`.
   *
   * Options can be provided in multiple ways:
   *
   * 1. As a single options object or another `CnpjValidatorOptions` instance.
   * 2. As multiple override objects that are merged in order (later overrides take
   *    precedence)
   *
   * All options are optional and will default to their predefined values if not
   * provided.
   *
   * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public constructor(
    defaultOptions?: CnpjValidatorOptionsInput,
    ...overrides: CnpjValidatorOptionsInput[]
  ) {
    this.caseSensitive = defaultOptions?.caseSensitive;
    this.type = defaultOptions?.type;

    for (const override of overrides) {
      this.set(override);
    }
  }

  /**
   * Returns a shallow copy of all current options, frozen to prevent
   * modification. This is useful for creating immutable snapshots of the
   * current configuration.
   */
  public get all(): CnpjValidatorOptionsType {
    const options = { ...this._options };

    return Object.freeze(options);
  }

  /**
   * Gets whether the CNPJ is validated in a case-sensitive manner.
   */
  public get caseSensitive(): boolean {
    return this._options.caseSensitive;
  }

  /**
   * Sets whether the CNPJ is validated in a case-sensitive manner.
   */
  public set caseSensitive(value: Nullable<boolean>) {
    let actualCaseSensitive = value ?? CnpjValidatorOptions.DEFAULT_CASE_SENSITIVE;

    actualCaseSensitive = Boolean(actualCaseSensitive);
    this._options.caseSensitive = actualCaseSensitive;
  }

  /**
   * Gets the type of characters to validate for the CNPJ.
   */
  public get type(): CnpjType {
    return this._options.type;
  }

  /**
   * Sets the type of characters to validate for the CNPJ.
   *
   * The options are:
   *
   * - `alphanumeric`: alphanumeric CNPJ format.
   * - `numeric`: numeric-only (legacy) CNPJ format.
   *
   * @throws {CnpjValidatorOptionsTypeError} If the value is not a string.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the value is not a
   *   valid type.
   */
  public set type(value: Nullable<CnpjType>) {
    const actualType = value ?? CnpjValidatorOptions.DEFAULT_TYPE;

    if (typeof actualType !== 'string') {
      throw new CnpjValidatorOptionsTypeError('type', actualType, 'string');
    }

    if (!CNPJ_TYPE_OPTIONS.includes(actualType)) {
      throw new CnpjValidatorOptionTypeInvalidException(actualType, CNPJ_TYPE_OPTIONS);
    }

    this._options.type = actualType;
  }

  /**
   * Sets multiple options at once. This method allows you to update multiple
   * options in a single call. Only the provided options are updated; options
   * not included in the object retain their current values. You can pass either
   * a partial options object or another `CnpjValidatorOptions` instance.
   *
   * @throws {CnpjValidatorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjValidatorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public set(options: CnpjValidatorOptionsInput): this {
    this.caseSensitive = options.caseSensitive ?? this.caseSensitive;
    this.type = options.type ?? this.type;

    return this;
  }
}

Object.freeze(CnpjValidatorOptions);
