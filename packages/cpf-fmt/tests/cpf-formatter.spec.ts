import { beforeEach, describe, expect, it } from 'bun:test';

import { CpfFormatter } from '../src/cpf-formatter';
import { CpfFormatterOptions } from '../src/cpf-formatter-options';
import { CpfFormatterInputLengthException, CpfFormatterInputTypeError } from '../src/exceptions';
import type { CpfFormatterOptionsInput } from '../src/types';

describe('CpfFormatter', (): void => {
  describe('constructor', (): void => {
    describe('when called with no arguments', (): void => {
      it('creates an instance with default options', (): void => {
        const defaultOptions = new CpfFormatterOptions();

        const formatter = new CpfFormatter();

        expect(formatter.options.all).toEqual(defaultOptions.all);
      });
    });

    describe('when called with arguments', (): void => {
      it('sets to default options with empty object', (): void => {
        const defaultOptions = new CpfFormatterOptions();

        const formatter = new CpfFormatter({});

        expect(formatter.options.all).toEqual(defaultOptions.all);
      });

      it('uses the provided options instance', (): void => {
        const options = new CpfFormatterOptions();

        const formatter = new CpfFormatter(options);

        expect(formatter.options).toBe(options);
      });

      it('overrides the default options with the provided ones (literal object)', (): void => {
        const options: CpfFormatterOptionsInput = {
          hidden: true,
          dotKey: '_',
          encode: true,
        };

        const formatter = new CpfFormatter(options);

        expect(formatter.options.all).toEqual(expect.objectContaining(options));
      });

      it('overrides the default options with the provided ones (CpfFormatterOptions instance)', (): void => {
        const options = new CpfFormatterOptions({
          hidden: true,
          dotKey: '_',
          encode: true,
        });

        const formatter = new CpfFormatter(options);

        expect(formatter.options.all).toEqual(options.all);
      });
    });
  });

  describe('`format` method', (): void => {
    let format: InstanceType<typeof CpfFormatter>['format'];

    beforeEach(() => {
      const formatter = new CpfFormatter();

      format = formatter.format.bind(formatter);
    });

    describe('when input is a string', (): void => {
      it('handles the input with no formatting', (): void => {
        const result = format('12345678910');

        expect(result).toBe('123.456.789-10');
      });

      it('handles the input with standard formatting', (): void => {
        const result = format('123.456.789-10');

        expect(result).toBe('123.456.789-10');
      });

      it('handles the input with custom formatting', (): void => {
        const result = format('123 456 789 _ 10');

        expect(result).toBe('123.456.789-10');
      });
    });

    describe('when input is an array', (): void => {
      it('handles array of only digits', (): void => {
        const result = format(['1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '0']);

        expect(result).toBe('123.456.789-10');
      });

      it('handles array of single item', (): void => {
        const result = format(['12345678910']);

        expect(result).toBe('123.456.789-10');
      });

      it('handles array of grouped digits', (): void => {
        const result = format(['123', '456', '789', '10']);

        expect(result).toBe('123.456.789-10');
      });

      it('handles array of grouped digits and punctuation', (): void => {
        const result = format(['123', '.', '456', '.', '789', '-', '10']);

        expect(result).toBe('123.456.789-10');
      });
    });

    describe('when input is not string or array of strings', (): void => {
      const makeErrorHandlingSpy = (type: string) => {
        return (value: unknown, error?: Error): string => {
          const inputTypeError = error as CpfFormatterInputTypeError;

          expect(inputTypeError).toBeInstanceOf(CpfFormatterInputTypeError);
          expect(inputTypeError.expectedType).toBe('string or string[]');
          expect(inputTypeError.actualInput).toBe(value);
          expect(inputTypeError.actualType).toBe(type);

          return `ERROR: "${value}"`;
        };
      };

      it.each([
        { input: null, type: 'null' },
        { input: undefined, type: 'undefined' },
        { input: 42, type: 'integer number' },
        { input: 3.14, type: 'float number' },
        { input: false, type: 'boolean' },
        { input: true, type: 'boolean' },
        { input: {}, type: 'object' },
      ])(
        'fails with CpfFormatterInputTypeError on input of $input ($type)',
        ({ input, type }): void => {
          format(input as unknown as string, {
            onFail: makeErrorHandlingSpy(type),
          });
        },
      );
    });

    describe('when sanitized input length is not 11', (): void => {
      const makeErrorHandlingSpy = (evaluatedLength: number) => {
        return (value: unknown, error?: Error): string => {
          const inputLengthException = error as CpfFormatterInputLengthException;

          expect(inputLengthException).toBeInstanceOf(CpfFormatterInputLengthException);
          expect(inputLengthException.evaluatedInput.length).toBe(evaluatedLength);
          expect(inputLengthException.actualInput).toBe(value as string);

          return `ERROR: "${value}"`;
        };
      };

      it.each([
        { input: '1', length: 1 },
        { input: '12', length: 2 },
        { input: '123', length: 3 },
        { input: '1234', length: 4 },
        { input: '12345', length: 5 },
        { input: '123456', length: 6 },
        { input: '1234567', length: 7 },
        { input: '12345678', length: 8 },
        { input: '123456789', length: 9 },
        { input: '1234567890', length: 10 },
        { input: '123456789012', length: 12 },
        { input: '1234567890123', length: 13 },
      ])(
        'fails with CpfFormatterInputLengthException on input of $input ($length)',
        ({ input, length }): void => {
          format(input as unknown as string, {
            onFail: makeErrorHandlingSpy(length),
          });
        },
      );
    });

    describe('when using `hidden` option', (): void => {
      const { DEFAULT_HIDDEN_END, DEFAULT_HIDDEN_START } = CpfFormatterOptions;
      const DEFAULT_HIDDEN_LENGTH = DEFAULT_HIDDEN_END - DEFAULT_HIDDEN_START + 1;
      const STANDARD_CPF_FORMAT_LENGTH = '000.000.000-00'.length;

      it('replaces some digits with "*" when simply `true`', (): void => {
        const result = format('12345678910', { hidden: true });
        const hiddenChars = Array.from(result).filter((char) => char === '*');

        expect(hiddenChars).toHaveLength(DEFAULT_HIDDEN_LENGTH);
        expect(result).toHaveLength(STANDARD_CPF_FORMAT_LENGTH);
      });

      it('replaces digits with "*" in a given range', (): void => {
        const result = format('12345678910', {
          hidden: true,
          hiddenStart: 3,
          hiddenEnd: 7,
        });

        expect(result).toBe('123.***.**9-10');
        expect(result).toHaveLength(STANDARD_CPF_FORMAT_LENGTH);
      });

      it('replaces digits with a custom key', (): void => {
        const result = format('12345678910', {
          hidden: true,
          hiddenKey: '#',
        });
        const hiddenChars = Array.from(result).filter((char) => char === '#');

        expect(result).not.toContain('*');
        expect(hiddenChars).toHaveLength(DEFAULT_HIDDEN_LENGTH);
        expect(result).toHaveLength(STANDARD_CPF_FORMAT_LENGTH);
      });

      it('replaces digits with a custom zero-width key', (): void => {
        const result = format('12345678910', {
          hidden: true,
          hiddenKey: '',
        });

        expect(result).not.toContain('*');
        expect(result).toHaveLength(STANDARD_CPF_FORMAT_LENGTH - DEFAULT_HIDDEN_LENGTH);
      });

      it('replaces digits with a custom multi-character key', (): void => {
        const result = format('12345678910', {
          hidden: true,
          hiddenKey: '[]',
        });
        const hiddenChars = Array.from(result)
          .filter((char) => char === '[' || char === ']')
          .join('');

        expect(result).not.toContain('*');
        expect(hiddenChars).toMatch(new RegExp(`^(\\[\\]){${DEFAULT_HIDDEN_LENGTH}}$`));
        expect(result).toHaveLength(STANDARD_CPF_FORMAT_LENGTH + DEFAULT_HIDDEN_LENGTH);
      });
    });

    describe('when customizing punctuation', (): void => {
      it('replaces dots with a custom key', (): void => {
        const result = format('12345678910', {
          dotKey: ' ',
        });

        expect(result).toBe('123 456 789-10');
      });

      it('replaces dots with a custom zero-width key', (): void => {
        const result = format('12345678910', {
          dotKey: '',
        });

        expect(result).toBe('123456789-10');
      });

      it('replaces dots with a custom multi-character key', (): void => {
        const result = format('12345678910', {
          dotKey: '[]',
        });

        expect(result).toBe('123[]456[]789-10');
      });

      it('replaces dash with a custom key', (): void => {
        const result = format('12345678910', {
          dashKey: '_',
        });

        expect(result).toBe('123.456.789_10');
      });

      it('replaces dash with a custom zero-width key', (): void => {
        const result = format('12345678910', {
          dashKey: '',
        });

        expect(result).toBe('123.456.78910');
      });

      it('replaces dash with a custom multi-character key', (): void => {
        const result = format('12345678910', {
          dashKey: ' dv ',
        });

        expect(result).toBe('123.456.789 dv 10');
      });
    });

    describe('when using `escape` option ', (): void => {
      it('escapes HTML special characters', (): void => {
        const result = format('12345678910', {
          dotKey: '&',
          dashKey: '<>',
          escape: true,
        });

        expect(result).toBe('123&amp;456&amp;789&lt;&gt;10');
      });
    });

    describe('when using `encode` option ', (): void => {
      it('URL-encodes the result', (): void => {
        const result = format('12345678910', {
          dashKey: '/',
          encode: true,
        });

        expect(result).toBe('123.456.789%2F10');
      });
    });

    describe('edge cases', (): void => {
      it('replaces `hiddenKey`, `dotKey` and `dashKey` use multi-characters value', (): void => {
        const result = format('12345678910', {
          hidden: true,
          hiddenStart: 3,
          hiddenEnd: 7,
          hiddenKey: '[*]',
          dotKey: '[.]',
          dashKey: '[-]',
        });

        expect(result).toBe('123[.][*][*][*][.][*][*]9[-]10');
      });
    });
  });
});
