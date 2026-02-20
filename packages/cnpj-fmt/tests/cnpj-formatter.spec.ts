import { beforeEach, describe, expect, it } from 'bun:test';

import { CnpjFormatter } from '../src/cnpj-formatter';
import { CnpjFormatterOptions } from '../src/cnpj-formatter-options';
import { CnpjFormatterInputLengthException, CnpjFormatterInputTypeError } from '../src/exceptions';
import type { CnpjFormatterOptionsInput } from '../src/types';

describe('CnpjFormatter', (): void => {
  describe('constructor', (): void => {
    describe('when called with no arguments', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CnpjFormatterOptions();

        const formatter = new CnpjFormatter();

        expect(formatter.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with arguments', (): void => {
      it('sets to default options with empty object', (): void => {
        const defaultOptions = new CnpjFormatterOptions();

        const formatter = new CnpjFormatter({});

        expect(formatter.options.all).toEqual(defaultOptions.all);
      });

      it('uses the provided options instance', (): void => {
        const options = new CnpjFormatterOptions();

        const formatter = new CnpjFormatter(options);

        expect(formatter.options).toBe(options);
      });

      it('overrides the default options with the provided ones (literal object)', (): void => {
        const options: CnpjFormatterOptionsInput = {
          hidden: true,
          slashKey: '|',
          dotKey: '_',
          encode: true,
        };

        const formatter = new CnpjFormatter(options);

        expect(formatter.options.all).toEqual(expect.objectContaining(options));
      });

      it('overrides the default options with the provided ones (CnpjFormatterOptions instance)', (): void => {
        const options = new CnpjFormatterOptions({
          hidden: true,
          slashKey: '|',
          dotKey: '_',
          encode: true,
        });

        const formatter = new CnpjFormatter(options);

        expect(formatter.options.all).toEqual(options.all);
      });
    });
  });

  describe('`format` method', (): void => {
    let format: InstanceType<typeof CnpjFormatter>['format'];

    beforeEach(() => {
      const formatter = new CnpjFormatter();

      format = formatter.format.bind(formatter);
    });

    describe('when input is a string with only digits', (): void => {
      it('handles the input with no formatting', (): void => {
        const result = format('12345678000910');

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles the input with standard formatting', (): void => {
        const result = format('12.345.678/0009-10');

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles the input with custom formatting', (): void => {
        const result = format('12 345 678 | 0009 _ 10');

        expect(result).toBe('12.345.678/0009-10');
      });
    });

    describe('when input is a string with only letters', (): void => {
      it('handles the input with no formatting', (): void => {
        const result = format('ABCDEFGHIJKLMN');

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles the input with standard formatting', (): void => {
        const result = format('AB.CDE.FGH/IJKL-MN');

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles the input with custom formatting', (): void => {
        const result = format('AB CDE FGH | IJKL _ MN');

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('converts lowercase letters to uppercase', (): void => {
        const result = format('AbCdEfGhIjKlMn');

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });
    });

    describe('when input is a string with mixed digits and letters characters', (): void => {
      it('handles the input with no formatting', (): void => {
        const result = format('12ABC34500DE00');

        expect(result).toBe('12.ABC.345/00DE-00');
      });

      it('handles the input with standard formatting', (): void => {
        const result = format('12.ABC.345/00DE-00');

        expect(result).toBe('12.ABC.345/00DE-00');
      });

      it('handles the input with custom formatting', (): void => {
        const result = format('12 ABC 345 | 00DE _ 00');

        expect(result).toBe('12.ABC.345/00DE-00');
      });

      it('converts lowercase letters to uppercase', (): void => {
        const result = format('12abcDEF00eF00');

        expect(result).toBe('12.ABC.DEF/00EF-00');
      });
    });

    describe('when input is an array', (): void => {
      it('handles array of only digits', (): void => {
        const result = format([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '0',
          '0',
          '0',
          '9',
          '1',
          '0',
        ]);

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles array of single item with only digits', (): void => {
        const result = format(['12345678000910']);

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles array of grouped digits', (): void => {
        const result = format(['12', '345', '678', '0009', '10']);

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles array of grouped digits and punctuation', (): void => {
        const result = format(['12', '.', '345', '.', '678', '/', '0009', '-', '10']);

        expect(result).toBe('12.345.678/0009-10');
      });

      it('handles array of only letters', (): void => {
        const result = format([
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
        ]);

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles array of single item with only letters', (): void => {
        const result = format(['ABCDEFGHIJKLMN']);

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles array of lowercase letters', (): void => {
        const result = format(['abcdefghijklmn']);

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles array of grouped letters', (): void => {
        const result = format(['AB', 'CDE', 'FGH', 'IJKL', 'MN']);

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles array of grouped letters and punctuation', (): void => {
        const result = format(['AB', '.', 'CDE', '.', 'FGH', '/', 'IJKL', '-', 'MN']);

        expect(result).toBe('AB.CDE.FGH/IJKL-MN');
      });

      it('handles array of mixed digits and letters', (): void => {
        const result = format([
          '1',
          '2',
          'a',
          'b',
          'c',
          'D',
          'E',
          'F',
          '0',
          '0',
          'g',
          'H',
          '3',
          '4',
        ]);

        expect(result).toBe('12.ABC.DEF/00GH-34');
      });

      it('handles array of single item with mixed digits and letters', (): void => {
        const result = format(['12abcDEF00gH34']);

        expect(result).toBe('12.ABC.DEF/00GH-34');
      });

      it('handles array of grouped digits and letters', (): void => {
        const result = format(['12', 'abc', 'DEF', '00gH', '34']);

        expect(result).toBe('12.ABC.DEF/00GH-34');
      });

      it('handles array of grouped digits, letters and punctuation', (): void => {
        const result = format(['12', '.', 'abc', '.', 'DEF', '/', '00gH', '-', '34']);

        expect(result).toBe('12.ABC.DEF/00GH-34');
      });
    });

    describe('when input is not string or array of strings', (): void => {
      it.each([
        { input: null, type: 'null' },
        { input: undefined, type: 'undefined' },
        { input: 42, type: 'integer number' },
        { input: 3.14, type: 'float number' },
        { input: false, type: 'boolean' },
        { input: true, type: 'boolean' },
        { input: {}, type: 'object' },
      ])(
        'throws CnpjFormatterInputTypeError on input of $input ($type)',
        ({ input, type }): void => {
          try {
            format(input as unknown as string);

            expect.unreachable();
          } catch (error: unknown) {
            const inputTypeError = error as CnpjFormatterInputTypeError;

            expect(error).toBeInstanceOf(CnpjFormatterInputTypeError);
            expect(inputTypeError.expectedType).toBe('string or string[]');
            expect(inputTypeError.actualInput).toBe(input);
            expect(inputTypeError.actualType).toBe(type);
          }
        },
      );
    });

    describe('when sanitized input length is not 14', (): void => {
      const makeErrorHandlingSpy = (evaluatedLength: number) => {
        return (value: unknown, error?: Error): string => {
          const inputLengthException = error as CnpjFormatterInputLengthException;

          expect(inputLengthException).toBeInstanceOf(CnpjFormatterInputLengthException);
          expect(inputLengthException.evaluatedInput.length).toBe(evaluatedLength);
          expect(inputLengthException.actualInput).toBe(value as string);

          return `ERROR: "${value}"`;
        };
      };

      it.each([
        { input: '1', length: 1 },
        { input: '12', length: 2 },
        { input: '12.A', length: 3 },
        { input: '12.AB', length: 4 },
        { input: '12.ABC', length: 5 },
        { input: '12.ABC.3', length: 6 },
        { input: '12.ABC.34', length: 7 },
        { input: '12.ABC.345', length: 8 },
        { input: '12.ABC.345/0', length: 9 },
        { input: '12.ABC.345/00', length: 10 },
        { input: '12.ABC.345/00D', length: 11 },
        { input: '12.ABC.345/00DE', length: 12 },
        { input: '12.ABC.345/00DE-6', length: 13 },
        { input: '12.ABC.345/00DE-678', length: 15 },
      ])(
        'fails with CnpjFormatterInputLengthException on input of $input ($length)',
        ({ input, length }): void => {
          format(input as unknown as string, {
            onFail: makeErrorHandlingSpy(length),
          });
        },
      );
    });

    describe('when using `hidden` option', (): void => {
      const { DEFAULT_HIDDEN_END, DEFAULT_HIDDEN_START } = CnpjFormatterOptions;
      const DEFAULT_HIDDEN_LENGTH = DEFAULT_HIDDEN_END - DEFAULT_HIDDEN_START + 1;
      const STANDARD_CNPJ_FORMAT_LENGTH = '00.000.000/0000-00'.length;

      it('replaces some characters with "*" when simply `true`', (): void => {
        const result = format('12ABC34500DE99', { hidden: true });
        const hiddenChars = Array.from(result).filter((char) => char === '*');

        expect(hiddenChars).toHaveLength(DEFAULT_HIDDEN_LENGTH);
        expect(result).toHaveLength(STANDARD_CNPJ_FORMAT_LENGTH);
      });

      it('replaces characters with "*" in a given range', (): void => {
        const result = format('12ABC34500DE99', {
          hidden: true,
          hiddenStart: 8,
          hiddenEnd: 11,
        });

        expect(result).toBe('12.ABC.345/****-99');
        expect(result).toHaveLength(STANDARD_CNPJ_FORMAT_LENGTH);
      });

      it('replaces characters with a custom key', (): void => {
        const result = format('12ABC34500DE99', {
          hidden: true,
          hiddenKey: '#',
        });
        const hiddenChars = Array.from(result).filter((char) => char === '#');

        expect(result).not.toContain('*');
        expect(hiddenChars).toHaveLength(DEFAULT_HIDDEN_LENGTH);
        expect(result).toHaveLength(STANDARD_CNPJ_FORMAT_LENGTH);
      });

      it('replaces characters with a custom zero-width key', (): void => {
        const result = format('12ABC34500DE99', {
          hidden: true,
          hiddenKey: '',
        });

        expect(result).not.toContain('*');
        expect(result).toHaveLength(STANDARD_CNPJ_FORMAT_LENGTH - DEFAULT_HIDDEN_LENGTH);
      });

      it('replaces characters with a custom multi-character key', (): void => {
        const result = format('12ABC34500DE99', {
          hidden: true,
          hiddenKey: '[]',
        });
        const hiddenChars = Array.from(result)
          .filter((char) => char === '[' || char === ']')
          .join('');

        expect(result).not.toContain('*');
        expect(hiddenChars).toMatch(new RegExp(`^(\\[\\]){${DEFAULT_HIDDEN_LENGTH}}$`));
        expect(result).toHaveLength(STANDARD_CNPJ_FORMAT_LENGTH + DEFAULT_HIDDEN_LENGTH);
      });
    });

    describe('when customizing punctuation', (): void => {
      it('replaces dots with a custom key', (): void => {
        const result = format('12ABC34500DE99', {
          dotKey: ' ',
        });

        expect(result).toBe('12 ABC 345/00DE-99');
      });

      it('replaces dots with a custom zero-width key', (): void => {
        const result = format('12ABC34500DE99', {
          dotKey: '',
        });

        expect(result).toBe('12ABC345/00DE-99');
      });

      it('replaces dots with a custom multi-character key', (): void => {
        const result = format('12ABC34500DE99', {
          dotKey: '[]',
        });

        expect(result).toBe('12[]ABC[]345/00DE-99');
      });

      it('replaces slash with a custom key', (): void => {
        const result = format('12ABC34500DE99', {
          slashKey: '|',
        });

        expect(result).toBe('12.ABC.345|00DE-99');
      });

      it('replaces slash with a custom zero-width key', (): void => {
        const result = format('12ABC34500DE99', {
          slashKey: '',
        });

        expect(result).toBe('12.ABC.34500DE-99');
      });

      it('replaces slash with a custom multi-character key', (): void => {
        const result = format('12ABC34500DE99', {
          slashKey: '[]',
        });

        expect(result).toBe('12.ABC.345[]00DE-99');
      });

      it('replaces dash with a custom key', (): void => {
        const result = format('12ABC34500DE99', {
          dashKey: '_',
        });

        expect(result).toBe('12.ABC.345/00DE_99');
      });

      it('replaces dash with a custom zero-width key', (): void => {
        const result = format('12ABC34500DE99', {
          dashKey: '',
        });

        expect(result).toBe('12.ABC.345/00DE99');
      });

      it('replaces dash with a custom multi-character key', (): void => {
        const result = format('12ABC34500DE99', {
          dashKey: '[]',
        });

        expect(result).toBe('12.ABC.345/00DE[]99');
      });
    });

    describe('when using `escape` option ', (): void => {
      it('escapes HTML special characters', (): void => {
        const result = format('12ABC34500DE99', {
          dotKey: '&',
          slashKey: '"',
          dashKey: '<>',
          escape: true,
        });

        expect(result).toBe('12&amp;ABC&amp;345&quot;00DE&lt;&gt;99');
      });
    });

    describe('when using `encode` option ', (): void => {
      it('URL-encodes the result', (): void => {
        const result = format('12ABC34500DE99', {
          encode: true,
        });

        expect(result).toBe('12.ABC.345%2F00DE-99');
      });
    });

    describe('edge cases', (): void => {
      it('replaces `hiddenKey`, `dotKey`, `slashKey` and `dashKey` use multi-characters value', (): void => {
        const result = format('12ABC34500DE99', {
          hidden: true,
          hiddenStart: 5,
          hiddenEnd: 9,
          hiddenKey: '[*]',
          dotKey: '[.]',
          slashKey: '[/]',
          dashKey: '[-]',
        });

        expect(result).toBe('12[.]ABC[.][*][*][*][/][*][*]DE[-]99');
      });
    });
  });
});
