import Bun, { $ } from 'bun';
import { beforeAll, describe, expect, it } from 'bun:test';

describe('package distributions', (): void => {
  beforeAll(
    async (): Promise<void> => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} build --silent`;
    },
    { timeout: 20000 },
  );

  describe('UMD', (): void => {
    describe.each(['cnpj-utils.js', 'cnpj-utils.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjUtils: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjUtils;`);

          cnpjUtils = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = Object.fromEntries(
            Object.entries({ ...cnpjUtils }).filter(([key]) => key.match(/^Cnpj/i)),
          );

          expect(api).toEqual({
            CnpjUtils: expect.anything(),
            cnpjFmt: expect.anything(),
            CnpjFormatter: expect.anything(),
            CnpjFormatterOptions: expect.anything(),
            CnpjFormatterTypeError: expect.anything(),
            CnpjFormatterInputTypeError: expect.anything(),
            CnpjFormatterOptionsTypeError: expect.anything(),
            CnpjFormatterException: expect.anything(),
            CnpjFormatterInputLengthException: expect.anything(),
            CnpjFormatterOptionsForbiddenKeyCharacterException: expect.anything(),
            CnpjFormatterOptionsHiddenRangeInvalidException: expect.anything(),
            cnpjGen: expect.anything(),
            CnpjGenerator: expect.anything(),
            CnpjGeneratorOptions: expect.anything(),
            CnpjGeneratorTypeError: expect.anything(),
            CnpjGeneratorOptionsTypeError: expect.anything(),
            CnpjGeneratorException: expect.anything(),
            CnpjGeneratorOptionPrefixInvalidException: expect.anything(),
            CnpjGeneratorOptionTypeInvalidException: expect.anything(),
            cnpjVal: expect.anything(),
            CnpjValidator: expect.anything(),
            CnpjValidatorOptions: expect.anything(),
            CnpjValidatorTypeError: expect.anything(),
            CnpjValidatorInputTypeError: expect.anything(),
            CnpjValidatorOptionsTypeError: expect.anything(),
            CnpjValidatorException: expect.anything(),
            CnpjValidatorOptionTypeInvalidException: expect.anything(),
          });
        });

        it('exposes a global `cnpjUtils` function', async () => {
          expect(cnpjUtils).toBeDefined();
          expect(cnpjUtils).toBeObject();
          expect(cnpjUtils.constructor?.name).toBe('CnpjUtils');

          expect(cnpjUtils.format).toBeFunction();
          expect(cnpjUtils.generate).toBeFunction();
          expect(cnpjUtils.isValid).toBeFunction();
        });

        it('exposes other resources through the global `cnpjUtils` variable', async () => {
          expect(cnpjUtils.cnpjFmt?.name).toBe('cnpjFmt');
          expect(cnpjUtils.CnpjFormatter?.name).toBe('CnpjFormatter');
          expect(cnpjUtils.CnpjFormatterOptions?.name).toBe('CnpjFormatterOptions');
          expect(cnpjUtils.CnpjFormatterTypeError?.name).toBe('CnpjFormatterTypeError');
          expect(cnpjUtils.CnpjFormatterInputTypeError?.name).toBe('CnpjFormatterInputTypeError');
          expect(cnpjUtils.CnpjFormatterOptionsTypeError?.name).toBe(
            'CnpjFormatterOptionsTypeError',
          );
          expect(cnpjUtils.CnpjFormatterException?.name).toBe('CnpjFormatterException');
          expect(cnpjUtils.CnpjFormatterInputLengthException?.name).toBe(
            'CnpjFormatterInputLengthException',
          );
          expect(cnpjUtils.CnpjFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CnpjFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cnpjUtils.CnpjFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CnpjFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cnpjUtils.cnpjGen?.name).toBe('cnpjGen');
          expect(cnpjUtils.CnpjGenerator?.name).toBe('CnpjGenerator');
          expect(cnpjUtils.CnpjGeneratorOptions?.name).toBe('CnpjGeneratorOptions');
          expect(cnpjUtils.CnpjGeneratorTypeError?.name).toBe('CnpjGeneratorTypeError');
          expect(cnpjUtils.CnpjGeneratorOptionsTypeError?.name).toBe(
            'CnpjGeneratorOptionsTypeError',
          );
          expect(cnpjUtils.CnpjGeneratorException?.name).toBe('CnpjGeneratorException');
          expect(cnpjUtils.CnpjGeneratorOptionPrefixInvalidException?.name).toBe(
            'CnpjGeneratorOptionPrefixInvalidException',
          );
          expect(cnpjUtils.CnpjGeneratorOptionTypeInvalidException?.name).toBe(
            'CnpjGeneratorOptionTypeInvalidException',
          );
          expect(cnpjUtils.cnpjVal?.name).toBe('cnpjVal');
          expect(cnpjUtils.CnpjValidator?.name).toBe('CnpjValidator');
          expect(cnpjUtils.CnpjValidatorOptions?.name).toBe('CnpjValidatorOptions');
          expect(cnpjUtils.CnpjValidatorTypeError?.name).toBe('CnpjValidatorTypeError');
          expect(cnpjUtils.CnpjValidatorInputTypeError?.name).toBe('CnpjValidatorInputTypeError');
          expect(cnpjUtils.CnpjValidatorOptionsTypeError?.name).toBe(
            'CnpjValidatorOptionsTypeError',
          );
          expect(cnpjUtils.CnpjValidatorException?.name).toBe('CnpjValidatorException');
          expect(cnpjUtils.CnpjValidatorOptionTypeInvalidException?.name).toBe(
            'CnpjValidatorOptionTypeInvalidException',
          );
        });

        describe('on formatting module', () => {
          it('exposes a `format` method', async () => {
            const result = cnpjUtils.format('01ABC234000X56', { slashKey: '|' });

            expect(result).toBe('01.ABC.234|000X-56');
          });

          it('exposes a `cnpjFmt` function', async () => {
            const result = cnpjUtils.cnpjFmt('01ABC234000X56', { slashKey: '|' });

            expect(result).toBe('01.ABC.234|000X-56');
          });

          it('exposes an instantiable `CnpjFormatter` class', async () => {
            const formatter = new cnpjUtils.CnpjFormatter({ hidden: true });
            const result = formatter.format('AB123XYZ000123');

            expect(result).toBe('AB.123.***/****-**');
          });

          it('exposes an instantiable `CnpjFormatterOptions` class', async () => {
            const options = new cnpjUtils.CnpjFormatterOptions({
              hidden: true,
              hiddenKey: 'X',
              dotKey: ' ',
              slashKey: '|',
              dashKey: '_',
            });

            expect(options.hidden).toBe(true);
            expect(options.hiddenKey).toBe('X');
            expect(options.dotKey).toBe(' ');
            expect(options.slashKey).toBe('|');
            expect(options.dashKey).toBe('_');
          });

          it('exposes an instantiable `CnpjFormatterInputTypeError` class', async () => {
            const error = new cnpjUtils.CnpjFormatterInputTypeError(123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
          });

          it('exposes an instantiable `CnpjFormatterOptionsTypeError` class', async () => {
            const error = new cnpjUtils.CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

            expect(error.actualInput).toBe(123);
            expect(error.optionName).toBe('hidden');
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('boolean');
            expect(error.message).toBe(
              'CNPJ formatting option "hidden" must be of type boolean. Got integer number.',
            );
          });

          it('exposes an instantiable `CnpjFormatterOptionsHiddenRangeInvalidException` class', async () => {
            const exception = new cnpjUtils.CnpjFormatterOptionsHiddenRangeInvalidException(
              'hiddenStart',
              123,
              0,
              13,
            );

            expect(exception.actualInput).toBe(123);
            expect(exception.optionName).toBe('hiddenStart');
            expect(exception.minExpectedValue).toBe(0);
            expect(exception.maxExpectedValue).toBe(13);
            expect(exception.message).toBe(
              'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 123.',
            );
          });

          it('exposes an instantiable `CnpjFormatterOptionsForbiddenKeyCharacterException` class', async () => {
            const exception = new cnpjUtils.CnpjFormatterOptionsForbiddenKeyCharacterException(
              'dotKey',
              'x',
              ['x'],
            );

            expect(exception.actualInput).toBe('x');
            expect(exception.optionName).toBe('dotKey');
            expect(exception.forbiddenCharacters).toEqual(['x']);
            expect(exception.message).toBe(
              'Value "x" for CNPJ formatting option "dotKey" contains disallowed characters ("x").',
            );
          });

          it('exposes an instantiable `CnpjFormatterInputLengthException` class', async () => {
            const exception = new cnpjUtils.CnpjFormatterInputLengthException(
              'ABC.123',
              'ABC123',
              14,
            );

            expect(exception.actualInput).toBe('ABC.123');
            expect(exception.evaluatedInput).toBe('ABC123');
            expect(exception.expectedLength).toBe(14);
            expect(exception.message).toBe(
              'CNPJ input "ABC.123" does not contain 14 characters. Got 6 in "ABC123".',
            );
          });
        });

        describe('on generating module', () => {
          it('exposes a `generate` method', async () => {
            const result = cnpjUtils.generate({ type: 'numeric' });

            expect(result).toMatch(/^\d{14}$/);
          });

          it('exposes a `cnpjGen` function', async () => {
            const result = cnpjUtils.cnpjGen({ type: 'numeric' });

            expect(result).toMatch(/^\d{14}$/);
          });

          it('exposes an instantiable `CnpjGenerator` class', async () => {
            const generator = new cnpjUtils.CnpjGenerator({ type: 'alphabetic' });
            const result = generator.generate({ prefix: '12345' });

            expect(result).toMatch(/^12345[A-Z]{7}\d{2}$/);
          });

          it('exposes an instantiable `CnpjGeneratorOptions` class', async () => {
            const options = new cnpjUtils.CnpjGeneratorOptions({
              prefix: 'AB123XYZ',
              type: 'numeric',
              format: true,
            });

            expect(options.prefix).toBe('AB123XYZ');
            expect(options.type).toBe('numeric');
            expect(options.format).toBe(true);
          });

          it('exposes an instantiable `CnpjGeneratorOptionsTypeError` class', async () => {
            const error = new cnpjUtils.CnpjGeneratorOptionsTypeError('prefix', 123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.optionName).toBe('prefix');
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe(
              'CNPJ generator option "prefix" must be of type string. Got integer number.',
            );
          });

          it('exposes an instantiable `CnpjGeneratorOptionPrefixInvalidException` class', async () => {
            const exception = new cnpjUtils.CnpjGeneratorOptionPrefixInvalidException(
              'AB123XYZ',
              'some reason',
            );

            expect(exception.actualInput).toBe('AB123XYZ');
            expect(exception.reason).toBe('some reason');
            expect(exception.message).toBe(
              'CNPJ generator option "prefix" with value "AB123XYZ" is invalid. some reason',
            );
          });

          it('exposes an instantiable `CnpjGeneratorOptionTypeInvalidException` class', async () => {
            const exception = new cnpjUtils.CnpjGeneratorOptionTypeInvalidException('string', [
              'numeric',
            ]);

            expect(exception.actualInput).toBe('string');
            expect(exception.expectedValues).toEqual(['numeric']);
            expect(exception.message).toBe(
              'CNPJ generator option "type" accepts only the following values: "numeric". Got "string".',
            );
          });
        });

        describe('on validating module', () => {
          it('exposes a `isValid` method', async () => {
            expect(cnpjUtils.isValid('9JN7MGLJZXIO50')).toBe(true);
            expect(cnpjUtils.isValid('9JN7MGLJZXIO51')).toBe(false);
          });

          it('exposes a `cnpjVal` function', async () => {
            expect(cnpjUtils.cnpjVal('9JN7MGLJZXIO50')).toBe(true);
            expect(cnpjUtils.cnpjVal('9JN7MGLJZXIO51')).toBe(false);
          });

          it('exposes an instantiable `CnpjValidator` class', async () => {
            const validator = new cnpjUtils.CnpjValidator({ type: 'numeric' });
            const result = validator.isValid('12651319934215');

            expect(result).toBe(true);
          });

          it('exposes an instantiable `CnpjValidatorOptions` class', async () => {
            const options = new cnpjUtils.CnpjValidatorOptions({
              caseSensitive: false,
              type: 'numeric',
            });

            expect(options.caseSensitive).toBe(false);
            expect(options.type).toBe('numeric');
          });

          it('exposes an instantiable `CnpjValidatorInputTypeError` class', async () => {
            const error = new cnpjUtils.CnpjValidatorInputTypeError(123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
          });

          it('exposes an instantiable `CnpjValidatorOptionsTypeError` class', async () => {
            const error = new cnpjUtils.CnpjValidatorOptionsTypeError('prefix', 123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.optionName).toBe('prefix');
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe(
              'CNPJ validator option "prefix" must be of type string. Got integer number.',
            );
          });

          it('exposes an instantiable `CnpjValidatorOptionTypeInvalidException` class', async () => {
            const exception = new cnpjUtils.CnpjValidatorOptionTypeInvalidException('string', [
              'numeric',
            ]);

            expect(exception.actualInput).toBe('string');
            expect(exception.expectedValues).toEqual(['numeric']);
          });
        });
      });
    });

    describe('file `cnpj-utils.min.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cnpj-utils.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjUtils: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(
            `${fileContent}\nreturn typeof cnpjUtils !== "undefined" ? cnpjUtils : (typeof globalThis !== "undefined" ? globalThis : self).cnpjUtils;`,
          );

          cnpjUtils = makeGlobalInstance();
        });

        it('exposes global `cnpjUtils` with same shape as unminified', (): void => {
          const instance = cnpjUtils.default ?? cnpjUtils;
          expect(instance?.format).toBeTypeOf('function');
          expect(instance?.CnpjUtils ?? cnpjUtils.CnpjUtils).toBeTypeOf('function');
        });
      });
    });
  });

  describe('CommonJS', (): void => {
    describe('file `index.cjs`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('exports using module.exports', async (): Promise<void> => {
        const content = await file.text();

        expect(content).toContain('module.exports = cnpjUtils');
      });
    });

    describe('file `index.d.cts`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.d.cts', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;

      beforeAll(async () => {
        content = await file.text();
      });

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjUtils` variable', (): void => {
        expect(content).toContain('declare const cnpjUtils');
      });

      it('exports `cnpjUtils` as default', (): void => {
        expect(content).toContain('export = cnpjUtils');
      });

      it('declares `CnpjUtils` class', (): void => {
        expect(content).toContain('declare class CnpjUtils');
      });

      it('declares `CnpjUtilsSettingsInput` type', () => {
        expect(content).toContain('type CnpjUtilsSettingsInput');
      });

      it('declares `CnpjUtilsSettingsType` type', () => {
        expect(content).toContain('interface CnpjUtilsSettingsType');
      });
    });
  });

  describe('ES Module', (): void => {
    function extractExportedResources(content: string): string[] {
      const regex = /export\s+(?:type\s+)?\{([^}]+)\}/g;
      const exported: string[] = [];
      let match: null | RegExpExecArray;

      while ((match = regex.exec(content)) !== null) {
        const parts =
          match
            .at(1)
            ?.split(',')
            ?.map((part) => part.trim())
            ?.filter(Boolean) ?? [];

        exported.push(...parts);
      }

      return exported;
    }

    describe('file `index.mjs`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;
      let exportedResources: string[];

      beforeAll(async () => {
        content = await file.text();
        exportedResources = extractExportedResources(content);
      });

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('exports `cnpjUtils` as default', (): void => {
        expect(exportedResources).toContain('cnpjUtils as default');
      });

      it('exports `CnpjUtils` as named', (): void => {
        expect(exportedResources).toContain('CnpjUtils');
      });

      describe('on formatting module', () => {
        it('exports `cnpjFmt` as named', () => {
          expect(exportedResources).toContain('cnpjFmt');
        });

        it('exports `CnpjFormatter` as named', () => {
          expect(exportedResources).toContain('CnpjFormatter');
        });

        it('exports `CnpjFormatterOptions` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptions');
        });

        it('exports `CnpjFormatterTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterTypeError');
        });

        it('exports `CnpjFormatterInputTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterInputTypeError');
        });

        it('exports `CnpjFormatterOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
        });

        it('exports `CnpjFormatterException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterException');
        });

        it('exports `CnpjFormatterInputLengthException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterInputLengthException');
        });

        it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
        });

        it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
        });
      });

      describe('on generating module', () => {
        it('exports `cnpjGen` as named', () => {
          expect(exportedResources).toContain('cnpjGen');
        });

        it('exports `CnpjGenerator` as named', () => {
          expect(exportedResources).toContain('CnpjGenerator');
        });

        it('exports `CnpjGeneratorOptions` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptions');
        });

        it('exports `CnpjGeneratorTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorTypeError');
        });

        it('exports `CnpjGeneratorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionsTypeError');
        });

        it('exports `CnpjGeneratorException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorException');
        });

        it('exports `CnpjGeneratorOptionPrefixInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionPrefixInvalidException');
        });

        it('exports `CnpjGeneratorOptionTypeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionTypeInvalidException');
        });
      });

      describe('on validating module', () => {
        it('exports `cnpjVal` as named', () => {
          expect(exportedResources).toContain('cnpjVal');
        });

        it('exports `CnpjValidator` as named', () => {
          expect(exportedResources).toContain('CnpjValidator');
        });

        it('exports `CnpjValidatorOptions` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptions');
        });

        it('exports `CnpjValidatorTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorTypeError');
        });

        it('exports `CnpjValidatorInputTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorInputTypeError');
        });

        it('exports `CnpjValidatorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
        });

        it('exports `CnpjValidatorException` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorException');
        });

        it('exports `CnpjValidatorOptionTypeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
        });
      });
    });

    describe('file `index.d.ts`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;
      let exportedResources: string[];

      beforeAll(async () => {
        content = await file.text();
        exportedResources = extractExportedResources(content);
      });

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjUtils` variable', (): void => {
        expect(content).toContain('declare const cnpjUtils');
      });

      it('exports `cnpjUtils` as default', (): void => {
        expect(exportedResources).toContain('cnpjUtils as default');
      });

      it('declares `CnpjUtils` class', (): void => {
        expect(content).toContain('declare class CnpjUtils');
      });

      it('exports `CnpjUtils` as named', (): void => {
        expect(exportedResources).toContain('CnpjUtils');
      });

      it('declares `CnpjUtilsSettingsInput` type', () => {
        expect(content).toContain('type CnpjUtilsSettingsInput');
      });

      it('exports `CnpjUtilsSettingsInput` as named', () => {
        expect(exportedResources).toContain('CnpjUtilsSettingsInput');
      });

      it('declares `CnpjUtilsSettingsType` type', () => {
        expect(content).toContain('interface CnpjUtilsSettingsType');
      });

      it('exports `CnpjUtilsSettingsType` as named', () => {
        expect(exportedResources).toContain('CnpjUtilsSettingsType');
      });

      describe('on formatting module', () => {
        it('does not declare `cnpjFmt` function', () => {
          expect(content).not.toContain('declare function cnpjFmt');
        });

        it('exports `cnpjFmt` function as named', () => {
          expect(exportedResources).toContain('cnpjFmt');
        });

        it('does not declare `CnpjFormatter` class', () => {
          expect(content).not.toContain('declare class CnpjFormatter');
        });

        it('exports `CnpjFormatter` as named', () => {
          expect(exportedResources).toContain('CnpjFormatter');
        });

        it('does not declare `CnpjFormatterOptions` class', () => {
          expect(content).not.toContain('declare class CnpjFormatterOptions');
        });

        it('exports `CnpjFormatterOptions` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptions');
        });

        it('does not declare `CnpjFormatterTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjFormatterTypeError');
        });

        it('exports `CnpjFormatterTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterTypeError');
        });

        it('does not declare `CnpjFormatterInputTypeError` class', () => {
          expect(content).not.toContain('declare class CnpjFormatterInputTypeError');
        });

        it('exports `CnpjFormatterInputTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterInputTypeError');
        });

        it('does not declare `CnpjFormatterOptionsTypeError` class', () => {
          expect(content).not.toContain('declare class CnpjFormatterOptionsTypeError');
        });

        it('exports `CnpjFormatterOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
        });

        it('does not declare `CnpjFormatterException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjFormatterException');
        });

        it('exports `CnpjFormatterException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterException');
        });

        it('does not declare `CnpjFormatterInputLengthException` class', () => {
          expect(content).not.toContain('declare class CnpjFormatterInputLengthException');
        });

        it('exports `CnpjFormatterInputLengthException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterInputLengthException');
        });

        it('does not declare `CnpjFormatterOptionsHiddenRangeInvalidException` class', () => {
          expect(content).not.toContain(
            'declare class CnpjFormatterOptionsHiddenRangeInvalidException',
          );
        });

        it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
        });

        it('does not declare `CnpjFormatterOptionsForbiddenKeyCharacterException` class', () => {
          expect(content).not.toContain(
            'declare class CnpjFormatterOptionsForbiddenKeyCharacterException',
          );
        });

        it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
        });

        it('does not declare `CnpjFormatterOptionsInput` type', () => {
          expect(content).not.toContain('type CnpjFormatterOptionsInput');
        });

        it('exports `CnpjFormatterOptionsInput` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsInput');
        });

        it('does not declare `CnpjFormatterOptionsType` type', () => {
          expect(content).not.toContain('interface CnpjFormatterOptionsType');
        });

        it('exports `CnpjFormatterOptionsType` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOptionsType');
        });

        it('does not declare `CnpjInput` nor `CnpjFormatterInput` type', () => {
          expect(content).not.toContain('type CnpjInput');
          expect(content).not.toContain('type CnpjFormatterInput');
        });

        it('exports `CnpjInput as CnpjFormatterInput` as named', () => {
          expect(exportedResources).toContain('CnpjInput as CnpjFormatterInput');
        });

        it('does not declare `OnFailCallback` nor `CnpjFormatterOnFailCallback` type', () => {
          expect(content).not.toContain('type OnFailCallback');
          expect(content).not.toContain('type CnpjFormatterOnFailCallback');
        });

        it('exports `OnFailCallback as CnpjFormatterOnFailCallback` as named', () => {
          expect(exportedResources).toContain('OnFailCallback as CnpjFormatterOnFailCallback');
        });
      });

      describe('on generating module', () => {
        it('does not declare `cnpjGen` function', () => {
          expect(content).not.toContain('declare function cnpjGen');
        });

        it('exports `cnpjGen` as named', () => {
          expect(exportedResources).toContain('cnpjGen');
        });

        it('does not declare `CnpjGenerator` class', () => {
          expect(content).not.toContain('declare class CnpjGenerator');
        });

        it('exports `CnpjGenerator` as named', () => {
          expect(exportedResources).toContain('CnpjGenerator');
        });

        it('does not declare `CnpjGeneratorOptions` class', () => {
          expect(content).not.toContain('declare class CnpjGeneratorOptions');
        });

        it('exports `CnpjGeneratorOptions` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptions');
        });

        it('does not declare `CnpjGeneratorTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjGeneratorTypeError');
        });

        it('exports `CnpjGeneratorTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorTypeError');
        });

        it('does not declare `CnpjGeneratorOptionsTypeError` class', () => {
          expect(content).not.toContain('declare class CnpjGeneratorOptionsTypeError');
        });

        it('exports `CnpjGeneratorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionsTypeError');
        });

        it('does not declare `CnpjGeneratorException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjGeneratorException');
        });

        it('exports `CnpjGeneratorException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorException');
        });

        it('does not declare `CnpjGeneratorOptionPrefixInvalidException` class', () => {
          expect(content).not.toContain('declare class CnpjGeneratorOptionPrefixInvalidException');
        });

        it('exports `CnpjGeneratorOptionPrefixInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionPrefixInvalidException');
        });

        it('does not declare `CnpjGeneratorOptionTypeInvalidException` class', () => {
          expect(content).not.toContain('declare class CnpjGeneratorOptionTypeInvalidException');
        });

        it('exports `CnpjGeneratorOptionTypeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionTypeInvalidException');
        });

        it('does not declare `CnpjType` nor `CnpjGeneratorType` type', () => {
          expect(content).not.toContain('type CnpjType');
          expect(content).not.toContain('type CnpjGeneratorType');
        });

        it('exports `CnpjType as CnpjGeneratorType` as named', () => {
          expect(exportedResources).toContain('CnpjType as CnpjGeneratorType');
        });

        it('does not declare `CnpjGeneratorOptionsInput` type', () => {
          expect(content).not.toContain('type CnpjGeneratorOptionsInput');
        });

        it('exports `CnpjGeneratorOptionsInput` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionsInput');
        });

        it('does not declare `CnpjGeneratorOptionsType` type', () => {
          expect(content).not.toContain('interface CnpjGeneratorOptionsType');
        });

        it('exports `CnpjGeneratorOptionsType` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorOptionsType');
        });
      });

      describe('on validating module', () => {
        it('does not declare `cnpjVal` function', () => {
          expect(content).not.toContain('declare function cnpjVal');
        });

        it('exports `cnpjVal` as named', () => {
          expect(exportedResources).toContain('cnpjVal');
        });

        it('does not declare `CnpjValidator` class', () => {
          expect(content).not.toContain('declare class CnpjValidator');
        });

        it('exports `CnpjValidator` as named', () => {
          expect(exportedResources).toContain('CnpjValidator');
        });

        it('does not declare `CnpjValidatorOptions` class', () => {
          expect(content).not.toContain('declare class CnpjValidatorOptions');
        });

        it('exports `CnpjValidatorOptions` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptions');
        });

        it('does not declare `CnpjValidatorTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjValidatorTypeError');
        });

        it('exports `CnpjValidatorTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorTypeError');
        });

        it('does not declare `CnpjValidatorInputTypeError` class', () => {
          expect(content).not.toContain('declare class CnpjValidatorInputTypeError');
        });

        it('exports `CnpjValidatorInputTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorInputTypeError');
        });

        it('does not declare `CnpjValidatorOptionsTypeError` class', () => {
          expect(content).not.toContain('declare class CnpjValidatorOptionsTypeError');
        });

        it('exports `CnpjValidatorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
        });

        it('does not declare `CnpjValidatorException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CnpjValidatorException');
        });

        it('exports `CnpjValidatorException` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorException');
        });

        it('does not declare `CnpjValidatorOptionTypeInvalidException` class', () => {
          expect(content).not.toContain('declare class CnpjValidatorOptionTypeInvalidException');
        });

        it('exports `CnpjValidatorOptionTypeInvalidException` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
        });

        it('does not declare `CnpjInput` nor `CnpjValidatorInput` type', () => {
          expect(content).not.toContain('type CnpjInput');
          expect(content).not.toContain('type CnpjValidatorInput');
        });

        it('exports `CnpjInput as CnpjValidatorInput` as named', () => {
          expect(exportedResources).toContain('CnpjInput as CnpjValidatorInput');
        });

        it('does not declare `CnpjType` nor `CnpjValidatorType` type', () => {
          expect(content).not.toContain('type CnpjType');
          expect(content).not.toContain('type CnpjValidatorType');
        });

        it('exports `CnpjType as CnpjValidatorType` as named', () => {
          expect(exportedResources).toContain('CnpjType as CnpjValidatorType');
        });

        it('does not declare `CnpjValidatorOptionsInput` type', () => {
          expect(content).not.toContain('type CnpjValidatorOptionsInput');
        });

        it('exports `CnpjValidatorOptionsInput` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionsInput');
        });

        it('does not declare `CnpjValidatorOptionsType` type', () => {
          expect(content).not.toContain('interface CnpjValidatorOptionsType');
        });

        it('exports `CnpjValidatorOptionsType` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorOptionsType');
        });
      });
    });
  });
});
