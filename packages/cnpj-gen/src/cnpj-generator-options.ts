import {
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionTypeInvalidException,
} from './exceptions';
import type {
  CnpjGeneratorOptionsInput,
  CnpjGeneratorOptionsType,
  CnpjType,
  Nullable,
} from './types';

/**
 * The standard length of a CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * identifier (14 alphanumeric characters).
 */
export const CNPJ_LENGTH = 14;

/**
 * Maximum length of the prefix (base ID and branch ID) of a CNPJ.
 */
export const CNPJ_PREFIX_MAX_LENGTH = CNPJ_LENGTH - 2;

const CNPJ_BASE_ID_LENGTH = 8;
const CNPJ_BASE_ID_LAST_INDEX = CNPJ_BASE_ID_LENGTH - 1;
const CNPJ_INVALID_BASE_ID = '0'.repeat(CNPJ_BASE_ID_LENGTH);

const CNPJ_BRANCH_ID_LENGTH = 4;
const CNPJ_BRANCH_ID_LAST_INDEX = CNPJ_BASE_ID_LAST_INDEX + CNPJ_BRANCH_ID_LENGTH;
const CNPJ_INVALID_BRANCH_ID = '0'.repeat(CNPJ_BRANCH_ID_LENGTH);

const CNPJ_TYPE_OPTIONS = ['alphabetic', 'alphanumeric', 'numeric'];

/**
 * Class to store the options for the CNPJ generator. This class provides a
 * centralized way to configure how CNPJ characters are generated, including
 * partial start string, formatting, and the type of characters to be generated
 * (numeric, alphabetic, or alphanumeric).
 */
export class CnpjGeneratorOptions {
  /**
   * Default value for the `format` option. When `true`, the generated CNPJ
   * string will have the standard formatting (`00.000.000/0000-00`).
   */
  public static readonly DEFAULT_FORMAT = false;

  /**
   * Default string used as the initial string of the generated CNPJ.
   */
  public static readonly DEFAULT_PREFIX = '';

  /**
   * Default type of characters to generate for the CNPJ.
   */
  public static readonly DEFAULT_TYPE = 'alphanumeric';

  private _options = {} as CnpjGeneratorOptionsType;

  /**
   * Creates a new instance of `CnpjGeneratorOptions`.
   *
   * Options can be provided in multiple ways:
   *
   * 1. As a single options object or another `CnpjGeneratorOptions` instance.
   * 2. As multiple override objects that are merged in order (later overrides take
   *    precedence)
   *
   * All options are optional and will default to their predefined values if not
   * provided.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains invalid combination of characters.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public constructor(
    defaultOptions?: CnpjGeneratorOptionsInput,
    ...overrides: CnpjGeneratorOptionsInput[]
  ) {
    this.format = defaultOptions?.format;
    this.prefix = defaultOptions?.prefix;
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
  public get all(): CnpjGeneratorOptionsType {
    const options = { ...this._options };

    return Object.freeze(options);
  }

  /**
   * Gets whether the generated CNPJ string will have the standard formatting
   * (`00.000.000/0000-00`).
   */
  public get format(): boolean {
    return this._options.format;
  }

  /**
   * Sets whether the generated CNPJ string will have the standard formatting
   * (`00.000.000/0000-00`). The value is converted to a boolean using
   * `Boolean()`, so truthy/falsy values are handled appropriately.
   */
  public set format(value: Nullable<boolean>) {
    let actualFormat = value ?? CnpjGeneratorOptions.DEFAULT_FORMAT;

    actualFormat = Boolean(actualFormat);
    this._options.format = actualFormat;
  }

  /**
   * Gets the string used as the initial string of the generated CNPJ.
   *
   * Note: If the evaluated prefix (after stripping non-alphanumeric characters)
   * is longer than 12 characters, the extra characters are ignored, because a
   * CNPJ has 12 base characters followed by 2 calculated check digits.
   */
  public get prefix(): string {
    return this._options.prefix;
  }

  /**
   * Sets the string used as the initial string of the generated CNPJ. Only
   * alphanumeric characters are kept and the rest is stripped. If provided,
   * only the missing characters are generated randomly. For example, if the
   * prefix `AAABBB` (6 characters) is given, only the next 8 characters are
   * randomly generated and concatenated to the prefix.
   *
   * Note: If the evaluated prefix (after stripping non-alphanumeric characters)
   * is longer than 12 characters, the extra characters are ignored, because a
   * CNPJ has 12 base characters followed by 2 calculated check digits.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If the value is not a string.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains invalid combination of characters or is too long.
   */
  public set prefix(value: Nullable<string>) {
    let actualPrefix = value ?? CnpjGeneratorOptions.DEFAULT_PREFIX;

    if (typeof actualPrefix !== 'string') {
      throw new CnpjGeneratorOptionsTypeError('prefix', actualPrefix, 'string');
    }

    actualPrefix = actualPrefix.replace(/[^0-9A-Z]/gi, '');
    actualPrefix = actualPrefix.toUpperCase();
    actualPrefix = actualPrefix.slice(0, CNPJ_PREFIX_MAX_LENGTH);

    this._validatePrefixBaseId(actualPrefix);
    this._validatePrefixBranchId(actualPrefix);
    this._validatePrefixNonRepeatedDigits(actualPrefix, actualPrefix);

    this._options.prefix = actualPrefix;
  }

  /**
   * Gets the type of characters to generate for the CNPJ.
   */
  public get type(): CnpjType {
    return this._options.type;
  }

  /**
   * Sets the type of characters to generate for the CNPJ.
   *
   * The options are:
   *
   * - `alphabetic`: Generates a sequence of alphabetic characters (`A-Z`).
   * - `alphanumeric`: Generates a sequence of alphanumeric characters (`0-9A-Z`).
   * - `numeric`: Generates a sequence of numbers-only characters (`0-9`).
   *
   * @throws {CnpjGeneratorOptionsTypeError} If the value is not a string.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If the value is not a
   *   valid type.
   */
  public set type(value: Nullable<CnpjType>) {
    const actualType = value ?? CnpjGeneratorOptions.DEFAULT_TYPE;

    if (typeof actualType !== 'string') {
      throw new CnpjGeneratorOptionsTypeError('type', actualType, 'string');
    }

    if (!CNPJ_TYPE_OPTIONS.includes(actualType)) {
      throw new CnpjGeneratorOptionTypeInvalidException(actualType, CNPJ_TYPE_OPTIONS);
    }

    this._options.type = actualType;
  }

  /**
   * Sets multiple options at once. This method allows you to update multiple
   * options in a single call. Only the provided options are updated; options
   * not included in the object retain their current values. You can pass either
   * a partial options object or another `CnpjGeneratorOptions` instance.
   *
   * @throws {CnpjGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains invalid combination of characters or is too long.
   * @throws {CnpjGeneratorOptionTypeInvalidException} If the `type` option is
   *   not one of the allowed values.
   */
  public set(options: CnpjGeneratorOptionsInput): this {
    this.format = options.format ?? this.format;
    this.prefix = options.prefix ?? this.prefix;
    this.type = options.type ?? this.type;

    return this;
  }

  /**
   * Throws if the prefix's first 8 characters (base ID) are all zeros.
   *
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the prefix's first 8
   *   characters are all zeros.
   */
  private _validatePrefixBaseId(partialCnpj: string): void {
    if (partialCnpj.length < CNPJ_BASE_ID_LENGTH) {
      return;
    }

    const cnpjBaseIdString = partialCnpj.slice(0, CNPJ_BASE_ID_LAST_INDEX + 1);

    if (cnpjBaseIdString === CNPJ_INVALID_BASE_ID) {
      throw new CnpjGeneratorOptionPrefixInvalidException(
        partialCnpj,
        `Base ID "${CNPJ_INVALID_BASE_ID}" is not eligible.`,
      );
    }
  }

  /**
   * Throws if the prefix's characters at positions 9–12 (branch ID) are all
   * zeros.
   *
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the prefix's
   *   characters at positions 9–12 are all zeros.
   */
  private _validatePrefixBranchId(partialCnpj: string): void {
    if (partialCnpj.length < CNPJ_BASE_ID_LENGTH + CNPJ_BRANCH_ID_LENGTH) {
      return;
    }

    const cnpjBranchIdString = partialCnpj.slice(
      CNPJ_BASE_ID_LENGTH,
      CNPJ_BRANCH_ID_LAST_INDEX + 1,
    );

    if (cnpjBranchIdString === CNPJ_INVALID_BRANCH_ID) {
      throw new CnpjGeneratorOptionPrefixInvalidException(
        partialCnpj,
        `Branch ID "${CNPJ_INVALID_BRANCH_ID}" is not eligible.`,
      );
    }
  }

  /**
   * Throws if the prefix has 12 characters and they are all the same digit.
   *
   * @throws {CnpjGeneratorOptionPrefixInvalidException} If the prefix has 12
   *   characters that are all the same digit.
   */
  private _validatePrefixNonRepeatedDigits(cnpjPrefix: string, actualInput: string): void {
    if (cnpjPrefix.length < CNPJ_PREFIX_MAX_LENGTH) {
      return;
    }

    const eligibleCnpjPrefix = cnpjPrefix.slice(0, CNPJ_PREFIX_MAX_LENGTH);
    const uniqueCharacters = new Set(eligibleCnpjPrefix);

    if (uniqueCharacters.size === 1 && /^\d$/.test(eligibleCnpjPrefix[0])) {
      throw new CnpjGeneratorOptionPrefixInvalidException(
        actualInput,
        'Repeated digits are not considered valid.',
      );
    }
  }
}

Object.freeze(CnpjGeneratorOptions);
