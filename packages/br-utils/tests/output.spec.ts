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
    describe.each(['br-utils.js', 'br-utils.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let brUtils: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn brUtils;`);

          brUtils = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = Object.fromEntries(
            Object.entries({ ...brUtils }).filter(([key]) => !key.match(/^_/)),
          );

          expect(api).toEqual({
            BrUtils: expect.anything(),
            CnpjUtils: expect.anything(),
            cnpjUtils: expect.anything(),
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
            CpfUtils: expect.anything(),
            cpfUtils: expect.anything(),
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

        it('exposes a global `brUtils` object', async () => {
          expect(brUtils).not.toBeNil();
          expect(brUtils).toBeObject();
          expect(brUtils.constructor?.name).toBe('BrUtils');

          expect(brUtils.cnpj).not.toBeNil();
          expect(brUtils.cnpj).toBeObject();
          expect(brUtils.cpf).not.toBeNil();
          expect(brUtils.cpf).toBeObject();
        });

        it('exposes other resources through the global `cnpjUtils` variable', async () => {
          expect(brUtils.cnpjUtils?.constructor?.name).toBe('CnpjUtils');
          expect(brUtils.CnpjUtils?.name).toBe('CnpjUtils');
          expect(brUtils.cnpjFmt?.name).toBe('cnpjFmt');
          expect(brUtils.CnpjFormatter?.name).toBe('CnpjFormatter');
          expect(brUtils.CnpjFormatterOptions?.name).toBe('CnpjFormatterOptions');
          expect(brUtils.CnpjFormatterTypeError?.name).toBe('CnpjFormatterTypeError');
          expect(brUtils.CnpjFormatterInputTypeError?.name).toBe('CnpjFormatterInputTypeError');
          expect(brUtils.CnpjFormatterOptionsTypeError?.name).toBe('CnpjFormatterOptionsTypeError');
          expect(brUtils.CnpjFormatterException?.name).toBe('CnpjFormatterException');
          expect(brUtils.CnpjFormatterInputLengthException?.name).toBe(
            'CnpjFormatterInputLengthException',
          );
          expect(brUtils.CnpjFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CnpjFormatterOptionsHiddenRangeInvalidException',
          );
          expect(brUtils.CnpjFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CnpjFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(brUtils.cnpjGen?.name).toBe('cnpjGen');
          expect(brUtils.CnpjGenerator?.name).toBe('CnpjGenerator');
          expect(brUtils.CnpjGeneratorOptions?.name).toBe('CnpjGeneratorOptions');
          expect(brUtils.CnpjGeneratorTypeError?.name).toBe('CnpjGeneratorTypeError');
          expect(brUtils.CnpjGeneratorOptionsTypeError?.name).toBe('CnpjGeneratorOptionsTypeError');
          expect(brUtils.CnpjGeneratorException?.name).toBe('CnpjGeneratorException');
          expect(brUtils.CnpjGeneratorOptionPrefixInvalidException?.name).toBe(
            'CnpjGeneratorOptionPrefixInvalidException',
          );
          expect(brUtils.CnpjGeneratorOptionTypeInvalidException?.name).toBe(
            'CnpjGeneratorOptionTypeInvalidException',
          );
          expect(brUtils.cnpjVal?.name).toBe('cnpjVal');
          expect(brUtils.CnpjValidator?.name).toBe('CnpjValidator');
          expect(brUtils.CnpjValidatorOptions?.name).toBe('CnpjValidatorOptions');
          expect(brUtils.CnpjValidatorTypeError?.name).toBe('CnpjValidatorTypeError');
          expect(brUtils.CnpjValidatorInputTypeError?.name).toBe('CnpjValidatorInputTypeError');
          expect(brUtils.CnpjValidatorOptionsTypeError?.name).toBe('CnpjValidatorOptionsTypeError');
          expect(brUtils.CnpjValidatorException?.name).toBe('CnpjValidatorException');
          expect(brUtils.CnpjValidatorOptionTypeInvalidException?.name).toBe(
            'CnpjValidatorOptionTypeInvalidException',
          );
          expect(brUtils.cpfUtils?.constructor?.name).toBe('CpfUtils');
          expect(brUtils.CpfUtils?.name).toBe('CpfUtils');
          expect(brUtils.cpfFmt?.name).toBe('cpfFmt');
          expect(brUtils.CpfFormatter?.name).toBe('CpfFormatter');
          expect(brUtils.CpfFormatterOptions?.name).toBe('CpfFormatterOptions');
          expect(brUtils.CpfFormatterTypeError?.name).toBe('CpfFormatterTypeError');
          expect(brUtils.CpfFormatterInputTypeError?.name).toBe('CpfFormatterInputTypeError');
          expect(brUtils.CpfFormatterOptionsTypeError?.name).toBe('CpfFormatterOptionsTypeError');
          expect(brUtils.CpfFormatterException?.name).toBe('CpfFormatterException');
          expect(brUtils.CpfFormatterInputLengthException?.name).toBe(
            'CpfFormatterInputLengthException',
          );
          expect(brUtils.CpfFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CpfFormatterOptionsHiddenRangeInvalidException',
          );
          expect(brUtils.CpfFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CpfFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(brUtils.cpfGen?.name).toBe('cpfGen');
          expect(brUtils.CpfGenerator?.name).toBe('CpfGenerator');
          expect(brUtils.CpfGeneratorOptions?.name).toBe('CpfGeneratorOptions');
          expect(brUtils.CpfGeneratorTypeError?.name).toBe('CpfGeneratorTypeError');
          expect(brUtils.CpfGeneratorOptionsTypeError?.name).toBe('CpfGeneratorOptionsTypeError');
          expect(brUtils.CpfGeneratorException?.name).toBe('CpfGeneratorException');
          expect(brUtils.CpfGeneratorOptionPrefixInvalidException?.name).toBe(
            'CpfGeneratorOptionPrefixInvalidException',
          );
          expect(brUtils.cpfVal?.name).toBe('cpfVal');
          expect(brUtils.CpfValidator?.name).toBe('CpfValidator');
          expect(brUtils.CpfValidatorTypeError?.name).toBe('CpfValidatorTypeError');
          expect(brUtils.CpfValidatorInputTypeError?.name).toBe('CpfValidatorInputTypeError');
          expect(brUtils.CpfValidatorException?.name).toBe('CpfValidatorException');
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

        expect(content).toContain('module.exports = brUtils');
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

      it('declares `brUtils` variable', (): void => {
        expect(content).toContain('declare const brUtils');
      });

      it('exports `brUtils` as default', (): void => {
        expect(content).toContain('export = brUtils');
      });

      it('declares `BrUtils` class', (): void => {
        expect(content).toContain('declare class BrUtils');
      });

      it('declares `BrUtilsSettingsInput` type', () => {
        expect(content).toContain('type BrUtilsSettingsInput');
      });

      it('declares `BrUtilsSettingsType` type', () => {
        expect(content).toContain('interface BrUtilsSettingsType');
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

      it('exports `brUtils` as default', (): void => {
        expect(exportedResources).toContain('brUtils as default');
      });

      it('exports `BrUtils` as named', (): void => {
        expect(exportedResources).toContain('BrUtils');
      });

      describe('on CNPJ module', () => {
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

      describe('on CPF module', () => {
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

      it('declares `brUtils` variable', (): void => {
        expect(content).toContain('declare const brUtils');
      });

      it('exports `brUtils` as default', (): void => {
        expect(exportedResources).toContain('brUtils as default');
      });

      it('declares `BrUtils` class', (): void => {
        expect(content).toContain('declare class BrUtils');
      });

      it('exports `BrUtils` as named', (): void => {
        expect(exportedResources).toContain('BrUtils');
      });

      it('declares `BrUtilsSettingsInput` type', () => {
        expect(content).toContain('type BrUtilsSettingsInput');
      });

      it('exports `BrUtilsSettingsInput` as named', () => {
        expect(exportedResources).toContain('BrUtilsSettingsInput');
      });

      it('declares `BrUtilsSettingsType` type', () => {
        expect(content).toContain('interface BrUtilsSettingsType');
      });

      it('exports `BrUtilsSettingsType` as named', () => {
        expect(exportedResources).toContain('BrUtilsSettingsType');
      });

      describe('on CNPJ module', () => {
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

        it('exports `CnpjFormatterInput` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterInput');
        });

        it('does not declare `OnFailCallback` nor `CnpjFormatterOnFailCallback` type', () => {
          expect(content).not.toContain('type OnFailCallback');
          expect(content).not.toContain('type CnpjFormatterOnFailCallback');
        });

        it('exports `CnpjFormatterOnFailCallback` as named', () => {
          expect(exportedResources).toContain('CnpjFormatterOnFailCallback');
        });

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

        it('exports `CnpjGeneratorType` as named', () => {
          expect(exportedResources).toContain('CnpjGeneratorType');
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

        it('exports `CnpjValidatorInput` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorInput');
        });

        it('does not declare `CnpjType` nor `CnpjValidatorType` type', () => {
          expect(content).not.toContain('type CnpjType');
          expect(content).not.toContain('type CnpjValidatorType');
        });

        it('exports `CnpjValidatorType` as named', () => {
          expect(exportedResources).toContain('CnpjValidatorType');
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

      describe('on CPF module', () => {
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

        it('exports `CpfFormatterInput` as named', () => {
          expect(exportedResources).toContain('CpfFormatterInput');
        });

        it('does not declare `OnFailCallback` nor `CpfFormatterOnFailCallback` type', () => {
          expect(content).not.toContain('type OnFailCallback');
          expect(content).not.toContain('type CpfFormatterOnFailCallback');
        });

        it('exports `CpfFormatterOnFailCallback` as named', () => {
          expect(exportedResources).toContain('CpfFormatterOnFailCallback');
        });

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

        it('exports `CpfValidatorInput` as named', () => {
          expect(exportedResources).toContain('CpfValidatorInput');
        });
      });
    });
  });
});
