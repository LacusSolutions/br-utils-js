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
    describe.each(['cnpj-val.js', 'cnpj-val.min.js'])('file `%s`', (fileName): void => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjVal: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjVal;`);

          cnpjVal = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cnpjVal };

          expect(api).toEqual({
            CnpjValidator: expect.anything(),
            CnpjValidatorOptions: expect.anything(),
            CnpjValidatorTypeError: expect.anything(),
            CnpjValidatorInputTypeError: expect.anything(),
            CnpjValidatorOptionsTypeError: expect.anything(),
            CnpjValidatorException: expect.anything(),
            CnpjValidatorOptionTypeInvalidException: expect.anything(),
            CNPJ_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cnpjVal` helper function', async (): Promise<void> => {
          expect(cnpjVal).toBeFunction();
          expect(cnpjVal.name).toBe('cnpjVal');
        });

        it('exposes other resources through the global `cnpjVal` variable', async (): Promise<void> => {
          expect(cnpjVal.CnpjValidator?.name).toBe('CnpjValidator');
          expect(cnpjVal.CnpjValidatorOptions?.name).toBe('CnpjValidatorOptions');
          expect(cnpjVal.CnpjValidatorTypeError?.name).toBe('CnpjValidatorTypeError');
          expect(cnpjVal.CnpjValidatorInputTypeError?.name).toBe('CnpjValidatorInputTypeError');
          expect(cnpjVal.CnpjValidatorOptionsTypeError?.name).toBe('CnpjValidatorOptionsTypeError');
          expect(cnpjVal.CnpjValidatorException?.name).toBe('CnpjValidatorException');
          expect(cnpjVal.CnpjValidatorOptionTypeInvalidException?.name).toBe(
            'CnpjValidatorOptionTypeInvalidException',
          );
          expect(cnpjVal.CNPJ_LENGTH).toBe(14);
        });

        it('exposes a working `cnpjVal` helper function', async (): Promise<void> => {
          expect(cnpjVal('9JN7MGLJZXIO50')).toBe(true);
          expect(cnpjVal('9JN7MGLJZXIO51')).toBe(false);
        });

        it('exposes an instantiable `CnpjValidator` class', async (): Promise<void> => {
          const validator = new cnpjVal.CnpjValidator({ type: 'numeric' });
          const result = validator.isValid('12651319934215');

          expect(result).toBe(true);
        });

        it('exposes an instantiable `CnpjValidatorOptions` class', async (): Promise<void> => {
          const options = new cnpjVal.CnpjValidatorOptions({
            caseSensitive: false,
            type: 'numeric',
          });

          expect(options.caseSensitive).toBe(false);
          expect(options.type).toBe('numeric');
        });

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const error = new cnpjVal.CnpjValidatorInputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const error = new cnpjVal.CnpjValidatorOptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ validator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionTypeInvalidException` class', async (): Promise<void> => {
          const exception = new cnpjVal.CnpjValidatorOptionTypeInvalidException('string', [
            'numeric',
          ]);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
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

        expect(content).toContain('index_cjs = Object.assign(cnpjVal');
        expect(content).toContain('module.exports = index_cjs');
      });
    });

    describe('file `index.d.ts`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;

      beforeAll(async () => {
        content = await file.text();
      });

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjVal` function', (): void => {
        expect(content).toContain('declare function cnpjVal');
      });

      it('declares `CnpjValidator` class', (): void => {
        expect(content).toContain('declare class CnpjValidator');
      });

      it('declares `CnpjValidatorOptions` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptions');
      });

      it('declares `CnpjValidatorTypeError` abstract class', (): void => {
        expect(content).toContain('declare abstract class CnpjValidatorTypeError');
      });

      it('declares `CnpjValidatorInputTypeError` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorInputTypeError');
      });

      it('declares `CnpjValidatorOptionsTypeError` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptionsTypeError');
      });

      it('declares `CnpjValidatorException` abstract class', (): void => {
        expect(content).toContain('declare abstract class CnpjValidatorException');
      });

      it('declares `CnpjValidatorOptionTypeInvalidException` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptionTypeInvalidException');
      });

      it('declares `CnpjInput` type', (): void => {
        expect(content).toContain('type CnpjInput');
      });

      it('declares `CnpjType` type', (): void => {
        expect(content).toContain('type CnpjType');
      });

      it('declares `CnpjValidatorOptionsInput` type', (): void => {
        expect(content).toContain('type CnpjValidatorOptionsInput');
      });

      it('declares `CnpjValidatorOptionsType` type', (): void => {
        expect(content).toContain('interface CnpjValidatorOptionsType');
      });
    });
  });

  describe('ES Module', (): void => {
    function extractExported(what: 'resources' | 'types', content: string): string[] {
      const regex = what === 'resources' ? /export \{([^}]+)\}/ : /export type \{([^}]+)\}/;

      return (
        content
          ?.match(regex)
          ?.at(1)
          ?.split(',')
          ?.map((resource) => resource.trim()) ?? []
      );
    }

    function extractExportedResources(content: string): string[] {
      return extractExported('resources', content);
    }

    function extractExportedTypes(content: string): string[] {
      return extractExported('types', content);
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

      it('exports `cnpjVal` as default', (): void => {
        expect(exportedResources).toContain('cnpjVal as default');
      });

      it('exports `cnpjVal` as named', (): void => {
        expect(exportedResources).toContain('cnpjVal');
      });

      it('exports `CnpjValidator` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidator');
      });

      it('exports `CnpjValidatorOptions` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptions');
      });

      it('exports `CnpjValidatorTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorTypeError');
      });

      it('exports `CnpjValidatorInputTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorInputTypeError');
      });

      it('exports `CnpjValidatorOptionsTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
      });

      it('exports `CnpjValidatorException` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorException');
      });

      it('exports `CnpjValidatorOptionTypeInvalidException` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
      });

      it('exports `CNPJ_LENGTH` as named', (): void => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });
    });

    describe('file `index.d.ts`', (): void => {
      const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;
      let exportedResources: string[];
      let exportedTypes: string[];

      beforeAll(async () => {
        content = await file.text();
        exportedResources = extractExportedResources(content);
        exportedTypes = extractExportedTypes(content);
      });

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjVal` function', (): void => {
        expect(content).toContain('declare function cnpjVal');
      });

      it('exports `cnpjVal` as default', (): void => {
        expect(exportedResources).toContain('cnpjVal as default');
      });

      it('exports `cnpjVal` as named', (): void => {
        expect(exportedResources).toContain('cnpjVal');
      });

      it('declares `CnpjValidator` class', (): void => {
        expect(content).toContain('declare class CnpjValidator');
      });

      it('exports `CnpjValidator` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidator');
      });

      it('declares `CnpjValidatorOptions` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptions');
      });

      it('exports `CnpjValidatorOptions` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptions');
      });

      it('declares `CnpjValidatorTypeError` abstract class', (): void => {
        expect(content).toContain('declare abstract class CnpjValidatorTypeError');
      });

      it('exports `CnpjValidatorTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorTypeError');
      });

      it('declares `CnpjValidatorInputTypeError` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorInputTypeError');
      });

      it('exports `CnpjValidatorInputTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorInputTypeError');
      });

      it('declares `CnpjValidatorOptionsTypeError` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptionsTypeError');
      });

      it('exports `CnpjValidatorOptionsTypeError` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
      });

      it('declares `CnpjValidatorException` abstract class', (): void => {
        expect(content).toContain('declare abstract class CnpjValidatorException');
      });

      it('exports `CnpjValidatorException` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorException');
      });

      it('declares `CnpjValidatorOptionTypeInvalidException` class', (): void => {
        expect(content).toContain('declare class CnpjValidatorOptionTypeInvalidException');
      });

      it('exports `CnpjValidatorOptionTypeInvalidException` as named', (): void => {
        expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
      });

      it('declares `CNPJ_LENGTH` constant', (): void => {
        expect(content).toContain('declare const CNPJ_LENGTH');
      });

      it('exports `CNPJ_LENGTH` as named', (): void => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });

      it('declares `CnpjInput` type', (): void => {
        expect(content).toContain('type CnpjInput');
      });

      it('exports `CnpjInput` as named', (): void => {
        expect(exportedTypes).toContain('CnpjInput');
      });

      it('declares `CnpjType` type', (): void => {
        expect(content).toContain('type CnpjType');
      });

      it('exports `CnpjType` as named', (): void => {
        expect(exportedTypes).toContain('CnpjType');
      });

      it('declares `CnpjValidatorOptionsInput` type', (): void => {
        expect(content).toContain('type CnpjValidatorOptionsInput');
      });

      it('exports `CnpjValidatorOptionsInput` as named', (): void => {
        expect(exportedTypes).toContain('CnpjValidatorOptionsInput');
      });

      it('declares `CnpjValidatorOptionsType` type', (): void => {
        expect(content).toContain('interface CnpjValidatorOptionsType');
      });

      it('exports `CnpjValidatorOptionsType` as named', (): void => {
        expect(exportedTypes).toContain('CnpjValidatorOptionsType');
      });
    });
  });
});
