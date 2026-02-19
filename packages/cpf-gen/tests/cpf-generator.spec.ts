import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { CpfGenerator } from '../src/cpf-generator';
import { CpfGeneratorOptions } from '../src/cpf-generator-options';
import {
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorOptionsTypeError,
} from '../src/exceptions';
import type { CpfGeneratorOptionsInput, CpfGeneratorOptionsType } from '../src/types';
import * as utils from '../src/utils';

describe('CpfGenerator', (): void => {
  describe('constructor', (): void => {
    describe('when called with no arguments', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CpfGeneratorOptions();

        const generator = new CpfGenerator();

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with an empty object', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CpfGeneratorOptions();

        const generator = new CpfGenerator({});

        expect(generator.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with a CpfGeneratorOptions instance', (): void => {
      it('uses that instance directly without copying', (): void => {
        const options = new CpfGeneratorOptions({
          format: true,
          prefix: '123456',
        });
        const generator = new CpfGenerator(options);

        expect(generator.options).toBe(options);
        expect(generator.options.all).toEqual(options.all);
      });

      it('mutations to the instance affect future generate calls', (): void => {
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

    describe('when called with a literal options object', (): void => {
      it('creates a new CpfGeneratorOptions instance from the provided values', (): void => {
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

    describe('when called with invalid options', (): void => {
      it('throws CpfGeneratorOptionPrefixInvalidException for invalid prefix', (): void => {
        expect(() => {
          new CpfGenerator({ prefix: '000000000' });
        }).toThrow(CpfGeneratorOptionPrefixInvalidException);
      });

      it('throws CpfGeneratorOptionsTypeError for non-string prefix', (): void => {
        expect(() => {
          new CpfGenerator({ prefix: 123 as unknown as string });
        }).toThrow(CpfGeneratorOptionsTypeError);
      });
    });
  });

  describe('`generate` method', (): void => {
    type CpfGeneratorFn = (options?: CpfGeneratorOptionsInput) => string;
    type CpfGeneratorFactory = (options: Partial<CpfGeneratorOptionsType>) => CpfGeneratorFn;

    const createGeneratorWithLiteralObjectOptionsInConstructor: CpfGeneratorFactory = (options) => {
      const generator = new CpfGenerator(options);

      return generator.generate.bind(generator);
    };

    const createGeneratorWithCpfGeneratorOptionsInstanceInConstructor: CpfGeneratorFactory = (
      options,
    ) => {
      const generatorOptions = new CpfGeneratorOptions(options);
      const generator = new CpfGenerator(generatorOptions);

      return generator.generate.bind(generator);
    };

    const createGeneratorWithLiteralObjectOptionsInMethod: CpfGeneratorFactory = (options) => {
      const generator = new CpfGenerator();

      return generator.generate.bind(generator, options);
    };

    const createGeneratorWithCpfGeneratorOptionsInstanceInMethod: CpfGeneratorFactory = (
      options,
    ) => {
      const generatorOptions = new CpfGeneratorOptions(options);
      const generator = new CpfGenerator();

      return generator.generate.bind(generator, generatorOptions);
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
    ])('%s', (_, createGenerator): void => {
      describe('when no options are passed', (): void => {
        const generate = createGenerator({});

        it('returns a 11-digit string with only numbers', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(11);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).not.toMatch(/[./-]/);
            expect(result).toMatch(/^\d+$/);
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

        it('returns an 14-character string with numbers and punctuation', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).toMatch(/[./-]/g);
            expect(result).toMatch(/\d{2,3}/g);
          }
        });

        it('returns a string with standard CPF formatting', (): void => {
          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
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
        ])('returns a 11-digit string with with prefix "%s"', (prefix): void => {
          const generate = createGenerator({ prefix });

          for (let i = 0; i < 100; i++) {
            const result = generate();

            expect(result).toHaveLength(11);
            expect(result).toMatch(/^\d+$/);
            expect(result).toMatch(new RegExp(`^${prefix}`));
          }
        });

        it('ignores characters after the 9th position', (): void => {
          const generate = createGenerator({ prefix: `12345678910` });

          const result = generate();

          expect(result).toHaveLength(11);
          expect(result).not.toMatch(/10$/);
          expect(result).toMatch(/^123456789\d{2}$/);
        });

        it('always generates the same CPF with the same 9-digit prefix', (): void => {
          const generate = createGenerator({ prefix: '987654321' });
          const results = new Set<string>();

          for (let i = 0; i < 100; i++) {
            const result = generate();

            results.add(result);
          }

          expect(results.size).toBe(1);
        });

        it('strips non-numeric characters from prefix before generating', (): void => {
          const generate = createGenerator({ prefix: 'ABC.123.DEF.456.GHI.789', format: false });

          const result = generate();

          expect(result).toMatch(/^123456789/);
        });
      });

      describe('when different options are passed', (): void => {
        describe('when `format = true` and `prefix = "12345678"`', (): void => {
          const generate = createGenerator({ format: true, prefix: '12345678' });

          it('returns a 14-character CPF', (): void => {
            const result = generate();

            expect(result).toHaveLength(14);
            expect(result).not.toMatch(/[a-z]/i);
            expect(result).toMatch(/^123\.456\.78\d-\d{2}$/);
          });
        });
      });
    });

    describe('when CpfCheckDigits throws an exception', (): void => {
      let randomSequenceSpy: ReturnType<typeof spyOn>;

      beforeEach((): void => {
        randomSequenceSpy = spyOn(utils, 'randomSequence');
      });

      afterEach((): void => {
        randomSequenceSpy.mockRestore();
      });

      it('retries generation and returns a valid CPF', (): void => {
        randomSequenceSpy
          .mockImplementationOnce(() => '111111111')
          .mockImplementationOnce(() => '123456789');

        const result = new CpfGenerator().generate();

        expect(result).toHaveLength(11);
        expect(result.startsWith('123456789')).toBe(true);
        expect(randomSequenceSpy).toHaveBeenCalledTimes(2);
      });

      it('uses the same options on retry', (): void => {
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
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(1, 6);
        expect(randomSequenceSpy).toHaveBeenNthCalledWith(2, 6);
      });
    });
  });

  describe('`options` getter', (): void => {
    describe('when options were passed as a plain object', (): void => {
      it('returns the internal CpfGeneratorOptions instance', (): void => {
        const generator = new CpfGenerator({ prefix: '123456' });

        expect(generator.options).toBeInstanceOf(CpfGeneratorOptions);
        expect(generator.options.prefix).toBe('123456');
      });
    });

    describe('when options were passed as a CpfGeneratorOptions instance', (): void => {
      it('returns the same instance that was passed to the constructor', (): void => {
        const options = new CpfGeneratorOptions({ prefix: '123456' });
        const generator = new CpfGenerator(options);

        expect(generator.options).toBe(options);
        expect(generator.options.prefix).toBe('123456');
      });
    });

    describe('when the returned options are mutated', (): void => {
      it('affects future generate calls that do not pass per-call options', (): void => {
        const generator = new CpfGenerator({ prefix: '123456' });

        generator.options.prefix = '789';

        const result = generator.generate();

        expect(result).toMatch(/^789\d{8}$/);
        expect(result).toHaveLength(11);
      });
    });
  });
});
