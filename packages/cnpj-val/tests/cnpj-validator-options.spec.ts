import { describe, expect, it } from 'bun:test';

import { CnpjValidatorOptions } from '../src/cnpj-validator-options';
import type { CnpjType, CnpjValidatorOptionsType } from '../src/types';

describe('CnpjValidatorOptions', (): void => {
  const DEFAULT_PARAMETERS: CnpjValidatorOptionsType = {
    caseSensitive: CnpjValidatorOptions.DEFAULT_CASE_SENSITIVE,
    type: CnpjValidatorOptions.DEFAULT_TYPE,
  };

  describe('constructor', (): void => {
    describe('when called with no parameters', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjValidatorOptions();

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with undefined values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: undefined,
          type: undefined,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with null values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: null as unknown as boolean,
          type: null as unknown as CnpjType,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters', (): void => {
      it('sets all options to the provided values', (): void => {
        const parameters: CnpjValidatorOptionsType = {
          caseSensitive: true,
          type: 'numeric',
        };

        const options = new CnpjValidatorOptions(parameters);

        expect(options.all).toEqual(parameters);
      });
    });

    describe('when called with a CnpjValidatorOptions instance', (): void => {
      it('sets a new instance with the same values', (): void => {
        const originalOptions = new CnpjValidatorOptions({
          caseSensitive: true,
          type: 'numeric',
        });

        const options = new CnpjValidatorOptions(originalOptions);

        expect(options).not.toBe(originalOptions);
        expect(options.all).toEqual(originalOptions.all);
      });
    });

    describe('when called with overrides parameters', (): void => {
      it('uses last param option with 2 params', (): void => {
        const options = new CnpjValidatorOptions({ type: 'numeric' }, { type: 'alphanumeric' });

        expect(options.type).toBe('alphanumeric');
      });

      it('uses last param option with 5 params', (): void => {
        const options = new CnpjValidatorOptions(
          { type: 'numeric' },
          { type: 'alphanumeric' },
          { type: 'numeric' },
          { type: 'alphanumeric' },
          { type: 'numeric' },
        );

        expect(options.type).toBe('numeric');
      });
    });
  });

  describe('`caseSensitive` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `caseSensitive` to `true`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = true;

        expect(options.caseSensitive).toBe(true);
      });

      it('sets `caseSensitive` to `false`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: true });

        options.caseSensitive = false;

        expect(options.caseSensitive).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: !DEFAULT_PARAMETERS.caseSensitive,
        });

        options.caseSensitive = undefined;

        expect(options.caseSensitive).toBe(DEFAULT_PARAMETERS.caseSensitive);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjValidatorOptions({
          caseSensitive: !DEFAULT_PARAMETERS.caseSensitive,
        });

        options.caseSensitive = null as unknown as boolean;

        expect(options.caseSensitive).toBe(DEFAULT_PARAMETERS.caseSensitive);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = { not: 'a boolean' } as unknown as boolean;

        expect(options.caseSensitive).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = 'not a boolean' as unknown as boolean;

        expect(options.caseSensitive).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = 123 as unknown as boolean;

        expect(options.caseSensitive).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = '' as unknown as boolean;

        expect(options.caseSensitive).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CnpjValidatorOptions({ caseSensitive: false });

        options.caseSensitive = 0 as unknown as boolean;

        expect(options.caseSensitive).toBe(false);
      });
    });
  });

  describe('`type` property', (): void => {
    describe('when setting to a valid option value', (): void => {
      it.each(['alphanumeric', 'numeric'])('sets `type` to the value "%s"', (type): void => {
        const options = new CnpjValidatorOptions({ type });

        options.type = type;

        expect(options.type).toBe(type);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjValidatorOptions({ type: 'numeric' });

        options.type = undefined;

        expect(options.type).toBe(DEFAULT_PARAMETERS.type);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjValidatorOptions({ type: 'numeric' });

        options.type = null as unknown as CnpjType;

        expect(options.type).toBe(DEFAULT_PARAMETERS.type);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CnpjValidatorOptionsTypeError with an object', (): void => {
        const options = new CnpjValidatorOptions();

        expect(() => {
          options.type = { not: 'a string' } as unknown as CnpjType;
        }).toThrow('CNPJ validator option "type" must be of type string. Got object.');
      });

      it('throws CnpjValidatorOptionsTypeError with a number', (): void => {
        const options = new CnpjValidatorOptions();

        expect(() => {
          options.type = 123 as unknown as CnpjType;
        }).toThrow('CNPJ validator option "type" must be of type string. Got integer number.');
      });

      it('throws CnpjValidatorOptionsTypeError with a boolean', (): void => {
        const options = new CnpjValidatorOptions();

        expect(() => {
          options.type = true as unknown as CnpjType;
        }).toThrow('CNPJ validator option "type" must be of type string. Got boolean.');
      });
    });

    describe('when setting to an invalid option', (): void => {
      it('throws CnpjValidatorOptionTypeInvalidException with unexpected value', (): void => {
        const options = new CnpjValidatorOptions();

        expect(() => {
          options.type = 'something' as unknown as CnpjType;
        }).toThrow(
          `CNPJ validator option "type" accepts only the following values: "alphanumeric", "numeric". Got "something".`,
        );
      });
    });
  });

  describe('`all` getter', (): void => {
    it('returns the all properties', (): void => {
      const options = new CnpjValidatorOptions();

      expect(options.all).toEqual({
        caseSensitive: expect.any(Boolean),
        type: expect.any(String),
      } satisfies CnpjValidatorOptionsType);
    });
  });
});
