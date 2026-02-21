import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { CnpjGenerator } from '../src/cnpj-generator';
import { CnpjGeneratorOptions } from '../src/cnpj-generator-options';
import {
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionTypeInvalidException,
} from '../src/exceptions';
import type { CnpjGeneratorOptionsInput, CnpjGeneratorOptionsType, CnpjType } from '../src/types';
import * as utils from '../src/utils';

describe('CnpjGenerator', (): void => {
  describe('constructor', (): void => {
    describe('when called with no arguments', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CnpjGeneratorOptions();

        const generator = new CnpjGenerator();

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with an empty object', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CnpjGeneratorOptions();

        const generator = new CnpjGenerator({});

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with a CnpjGeneratorOptions instance', (): void => {
      it('uses that instance directly without copying', (): void => {
        const options = new CnpjGeneratorOptions({
          format: true,
          prefix: '12345678',
          type: 'numeric',
        });
        const generator = new CnpjGenerator(options);

        expect(generator.options).toBe(options);
        expect(generator.options.all).toEqual(options.all);
      });

      it('mutations to the instance affect future generate calls', (): void => {
        const options = new CnpjGeneratorOptions({
          format: false,
          type: 'numeric',
        });
        const generator = new CnpjGenerator(options);

        options.format = true;
        options.type = 'alphabetic';

        expect(generator.options.format).toBe(true);
        expect(generator.options.type).toBe('alphabetic');
      });
    });

    describe('when called with a literal options object', (): void => {
      it('creates a new CnpjGeneratorOptions instance from the provided values', (): void => {
        const input: CnpjGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
          type: 'numeric',
        };
        const generator = new CnpjGenerator(input);

        expect(generator.options).toBeInstanceOf(CnpjGeneratorOptions);
        expect(generator.options.all).toEqual(
          expect.objectContaining({
            format: true,
            prefix: '12345678',
            type: 'numeric',
          }),
        );
      });
    });

    describe('when called with invalid options', (): void => {
      it('throws CnpjGeneratorOptionPrefixInvalidException for invalid prefix', (): void => {
        expect(() => {
          new CnpjGenerator({ prefix: '00000000' });
        }).toThrow(CnpjGeneratorOptionPrefixInvalidException);
      });

      it('throws CnpjGeneratorOptionTypeInvalidException for invalid type', (): void => {
        expect(() => {
          new CnpjGenerator({ type: 'invalid' as CnpjType });
        }).toThrow(CnpjGeneratorOptionTypeInvalidException);
      });

      it('throws CnpjGeneratorOptionsTypeError for non-string prefix', (): void => {
        expect(() => {
          new CnpjGenerator({ prefix: 123 as unknown as string });
        }).toThrow(CnpjGeneratorOptionsTypeError);
      });
    });
  });

  describe('`generate` method', (): void => {
    type CnpjGeneratorFn = (options?: CnpjGeneratorOptionsInput) => string;
    type CnpjGeneratorFactory = (options: Partial<CnpjGeneratorOptionsType>) => CnpjGeneratorFn;

    const createGeneratorWithLiteralObjectOptionsInConstructor: CnpjGeneratorFactory = (
      options,
    ) => {
      const generator = new CnpjGenerator(options);

      return (optionsOverride?: CnpjGeneratorOptionsInput): string => {
        return generator.generate(optionsOverride);
      };
    };

    const createGeneratorWithCnpjGeneratorOptionsInstanceInConstructor: CnpjGeneratorFactory = (
      options,
    ) => {
      const generatorOptions = new CnpjGeneratorOptions(options);
      const generator = new CnpjGenerator(generatorOptions);

      return (optionsOverride?: CnpjGeneratorOptionsInput): string => {
        return generator.generate(optionsOverride);
      };
    };

    const createGeneratorWithLiteralObjectOptionsInMethod: CnpjGeneratorFactory = (options) => {
      const generator = new CnpjGenerator();

      return (optionsOverride?: CnpjGeneratorOptionsInput): string => {
        return generator.generate({
          ...options,
          ...(optionsOverride instanceof CnpjGeneratorOptions
            ? optionsOverride.all
            : optionsOverride),
        });
      };
    };

    const createGeneratorWithCnpjGeneratorOptionsInstanceInMethod: CnpjGeneratorFactory = (
      options,
    ) => {
      const generator = new CnpjGenerator();

      return (optionsOverride?: CnpjGeneratorOptionsInput): string => {
        const generatorOptions = new CnpjGeneratorOptions(options, optionsOverride ?? {});

        return generator.generate(generatorOptions);
      };
    };

    describe.each([
      [
        'when options are passed to constructor as literal object',
        createGeneratorWithLiteralObjectOptionsInConstructor,
      ],
      [
        'when options are passed to constructor as CnpjGeneratorOptions instance',
        createGeneratorWithCnpjGeneratorOptionsInstanceInConstructor,
      ],
      [
        'when options are passed to method as literal object',
        createGeneratorWithLiteralObjectOptionsInMethod,
      ],
      [
        'when options are passed to method as CnpjGeneratorOptions instance',
        createGeneratorWithCnpjGeneratorOptionsInstanceInMethod,
      ],
    ])('%s', (_, createGenerator): void => {
      describe('when no options are passed', (): void => {
        const generate = createGenerator({});

        it('returns a 14-character string with only numbers and uppercase letters', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).not.toMatch(/[./-]/);
            expect(result).toMatch(/^[0-9A-Z]+$/);
          }
        });

        it('contains 2 numeric check digits', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toMatch(/\d{2}$/);
          }
        });

        it('returns different values on successive calls', (): void => {
          // In 100 calls, 1 value can repeat at most.
          const EXPECTED_DIFFERENT_VALUES = 99;
          const results = new Set<string>();

          for (let i = 0; i < 100; i++) {
            const result = generate();

            results.add(result);
          }

          expect(results.size).toBeGreaterThanOrEqual(EXPECTED_DIFFERENT_VALUES);
        });
      });

      describe('when `format` option is `true`', (): void => {
        const generate = createGenerator({ format: true });

        it('returns an 18-character string with numbers, uppercase letters and punctuation', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(18);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).toMatch(/[./-]/g);
            expect(result).toMatch(/[0-9A-Z]{2,4}/g);
          }
        });

        it('contains 2 numeric check digits', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toMatch(/\d{2}$/);
          }
        });

        it('returns a string with standard CNPJ formatting', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toMatch(
              /^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-[0-9A-Z]{2}$/i,
            );
          }
        });

        it('returns different values on successive calls', (): void => {
          // In 100 calls, 1 value can repeat at most.
          const EXPECTED_DIFFERENT_VALUES = 99;
          const results = new Set<string>();

          for (let i = 0; i < 100; i++) {
            const result = generate();

            results.add(result);
          }

          expect(results.size).toBeGreaterThanOrEqual(EXPECTED_DIFFERENT_VALUES);
        });
      });

      describe('when `prefix` option is passed', (): void => {
        it.each([
          ['1'],
          ['12'],
          ['123'],
          ['1234'],
          ['12345'],
          ['123456'],
          ['1234567'],
          ['12345678'],
          ['123456789'],
          ['1234567890'],
          ['12345678910'],
          ['123456780009'],
          ['A'],
          ['AB'],
          ['ABC'],
          ['ABCD'],
          ['ABCDE'],
          ['ABCDEF'],
          ['ABCDEFG'],
          ['ABCDEFGH'],
          ['ABCDEFGHI'],
          ['ABCDEFGHIJ'],
          ['ABCDEFGHIJK'],
          ['ABCDEFGHIJKL'],
          ['AB123CDE0001'],
        ])('returns a 14-character string with with prefix "%s"', (prefix): void => {
          const generate = createGenerator({ prefix });

          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).toMatch(/^[0-9A-Z]+$/);
            expect(result).toMatch(new RegExp(`^${prefix}`));
          }
        });

        it.each([
          ['numeric', '123456780009'],
          ['alphabetic', 'ABCDEFGHIJKL'],
          ['alphanumeric', 'AB123CDE0001'],
        ])('ignores characters after the 12th position with %s prefix', (_, prefix): void => {
          const generate = createGenerator({ prefix: `${prefix}XY` });

          const result = generate();

          expect(result).toHaveLength(14);
          expect(result).not.toMatch(/XY$/);
          expect(result).toMatch(new RegExp(`^${prefix}\\d{2}$`));
        });

        it.each([
          ['numeric', '123456780009'],
          ['alphabetic', 'ABCDEFGHIJKL'],
          ['alphanumeric', 'AB123CDE0001'],
        ])(
          'always generates the same CNPJ with the same 12-character %s prefix',
          (_, prefix): void => {
            const generate = createGenerator({ prefix });
            const results = new Set<string>();

            for (let i = 0; i < 100; i++) {
              const result = generate({ prefix });

              results.add(result);
            }

            expect(results.size).toBe(1);
          },
        );

        it('strips non-alphanumeric characters from prefix before generating', (): void => {
          const generate = createGenerator({ prefix: 'AB.12.CDE/0001', format: false });

          const result = generate();

          expect(result).toMatch(/^AB12CDE0001/);
        });
      });

      describe.each([
        ['numeric', '\\d'],
        ['alphabetic', '[A-Z]'],
        ['alphanumeric', '[0-9A-Z]'],
      ])('when `type` option is `"%s"`', (type, pattern): void => {
        const generate = createGenerator({ type: type as CnpjType });

        it('returns a 14-character string', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).not.toMatch(/[./-]/);
            expect(result).toMatch(new RegExp(`^${pattern}{12}\\d{2}$`));
          }
        });

        it('returns different values on successive calls', (): void => {
          // In 100 calls, 2 value can repeat at most.
          const EXPECTED_DIFFERENT_VALUES = 98;
          const results = new Set<string>();

          for (let i = 0; i < 100; i++) {
            const result = generate();

            results.add(result);
          }

          expect(results.size).toBeGreaterThanOrEqual(EXPECTED_DIFFERENT_VALUES);
        });
      });

      describe('when different options are passed', (): void => {
        describe('when `format = true` and `prefix = "AB123CDE000"`', (): void => {
          const generate = createGenerator({ format: true, prefix: 'AB123CDE000' });

          it('returns an 18-character CNPJ', (): void => {
            const result = generate();

            expect(result).toHaveLength(18);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).toMatch(/^AB\.123\.CDE\/000[0-9A-Z]-\d{2}$/);
          });
        });

        describe.each([
          ['numeric', '\\d'],
          ['alphabetic', '[A-Z]'],
          ['alphanumeric', '[0-9A-Z]'],
        ])('when `format = true` and `type = "%s"`', (type, pattern): void => {
          const generate = createGenerator({ format: true, type: type as CnpjType });

          it('returns an 18-character CNPJ', (): void => {
            const result = generate();

            expect(result).toHaveLength(18);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).toMatch(
              new RegExp(`^${pattern}{2}\\.${pattern}{3}\\.${pattern}{3}/${pattern}{4}-\\d{2}$`),
            );
          });
        });

        describe.each([
          ['numeric', '\\d'],
          ['alphabetic', '[A-Z]'],
          ['alphanumeric', '[0-9A-Z]'],
        ])('when `prefix = "AB123CDE"` and `type = "%s"`', (type, pattern): void => {
          const generate = createGenerator({ prefix: 'AB123CDE', type: type as CnpjType });

          it('returns a 14-character CNPJ', (): void => {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/);
            expect(result).not.toMatch(/[./-]/);
            expect(result).toMatch(new RegExp(`^AB123CDE${pattern}{4}\\d{2}$`));
          });
        });

        describe.each([
          ['numeric', '\\d'],
          ['alphabetic', '[A-Z]'],
          ['alphanumeric', '[0-9A-Z]'],
        ])(
          'when `format = true`, `prefix = "AB123CDE"` and `type = "%s"`',
          (type, pattern): void => {
            const generate = createGenerator({
              format: true,
              prefix: 'AB123CDE',
              type: type as CnpjType,
            });

            it('returns an 18-character CNPJ', (): void => {
              const result = generate();

              expect(result).toHaveLength(18);
              expect(result).not.toMatch(/[a-z]/);
              expect(result).toMatch(new RegExp(`^AB\\.123\\.CDE/${pattern}{4}-\\d{2}$`));
            });
          },
        );
      });
    });

    describe('when CnpjCheckDigits throws an exception', (): void => {
      let randomSequenceSpy: ReturnType<typeof spyOn>;

      beforeEach((): void => {
        randomSequenceSpy = spyOn(utils, 'randomSequence');
      });

      afterEach((): void => {
        randomSequenceSpy.mockRestore();
      });

      it('retries generation and returns a valid CNPJ', (): void => {
        const invalidSequence = '111111111111';
        const validSequence = '123456780001';

        randomSequenceSpy
          .mockImplementationOnce(() => invalidSequence)
          .mockImplementationOnce(() => validSequence);

        const result = new CnpjGenerator().generate();

        expect(result).toHaveLength(14);
        expect(result.startsWith(validSequence)).toBe(true);
        expect(randomSequenceSpy).toHaveBeenCalledTimes(2);
      });

      it('uses the same options on retry', (): void => {
        randomSequenceSpy.mockImplementationOnce(() => '0000').mockImplementationOnce(() => '0001');

        const result = new CnpjGenerator({ prefix: '12345678' }).generate();

        expect(result).toHaveLength(14);
        expect(result.startsWith('12345678')).toBe(true);
        expect(randomSequenceSpy).toHaveBeenCalledTimes(2);
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(1, 4, 'alphanumeric');
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(2, 4, 'alphanumeric');
      });
    });
  });
});
