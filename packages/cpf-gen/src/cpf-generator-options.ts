import {
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorOptionsTypeError,
} from './exceptions';
import type { CpfGeneratorOptionsInput, CpfGeneratorOptionsType, Nullable } from './types';

/**
 * The standard length of a CPF (Cadastro de Pessoa Física) identifier (11
 * digits).
 */
export const CPF_LENGTH = 11;

/**
 * Maximum length of the prefix of a CPF.
 */
export const CPF_PREFIX_MAX_LENGTH = CPF_LENGTH - 2;

const CPF_BASE_ID_LENGTH = 9;
const CPF_BASE_ID_LAST_INDEX = CPF_BASE_ID_LENGTH - 1;
const CPF_INVALID_BASE_ID = '0'.repeat(CPF_BASE_ID_LENGTH);

/**
 * Class to store the options for the CPF generator. This class provides a
 * centralized way to configure how CPF digits are generated, including partial
 * start string and formatting.
 */
export class CpfGeneratorOptions {
  /**
   * Default value for the `format` option. When `true`, the generated CPF
   * string will have the standard formatting (`000.000.000-00`).
   */
  public static readonly DEFAULT_FORMAT = false;

  /**
   * Default string used as the initial string of the generated CPF.
   */
  public static readonly DEFAULT_PREFIX = '';

  private _options = {} as CpfGeneratorOptionsType;

  /**
   * Creates a new instance of `CpfGeneratorOptions`.
   *
   * Options can be provided in multiple ways:
   *
   * 1. As a single options object or another `CpfGeneratorOptions` instance.
   * 2. As multiple override objects that are merged in order (later overrides take
   *    precedence)
   *
   * All options are optional and will default to their predefined values if not
   * provided.
   *
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of digits.
   */
  public constructor(
    defaultOptions?: CpfGeneratorOptionsInput,
    ...overrides: CpfGeneratorOptionsInput[]
  ) {
    this.format = defaultOptions?.format;
    this.prefix = defaultOptions?.prefix;

    for (const override of overrides) {
      this.set(override);
    }
  }

  /**
   * Returns a shallow copy of all current options, frozen to prevent
   * modification. This is useful for creating immutable snapshots of the
   * current configuration.
   */
  public get all(): CpfGeneratorOptionsType {
    const options = { ...this._options };

    return Object.freeze(options);
  }

  /**
   * Gets whether the generated CPF string will have the standard formatting
   * (`000.000.000-00`).
   */
  public get format(): boolean {
    return this._options.format;
  }

  /**
   * Sets whether the generated CPF string will have the standard formatting
   * (`000.000.000-00`). The value is converted to a boolean using `Boolean()`,
   * so truthy/falsy values are handled appropriately.
   */
  public set format(value: Nullable<boolean>) {
    let actualFormat = value ?? CpfGeneratorOptions.DEFAULT_FORMAT;

    actualFormat = Boolean(actualFormat);
    this._options.format = actualFormat;
  }

  /**
   * Gets the string used as the initial string of the generated CPF.
   *
   * Note: If the evaluated prefix (after stripping non-digit characters) is
   * longer than 9 digits, the extra digits are ignored, because a CPF has 9
   * base digits followed by 2 calculated check digits.
   */
  public get prefix(): string {
    return this._options.prefix;
  }

  /**
   * Sets the string used as the initial string of the generated CPF. Only
   * digits are kept and the rest is stripped. If provided, only the missing
   * digits are generated randomly. For example, if the prefix `123456` (6
   * digits) is given, only the next 3 digits are randomly generated and
   * concatenated to the prefix.
   *
   * Note: If the evaluated prefix (after stripping non-digit characters) is
   * longer than 9 digits, the extra digits are ignored, because a CPF has 9
   * base digits followed by 2 calculated check digits.
   *
   * @throws {CpfGeneratorOptionsTypeError} If the value is not a string.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of digits or is too long.
   */
  public set prefix(value: Nullable<string>) {
    let actualPrefix = value ?? CpfGeneratorOptions.DEFAULT_PREFIX;

    if (typeof actualPrefix !== 'string') {
      throw new CpfGeneratorOptionsTypeError('prefix', actualPrefix, 'string');
    }

    actualPrefix = actualPrefix.replace(/\D/g, '');
    actualPrefix = actualPrefix.slice(0, CPF_PREFIX_MAX_LENGTH);

    this._validatePrefixBaseId(actualPrefix);
    this._validatePrefixNonRepeatedDigits(actualPrefix);

    this._options.prefix = actualPrefix;
  }

  /**
   * Sets multiple options at once. This method allows you to update multiple
   * options in a single call. Only the provided options are updated; options
   * not included in the object retain their current values. You can pass either
   * a partial options object or another `CpfGeneratorOptions` instance.
   *
   * @throws {CpfGeneratorOptionsTypeError} If any option has an invalid type.
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the `prefix` option
   *   contains an invalid combination of digits or is too long.
   */
  public set(options: CpfGeneratorOptionsInput): this {
    this.format = options.format ?? this.format;
    this.prefix = options.prefix ?? this.prefix;

    return this;
  }

  /**
   * Throws if the prefix's digits are all zeros.
   *
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the prefix's first 8
   *   digits are all zeros.
   */
  private _validatePrefixBaseId(partialCpf: string): void {
    if (partialCpf.length < CPF_BASE_ID_LENGTH) {
      return;
    }

    const cpfBaseIdString = partialCpf.slice(0, CPF_BASE_ID_LAST_INDEX + 1);

    if (cpfBaseIdString === CPF_INVALID_BASE_ID) {
      throw new CpfGeneratorOptionPrefixInvalidException(
        partialCpf,
        `Zeroed base ID is not eligible.`,
      );
    }
  }

  /**
   * Throws if the prefix has 9 digits and they are all the same number.
   *
   * @throws {CpfGeneratorOptionPrefixInvalidException} If the prefix has 12
   *   digits that are all the same digit.
   */
  private _validatePrefixNonRepeatedDigits(cpfPrefix: string): void {
    if (cpfPrefix.length < CPF_PREFIX_MAX_LENGTH) {
      return;
    }

    const eligibleCpfPrefix = cpfPrefix.slice(0, CPF_PREFIX_MAX_LENGTH);
    const uniqueDigits = new Set(eligibleCpfPrefix);

    if (uniqueDigits.size === 1 && /^\d$/.test(eligibleCpfPrefix[0])) {
      throw new CpfGeneratorOptionPrefixInvalidException(
        cpfPrefix,
        'Repeated digits are not considered valid.',
      );
    }
  }
}

Object.freeze(CpfGeneratorOptions);
