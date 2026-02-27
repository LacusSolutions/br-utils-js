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

describe('CnpjValidator', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with default options', () => {
        const defaultOptions = new CnpjValidatorOptions();

        const validator = new CnpjValidator();

        expect(validator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with an empty object', () => {
      it('creates an instance with default options', () => {
        const defaultOptions = new CnpjValidatorOptions();

        const validator = new CnpjValidator({});

        expect(validator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with a CnpjValidatorOptions instance', () => {
      it('uses that instance directly without copying', () => {
        const options = new CnpjValidatorOptions({
          caseSensitive: false,
          type: 'numeric',
        });
        const validator = new CnpjValidator(options);

        expect(validator.options).toBe(options);
        expect(validator.options.all).toEqual(options.all);
      });

      it('mutations to the instance affect future isValid calls', () => {
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

    describe('when called with a literal options object', () => {
      it('creates a new CnpjValidatorOptions instance from the provided values', () => {
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

    describe('when called with invalid options', () => {
      it('throws CnpjValidatorOptionTypeInvalidException for invalid type', () => {
        expect(() => {
          new CnpjValidator({ type: 'invalid' as CnpjType });
        }).toThrow(CnpjValidatorOptionTypeInvalidException);
      });

      it('throws CnpjValidatorOptionsTypeError for non-string type', () => {
        expect(() => {
          new CnpjValidator({ type: 123 as unknown as CnpjType });
        }).toThrow(CnpjValidatorOptionsTypeError);
      });
    });
  });

  describe('`isValid` method', () => {
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
    ])('%s', (_, createValidator) => {
      describe('when no options are passed', () => {
        const isValid = createValidator({});

        it.each(createInputsSet('1QB5UKALPYFP59'))(
          'returns `true` for a valid CNPJ $type with numbers and uppercase letters',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('96206256120884'))(
          'returns `true` for a valid CNPJ $type with only numbers',
          ({ input }) => {
            const result = isValid(input);
            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('1QB5UKALpyfp59'))(
          'returns `false` for a valid CNPJ $type with numbers and lowercase letters',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each(createInputsSet('AB123CDE00015'))(
          'returns `false` for a CNPJ $type with less than 14 digits',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each(createInputsSet('AB123CDE0001555'))(
          'returns `false` for a CNPJ $type with more than 14 digits',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );

        it.each([
          { baseId: 'AB123CDE', branchId: '0000' },
          { baseId: '00000000', branchId: 'A001' },
        ])(
          'returns `false` for a CNPJ with base ID "$baseId" and branch ID "$branchId"',
          ({ baseId, branchId }) => {
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
        ])('returns `false` for a CNPJ with all digits the same', (prefix) => {
          for (let i = 0; i < 100; i++) {
            const input = `${prefix}${i.toString().padStart(2, '0')}`;

            const result = isValid(input);

            expect(result).toBe(false);
          }
        });
      });

      describe('when `caseSensitive` option is `false`', () => {
        const isValid = createValidator({ caseSensitive: false });

        it.each(createInputsSet('1QB5UKALpyfp59'))(
          'returns `true` for a valid CNPJ $type with numbers and lowercase letters',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(true);
          },
        );
      });

      describe('when `type` option is `"numeric"`', () => {
        const isValid = createValidator({ type: 'numeric' });

        it.each(createInputsSet('96206256120884'))(
          'returns `true` for a valid CNPJ $type with only numbers',
          ({ input }) => {
            const result = isValid(input);
            expect(result).toBe(true);
          },
        );

        it.each(createInputsSet('1QB5UKALPYFP59'))(
          'returns `false` for a valid CNPJ $type with numbers and uppercase letters',
          ({ input }) => {
            const result = isValid(input);

            expect(result).toBe(false);
          },
        );
      });
    });

    describe('when called with invalid arguments', () => {
      let validator: CnpjValidator;

      beforeEach(() => {
        validator = new CnpjValidator();
      });

      it('throws a `CnpjValidatorInputTypeError` with `undefined`', () => {
        expect(() => {
          validator.isValid(undefined as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with `null`', () => {
        expect(() => {
          validator.isValid(null as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with integer number', () => {
        expect(() => {
          validator.isValid(42 as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with float number', () => {
        expect(() => {
          validator.isValid(3.14 as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with boolean', () => {
        expect(() => {
          validator.isValid(true as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with object', () => {
        expect(() => {
          validator.isValid({ not: 'a string' } as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });

      it('throws a `CnpjValidatorInputTypeError` with array of numbers', () => {
        expect(() => {
          validator.isValid([1, 2, 3] as unknown as CnpjInput);
        }).toThrow(CnpjValidatorInputTypeError);
      });
    });
  });
});
