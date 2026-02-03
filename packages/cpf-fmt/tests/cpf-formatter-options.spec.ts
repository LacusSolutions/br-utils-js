import { describe, expect, it } from 'bun:test';

import { CpfFormatterOptions } from '../src/cpf-formatter-options';
import type { CpfFormatterOptionsType, OnFailCallback } from '../src/types';

describe('CpfFormatterOptions', (): void => {
  const DEFAULT_PARAMETERS: CpfFormatterOptionsType = {
    hidden: CpfFormatterOptions.DEFAULT_HIDDEN,
    hiddenKey: CpfFormatterOptions.DEFAULT_HIDDEN_KEY,
    hiddenStart: CpfFormatterOptions.DEFAULT_HIDDEN_START,
    hiddenEnd: CpfFormatterOptions.DEFAULT_HIDDEN_END,
    dotKey: CpfFormatterOptions.DEFAULT_DOT_KEY,
    dashKey: CpfFormatterOptions.DEFAULT_DASH_KEY,
    escape: CpfFormatterOptions.DEFAULT_ESCAPE,
    encode: CpfFormatterOptions.DEFAULT_ENCODE,
    onFail: CpfFormatterOptions.DEFAULT_ON_FAIL,
  };

  describe('constructor', (): void => {
    describe('when called with no parameters', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CpfFormatterOptions();

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with undefined values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CpfFormatterOptions({
          hidden: undefined,
          hiddenKey: undefined,
          hiddenStart: undefined,
          hiddenEnd: undefined,
          dotKey: undefined,
          dashKey: undefined,
          escape: undefined,
          onFail: undefined,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with null values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CpfFormatterOptions({
          hidden: null as unknown as boolean,
          hiddenKey: null as unknown as string,
          hiddenStart: null as unknown as number,
          hiddenEnd: null as unknown as number,
          dotKey: null as unknown as string,
          dashKey: null as unknown as string,
          escape: null as unknown as boolean,
          onFail: null as unknown as OnFailCallback,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters', (): void => {
      it('sets all options to the provided values', (): void => {
        const parameters: CpfFormatterOptionsType = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 1,
          hiddenEnd: 8,
          dotKey: '|',
          dashKey: '~',
          escape: true,
          encode: true,
          onFail: (value) => `ERROR: ${value}`,
        };

        const options = new CpfFormatterOptions(parameters);

        expect(options.all).toEqual(parameters);
      });
    });

    describe('when called with some parameters', (): void => {
      it('sets only the provided non-nullish values', (): void => {
        const parameters: Partial<CpfFormatterOptionsType> = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: undefined,
          hiddenEnd: null as unknown as number,
          escape: true,
          encode: false,
          onFail: undefined,
        };

        const options = new CpfFormatterOptions(parameters);

        expect(options.all).toEqual({
          ...DEFAULT_PARAMETERS,
          hidden: true,
          hiddenKey: '#',
          escape: true,
          encode: false,
        });
      });
    });

    describe('when called with a CpfFormatterOptions instance', (): void => {
      it('sets a new instance with the same values', (): void => {
        const originalOptions = new CpfFormatterOptions({
          hidden: true,
          hiddenStart: 1,
          hiddenEnd: 8,
          escape: true,
          onFail: (value): string => `ERROR: ${value}`,
        });

        const options = new CpfFormatterOptions(originalOptions);

        expect(options).not.toBe(originalOptions);
        expect(options.all).toEqual(originalOptions.all);
      });
    });

    describe('when called with overrides parameters', (): void => {
      it('uses last param option with 2 params', (): void => {
        const options = new CpfFormatterOptions({ hiddenKey: '#' }, { hiddenKey: 'X' });

        expect(options.hiddenKey).toBe('X');
      });

      it('uses last param option with 5 params', (): void => {
        const options = new CpfFormatterOptions(
          { hiddenKey: '.' },
          { hiddenKey: '_' },
          { hiddenKey: '#' },
          { hiddenKey: 'X' },
          { hiddenKey: '@' },
        );

        expect(options.hiddenKey).toBe('@');
      });
    });
  });

  describe('`hidden` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `hidden` to `true`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = true;

        expect(options.hidden).toBe(true);
      });

      it('sets `hidden` to `false`', (): void => {
        const options = new CpfFormatterOptions({ hidden: true });

        options.hidden = false;

        expect(options.hidden).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ hidden: !DEFAULT_PARAMETERS.hidden });

        options.hidden = undefined;

        expect(options.hidden).toBe(DEFAULT_PARAMETERS.hidden);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ hidden: !DEFAULT_PARAMETERS.hidden });

        options.hidden = null as unknown as boolean;

        expect(options.hidden).toBe(DEFAULT_PARAMETERS.hidden);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = { not: 'a boolean' } as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = 'not a boolean' as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = 123 as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = '' as unknown as boolean;

        expect(options.hidden).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CpfFormatterOptions({ hidden: false });

        options.hidden = 0 as unknown as boolean;

        expect(options.hidden).toBe(false);
      });
    });
  });

  describe('`hiddenKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `hiddenKey` to the provided value', (): void => {
        const options = new CpfFormatterOptions({ hiddenKey: '*' });

        options.hiddenKey = 'X';

        expect(options.hiddenKey).toBe('X');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ hiddenKey: '#' });

        options.hiddenKey = undefined;

        expect(options.hiddenKey).toBe(DEFAULT_PARAMETERS.hiddenKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ hiddenKey: '#' });

        options.hiddenKey = null as unknown as string;

        expect(options.hiddenKey).toBe(DEFAULT_PARAMETERS.hiddenKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenKey = { not: 'a string' } as unknown as string;
        }).toThrow('CPF formatting option "hiddenKey" must be of type string. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenKey = 123 as unknown as string;
        }).toThrow('CPF formatting option "hiddenKey" must be of type string. Got integer number.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenKey = true as unknown as string;
        }).toThrow('CPF formatting option "hiddenKey" must be of type string. Got boolean.');
      });
    });

    describe('when setting to a string containing a forbidden key character', (): void => {
      it.each([...CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS])(
        'throws CpfFormatterOptionsForbiddenKeyCharacterException with %s',
        (forbiddenChar): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.hiddenKey = forbiddenChar;
          }).toThrow(
            `Value "${forbiddenChar}" for CPF formatting option "hiddenKey" contains disallowed characters ("${CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS.join('", "')}").`,
          );
        },
      );
    });
  });

  describe('`hiddenStart` property', (): void => {
    describe('when setting to a number value', (): void => {
      it('sets `hiddenStart` to the provided value', (): void => {
        const options = new CpfFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = 1;

        expect(options.hiddenStart).toBe(1);
      });
    });

    describe('when setting to an invalid number value range', (): void => {
      it('throws CpfFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = -1;
        }).toThrow(
          'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got -1.',
        );
      });

      it('throws CpfFormatterOptionsHiddenRangeInvalidException with a number greater than 10', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = 11;
        }).toThrow(
          'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got 11.',
        );
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = undefined;

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = null as unknown as number;

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
      });
    });

    describe('when setting to a non-integer value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = { not: 'a number' } as unknown as number;
        }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a string', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = 'not a number' as unknown as number;
        }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got string.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = true as unknown as number;
        }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got boolean.');
      });

      it('throws CpfFormatterOptionsTypeError with a float number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenStart = 1.5 as unknown as number;
        }).toThrow(
          'CPF formatting option "hiddenStart" must be of type integer. Got float number.',
        );
      });
    });
  });

  describe('`hiddenEnd` property', (): void => {
    describe('when setting to a number value', (): void => {
      it('sets `hiddenEnd` to the provided value', (): void => {
        const options = new CpfFormatterOptions({ hiddenEnd: 10 });

        options.hiddenEnd = 9;

        expect(options.hiddenEnd).toBe(9);
      });
    });

    describe('when setting to an invalid number value range', (): void => {
      it('throws CpfFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = -1;
        }).toThrow(
          'CPF formatting option "hiddenEnd" must be an integer between 0 and 10. Got -1.',
        );
      });

      it('throws CpfFormatterOptionsHiddenRangeInvalidException with a number greater than 10', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = 11;
        }).toThrow(
          'CPF formatting option "hiddenEnd" must be an integer between 0 and 10. Got 11.',
        );
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ hiddenEnd: 0 });

        options.hiddenEnd = undefined;

        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ hiddenEnd: 0 });

        options.hiddenEnd = null as unknown as number;

        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });
    });

    describe('when setting to a non-integer value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = { not: 'a number' } as unknown as number;
        }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a string', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = 'not a number' as unknown as number;
        }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got string.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = true as unknown as number;
        }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got boolean.');
      });

      it('throws CpfFormatterOptionsTypeError with a float number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.hiddenEnd = 1.5 as unknown as number;
        }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got float number.');
      });
    });
  });

  describe('`dotKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `dotKey` to the provided value', (): void => {
        const options = new CpfFormatterOptions({ dotKey: '.' });

        options.dotKey = '_';

        expect(options.dotKey).toBe('_');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ dotKey: '_' });

        options.dotKey = undefined;

        expect(options.dotKey).toBe(DEFAULT_PARAMETERS.dotKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ dotKey: '.' });

        options.dotKey = null as unknown as string;

        expect(options.dotKey).toBe(DEFAULT_PARAMETERS.dotKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dotKey = { not: 'a string' } as unknown as string;
        }).toThrow('CPF formatting option "dotKey" must be of type string. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dotKey = 123 as unknown as string;
        }).toThrow('CPF formatting option "dotKey" must be of type string. Got integer number.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dotKey = true as unknown as string;
        }).toThrow('CPF formatting option "dotKey" must be of type string. Got boolean.');
      });
    });

    describe('when setting to a string containing a forbidden key character', (): void => {
      it.each([...CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS])(
        'throws CpfFormatterOptionsForbiddenKeyCharacterException with %s',
        (forbiddenChar): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.dotKey = forbiddenChar;
          }).toThrow(
            `Value "${forbiddenChar}" for CPF formatting option "dotKey" contains disallowed characters ("${CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS.join('", "')}").`,
          );
        },
      );
    });
  });

  describe('`dashKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `dashKey` to the provided value', (): void => {
        const options = new CpfFormatterOptions({ dashKey: '.' });

        options.dashKey = '_';

        expect(options.dashKey).toBe('_');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ dashKey: '_' });

        options.dashKey = undefined;

        expect(options.dashKey).toBe(DEFAULT_PARAMETERS.dashKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ dashKey: '.' });

        options.dashKey = null as unknown as string;

        expect(options.dashKey).toBe(DEFAULT_PARAMETERS.dashKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dashKey = { not: 'a string' } as unknown as string;
        }).toThrow('CPF formatting option "dashKey" must be of type string. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dashKey = 123 as unknown as string;
        }).toThrow('CPF formatting option "dashKey" must be of type string. Got integer number.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.dashKey = true as unknown as string;
        }).toThrow('CPF formatting option "dashKey" must be of type string. Got boolean.');
      });
    });

    describe('when setting to a string containing a forbidden key character', (): void => {
      it.each([...CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS])(
        'throws CpfFormatterOptionsForbiddenKeyCharacterException with %s',
        (forbiddenChar): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.dashKey = forbiddenChar;
          }).toThrow(
            `Value "${forbiddenChar}" for CPF formatting option "dashKey" contains disallowed characters ("${CpfFormatterOptions.DISALLOWED_KEY_CHARACTERS.join('", "')}").`,
          );
        },
      );
    });
  });

  describe('`escape` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `escape` to `true`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = true;

        expect(options.escape).toBe(true);
      });

      it('sets `escape` to `false`', (): void => {
        const options = new CpfFormatterOptions({ escape: true });

        options.escape = false;

        expect(options.escape).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ escape: !DEFAULT_PARAMETERS.escape });

        options.escape = undefined;

        expect(options.escape).toBe(DEFAULT_PARAMETERS.escape);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ escape: !DEFAULT_PARAMETERS.escape });

        options.escape = null as unknown as boolean;

        expect(options.escape).toBe(DEFAULT_PARAMETERS.escape);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = { not: 'a boolean' } as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = 'not a boolean' as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = 123 as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = '' as unknown as boolean;

        expect(options.escape).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CpfFormatterOptions({ escape: false });

        options.escape = 0 as unknown as boolean;

        expect(options.escape).toBe(false);
      });
    });
  });

  describe('`encode` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `encode` to `true`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = true;

        expect(options.encode).toBe(true);
      });

      it('sets `encode` to `false`', (): void => {
        const options = new CpfFormatterOptions({ encode: true });

        options.encode = false;

        expect(options.encode).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CpfFormatterOptions({ encode: !DEFAULT_PARAMETERS.encode });

        options.encode = undefined;

        expect(options.encode).toBe(DEFAULT_PARAMETERS.encode);
      });

      it('sets default value for `null`', (): void => {
        const options = new CpfFormatterOptions({ encode: !DEFAULT_PARAMETERS.encode });

        options.encode = null as unknown as boolean;

        expect(options.encode).toBe(DEFAULT_PARAMETERS.encode);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = { not: 'a boolean' } as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = 'not a boolean' as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = 123 as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = '' as unknown as boolean;

        expect(options.encode).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CpfFormatterOptions({ encode: false });

        options.encode = 0 as unknown as boolean;

        expect(options.encode).toBe(false);
      });
    });
  });

  describe('`onFail` property', (): void => {
    describe('when using the default callback value', (): void => {
      it('returns empty string', (): void => {
        const result = CpfFormatterOptions.DEFAULT_ON_FAIL('some value');

        expect(result).toBe('');
      });
    });

    describe('when setting to a callable value', (): void => {
      it('sets `onFail` to the provided callback', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CpfFormatterOptions();

        options.onFail = callback;

        expect(options.onFail).toBe(callback);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default callback for `undefined`', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CpfFormatterOptions({ onFail: callback });

        options.onFail = undefined;

        expect(options.onFail).toBe(DEFAULT_PARAMETERS.onFail);
        expect(options.onFail.name).toBe('DEFAULT_ON_FAIL');
      });

      it('sets default callback for `null`', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CpfFormatterOptions({ onFail: callback });

        options.onFail = null as unknown as OnFailCallback;

        expect(options.onFail).toBe(DEFAULT_PARAMETERS.onFail);
        expect(options.onFail.name).toBe('DEFAULT_ON_FAIL');
      });
    });

    describe('when setting to a non-callable value', (): void => {
      it('throws CpfFormatterOptionsTypeError with an object', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.onFail = { not: 'a function' } as unknown as OnFailCallback;
        }).toThrow('CPF formatting option "onFail" must be of type function. Got object.');
      });

      it('throws CpfFormatterOptionsTypeError with a string', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.onFail = 'not a function' as unknown as OnFailCallback;
        }).toThrow('CPF formatting option "onFail" must be of type function. Got string.');
      });

      it('throws CpfFormatterOptionsTypeError with a number', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.onFail = 123 as unknown as OnFailCallback;
        }).toThrow('CPF formatting option "onFail" must be of type function. Got integer number.');
      });

      it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CpfFormatterOptions();

        expect(() => {
          options.onFail = true as unknown as OnFailCallback;
        }).toThrow('CPF formatting option "onFail" must be of type function. Got boolean.');
      });
    });
  });

  describe('`all` getter', (): void => {
    it('returns the all properties', (): void => {
      const options = new CpfFormatterOptions();

      expect(options.all).toEqual({
        hidden: expect.any(Boolean),
        hiddenKey: expect.any(String),
        hiddenStart: expect.any(Number),
        hiddenEnd: expect.any(Number),
        dotKey: expect.any(String),
        dashKey: expect.any(String),
        escape: expect.any(Boolean),
        encode: expect.any(Boolean),
        onFail: expect.any(Function),
      } satisfies CpfFormatterOptionsType);
    });
  });

  describe('`setHiddenRange` method', (): void => {
    describe('when called with valid values', (): void => {
      it('sets `hiddenStart` and `hiddenEnd` to the provided values', (): void => {
        const options = new CpfFormatterOptions();

        options.setHiddenRange(0, 10);

        expect(options.hiddenStart).toBe(0);
        expect(options.hiddenEnd).toBe(10);
      });

      describe('and `hiddenStart` is equal to `hiddenEnd`', (): void => {
        it('sets `hiddenStart` and `hiddenEnd` with 0 accordingly', (): void => {
          const options = new CpfFormatterOptions();

          options.setHiddenRange(0, 0);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(0);
        });

        it('sets `hiddenStart` and `hiddenEnd` with 10 accordingly', (): void => {
          const options = new CpfFormatterOptions();

          options.setHiddenRange(10, 10);

          expect(options.hiddenStart).toBe(10);
          expect(options.hiddenEnd).toBe(10);
        });
      });

      describe('and `hiddenStart` is greater than `hiddenEnd`', (): void => {
        it('automatically swaps start and end values', (): void => {
          const options = new CpfFormatterOptions();

          options.setHiddenRange(8, 2);

          expect(options.hiddenStart).toBe(2);
          expect(options.hiddenEnd).toBe(8);
        });
      });
    });

    describe('when called with nullish values', (): void => {
      it('sets default values for `undefined` in both fields', (): void => {
        const options = new CpfFormatterOptions();

        options.setHiddenRange(undefined, undefined);

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      it('sets default values for `null` in both fields', (): void => {
        const options = new CpfFormatterOptions();

        options.setHiddenRange(null as unknown as number, null as unknown as number);

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      describe('when setting `hiddenStart` to a nullish value', (): void => {
        it('sets default value for `undefined`', (): void => {
          const options = new CpfFormatterOptions({ hiddenStart: 0 });

          options.setHiddenRange(undefined, 10);

          expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
          expect(options.hiddenEnd).toBe(10);
        });

        it('sets default value for `null`', (): void => {
          const options = new CpfFormatterOptions({ hiddenStart: 0 });

          options.setHiddenRange(null as unknown as number, 10);

          expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
          expect(options.hiddenEnd).toBe(10);
        });
      });

      describe('when setting `hiddenEnd` to a nullish value', (): void => {
        it('sets default value for `undefined`', (): void => {
          const options = new CpfFormatterOptions({ hiddenEnd: 10 });

          options.setHiddenRange(0, undefined);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
        });

        it('sets default value for `null`', (): void => {
          const options = new CpfFormatterOptions({ hiddenEnd: 10 });

          options.setHiddenRange(0, null as unknown as number);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
        });
      });
    });

    describe('when called with invalid values', (): void => {
      describe('when setting `hiddenStart` to an invalid number value range', (): void => {
        it('throws CpfFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(-1, 10);
          }).toThrow(
            'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got -1.',
          );
        });

        it('throws CpfFormatterOptionsHiddenRangeInvalidException with a number greater than 10', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(11, 10);
          }).toThrow(
            'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got 11.',
          );
        });
      });

      describe('when setting `hiddenEnd` to an invalid number value range', (): void => {
        it('throws CpfFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, -1);
          }).toThrow(
            'CPF formatting option "hiddenEnd" must be an integer between 0 and 10. Got -1.',
          );
        });

        it('throws CpfFormatterOptionsHiddenRangeInvalidException with a number greater than 10', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 11);
          }).toThrow(
            'CPF formatting option "hiddenEnd" must be an integer between 0 and 10. Got 11.',
          );
        });
      });

      describe('when setting `hiddenStart` to a non-integer value', (): void => {
        it('throws CpfFormatterOptionsTypeError with an object', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange({ not: 'a number' } as unknown as number, 10);
          }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got object.');
        });

        it('throws CpfFormatterOptionsTypeError with a string', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange('not a number' as unknown as number, 10);
          }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got string.');
        });

        it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(true as unknown as number, 10);
          }).toThrow('CPF formatting option "hiddenStart" must be of type integer. Got boolean.');
        });

        it('throws CpfFormatterOptionsTypeError with a float number', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(1.5 as unknown as number, 10);
          }).toThrow(
            'CPF formatting option "hiddenStart" must be of type integer. Got float number.',
          );
        });
      });

      describe('when setting `hiddenEnd` to a non-integer value', (): void => {
        it('throws CpfFormatterOptionsTypeError with an object', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, { not: 'a number' } as unknown as number);
          }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got object.');
        });

        it('throws CpfFormatterOptionsTypeError with a string', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 'not a number' as unknown as number);
          }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got string.');
        });

        it('throws CpfFormatterOptionsTypeError with a boolean', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, true as unknown as number);
          }).toThrow('CPF formatting option "hiddenEnd" must be of type integer. Got boolean.');
        });

        it('throws CpfFormatterOptionsTypeError with a float number', (): void => {
          const options = new CpfFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 1.5 as unknown as number);
          }).toThrow(
            'CPF formatting option "hiddenEnd" must be of type integer. Got float number.',
          );
        });
      });
    });
  });
});
