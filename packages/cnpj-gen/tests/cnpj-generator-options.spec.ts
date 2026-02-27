import { describe, expect, it } from 'bun:test';

import { CnpjGeneratorOptions } from '../src/cnpj-generator-options';
import type { CnpjGeneratorOptionsType, CnpjType } from '../src/types';

describe('CnpjGeneratorOptions', () => {
  const DEFAULT_PARAMETERS: CnpjGeneratorOptionsType = {
    format: CnpjGeneratorOptions.DEFAULT_FORMAT,
    prefix: CnpjGeneratorOptions.DEFAULT_PREFIX,
    type: CnpjGeneratorOptions.DEFAULT_TYPE,
  };

  describe('constructor', () => {
    describe('when called with no parameters', () => {
      it('sets all options to default values', () => {
        const options = new CnpjGeneratorOptions();

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with undefined values', () => {
      it('sets all options to default values', () => {
        const options = new CnpjGeneratorOptions({
          format: undefined,
          prefix: undefined,
          type: undefined,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with null values', () => {
      it('sets all options to default values', () => {
        const options = new CnpjGeneratorOptions({
          format: null as unknown as boolean,
          prefix: null as unknown as string,
          type: null as unknown as CnpjType,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters', () => {
      it('sets all options to the provided values', () => {
        const parameters: CnpjGeneratorOptionsType = {
          format: true,
          prefix: '12345',
          type: 'numeric',
        };

        const options = new CnpjGeneratorOptions(parameters);

        expect(options.all).toEqual(parameters);
      });
    });

    describe('when called with some parameters', () => {
      it('sets only the provided non-nullish values', () => {
        const parameters: Partial<CnpjGeneratorOptionsType> = {
          prefix: undefined,
          type: 'numeric',
        };

        const options = new CnpjGeneratorOptions(parameters);

        expect(options.all).toEqual({
          ...DEFAULT_PARAMETERS,
          type: 'numeric',
        });
      });
    });

    describe('when called with a CnpjGeneratorOptions instance', () => {
      it('sets a new instance with the same values', () => {
        const originalOptions = new CnpjGeneratorOptions({
          format: true,
          prefix: '12345',
          type: 'numeric',
        });

        const options = new CnpjGeneratorOptions(originalOptions);

        expect(options).not.toBe(originalOptions);
        expect(options.all).toEqual(originalOptions.all);
      });
    });

    describe('when called with overrides parameters', () => {
      it('uses last param option with 2 params', () => {
        const options = new CnpjGeneratorOptions({ prefix: '12345' }, { prefix: '11222333' });

        expect(options.prefix).toBe('11222333');
      });

      it('uses last param option with 5 params', () => {
        const options = new CnpjGeneratorOptions(
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
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = true;

        expect(options.format).toBe(true);
      });

      it('sets `format` to `false`', () => {
        const options = new CnpjGeneratorOptions({ format: true });

        options.format = false;

        expect(options.format).toBe(false);
      });
    });

    describe('when setting to a nullish value', () => {
      it('sets default value for `undefined`', () => {
        const options = new CnpjGeneratorOptions({ format: !DEFAULT_PARAMETERS.format });

        options.format = undefined;

        expect(options.format).toBe(DEFAULT_PARAMETERS.format);
      });

      it('sets default value for `null`', () => {
        const options = new CnpjGeneratorOptions({ format: !DEFAULT_PARAMETERS.format });

        options.format = null as unknown as boolean;

        expect(options.format).toBe(DEFAULT_PARAMETERS.format);
      });
    });

    describe('when setting to a non-boolean value', () => {
      it('coerces object value to `true`', () => {
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = { not: 'a boolean' } as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces truthy string value to `true`', () => {
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = 'not a boolean' as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces truthy number value to `true`', () => {
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = 123 as unknown as boolean;

        expect(options.format).toBe(true);
      });

      it('coerces empty string value to `false`', () => {
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = '' as unknown as boolean;

        expect(options.format).toBe(false);
      });

      it('coerces zero number value to `false`', () => {
        const options = new CnpjGeneratorOptions({ format: false });

        options.format = 0 as unknown as boolean;

        expect(options.format).toBe(false);
      });
    });
  });

  describe('`prefix` property', () => {
    describe('when setting to a valid string value', () => {
      it('sets `prefix` to the provided value', () => {
        const options = new CnpjGeneratorOptions({ prefix: '12345' });

        options.prefix = '11222333';

        expect(options.prefix).toBe('11222333');
      });

      it('strips non-alphanumeric characters from the provided value', () => {
        const options = new CnpjGeneratorOptions();

        options.prefix = '12.ABC.def/0001';

        expect(options.prefix).toBe('12ABCDEF0001');
      });

      it('ignores extra characters from the provided value', () => {
        const options = new CnpjGeneratorOptions();

        options.prefix = '12ABC345678910';

        expect(options.prefix).toBe('12ABC3456789');
      });
    });

    describe('when setting to a nullish value', () => {
      it('sets default value for `undefined`', () => {
        const options = new CnpjGeneratorOptions({ prefix: '12345' });

        options.prefix = undefined;

        expect(options.prefix).toBe(DEFAULT_PARAMETERS.prefix);
      });

      it('sets default value for `null`', () => {
        const options = new CnpjGeneratorOptions({ prefix: '12345' });

        options.prefix = null as unknown as string;

        expect(options.prefix).toBe(DEFAULT_PARAMETERS.prefix);
      });
    });

    describe('when setting to a non-string value', () => {
      it('throws CnpjGeneratorOptionsTypeError with an object', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = { not: 'a string' } as unknown as string;
        }).toThrow('CNPJ generator option "prefix" must be of type string. Got object.');
      });

      it('throws CnpjGeneratorOptionsTypeError with a number', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = 123 as unknown as string;
        }).toThrow('CNPJ generator option "prefix" must be of type string. Got integer number.');
      });

      it('throws CnpjGeneratorOptionsTypeError with a boolean', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = true as unknown as string;
        }).toThrow('CNPJ generator option "prefix" must be of type string. Got boolean.');
      });
    });

    describe('when setting to an invalid string', () => {
      it('throws CnpjGeneratorOptionPrefixInvalidException with base ID all zeros', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = '00000000';
        }).toThrow(
          'CNPJ generator option "prefix" with value "00000000" is invalid. Zeroed base ID is not eligible.',
        );
      });

      it('throws CnpjGeneratorOptionPrefixInvalidException with branch ID all zeros', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = '123456780000';
        }).toThrow(
          'CNPJ generator option "prefix" with value "123456780000" is invalid. Zeroed branch ID is not eligible.',
        );
      });

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
      ])('throws CnpjGeneratorOptionPrefixInvalidException with "%s"', (prefix) => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = prefix;
        }).toThrow(
          `CNPJ generator option "prefix" with value "${prefix}" is invalid. Repeated digits are not considered valid.`,
        );
      });

      it.each([
        'AAAAAAAAAAAA',
        'BBBBBBBBBBBB',
        'CCCCCCCCCCCC',
        'DDDDDDDDDDDD',
        'EEEEEEEEEEEE',
        'FFFFFFFFFFFF',
        'GGGGGGGGGGGG',
        'HHHHHHHHHHHH',
        'IIIIIIIIIIII',
        'JJJJJJJJJJJJ',
        'KKKKKKKKKKKK',
        'LLLLLLLLLLLL',
        'MMMMMMMMMMMM',
        'NNNNNNNNNNNN',
        'OOOOOOOOOOOO',
        'PPPPPPPPPPPP',
        'QQQQQQQQQQQQ',
        'RRRRRRRRRRRR',
        'SSSSSSSSSSSS',
        'TTTTTTTTTTTT',
        'UUUUUUUUUUUU',
        'VVVVVVVVVVVV',
        'WWWWWWWWWWWW',
        'XXXXXXXXXXXX',
        'YYYYYYYYYYYY',
        'ZZZZZZZZZZZZ',
      ])('does not throw exception with "%s"', (prefix) => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.prefix = prefix;
        }).not.toThrow();
        expect(options.prefix).toBe(prefix);
      });
    });
  });

  describe('`type` property', () => {
    describe('when setting to a valid option value', () => {
      it.each(['alphabetic', 'alphanumeric', 'numeric'])(
        'sets `type` to the value "%s"',
        (type) => {
          const options = new CnpjGeneratorOptions({ type });

          options.type = type;

          expect(options.type).toBe(type);
        },
      );
    });

    describe('when setting to a nullish value', () => {
      it('sets default value for `undefined`', () => {
        const options = new CnpjGeneratorOptions({ type: 'numeric' });

        options.type = undefined;

        expect(options.type).toBe(DEFAULT_PARAMETERS.type);
      });

      it('sets default value for `null`', () => {
        const options = new CnpjGeneratorOptions({ type: 'numeric' });

        options.type = null as unknown as CnpjType;

        expect(options.type).toBe(DEFAULT_PARAMETERS.type);
      });
    });

    describe('when setting to a non-string value', () => {
      it('throws CnpjGeneratorOptionsTypeError with an object', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.type = { not: 'a string' } as unknown as CnpjType;
        }).toThrow('CNPJ generator option "type" must be of type string. Got object.');
      });

      it('throws CnpjGeneratorOptionsTypeError with a number', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.type = 123 as unknown as CnpjType;
        }).toThrow('CNPJ generator option "type" must be of type string. Got integer number.');
      });

      it('throws CnpjGeneratorOptionsTypeError with a boolean', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.type = true as unknown as CnpjType;
        }).toThrow('CNPJ generator option "type" must be of type string. Got boolean.');
      });
    });

    describe('when setting to an invalid option', () => {
      it('throws CnpjGeneratorOptionTypeInvalidException with unexpected value', () => {
        const options = new CnpjGeneratorOptions();

        expect(() => {
          options.type = 'something' as unknown as CnpjType;
        }).toThrow(
          `CNPJ generator option "type" accepts only the following values: "alphabetic", "alphanumeric", "numeric". Got "something".`,
        );
      });
    });
  });

  describe('`all` getter', () => {
    it('returns the all properties', () => {
      const options = new CnpjGeneratorOptions();

      expect(options.all).toEqual({
        format: expect.any(Boolean),
        prefix: expect.any(String),
        type: expect.any(String),
      } satisfies CnpjGeneratorOptionsType);
    });
  });
});
