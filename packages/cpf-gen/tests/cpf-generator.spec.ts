import * as lacusUtils from '@lacussoft/utils';
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { CpfGenerator } from '../src/cpf-generator';
import { CpfGeneratorOptions } from '../src/cpf-generator-options';
import {
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorOptionsTypeError,
} from '../src/exceptions';
import type { CpfGeneratorOptionsInput, CpfGeneratorOptionsType } from '../src/types';

describe('CpfGenerator', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with default options', () => {
        const defaultOptions = new CpfGeneratorOptions();

        const generator = new CpfGenerator();

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with an empty object', () => {
      it('creates an instance with default options', () => {
        const defaultOptions = new CpfGeneratorOptions();

        const generator = new CpfGenerator({});

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with a CpfGeneratorOptions instance', () => {
      it('uses that instance directly without copying', () => {
        const options = new CpfGeneratorOptions({
          format: true,
          prefix: '123456',
        });
        const generator = new CpfGenerator(options);

        expect(generator.options).toBe(options);
        expect(generator.options.all).toEqual(options.all);
      });

      it('mutations to the instance affect future generate calls', () => {
        const options = new CpfGeneratorOptions({
          prefix: '123456',
          format: true,
        });
        const generator = new CpfGenerator(options);
        options.prefix = '112233';
        options.format = false;

        const result = generator.generate();

        expect(result).toHaveLength(11);
        expect(result).toMatch(/^112233\d{5}$/);
      });
    });

    describe('when called with a literal options object', () => {
      it('creates a new CpfGeneratorOptions instance from the provided values', () => {
        const input: CpfGeneratorOptionsInput = {
          format: true,
          prefix: '123456',
        };
        const generator = new CpfGenerator(input);

        expect(generator.options).toBeInstanceOf(CpfGeneratorOptions);
        expect(generator.options.all).toEqual(
          expect.objectContaining({
            format: true,
            prefix: '123456',
          }),
        );
      });
    });

    describe('when called with invalid options', () => {
      it('throws CpfGeneratorOptionPrefixInvalidException for invalid prefix', () => {
        expect(() => {
          new CpfGenerator({ prefix: '000000000' });
        }).toThrow(CpfGeneratorOptionPrefixInvalidException);
      });

      it('throws CpfGeneratorOptionsTypeError for non-string prefix', () => {
        expect(() => {
          new CpfGenerator({ prefix: 123 as unknown as string });
        }).toThrow(CpfGeneratorOptionsTypeError);
      });
    });
  });

  describe('`generate` method', () => {
    type CpfGeneratorFn = (options?: CpfGeneratorOptionsInput) => string;
    type CpfGeneratorFactory = (options: Partial<CpfGeneratorOptionsType>) => CpfGeneratorFn;

    const createGeneratorWithLiteralObjectOptionsInConstructor: CpfGeneratorFactory = (options) => {
      const generator = new CpfGenerator(options);

      return (optionsOverride?: CpfGeneratorOptionsInput): string => {
        return generator.generate(optionsOverride);
      };
    };

    const createGeneratorWithCpfGeneratorOptionsInstanceInConstructor: CpfGeneratorFactory = (
      options,
    ) => {
      const generatorOptions = new CpfGeneratorOptions(options);
      const generator = new CpfGenerator(generatorOptions);

      return (optionsOverride?: CpfGeneratorOptionsInput): string => {
        return generator.generate(optionsOverride);
      };
    };

    const createGeneratorWithLiteralObjectOptionsInMethod: CpfGeneratorFactory = (options) => {
      const generator = new CpfGenerator();

      return (optionsOverride?: CpfGeneratorOptionsInput): string => {
        return generator.generate({
          ...options,
          ...(optionsOverride instanceof CpfGeneratorOptions
            ? optionsOverride.all
            : optionsOverride),
        });
      };
    };

    const createGeneratorWithCpfGeneratorOptionsInstanceInMethod: CpfGeneratorFactory = (
      options,
    ) => {
      const generator = new CpfGenerator();

      return (optionsOverride?: CpfGeneratorOptionsInput): string => {
        const generatorOptions = new CpfGeneratorOptions(options, optionsOverride ?? {});

        return generator.generate(generatorOptions);
      };
    };

    describe.each([
      [
        'when options are passed to constructor as literal object',
        createGeneratorWithLiteralObjectOptionsInConstructor,
      ],
      [
        'when options are passed to constructor as CpfGeneratorOptions instance',
        createGeneratorWithCpfGeneratorOptionsInstanceInConstructor,
      ],
      [
        'when options are passed to method as literal object',
        createGeneratorWithLiteralObjectOptionsInMethod,
      ],
      [
        'when options are passed to method as CpfGeneratorOptions instance',
        createGeneratorWithCpfGeneratorOptionsInstanceInMethod,
      ],
    ])('%s', (_, createGenerator) => {
      describe('when no options are passed', () => {
        const generate = createGenerator({});

        it('returns an 11-digit string with only numbers', () => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(11);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).not.toMatch(/[./-]/);
            expect(result).toMatch(/^\d+$/);
          }
        });

        it('returns different values on successive calls', () => {
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

      describe('when `format` option is `true`', () => {
        const generate = createGenerator({ format: true });

        it('returns a 14-character string with numbers and punctuation', () => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).toMatch(/[./-]/g);
            expect(result).toMatch(/\d{2,3}/g);
          }
        });

        it('returns a string with standard CPF formatting', () => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
          }
        });

        it('returns different values on successive calls', () => {
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

      describe('when `prefix` option is passed', () => {
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
        ])('returns an 11-digit string with prefix "%s"', (prefix) => {
          const generate = createGenerator({ prefix });

          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(11);
            expect(result).toMatch(/^\d+$/);
            expect(result).toMatch(new RegExp(`^${prefix}`));
          }
        });

        it('ignores characters after the 9th position', () => {
          const generate = createGenerator({ prefix: `12345678910` });

          const result = generate();

          expect(result).toHaveLength(11);
          expect(result).not.toMatch(/10$/);
          expect(result).toMatch(/^123456789\d{2}$/);
        });

        it('always generates the same CPF with the same 9-digit prefix', () => {
          const generate = createGenerator({ prefix: '987654321' });
          const results = new Set<string>();

          for (let i = 0; i < 100; i++) {
            const result = generate();

            results.add(result);
          }

          expect(results.size).toBe(1);
        });

        it('strips non-numeric characters from prefix before generating', () => {
          const generate = createGenerator({ prefix: 'ABC.123.DEF.456.GHI.789', format: false });

          const result = generate();

          expect(result).toMatch(/^123456789/);
        });
      });

      describe('when different options are passed', () => {
        describe('when `format = true` and `prefix = "12345678"`', () => {
          const generate = createGenerator({ format: true, prefix: '12345678' });

          it('returns a 14-character CPF', () => {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).toMatch(/^123\.456\.78\d-\d{2}$/);
          });
        });
      });
    });

    describe('when CpfCheckDigits throws an exception', () => {
      let randomSequenceSpy: ReturnType<typeof spyOn>;

      beforeEach(() => {
        randomSequenceSpy = spyOn(lacusUtils, 'generateRandomSequence');
      });

      afterEach(() => {
        randomSequenceSpy.mockRestore();
      });

      it('retries generation and returns a valid CPF', () => {
        randomSequenceSpy
          .mockImplementationOnce(() => '111111111')
          .mockImplementationOnce(() => '123456789');

        const result = new CpfGenerator().generate();

        expect(result).toHaveLength(11);
        expect(result.startsWith('123456789')).toBe(true);
        expect(randomSequenceSpy).toHaveBeenCalledTimes(2);
      });

      it('uses the same options on retry', () => {
        randomSequenceSpy
          .mockImplementationOnce(() => '111111')
          .mockImplementationOnce(() => '222333');

        const result = new CpfGenerator({
          prefix: '111',
          format: true,
        }).generate();

        expect(result).toHaveLength(14);
        expect(result.startsWith('111.222.333-')).toBe(true);
        expect(randomSequenceSpy).toHaveBeenCalledTimes(2);
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(1, 6, 'numeric');
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(2, 6, 'numeric');
      });
    });
  });
});
