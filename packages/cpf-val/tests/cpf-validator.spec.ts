import { beforeEach, describe, expect, it } from 'bun:test';

import { CpfValidator } from '../src/cpf-validator';
import { CpfValidatorInputTypeError } from '../src/exceptions';
import type { CpfInput } from '../src/types';

describe('CpfValidator', (): void => {
  describe('constructor', (): void => {
    describe('when called', (): void => {
      it('creates an instance of `CpfValidator`', (): void => {
        const validator = new CpfValidator();

        expect(validator).toBeInstanceOf(CpfValidator);
      });
    });
  });

  describe('`isValid` method', (): void => {
    let validator: CpfValidator;

    interface InputType {
      input: CpfInput;
      type: string;
    }

    function createInputsSet(cpf: string): InputType[] {
      const unformattedString = cpf;
      const formattedString = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
      const unformattedArray = unformattedString.split('');
      const formattedArray = formattedString.split('');
      const groupedArray = formattedString.split(/[.-]/);

      return [
        { type: 'string', input: unformattedString },
        { type: 'formatted string', input: formattedString },
        { type: 'array', input: unformattedArray },
        { type: 'formatted array', input: formattedArray },
        { type: 'grouped array', input: groupedArray },
      ];
    }

    beforeEach(() => {
      validator = new CpfValidator();
    });

    it.each(createInputsSet('82911017366'))('returns `true` for a valid CPF', ({ input }): void => {
      const result = validator.isValid(input);

      expect(result).toBe(true);
    });

    it.each(createInputsSet('8291101736'))(
      'returns `false` for a CPF $type with less than 11 digits',
      ({ input }): void => {
        const result = validator.isValid(input);

        expect(result).toBe(false);
      },
    );

    it.each(createInputsSet('829110173666'))(
      'returns `false` for a CPF $type with more than 11 digits',
      ({ input }): void => {
        const result = validator.isValid(input);

        expect(result).toBe(false);
      },
    );

    it.each([
      '000000000',
      '111111111',
      '222222222',
      '333333333',
      '444444444',
      '555555555',
      '666666666',
      '777777777',
      '888888888',
      '999999999',
    ])('returns `false` for a CPF with all digits the same', (prefix): void => {
      for (let i = 0; i < 100; i++) {
        const input = `${prefix}${i.toString().padStart(2, '0')}`;

        const result = validator.isValid(input);

        expect(result).toBe(false);
      }
    });

    describe('when called with invalid arguments', (): void => {
      it('does not throw with string input', (): void => {
        expect(() => {
          validator.isValid('12345678901');
        }).not.toThrow();
      });

      it('does not throw with array of strings input', (): void => {
        expect(() => {
          validator.isValid(['12345678901']);
        }).not.toThrow();
      });

      it('throws a `CpfValidatorInputTypeError` with `undefined`', (): void => {
        expect(() => {
          validator.isValid(undefined as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with `null`', (): void => {
        expect(() => {
          validator.isValid(null as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with integer number', (): void => {
        expect(() => {
          validator.isValid(42 as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with float number', (): void => {
        expect(() => {
          validator.isValid(3.14 as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with boolean', (): void => {
        expect(() => {
          validator.isValid(true as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with object', (): void => {
        expect(() => {
          validator.isValid({ not: 'a string' } as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with array of numbers', (): void => {
        expect(() => {
          validator.isValid([1, 2, 3] as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });
    });
  });
});
