import { beforeEach, describe, expect, it } from 'bun:test';

import { CnpjValidator } from '../src/cnpj-validator';
import { CnpjValidatorOptions } from '../src/cnpj-validator-options';
import {
  CnpjValidatorInputTypeError,
  CnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException,
} from '../src/exceptions';
import type {
  CnpjInput,
  CnpjType,
  CnpjValidatorOptionsInput,
  CnpjValidatorOptionsType,
} from '../src/types';

describe('CnpjValidator', (): void => {
  describe('constructor', (): void => {
    describe('when called with no arguments', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CnpjValidatorOptions();

        const validator = new CnpjValidator();

        expect(validator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with an empty object', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CnpjValidatorOptions();

        const validator = new CnpjValidator({});

        expect(validator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with a CnpjValidatorOptions instance', (): void => {
      it('uses that instance directly without copying', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: false,
          type: 'numeric',
        });
        const validator = new CnpjValidator(options);

        expect(validator.options).toBe(options);
        expect(validator.options.all).toEqual(options.all);
      });

      it('mutations to the instance affect future isValid calls', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: false,
          type: 'numeric',
        });
        const validator = new CnpjValidator(options);

        options.caseSensitive = true;
        options.type = 'alphanumeric';

        expect(validator.options.caseSensitive).toBe(true);
        expect(validator.options.type).toBe('alphanumeric');
      });
    });

    describe('when called with a literal options object', (): void => {
      it('creates a new CnpjValidatorOptions instance from the provided values', (): void => {
        const input: CnpjValidatorOptionsInput = {
          caseSensitive: false,
          type: 'numeric',
        };
        const validator = new CnpjValidator(input);

        expect(validator.options).toBeInstanceOf(CnpjValidatorOptions);
        expect(validator.options.all).toEqual(
          expect.objectContaining({
            caseSensitive: false,
            type: 'numeric',
          }),
        );
      });
    });

    describe('when called with invalid options', (): void => {
      it('throws CnpjValidatorOptionTypeInvalidException for invalid type', (): void => {
        expect(() => {
          new CnpjValidator({ type: 'invalid' as CnpjType });
        }).toThrow(CnpjValidatorOptionTypeInvalidException);
      });

      it('throws CnpjValidatorOptionsTypeError for non-string prefix', (): void => {
        expect(() => {
          new CnpjValidator({ type: 123 as unknown as CnpjType });
        }).toThrow(CnpjValidatorOptionsTypeError);
      });
    });
  });

  describe('`isValid` method', (): void => {
    type CnpjValidatorFn = (cnpjInput: CnpjInput, options?: CnpjValidatorOptionsInput) => boolean;
    type CnpjValidatorFactory = (options: Partial<CnpjValidatorOptionsType>) => CnpjValidatorFn;

    const createValidatorWithLiteralObjectOptionsInConstructor: CnpjValidatorFactory = (
      options,
    ) => {
      const validator = new CnpjValidator(options);

      return (cnpjInput: CnpjInput, optionsOverride?: CnpjValidatorOptionsInput): boolean => {
        return validator.isValid(cnpjInput, optionsOverride);
      };
    };

    const createValidatorWithCnpjValidatorOptionsInstanceInConstructor: CnpjValidatorFactory = (
      options,
    ) => {
      const validatorOptions = new CnpjValidatorOptions(options);
      const validator = new CnpjValidator(validatorOptions);

      return (cnpjInput: CnpjInput, optionsOverride?: CnpjValidatorOptionsInput): boolean => {
        return validator.isValid(cnpjInput, optionsOverride);
      };
    };

    const createValidatorWithLiteralObjectOptionsInMethod: CnpjValidatorFactory = (options) => {
      const validator = new CnpjValidator();

      return (cnpjInput: CnpjInput, optionsOverride?: CnpjValidatorOptionsInput): boolean => {
        return validator.isValid(cnpjInput, {
          ...options,
          ...(optionsOverride instanceof CnpjValidatorOptions
            ? optionsOverride.all
            : optionsOverride),
        });
      };
    };

    const createValidatorWithCnpjValidatorOptionsInstanceInMethod: CnpjValidatorFactory = (
      options,
    ) => {
      const validator = new CnpjValidator();

      return (cnpjInput: CnpjInput, optionsOverride?: CnpjValidatorOptionsInput): boolean => {
        const validatorOptions = new CnpjValidatorOptions(options, optionsOverride ?? {});

        return validator.isValid(cnpjInput, validatorOptions);
      };
    };

    interface InputType {
      input: CnpjInput;
      type: string;
    }

    function createInputsSet(cnpj: string): InputType[] {
      const unformattedString = cnpj;
      const formattedString = cnpj.replace(
        /([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})(\d+)/i,
        '$1.$2.$3/$4-$5',
      );
      const unformattedArray = unformattedString.split('');
      const formattedArray = formattedString.split('');
      const groupedArray = formattedString.split(/[./-]/);

      return [
        { type: 'string', input: unformattedString },
        { type: 'formatted string', input: formattedString },
        { type: 'array', input: unformattedArray },
        { type: 'formatted array', input: formattedArray },
        { type: 'grouped array', input: groupedArray },
      ];
    }

    describe.each([
      [
        'when options are passed to constructor as literal object',
        createValidatorWithLiteralObjectOptionsInConstructor,
      ],
      [
        'when options are passed to constructor as CnpjValidatorOptions instance',
        createValidatorWithCnpjValidatorOptionsInstanceInConstructor,
      ],
      [
        'when options are passed to method as literal object',
        createValidatorWithLiteralObjectOptionsInMethod,
      ],
      [
        'when options are passed to method as CnpjValidatorOptions instance',
        createValidatorWithCnpjValidatorOptionsInstanceInMethod,
      ],
    ])('%s', (_, createValidator): void => {
      describe('when no options are passed', (): void => {
        const isValid = createValidator({});

        it.each(createInputsSet('1QB5UKALPYFP59'))(
          'returns `true` for a valid CNPJ $type with numbers and uppercase letters',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('96206256120884'))(
          'returns `true` for a valid CNPJ $type with only numbers',
          ({ input }): void => {
            const result = isValid(input);
            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('1QB5UKALpyfp59'))(
          'returns `false` for a valid CNPJ $type with numbers and lowercase letters',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each(createInputsSet('AB123CDE00015'))(
          'returns `false` for a CNPJ $type with less than 14 digits',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each(createInputsSet('AB123CDE0001555'))(
          'returns `false` for a CNPJ $type with more than 14 digits',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each([
          { baseId: 'AB123CDE', branchId: '0000' },
          { baseId: '00000000', branchId: 'A001' },
        ])(
          'returns `false` for a CNPJ with base ID "$baseId" and branch ID "$branchId"',
          ({ baseId, branchId }): void => {
            for (let i = 0; i < 100; i++) {
              const input = `${baseId}${branchId}${i.toString().padStart(2, '0')}`;

              const result = isValid(input);

              expect(result).toBe(false);
            }
          },
        );

        it.each([
          '111111111111',
          '222222222222',
          '333333333333',
          '444444444444',
          '555555555555',
          '666666666666',
          '777777777777',
          '888888888888',
          '999999999999',
        ])('returns `false` for a CNPJ with all digits the same', (prefix): void => {
          for (let i = 0; i < 100; i++) {
            const input = `${prefix}${i.toString().padStart(2, '0')}`;

            const result = isValid(input);

            expect(result).toBe(false);
          }
        });
      });

      describe('when `caseSensitive` option is `false`', (): void => {
        const isValid = createValidator({ caseSensitive: false });

        it.each(createInputsSet('1QB5UKALpyfp59'))(
          'returns `true` for a valid CNPJ $type with numbers and lowercase letters',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(true);
          },
        );
      });

      describe('when `type` option is `"numeric"`', (): void => {
        const isValid = createValidator({ type: 'numeric' });

        it.each(createInputsSet('96206256120884'))(
          'returns `true` for a valid CNPJ $type with only numbers',
          ({ input }): void => {
            const result = isValid(input);
            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('1QB5UKALPYFP59'))(
          'returns `false` for a valid CNPJ $type with numbers and uppercase letters',
          ({ input }): void => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );
      });
    });

    describe('when called with invalid arguments', (): void => {
      let validator: CnpjValidator;

      beforeEach(() => {
        validator = new CnpjValidator();
      });

      it('throws a `CnpjValidatorInputTypeError` with `undefined`', (): void => {
        expect(() => {
          validator.isValid(undefined as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with `null`', (): void => {
        expect(() => {
          validator.isValid(null as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with integer number', (): void => {
        expect(() => {
          validator.isValid(42 as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with float number', (): void => {
        expect(() => {
          validator.isValid(3.14 as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with boolean', (): void => {
        expect(() => {
          validator.isValid(true as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with object', (): void => {
        expect(() => {
          validator.isValid({ not: 'a string' } as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with array of numbers', (): void => {
        expect(() => {
          validator.isValid([1, 2, 3] as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });
    });
  });
});
