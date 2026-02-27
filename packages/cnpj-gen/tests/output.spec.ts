import Bun, { $ } from 'bun';
import { beforeAll, describe, expect, it } from 'bun:test';

describe('package distributions', () => {
  beforeAll(
    async () => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} build --silent`;
    },
    { timeout: 20000 },
  );

  describe('UMD', () => {
    describe.each(['cnpj-gen.js', 'cnpj-gen.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjGen: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjGen;`);

          cnpjGen = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cnpjGen };

          expect(api).toEqual({
            CnpjGenerator: expect.anything(),
            CnpjGeneratorOptions: expect.anything(),
            CnpjGeneratorTypeError: expect.anything(),
            CnpjGeneratorOptionsTypeError: expect.anything(),
            CnpjGeneratorException: expect.anything(),
            CnpjGeneratorOptionPrefixInvalidException: expect.anything(),
            CnpjGeneratorOptionTypeInvalidException: expect.anything(),
            CNPJ_PREFIX_MAX_LENGTH: expect.any(Number),
            CNPJ_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cnpjGen` function', async () => {
          expect(cnpjGen).toBeFunction();
          expect(cnpjGen.name).toBe('cnpjGen');
        });

        it('exposes other resources through the global `cnpjGen` variable', async () => {
          expect(cnpjGen.CnpjGenerator?.name).toBe('CnpjGenerator');
          expect(cnpjGen.CnpjGeneratorOptions?.name).toBe('CnpjGeneratorOptions');
          expect(cnpjGen.CnpjGeneratorTypeError?.name).toBe('CnpjGeneratorTypeError');
          expect(cnpjGen.CnpjGeneratorOptionsTypeError?.name).toBe('CnpjGeneratorOptionsTypeError');
          expect(cnpjGen.CnpjGeneratorException?.name).toBe('CnpjGeneratorException');
          expect(cnpjGen.CnpjGeneratorOptionPrefixInvalidException?.name).toBe(
            'CnpjGeneratorOptionPrefixInvalidException',
          );
          expect(cnpjGen.CnpjGeneratorOptionTypeInvalidException?.name).toBe(
            'CnpjGeneratorOptionTypeInvalidException',
          );
          expect(cnpjGen.CNPJ_PREFIX_MAX_LENGTH).toBe(12);
          expect(cnpjGen.CNPJ_LENGTH).toBe(14);
        });

        it('exposes a working `cnpjGen` function', async () => {
          const result = cnpjGen({ type: 'numeric' });

          expect(result).toMatch(/^\d{14}$/);
        });

        it('exposes an instantiable `CnpjGenerator` class', async () => {
          const generator = new cnpjGen.CnpjGenerator({ type: 'alphabetic' });
          const result = generator.generate({ prefix: '12345' });

          expect(result).toMatch(/^12345[A-Z]{7}\d{2}$/);
        });

        it('exposes an instantiable `CnpjGeneratorOptions` class', async () => {
          const options = new cnpjGen.CnpjGeneratorOptions({
            prefix: 'AB123XYZ',
            type: 'numeric',
            format: true,
          });

          expect(options.prefix).toBe('AB123XYZ');
          expect(options.type).toBe('numeric');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `CnpjGeneratorOptionsTypeError` class', async () => {
          const error = new cnpjGen.CnpjGeneratorOptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `CnpjGeneratorOptionPrefixInvalidException` class', async () => {
          const exception = new cnpjGen.CnpjGeneratorOptionPrefixInvalidException(
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
          const exception = new cnpjGen.CnpjGeneratorOptionTypeInvalidException('string', [
            'numeric',
          ]);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
          expect(exception.message).toBe(
            'CNPJ generator option "type" accepts only the following values: "numeric". Got "string".',
          );
        });
      });
    });
  });

  describe('CommonJS', () => {
    describe('file `index.cjs`', () => {
      const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('exports using module.exports', async () => {
        await expect(file.text()).resolves.toContain('index_cjs = Object.assign(cnpjGen');
        await expect(file.text()).resolves.toContain('module.exports = index_cjs');
      });
    });

    describe('file `index.d.cts`', () => {
      const filePath = Bun.resolveSync('../dist/index.d.cts', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;

      beforeAll(async () => {
        content = await file.text();
      });

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjGen` function', () => {
        expect(content).toContain('declare function cnpjGen');
      });

      it('declares `CnpjGenerator` class', () => {
        expect(content).toContain('declare class CnpjGenerator');
      });

      it('declares `CnpjGeneratorOptions` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptions');
      });

      it('declares `CnpjGeneratorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjGeneratorTypeError');
      });

      it('declares `CnpjGeneratorOptionsTypeError` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionsTypeError');
      });

      it('declares `CnpjGeneratorException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjGeneratorException');
      });

      it('declares `CnpjGeneratorOptionPrefixInvalidException` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionPrefixInvalidException');
      });

      it('declares `CnpjGeneratorOptionTypeInvalidException` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionTypeInvalidException');
      });

      it('declares `CnpjType` type', () => {
        expect(content).toContain('type CnpjType');
      });

      it('declares `CnpjGeneratorOptionsInput` type', () => {
        expect(content).toContain('type CnpjGeneratorOptionsInput');
      });

      it('declares `CnpjGeneratorOptionsType` type', () => {
        expect(content).toContain('interface CnpjGeneratorOptionsType');
      });
    });
  });

  describe('ES Module', () => {
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

    describe('file `index.mjs`', () => {
      const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
      const file = Bun.file(filePath);
      let content: string;
      let exportedResources: string[];

      beforeAll(async () => {
        content = await file.text();
        exportedResources = extractExportedResources(content);
      });

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('exports `cnpjGen` as default', () => {
        expect(exportedResources).toContain('cnpjGen as default');
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

      it('exports `CNPJ_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });

      it('exports `CNPJ_PREFIX_MAX_LENGTH` constant as named', () => {
        expect(exportedResources).toContain('CNPJ_PREFIX_MAX_LENGTH');
      });
    });

    describe('file `index.d.ts`', () => {
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

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      it('declares `cnpjGen` function', () => {
        expect(content).toContain('declare function cnpjGen');
      });

      it('exports `cnpjGen` as default', () => {
        expect(exportedResources).toContain('cnpjGen as default');
      });

      it('exports `cnpjGen` as named', () => {
        expect(exportedResources).toContain('cnpjGen');
      });

      it('declares `CnpjGenerator` class', () => {
        expect(content).toContain('declare class CnpjGenerator');
      });

      it('exports `CnpjGenerator` as named', () => {
        expect(exportedResources).toContain('CnpjGenerator');
      });

      it('declares `CnpjGeneratorOptions` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptions');
      });

      it('exports `CnpjGeneratorOptions` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorOptions');
      });

      it('declares `CnpjGeneratorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjGeneratorTypeError');
      });

      it('exports `CnpjGeneratorTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorTypeError');
      });

      it('declares `CnpjGeneratorOptionsTypeError` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionsTypeError');
      });

      it('exports `CnpjGeneratorOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorOptionsTypeError');
      });

      it('declares `CnpjGeneratorException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjGeneratorException');
      });

      it('exports `CnpjGeneratorException` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorException');
      });

      it('declares `CnpjGeneratorOptionPrefixInvalidException` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionPrefixInvalidException');
      });

      it('exports `CnpjGeneratorOptionPrefixInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorOptionPrefixInvalidException');
      });

      it('declares `CnpjGeneratorOptionTypeInvalidException` class', () => {
        expect(content).toContain('declare class CnpjGeneratorOptionTypeInvalidException');
      });

      it('exports `CnpjGeneratorOptionTypeInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjGeneratorOptionTypeInvalidException');
      });

      it('declares `CNPJ_LENGTH` constant', () => {
        expect(content).toContain('declare const CNPJ_LENGTH');
      });

      it('exports `CNPJ_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });

      it('declares `CNPJ_PREFIX_MAX_LENGTH` constant', () => {
        expect(content).toContain('declare const CNPJ_PREFIX_MAX_LENGTH');
      });

      it('exports `CNPJ_PREFIX_MAX_LENGTH` constant as named', () => {
        expect(exportedResources).toContain('CNPJ_PREFIX_MAX_LENGTH');
      });

      it('declares `CnpjType` type', () => {
        expect(content).toContain('type CnpjType');
      });

      it('exports `CnpjType` as named', () => {
        expect(exportedTypes).toContain('CnpjType');
      });

      it('declares `CnpjGeneratorOptionsInput` type', () => {
        expect(content).toContain('type CnpjGeneratorOptionsInput');
      });

      it('exports `CnpjGeneratorOptionsInput` as named', () => {
        expect(exportedTypes).toContain('CnpjGeneratorOptionsInput');
      });

      it('declares `CnpjGeneratorOptionsType` type', () => {
        expect(content).toContain('interface CnpjGeneratorOptionsType');
      });

      it('exports `CnpjGeneratorOptionsType` as named', () => {
        expect(exportedTypes).toContain('CnpjGeneratorOptionsType');
      });
    });
  });
});
