import { describe, expect, it } from 'bun:test';

import { CnpjFormatterOptions } from '../src/cnpj-formatter-options';
import { type CnpjFormatterOptionsType, type OnFailCallback } from '../src/types';

describe('CnpjFormatterOptions', (): void => {
  const DEFAULT_PARAMETERS: CnpjFormatterOptionsType = {
    hidden: false,
    hiddenKey: '*',
    hiddenStart: 5,
    hiddenEnd: 13,
    dotKey: '.',
    slashKey: '/',
    dashKey: '-',
    escape: false,
    encode: false,
    onFail: expect.any(Function),
  };

  describe('constructor', (): void => {
    describe('when called with no parameters', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjFormatterOptions();

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with undefined values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjFormatterOptions({
          hidden: undefined,
          hiddenKey: undefined,
          hiddenStart: undefined,
          hiddenEnd: undefined,
          dotKey: undefined,
          slashKey: undefined,
          dashKey: undefined,
          escape: undefined,
          onFail: undefined,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters with null values', (): void => {
      it('sets all options to default values', (): void => {
        const options = new CnpjFormatterOptions({
          hidden: null as unknown as boolean,
          hiddenKey: null as unknown as string,
          hiddenStart: null as unknown as number,
          hiddenEnd: null as unknown as number,
          dotKey: null as unknown as string,
          slashKey: null as unknown as string,
          dashKey: null as unknown as string,
          escape: null as unknown as boolean,
          onFail: null as unknown as OnFailCallback,
        });

        expect(options.all).toEqual(DEFAULT_PARAMETERS);
      });
    });

    describe('when called with all parameters', (): void => {
      it('sets all options to the provided values', (): void => {
        const parameters: CnpjFormatterOptionsType = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 1,
          hiddenEnd: 8,
          dotKey: '|',
          slashKey: '_',
          dashKey: '~',
          escape: true,
          encode: true,
          onFail: (value) => `ERROR: ${value}`,
        };

        const options = new CnpjFormatterOptions(parameters);

        expect(options.all).toEqual(parameters);
      });
    });

    describe('when called with some parameters', (): void => {
      it('sets only the provided non-nullish values', (): void => {
        const parameters: Partial<CnpjFormatterOptionsType> = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: undefined,
          hiddenEnd: null as unknown as number,
          escape: true,
          encode: false,
          onFail: undefined,
        };

        const options = new CnpjFormatterOptions(parameters);

        expect(options.all).toEqual({
          ...DEFAULT_PARAMETERS,
          hidden: true,
          hiddenKey: '#',
          escape: true,
          encode: false,
        });
      });
    });

    describe('when called with a CnpjFormatterOptions instance', (): void => {
      it('sets a new instance with the same values', (): void => {
        const originalOptions = new CnpjFormatterOptions({
          hidden: true,
          hiddenStart: 1,
          hiddenEnd: 8,
          slashKey: '|',
          escape: true,
          onFail: (value) => `ERROR: ${value}`,
        });

        const options = new CnpjFormatterOptions(originalOptions);

        expect(options).not.toBe(originalOptions);
        expect(options.all).toEqual(originalOptions.all);
      });
    });
  });

  describe('`hidden` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `hidden` to `true`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = true;

        expect(options.hidden).toBe(true);
      });

      it('sets `hidden` to `false`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: true });

        options.hidden = false;

        expect(options.hidden).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: !DEFAULT_PARAMETERS.hidden });

        options.hidden = undefined;

        expect(options.hidden).toBe(DEFAULT_PARAMETERS.hidden);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: !DEFAULT_PARAMETERS.hidden });

        options.hidden = null as unknown as boolean;

        expect(options.hidden).toBe(DEFAULT_PARAMETERS.hidden);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = { not: 'a boolean' } as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = 'not a boolean' as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = 123 as unknown as boolean;

        expect(options.hidden).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = '' as unknown as boolean;

        expect(options.hidden).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ hidden: false });

        options.hidden = 0 as unknown as boolean;

        expect(options.hidden).toBe(false);
      });
    });
  });

  describe('`hiddenKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `hiddenKey` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ hiddenKey: '*' });

        options.hiddenKey = 'X';

        expect(options.hiddenKey).toBe('X');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenKey: '#' });

        options.hiddenKey = undefined;

        expect(options.hiddenKey).toBe(DEFAULT_PARAMETERS.hiddenKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenKey: '#' });

        options.hiddenKey = null as unknown as string;

        expect(options.hiddenKey).toBe(DEFAULT_PARAMETERS.hiddenKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenKey = { not: 'a string' } as unknown as string;
        }).toThrow('CNPJ formatting option "hiddenKey" must be of type string. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenKey = 123 as unknown as string;
        }).toThrow(
          'CNPJ formatting option "hiddenKey" must be of type string. Got integer number.',
        );
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenKey = true as unknown as string;
        }).toThrow('CNPJ formatting option "hiddenKey" must be of type string. Got boolean.');
      });
    });
  });

  describe('`hiddenStart` property', (): void => {
    describe('when setting to a number value', (): void => {
      it('sets `hiddenStart` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = 1;

        expect(options.hiddenStart).toBe(1);
      });
    });

    describe('when setting to an invalid number value range', (): void => {
      it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = -1;
        }).toThrow(
          'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got -1.',
        );
      });

      it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a number greater than 13', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = 14;
        }).toThrow(
          'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 14.',
        );
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = undefined;

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenStart: 0 });

        options.hiddenStart = null as unknown as number;

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
      });
    });

    describe('when setting to a non-integer value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = { not: 'a number' } as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a string', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = 'not a number' as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got string.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = true as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got boolean.');
      });

      it('throws CnpjFormatterOptionsTypeError with a float number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenStart = 1.5 as unknown as number;
        }).toThrow(
          'CNPJ formatting option "hiddenStart" must be of type integer. Got float number.',
        );
      });
    });
  });

  describe('`hiddenEnd` property', (): void => {
    describe('when setting to a number value', (): void => {
      it('sets `hiddenEnd` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ hiddenEnd: 13 });

        options.hiddenEnd = 12;

        expect(options.hiddenEnd).toBe(12);
      });
    });

    describe('when setting to an invalid number value range', (): void => {
      it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = -1;
        }).toThrow(
          'CNPJ formatting option "hiddenEnd" must be an integer between 0 and 13. Got -1.',
        );
      });

      it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a number greater than 13', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = 14;
        }).toThrow(
          'CNPJ formatting option "hiddenEnd" must be an integer between 0 and 13. Got 14.',
        );
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenEnd: 0 });

        options.hiddenEnd = undefined;

        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ hiddenEnd: 0 });

        options.hiddenEnd = null as unknown as number;

        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });
    });

    describe('when setting to a non-integer value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = { not: 'a number' } as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a string', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = 'not a number' as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got string.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = true as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got boolean.');
      });

      it('throws CnpjFormatterOptionsTypeError with a float number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.hiddenEnd = 1.5 as unknown as number;
        }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got float number.');
      });
    });
  });

  describe('`dotKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `dotKey` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ dotKey: '.' });

        options.dotKey = '_';

        expect(options.dotKey).toBe('_');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ dotKey: '_' });

        options.dotKey = undefined;

        expect(options.dotKey).toBe(DEFAULT_PARAMETERS.dotKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ dotKey: '.' });

        options.dotKey = null as unknown as string;

        expect(options.dotKey).toBe(DEFAULT_PARAMETERS.dotKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dotKey = { not: 'a string' } as unknown as string;
        }).toThrow('CNPJ formatting option "dotKey" must be of type string. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dotKey = 123 as unknown as string;
        }).toThrow('CNPJ formatting option "dotKey" must be of type string. Got integer number.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dotKey = true as unknown as string;
        }).toThrow('CNPJ formatting option "dotKey" must be of type string. Got boolean.');
      });
    });
  });

  describe('`slashKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `slashKey` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ slashKey: '.' });

        options.slashKey = '_';

        expect(options.slashKey).toBe('_');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ slashKey: '_' });

        options.slashKey = undefined;

        expect(options.slashKey).toBe(DEFAULT_PARAMETERS.slashKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ slashKey: '.' });

        options.slashKey = null as unknown as string;

        expect(options.slashKey).toBe(DEFAULT_PARAMETERS.slashKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.slashKey = { not: 'a string' } as unknown as string;
        }).toThrow('CNPJ formatting option "slashKey" must be of type string. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.slashKey = 123 as unknown as string;
        }).toThrow('CNPJ formatting option "slashKey" must be of type string. Got integer number.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.slashKey = true as unknown as string;
        }).toThrow('CNPJ formatting option "slashKey" must be of type string. Got boolean.');
      });
    });
  });

  describe('`dashKey` property', (): void => {
    describe('when setting to a string value', (): void => {
      it('sets `dashKey` to the provided value', (): void => {
        const options = new CnpjFormatterOptions({ dashKey: '.' });

        options.dashKey = '_';

        expect(options.dashKey).toBe('_');
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ dashKey: '_' });

        options.dashKey = undefined;

        expect(options.dashKey).toBe(DEFAULT_PARAMETERS.dashKey);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ dashKey: '.' });

        options.dashKey = null as unknown as string;

        expect(options.dashKey).toBe(DEFAULT_PARAMETERS.dashKey);
      });
    });

    describe('when setting to a non-string value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dashKey = { not: 'a string' } as unknown as string;
        }).toThrow('CNPJ formatting option "dashKey" must be of type string. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dashKey = 123 as unknown as string;
        }).toThrow('CNPJ formatting option "dashKey" must be of type string. Got integer number.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.dashKey = true as unknown as string;
        }).toThrow('CNPJ formatting option "dashKey" must be of type string. Got boolean.');
      });
    });
  });

  describe('`escape` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `escape` to `true`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = true;

        expect(options.escape).toBe(true);
      });

      it('sets `escape` to `false`', (): void => {
        const options = new CnpjFormatterOptions({ escape: true });

        options.escape = false;

        expect(options.escape).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ escape: !DEFAULT_PARAMETERS.escape });

        options.escape = undefined;

        expect(options.escape).toBe(DEFAULT_PARAMETERS.escape);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ escape: !DEFAULT_PARAMETERS.escape });

        options.escape = null as unknown as boolean;

        expect(options.escape).toBe(DEFAULT_PARAMETERS.escape);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = { not: 'a boolean' } as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = 'not a boolean' as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = 123 as unknown as boolean;

        expect(options.escape).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = '' as unknown as boolean;

        expect(options.escape).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ escape: false });

        options.escape = 0 as unknown as boolean;

        expect(options.escape).toBe(false);
      });
    });
  });

  describe('`encode` property', (): void => {
    describe('when setting to a boolean value', (): void => {
      it('sets `encode` to `true`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = true;

        expect(options.encode).toBe(true);
      });

      it('sets `encode` to `false`', (): void => {
        const options = new CnpjFormatterOptions({ encode: true });

        options.encode = false;

        expect(options.encode).toBe(false);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default value for `undefined`', (): void => {
        const options = new CnpjFormatterOptions({ encode: !DEFAULT_PARAMETERS.encode });

        options.encode = undefined;

        expect(options.encode).toBe(DEFAULT_PARAMETERS.encode);
      });

      it('sets default value for `null`', (): void => {
        const options = new CnpjFormatterOptions({ encode: !DEFAULT_PARAMETERS.encode });

        options.encode = null as unknown as boolean;

        expect(options.encode).toBe(DEFAULT_PARAMETERS.encode);
      });
    });

    describe('when setting to a non-boolean value', (): void => {
      it('coerces object value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = { not: 'a boolean' } as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces truthy string value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = 'not a boolean' as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces truthy number value to `true`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = 123 as unknown as boolean;

        expect(options.encode).toBe(true);
      });

      it('coerces empty string value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = '' as unknown as boolean;

        expect(options.encode).toBe(false);
      });

      it('coerces zero number value to `false`', (): void => {
        const options = new CnpjFormatterOptions({ encode: false });

        options.encode = 0 as unknown as boolean;

        expect(options.encode).toBe(false);
      });
    });
  });

  describe('`onFail` property', (): void => {
    describe('when setting to a callable value', (): void => {
      it('sets `onFail` to the provided callback', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CnpjFormatterOptions();

        options.onFail = callback;

        expect(options.onFail).toBe(callback);
      });
    });

    describe('when setting to a nullish value', (): void => {
      it('sets default callback for `undefined`', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CnpjFormatterOptions({ onFail: callback });

        options.onFail = undefined;

        expect(typeof options.onFail).toBe('function');
        expect(options.onFail.name).toBe('DEFAULT_ON_FAIL');
      });

      it('sets default callback for `null`', (): void => {
        const callback: OnFailCallback = (value) => `ERROR: ${value}`;
        const options = new CnpjFormatterOptions({ onFail: callback });

        options.onFail = null as unknown as OnFailCallback;

        expect(typeof options.onFail).toBe('function');
        expect(options.onFail.name).toBe('DEFAULT_ON_FAIL');
      });
    });

    describe('when setting to a non-callable value', (): void => {
      it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.onFail = { not: 'a function' } as unknown as OnFailCallback;
        }).toThrow('CNPJ formatting option "onFail" must be of type function. Got object.');
      });

      it('throws CnpjFormatterOptionsTypeError with a string', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.onFail = 'not a function' as unknown as OnFailCallback;
        }).toThrow('CNPJ formatting option "onFail" must be of type function. Got string.');
      });

      it('throws CnpjFormatterOptionsTypeError with a number', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.onFail = 123 as unknown as OnFailCallback;
        }).toThrow('CNPJ formatting option "onFail" must be of type function. Got integer number.');
      });

      it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
        const options = new CnpjFormatterOptions();

        expect(() => {
          options.onFail = true as unknown as OnFailCallback;
        }).toThrow('CNPJ formatting option "onFail" must be of type function. Got boolean.');
      });
    });
  });

  describe('`all` getter', (): void => {
    it('returns the all properties', (): void => {
      const options = new CnpjFormatterOptions();

      expect(options.all).toEqual({
        hidden: expect.any(Boolean),
        hiddenKey: expect.any(String),
        hiddenStart: expect.any(Number),
        hiddenEnd: expect.any(Number),
        dotKey: expect.any(String),
        slashKey: expect.any(String),
        dashKey: expect.any(String),
        escape: expect.any(Boolean),
        encode: expect.any(Boolean),
        onFail: expect.any(Function),
      } satisfies CnpjFormatterOptionsType);
    });
  });

  describe('`setHiddenRange` method', (): void => {
    describe('when called with valid values', (): void => {
      it('sets `hiddenStart` and `hiddenEnd` to the provided values', (): void => {
        const options = new CnpjFormatterOptions();

        options.setHiddenRange(0, 10);

        expect(options.hiddenStart).toBe(0);
        expect(options.hiddenEnd).toBe(10);
      });

      describe('and `hiddenStart` is equal to `hiddenEnd`', (): void => {
        it('sets `hiddenStart` and `hiddenEnd` with 0 accordingly', (): void => {
          const options = new CnpjFormatterOptions();

          options.setHiddenRange(0, 0);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(0);
        });

        it('sets `hiddenStart` and `hiddenEnd` with 13 accordingly', (): void => {
          const options = new CnpjFormatterOptions();

          options.setHiddenRange(13, 13);

          expect(options.hiddenStart).toBe(13);
          expect(options.hiddenEnd).toBe(13);
        });
      });

      describe('and `hiddenStart` is greater than `hiddenEnd`', (): void => {
        it('automatically swaps start and end values', (): void => {
          const options = new CnpjFormatterOptions();

          options.setHiddenRange(8, 2);

          expect(options.hiddenStart).toBe(2);
          expect(options.hiddenEnd).toBe(8);
        });
      });
    });

    describe('when called with nullish values', (): void => {
      it('sets default values for `undefined` in both fields', (): void => {
        const options = new CnpjFormatterOptions();

        options.setHiddenRange(undefined, undefined);

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      it('sets default values for `null` in both fields', (): void => {
        const options = new CnpjFormatterOptions();

        options.setHiddenRange(null as unknown as number, null as unknown as number);

        expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
        expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
      });

      describe('when setting `hiddenStart` to a nullish value', (): void => {
        it('sets default value for `undefined`', (): void => {
          const options = new CnpjFormatterOptions({ hiddenStart: 0 });

          options.setHiddenRange(undefined, 13);

          expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
          expect(options.hiddenEnd).toBe(13);
        });

        it('sets default value for `null`', (): void => {
          const options = new CnpjFormatterOptions({ hiddenStart: 0 });

          options.setHiddenRange(null as unknown as number, 13);

          expect(options.hiddenStart).toBe(DEFAULT_PARAMETERS.hiddenStart);
          expect(options.hiddenEnd).toBe(13);
        });
      });

      describe('when setting `hiddenEnd` to a nullish value', (): void => {
        it('sets default value for `undefined`', (): void => {
          const options = new CnpjFormatterOptions({ hiddenEnd: 13 });

          options.setHiddenRange(0, undefined);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
        });

        it('sets default value for `null`', (): void => {
          const options = new CnpjFormatterOptions({ hiddenEnd: 13 });

          options.setHiddenRange(0, null as unknown as number);

          expect(options.hiddenStart).toBe(0);
          expect(options.hiddenEnd).toBe(DEFAULT_PARAMETERS.hiddenEnd);
        });
      });
    });

    describe('when called with invalid values', (): void => {
      describe('when setting `hiddenStart` to an invalid number value range', (): void => {
        it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(-1, 13);
          }).toThrow(
            'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got -1.',
          );
        });

        it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a number greater than 13', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(14, 13);
          }).toThrow(
            'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 14.',
          );
        });
      });

      describe('when setting `hiddenEnd` to an invalid number value range', (): void => {
        it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a negative number', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, -1);
          }).toThrow(
            'CNPJ formatting option "hiddenEnd" must be an integer between 0 and 13. Got -1.',
          );
        });

        it('throws CnpjFormatterOptionsHiddenRangeInvalidException with a number greater than 13', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 14);
          }).toThrow(
            'CNPJ formatting option "hiddenEnd" must be an integer between 0 and 13. Got 14.',
          );
        });
      });

      describe('when setting `hiddenStart` to a non-integer value', (): void => {
        it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange({ not: 'a number' } as unknown as number, 13);
          }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got object.');
        });

        it('throws CnpjFormatterOptionsTypeError with a string', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange('not a number' as unknown as number, 13);
          }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got string.');
        });

        it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(true as unknown as number, 13);
          }).toThrow('CNPJ formatting option "hiddenStart" must be of type integer. Got boolean.');
        });

        it('throws CnpjFormatterOptionsTypeError with a float number', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(1.5 as unknown as number, 13);
          }).toThrow(
            'CNPJ formatting option "hiddenStart" must be of type integer. Got float number.',
          );
        });
      });

      describe('when setting `hiddenEnd` to a non-integer value', (): void => {
        it('throws CnpjFormatterOptionsTypeError with an object', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, { not: 'a number' } as unknown as number);
          }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got object.');
        });

        it('throws CnpjFormatterOptionsTypeError with a string', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 'not a number' as unknown as number);
          }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got string.');
        });

        it('throws CnpjFormatterOptionsTypeError with a boolean', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, true as unknown as number);
          }).toThrow('CNPJ formatting option "hiddenEnd" must be of type integer. Got boolean.');
        });

        it('throws CnpjFormatterOptionsTypeError with a float number', (): void => {
          const options = new CnpjFormatterOptions();

          expect(() => {
            options.setHiddenRange(0, 1.5 as unknown as number);
          }).toThrow(
            'CNPJ formatting option "hiddenEnd" must be of type integer. Got float number.',
          );
        });
      });
    });
  });
});
