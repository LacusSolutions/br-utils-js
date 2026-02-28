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
    describe.each(['cpf-utils.js', 'cpf-utils.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfUtils: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfUtils;`);

          cpfUtils = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = Object.fromEntries(
            Object.entries({ ...cpfUtils }).filter(([key]) => key.match(/^Cpf/i)),
          );

          expect(api).toEqual({
            CpfUtils: expect.anything(),
            cpfFmt: expect.anything(),
            CpfFormatter: expect.anything(),
            CpfFormatterOptions: expect.anything(),
            CpfFormatterTypeError: expect.anything(),
            CpfFormatterInputTypeError: expect.anything(),
            CpfFormatterOptionsTypeError: expect.anything(),
            CpfFormatterException: expect.anything(),
            CpfFormatterInputLengthException: expect.anything(),
            CpfFormatterOptionsForbiddenKeyCharacterException: expect.anything(),
            CpfFormatterOptionsHiddenRangeInvalidException: expect.anything(),
            cpfGen: expect.anything(),
            CpfGenerator: expect.anything(),
            CpfGeneratorOptions: expect.anything(),
            CpfGeneratorTypeError: expect.anything(),
            CpfGeneratorOptionsTypeError: expect.anything(),
            CpfGeneratorException: expect.anything(),
            CpfGeneratorOptionPrefixInvalidException: expect.anything(),
            cpfVal: expect.anything(),
            CpfValidator: expect.anything(),
            CpfValidatorTypeError: expect.anything(),
            CpfValidatorInputTypeError: expect.anything(),
            CpfValidatorException: expect.anything(),
          });
        });

        it('exposes a global `cpfUtils` object', async () => {
          expect(cpfUtils).toBeDefined();
          expect(cpfUtils).toBeObject();
          expect(cpfUtils.constructor?.name).toBe('CpfUtils');

          expect(cpfUtils.format).toBeFunction();
          expect(cpfUtils.generate).toBeFunction();
          expect(cpfUtils.isValid).toBeFunction();
        });

        it('exposes other resources through the global `cpfUtils` variable', async () => {
          expect(cpfUtils.cpfFmt?.name).toBe('cpfFmt');
          expect(cpfUtils.CpfFormatter?.name).toBe('CpfFormatter');
          expect(cpfUtils.CpfFormatterOptions?.name).toBe('CpfFormatterOptions');
          expect(cpfUtils.CpfFormatterTypeError?.name).toBe('CpfFormatterTypeError');
          expect(cpfUtils.CpfFormatterInputTypeError?.name).toBe('CpfFormatterInputTypeError');
          expect(cpfUtils.CpfFormatterOptionsTypeError?.name).toBe('CpfFormatterOptionsTypeError');
          expect(cpfUtils.CpfFormatterException?.name).toBe('CpfFormatterException');
          expect(cpfUtils.CpfFormatterInputLengthException?.name).toBe(
            'CpfFormatterInputLengthException',
          );
          expect(cpfUtils.CpfFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CpfFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cpfUtils.CpfFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CpfFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cpfUtils.cpfGen?.name).toBe('cpfGen');
          expect(cpfUtils.CpfGenerator?.name).toBe('CpfGenerator');
          expect(cpfUtils.CpfGeneratorOptions?.name).toBe('CpfGeneratorOptions');
          expect(cpfUtils.CpfGeneratorTypeError?.name).toBe('CpfGeneratorTypeError');
          expect(cpfUtils.CpfGeneratorOptionsTypeError?.name).toBe('CpfGeneratorOptionsTypeError');
          expect(cpfUtils.CpfGeneratorException?.name).toBe('CpfGeneratorException');
          expect(cpfUtils.CpfGeneratorOptionPrefixInvalidException?.name).toBe(
            'CpfGeneratorOptionPrefixInvalidException',
          );
          expect(cpfUtils.cpfVal?.name).toBe('cpfVal');
          expect(cpfUtils.CpfValidator?.name).toBe('CpfValidator');
          expect(cpfUtils.CpfValidatorTypeError?.name).toBe('CpfValidatorTypeError');
          expect(cpfUtils.CpfValidatorInputTypeError?.name).toBe('CpfValidatorInputTypeError');
          expect(cpfUtils.CpfValidatorException?.name).toBe('CpfValidatorException');
        });

        describe('on formatting module', () => {
          it('exposes a `format` method', async () => {
            const result = cpfUtils.format('12345678909', { dotKey: '_', dashKey: ' dv ' });

            expect(result).toBe('123_456_789 dv 09');
          });

          it('exposes a `cpfFmt` function', async () => {
            const result = cpfUtils.cpfFmt('12345678909', { dotKey: '_', dashKey: ' dv ' });

            expect(result).toBe('123_456_789 dv 09');
          });

          it('exposes an instantiable `CpfFormatter` class', async () => {
            const formatter = new cpfUtils.CpfFormatter({ hidden: true });
            const result = formatter.format('12345678909');

            expect(result).toBe('123.***.***-**');
          });

          it('exposes an instantiable `CpfFormatterOptions` class', async () => {
            const options = new cpfUtils.CpfFormatterOptions({
              hidden: true,
              hiddenKey: 'X',
              dotKey: ' ',
              dashKey: '_',
            });

            expect(options.hidden).toBe(true);
            expect(options.hiddenKey).toBe('X');
            expect(options.dotKey).toBe(' ');
            expect(options.dashKey).toBe('_');
          });

          it('exposes an instantiable `CpfFormatterInputTypeError` class', async () => {
            const error = new cpfUtils.CpfFormatterInputTypeError(123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe('CPF input must be of type string. Got integer number.');
          });

          it('exposes an instantiable `CpfFormatterOptionsTypeError` class', async () => {
            const error = new cpfUtils.CpfFormatterOptionsTypeError('hidden', 123, 'boolean');

            expect(error.actualInput).toBe(123);
            expect(error.optionName).toBe('hidden');
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('boolean');
            expect(error.message).toBe(
              'CPF formatting option "hidden" must be of type boolean. Got integer number.',
            );
          });

          it('exposes an instantiable `CpfFormatterOptionsHiddenRangeInvalidException` class', async () => {
            const exception = new cpfUtils.CpfFormatterOptionsHiddenRangeInvalidException(
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
              'CPF formatting option "hiddenStart" must be an integer between 0 and 13. Got 123.',
            );
          });

          it('exposes an instantiable `CpfFormatterOptionsForbiddenKeyCharacterException` class', async () => {
            const exception = new cpfUtils.CpfFormatterOptionsForbiddenKeyCharacterException(
              'dotKey',
              'x',
              ['x'],
            );

            expect(exception.actualInput).toBe('x');
            expect(exception.optionName).toBe('dotKey');
            expect(exception.forbiddenCharacters).toEqual(['x']);
            expect(exception.message).toBe(
              'Value "x" for CPF formatting option "dotKey" contains disallowed characters ("x").',
            );
          });

          it('exposes an instantiable `CpfFormatterInputLengthException` class', async () => {
            const exception = new cpfUtils.CpfFormatterInputLengthException(
              'ABC.123',
              'ABC123',
              11,
            );

            expect(exception.actualInput).toBe('ABC.123');
            expect(exception.evaluatedInput).toBe('ABC123');
            expect(exception.expectedLength).toBe(11);
            expect(exception.message).toBe(
              'CPF input "ABC.123" does not contain 11 digits. Got 6 in "ABC123".',
            );
          });
        });

        describe('on generating module', () => {
          it('exposes a `generate` method', async () => {
            const result = cpfUtils.generate();

            expect(result).toMatch(/^\d{11}$/);
          });

          it('exposes a `cpfGen` function', async () => {
            const result = cpfUtils.cpfGen();

            expect(result).toMatch(/^\d{11}$/);
          });

          it('exposes an instantiable `CpfGenerator` class', async () => {
            const generator = new cpfUtils.CpfGenerator();
            const result = generator.generate({ prefix: '12345' });

            expect(result).toMatch(/^12345\d{6}$/);
          });

          it('exposes an instantiable `CpfGeneratorOptions` class', async () => {
            const options = new cpfUtils.CpfGeneratorOptions({
              prefix: '12345678',
              format: true,
            });

            expect(options.prefix).toBe('12345678');
            expect(options.format).toBe(true);
          });

          it('exposes an instantiable `CpfGeneratorOptionsTypeError` class', async () => {
            const error = new cpfUtils.CpfGeneratorOptionsTypeError('prefix', 123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.optionName).toBe('prefix');
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe(
              'CPF generator option "prefix" must be of type string. Got integer number.',
            );
          });

          it('exposes an instantiable `CpfGeneratorOptionPrefixInvalidException` class', async () => {
            const exception = new cpfUtils.CpfGeneratorOptionPrefixInvalidException(
              'AB123XYZ',
              'some reason',
            );

            expect(exception.actualInput).toBe('AB123XYZ');
            expect(exception.reason).toBe('some reason');
            expect(exception.message).toBe(
              'CPF generator option "prefix" with value "AB123XYZ" is invalid. some reason',
            );
          });
        });

        describe('on validating module', () => {
          it('exposes a `isValid` method', async () => {
            expect(cpfUtils.isValid('12345678909')).toBe(true);
            expect(cpfUtils.isValid('12345678900')).toBe(false);
          });

          it('exposes a `cpfVal` function', async () => {
            expect(cpfUtils.cpfVal('12345678909')).toBe(true);
            expect(cpfUtils.cpfVal('12345678900')).toBe(false);
          });

          it('exposes an instantiable `CpfValidator` class', async () => {
            const validator = new cpfUtils.CpfValidator();
            const result = validator.isValid('12345678909');

            expect(result).toBe(true);
          });

          it('exposes an instantiable `CpfValidatorInputTypeError` class', async () => {
            const error = new cpfUtils.CpfValidatorInputTypeError(123, 'string');

            expect(error.actualInput).toBe(123);
            expect(error.actualType).toBe('integer number');
            expect(error.expectedType).toBe('string');
            expect(error.message).toBe('CPF input must be of type string. Got integer number.');
          });
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

        expect(content).toContain('module.exports = cpfUtils');
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

      it('declares `cpfUtils` variable', (): void => {
        expect(content).toContain('declare const cpfUtils');
      });

      it('exports `cpfUtils` as default', (): void => {
        expect(content).toContain('export = cpfUtils');
      });

      it('declares `CpfUtils` class', (): void => {
        expect(content).toContain('declare class CpfUtils');
      });

      it('declares `CpfUtilsSettingsInput` type', () => {
        expect(content).toContain('type CpfUtilsSettingsInput');
      });

      it('declares `CpfUtilsSettingsType` type', () => {
        expect(content).toContain('interface CpfUtilsSettingsType');
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

      it('exports `cpfUtils` as default', (): void => {
        expect(exportedResources).toContain('cpfUtils as default');
      });

      it('exports `CpfUtils` as named', (): void => {
        expect(exportedResources).toContain('CpfUtils');
      });

      describe('on formatting module', () => {
        it('exports `cpfFmt` as named', () => {
          expect(exportedResources).toContain('cpfFmt');
        });

        it('exports `CpfFormatter` as named', () => {
          expect(exportedResources).toContain('CpfFormatter');
        });

        it('exports `CpfFormatterOptions` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptions');
        });

        it('exports `CpfFormatterTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterTypeError');
        });

        it('exports `CpfFormatterInputTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterInputTypeError');
        });

        it('exports `CpfFormatterOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
        });

        it('exports `CpfFormatterException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterException');
        });

        it('exports `CpfFormatterInputLengthException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterInputLengthException');
        });

        it('exports `CpfFormatterOptionsHiddenRangeInvalidException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
        });

        it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
        });
      });

      describe('on generating module', () => {
        it('exports `cpfGen` as named', () => {
          expect(exportedResources).toContain('cpfGen');
        });

        it('exports `CpfGenerator` as named', () => {
          expect(exportedResources).toContain('CpfGenerator');
        });

        it('exports `CpfGeneratorOptions` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptions');
        });

        it('exports `CpfGeneratorTypeError` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorTypeError');
        });

        it('exports `CpfGeneratorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionsTypeError');
        });

        it('exports `CpfGeneratorException` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorException');
        });

        it('exports `CpfGeneratorOptionPrefixInvalidException` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionPrefixInvalidException');
        });
      });

      describe('on validating module', () => {
        it('exports `cpfVal` as named', () => {
          expect(exportedResources).toContain('cpfVal');
        });

        it('exports `CpfValidator` as named', () => {
          expect(exportedResources).toContain('CpfValidator');
        });

        it('exports `CpfValidatorTypeError` as named', () => {
          expect(exportedResources).toContain('CpfValidatorTypeError');
        });

        it('exports `CpfValidatorInputTypeError` as named', () => {
          expect(exportedResources).toContain('CpfValidatorInputTypeError');
        });

        it('exports `CpfValidatorException` as named', () => {
          expect(exportedResources).toContain('CpfValidatorException');
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

      it('declares `cpfUtils` variable', (): void => {
        expect(content).toContain('declare const cpfUtils');
      });

      it('exports `cpfUtils` as default', (): void => {
        expect(exportedResources).toContain('cpfUtils as default');
      });

      it('declares `CpfUtils` class', (): void => {
        expect(content).toContain('declare class CpfUtils');
      });

      it('exports `CpfUtils` as named', (): void => {
        expect(exportedResources).toContain('CpfUtils');
      });

      it('declares `CpfUtilsSettingsInput` type', () => {
        expect(content).toContain('type CpfUtilsSettingsInput');
      });

      it('exports `CpfUtilsSettingsInput` as named', () => {
        expect(exportedResources).toContain('CpfUtilsSettingsInput');
      });

      it('declares `CpfUtilsSettingsType` type', () => {
        expect(content).toContain('interface CpfUtilsSettingsType');
      });

      it('exports `CpfUtilsSettingsType` as named', () => {
        expect(exportedResources).toContain('CpfUtilsSettingsType');
      });

      describe('on formatting module', () => {
        it('does not declare `cpfFmt` function', () => {
          expect(content).not.toContain('declare function cpfFmt');
        });

        it('exports `cpfFmt` function as named', () => {
          expect(exportedResources).toContain('cpfFmt');
        });

        it('does not declare `CpfFormatter` class', () => {
          expect(content).not.toContain('declare class CpfFormatter');
        });

        it('exports `CpfFormatter` as named', () => {
          expect(exportedResources).toContain('CpfFormatter');
        });

        it('does not declare `CpfFormatterOptions` class', () => {
          expect(content).not.toContain('declare class CpfFormatterOptions');
        });

        it('exports `CpfFormatterOptions` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptions');
        });

        it('does not declare `CpfFormatterTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfFormatterTypeError');
        });

        it('exports `CpfFormatterTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterTypeError');
        });

        it('does not declare `CpfFormatterInputTypeError` class', () => {
          expect(content).not.toContain('declare class CpfFormatterInputTypeError');
        });

        it('exports `CpfFormatterInputTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterInputTypeError');
        });

        it('does not declare `CpfFormatterOptionsTypeError` class', () => {
          expect(content).not.toContain('declare class CpfFormatterOptionsTypeError');
        });

        it('exports `CpfFormatterOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
        });

        it('does not declare `CpfFormatterException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfFormatterException');
        });

        it('exports `CpfFormatterException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterException');
        });

        it('does not declare `CpfFormatterInputLengthException` class', () => {
          expect(content).not.toContain('declare class CpfFormatterInputLengthException');
        });

        it('exports `CpfFormatterInputLengthException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterInputLengthException');
        });

        it('does not declare `CpfFormatterOptionsHiddenRangeInvalidException` class', () => {
          expect(content).not.toContain(
            'declare class CpfFormatterOptionsHiddenRangeInvalidException',
          );
        });

        it('exports `CpfFormatterOptionsHiddenRangeInvalidException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
        });

        it('does not declare `CpfFormatterOptionsForbiddenKeyCharacterException` class', () => {
          expect(content).not.toContain(
            'declare class CpfFormatterOptionsForbiddenKeyCharacterException',
          );
        });

        it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
        });

        it('does not declare `CpfFormatterOptionsInput` type', () => {
          expect(content).not.toContain('type CpfFormatterOptionsInput');
        });

        it('exports `CpfFormatterOptionsInput` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsInput');
        });

        it('does not declare `CpfFormatterOptionsType` type', () => {
          expect(content).not.toContain('interface CpfFormatterOptionsType');
        });

        it('exports `CpfFormatterOptionsType` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOptionsType');
        });

        it('does not declare `CpfInput` nor `CpfFormatterInput` type', () => {
          expect(content).not.toContain('type CpfInput');
          expect(content).not.toContain('type CpfFormatterInput');
        });

        it('exports `CpfInput as CpfFormatterInput` as named', () => {
          expect(exportedResources).toContain('CpfInput as CpfFormatterInput');
        });

        it('does not declare `OnFailCallback` nor `CpfFormatterOnFailCallback` type', () => {
          expect(content).not.toContain('type OnFailCallback');
          expect(content).not.toContain('type CpfFormatterOnFailCallback');
        });

        it('exports `OnFailCallback as CpfFormatterOnFailCallback` as named', () => {
          expect(exportedResources).toContain('OnFailCallback as CpfFormatterOnFailCallback');
        });
      });

      describe('on generating module', () => {
        it('does not declare `cpfGen` function', () => {
          expect(content).not.toContain('declare function cpfGen');
        });

        it('exports `cpfGen` as named', () => {
          expect(exportedResources).toContain('cpfGen');
        });

        it('does not declare `CpfGenerator` class', () => {
          expect(content).not.toContain('declare class CpfGenerator');
        });

        it('exports `CpfGenerator` as named', () => {
          expect(exportedResources).toContain('CpfGenerator');
        });

        it('does not declare `CpfGeneratorOptions` class', () => {
          expect(content).not.toContain('declare class CpfGeneratorOptions');
        });

        it('exports `CpfGeneratorOptions` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptions');
        });

        it('does not declare `CpfGeneratorTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfGeneratorTypeError');
        });

        it('exports `CpfGeneratorTypeError` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorTypeError');
        });

        it('does not declare `CpfGeneratorOptionsTypeError` class', () => {
          expect(content).not.toContain('declare class CpfGeneratorOptionsTypeError');
        });

        it('exports `CpfGeneratorOptionsTypeError` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionsTypeError');
        });

        it('does not declare `CpfGeneratorException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfGeneratorException');
        });

        it('exports `CpfGeneratorException` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorException');
        });

        it('does not declare `CpfGeneratorOptionPrefixInvalidException` class', () => {
          expect(content).not.toContain('declare class CpfGeneratorOptionPrefixInvalidException');
        });

        it('exports `CpfGeneratorOptionPrefixInvalidException` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionPrefixInvalidException');
        });

        it('does not declare `CpfGeneratorOptionsInput` type', () => {
          expect(content).not.toContain('type CpfGeneratorOptionsInput');
        });

        it('exports `CpfGeneratorOptionsInput` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionsInput');
        });

        it('does not declare `CpfGeneratorOptionsType` type', () => {
          expect(content).not.toContain('interface CpfGeneratorOptionsType');
        });

        it('exports `CpfGeneratorOptionsType` as named', () => {
          expect(exportedResources).toContain('CpfGeneratorOptionsType');
        });
      });

      describe('on validating module', () => {
        it('does not declare `cpfVal` function', () => {
          expect(content).not.toContain('declare function cpfVal');
        });

        it('exports `cpfVal` as named', () => {
          expect(exportedResources).toContain('cpfVal');
        });

        it('does not declare `CpfValidator` class', () => {
          expect(content).not.toContain('declare class CpfValidator');
        });

        it('exports `CpfValidator` as named', () => {
          expect(exportedResources).toContain('CpfValidator');
        });

        it('does not declare `CpfValidatorTypeError` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfValidatorTypeError');
        });

        it('exports `CpfValidatorTypeError` as named', () => {
          expect(exportedResources).toContain('CpfValidatorTypeError');
        });

        it('does not declare `CpfValidatorInputTypeError` class', () => {
          expect(content).not.toContain('declare class CpfValidatorInputTypeError');
        });

        it('exports `CpfValidatorInputTypeError` as named', () => {
          expect(exportedResources).toContain('CpfValidatorInputTypeError');
        });

        it('does not declare `CpfValidatorException` abstract class', () => {
          expect(content).not.toContain('declare abstract class CpfValidatorException');
        });

        it('exports `CpfValidatorException` as named', () => {
          expect(exportedResources).toContain('CpfValidatorException');
        });

        it('does not declare `CpfInput` nor `CpfValidatorInput` type', () => {
          expect(content).not.toContain('type CpfInput');
          expect(content).not.toContain('type CpfValidatorInput');
        });

        it('exports `CpfInput as CpfValidatorInput` as named', () => {
          expect(exportedResources).toContain('CpfInput as CpfValidatorInput');
        });
      });
    });
  });
});
