import { beforeEach, describe, expect, it } from 'bun:test';

import { CpfValidator } from '../src/cpf-validator';
import { CpfValidatorInputTypeError } from '../src/exceptions';
import type { CpfInput } from '../src/types';

describe('CpfValidator', () => {
  describe('constructor', () => {
    describe('when called', () => {
      it('creates an instance of `CpfValidator`', () => {
        const validator = new CpfValidator();

        expect(validator).toBeInstanceOf(CpfValidator);
      });
    });
  });

  describe('`isValid` method', () => {
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

    it.each(createInputsSet('82911017366'))('returns `true` for a valid CPF', ({ input }) => {
      const result = validator.isValid(input);

      expect(result).toBe(true);
    });

    it.each(createInputsSet('8291101736'))(
      'returns `false` for a CPF $type with less than 11 digits',
      ({ input }) => {
        const result = validator.isValid(input);

        expect(result).toBe(false);
      },
    );

    it.each(createInputsSet('829110173666'))(
      'returns `false` for a CPF $type with more than 11 digits',
      ({ input }) => {
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
    ])('returns `false` for a CPF with all digits the same', (prefix) => {
      for (let i = 0; i < 100; i++) {
        const input = `${prefix}${i.toString().padStart(2, '0')}`;

        const result = validator.isValid(input);

        expect(result).toBe(false);
      }
    });

    describe('when called with invalid arguments', () => {
      it('does not throw with string input', () => {
        expect(() => {
          validator.isValid('12345678901');
        }).not.toThrow();
      });

      it('does not throw with array of strings input', () => {
        expect(() => {
          validator.isValid(['12345678901']);
        }).not.toThrow();
      });

      it('throws a `CpfValidatorInputTypeError` with `undefined`', () => {
        expect(() => {
          validator.isValid(undefined as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with `null`', () => {
        expect(() => {
          validator.isValid(null as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with integer number', () => {
        expect(() => {
          validator.isValid(42 as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with float number', () => {
        expect(() => {
          validator.isValid(3.14 as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with boolean', () => {
        expect(() => {
          validator.isValid(true as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with object', () => {
        expect(() => {
          validator.isValid({ not: 'a string' } as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });

      it('throws a `CpfValidatorInputTypeError` with array of numbers', () => {
        expect(() => {
          validator.isValid([1, 2, 3] as unknown as CpfInput);
        }).toThrow(CpfValidatorInputTypeError);
      });
    });
  });
});
