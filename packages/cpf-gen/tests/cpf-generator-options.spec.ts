import { describe, expect, it } from 'bun:test';

import { CpfGeneratorOptions } from '../src/cpf-generator-options';
import type { CpfGeneratorOptionsType } from '../src/types';

describe('CpfGeneratorOptions', () => {
  const DEFAULT_PARAMETERS: CpfGeneratorOptionsType = {
    format: CpfGeneratorOptions.DEFAULT_FORMAT,
    prefix: CpfGeneratorOptions.DEFAULT_PREFIX,
  };

  describe('constructor', () => {
    describe('when called with no parameters', () => {
      it('sets all options to default values', () => {
        const options = new CpfGeneratorOptions();

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with undefined values', () => {
      it('sets all options to default values', () => {
        const options = new CpfGeneratorOptions({
          format: undefined,
          prefix: undefined,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with null values', () => {
      it('sets all options to default values', () => {
        const options = new CpfGeneratorOptions({
          format: null as unknown as boolean,
          prefix: null as unknown as string,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters', () => {
      it('sets all options to the provided values', () => {
        const parameters: CpfGeneratorOptionsType = {
          format: true,
          prefix: '12345',
        };

        const options = new CpfGeneratorOptions(parameters);

        expect(options.all).toEqual(parameters);
      });
    });

    describe('when called with a CpfGeneratorOptions instance', () => {
      it('sets a new instance with the same values', () => {
        const originalOptions = new CpfGeneratorOptions({
          format: true,
          prefix: '12345',
        });

        const options = new CpfGeneratorOptions(originalOptions);

        expect(options).not.toBe(originalOptions);
        expect(options.all).toEqual(originalOptions.all);
      });
    });

    describe('when called with overrides parameters', () => {
      it('uses last param option with 2 params', () => {
        const options = new CpfGeneratorOptions({ prefix: '12345' }, { prefix: '11222333' });

        expect(options.prefix).toBe('11222333');
      });

      it('uses last param option with 5 params', () => {
        const options = new CpfGeneratorOptions(
          { prefix: '123456780009' },
          { prefix: '11' },
          { prefix: '22333' },
          { prefix: '44555666' },
          { prefix: '77888999' },
        );

        expect(options.prefix).toBe('77888999');
      });
    });
  });

  describe('`format` property', () => {
    describe('when setting to a boolean value', () => {
      it('sets `format` to `true`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = true;

        expect(options.format).toBe(true);
      });

      it('sets `format` to `false`', () => {
        const options = new CpfGeneratorOptions({ format: true });

        options.format = false;

        expect(options.format).toBe(false);
      });
    });

    describe('when setting to a nullish value', () => {
      it('sets default value for `undefined`', () => {
        const options = new CpfGeneratorOptions({ format: !DEFAULT_PARAMETERS.format });

        options.format = undefined;

        expect(options.format).toBe(DEFAULT_PARAMETERS.format);
      });

      it('sets default value for `null`', () => {
        const options = new CpfGeneratorOptions({ format: !DEFAULT_PARAMETERS.format });

        options.format = null as unknown as boolean;

        expect(options.format).toBe(DEFAULT_PARAMETERS.format);
      });
    });

    describe('when setting to a non-boolean value', () => {
      it('coerces object value to `true`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = { not: 'a boolean' } as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces truthy string value to `true`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = 'not a boolean' as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces truthy number value to `true`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = 123 as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces empty string value to `false`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = '' as unknown as boolean;

        expect(options.format).toBe(false);
      });

      it('coerces zero number value to `false`', () => {
        const options = new CpfGeneratorOptions({ format: false });

        options.format = 0 as unknown as boolean;

        expect(options.format).toBe(false);
      });
    });
  });

  describe('`prefix` property', () => {
    describe('when setting to a valid string value', () => {
      it('sets `prefix` to the provided value', () => {
        const options = new CpfGeneratorOptions({ prefix: '12345' });

        options.prefix = '11222333';

        expect(options.prefix).toBe('11222333');
      });

      it('strips non-numeric characters from the provided value', () => {
        const options = new CpfGeneratorOptions();

        options.prefix = '123.ABC.def';

        expect(options.prefix).toBe('123');
      });

      it('ignores extra characters from the provided value', () => {
        const options = new CpfGeneratorOptions();

        options.prefix = '12345678910';

        expect(options.prefix).toBe('123456789');
      });
    });

    describe('when setting to a nullish value', () => {
      it('sets default value for `undefined`', () => {
        const options = new CpfGeneratorOptions({ prefix: '12345' });

        options.prefix = undefined;

        expect(options.prefix).toBe(DEFAULT_PARAMETERS.prefix);
      });

      it('sets default value for `null`', () => {
        const options = new CpfGeneratorOptions({ prefix: '12345' });

        options.prefix = null as unknown as string;

        expect(options.prefix).toBe(DEFAULT_PARAMETERS.prefix);
      });
    });

    describe('when setting to a non-string value', () => {
      it('throws CpfGeneratorOptionsTypeError with an object', () => {
        const options = new CpfGeneratorOptions();

        expect(() => {
          options.prefix = { not: 'a string' } as unknown as string;
        }).toThrow('CPF generator option "prefix" must be of type string. Got object.');
      });

      it('throws CpfGeneratorOptionsTypeError with a number', () => {
        const options = new CpfGeneratorOptions();

        expect(() => {
          options.prefix = 123 as unknown as string;
        }).toThrow('CPF generator option "prefix" must be of type string. Got integer number.');
      });

      it('throws CpfGeneratorOptionsTypeError with a boolean', () => {
        const options = new CpfGeneratorOptions();

        expect(() => {
          options.prefix = true as unknown as string;
        }).toThrow('CPF generator option "prefix" must be of type string. Got boolean.');
      });
    });

    describe('when setting to an invalid string', () => {
      it('throws CpfGeneratorOptionPrefixInvalidException with base ID all zeros', () => {
        const options = new CpfGeneratorOptions();

        expect(() => {
          options.prefix = '000000000';
        }).toThrow(
          'CPF generator option "prefix" with value "000000000" is invalid. Zeroed base ID is not eligible.',
        );
      });

      it.each([
        '111111111',
        '222222222',
        '333333333',
        '444444444',
        '555555555',
        '666666666',
        '777777777',
        '888888888',
        '999999999',
      ])('throws CpfGeneratorOptionPrefixInvalidException with "%s"', (prefix) => {
        const options = new CpfGeneratorOptions();

        expect(() => {
          options.prefix = prefix;
        }).toThrow(
          `CPF generator option "prefix" with value "${prefix}" is invalid. Repeated digits are not considered valid.`,
        );
      });
    });
  });

  describe('`all` getter', () => {
    it('returns the all properties', () => {
      const options = new CpfGeneratorOptions();

      expect(options.all).toEqual({
        format: expect.any(Boolean),
        prefix: expect.any(String),
      } satisfies CpfGeneratorOptionsType);
    });
  });
});
