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
    describe.each(['cpf-gen.js', 'cpf-gen.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfGen: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfGen;`);

          cpfGen = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cpfGen };

          expect(api).toEqual({
            CpfGenerator: expect.anything(),
            CpfGeneratorOptions: expect.anything(),
            CpfGeneratorTypeError: expect.anything(),
            CpfGeneratorOptionsTypeError: expect.anything(),
            CpfGeneratorException: expect.anything(),
            CpfGeneratorOptionPrefixInvalidException: expect.anything(),
            CPF_LENGTH: expect.any(Number),
            CPF_PREFIX_MAX_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cpfGen` function', async () => {
          expect(cpfGen).toBeFunction();
          expect(cpfGen.name).toBe('cpfGen');
        });

        it('exposes other resources through the global `cpfGen` variable', async () => {
          expect(cpfGen.CpfGenerator?.name).toBe('CpfGenerator');
          expect(cpfGen.CpfGeneratorOptions?.name).toBe('CpfGeneratorOptions');
          expect(cpfGen.CpfGeneratorTypeError?.name).toBe('CpfGeneratorTypeError');
          expect(cpfGen.CpfGeneratorOptionsTypeError?.name).toBe('CpfGeneratorOptionsTypeError');
          expect(cpfGen.CpfGeneratorException?.name).toBe('CpfGeneratorException');
          expect(cpfGen.CpfGeneratorOptionPrefixInvalidException?.name).toBe(
            'CpfGeneratorOptionPrefixInvalidException',
          );
          expect(cpfGen.CPF_LENGTH).toBe(11);
          expect(cpfGen.CPF_PREFIX_MAX_LENGTH).toBe(9);
        });

        it('exposes a working `cpfGen` function', async () => {
          expect(cpfGen()).toMatch(/^\d{11}$/);
        });

        it('exposes an instantiable `CpfGenerator` class', async () => {
          const generator = new cpfGen.CpfGenerator({ prefix: '111222333' });
          const result = generator.generate({ prefix: '123456' });

          expect(result).toMatch(/^123456\d{5}$/);
        });

        it('exposes an instantiable `CpfGeneratorOptions` class', async () => {
          const options = new cpfGen.CpfGeneratorOptions({
            prefix: '123456',
            format: true,
          });

          expect(options.prefix).toBe('123456');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `CpfGeneratorOptionsTypeError` class', async () => {
          const error = new cpfGen.CpfGeneratorOptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CPF generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `CpfGeneratorOptionPrefixInvalidException` class', async () => {
          const exception = new cpfGen.CpfGeneratorOptionPrefixInvalidException(
            'AB123XYZ',
            'some reason',
          );

          expect(exception.actualInput).toBe('AB123XYZ');
          expect(exception.reason).toBe('some reason');
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
        const content = await file.text();

        expect(content).toContain('index_cjs = Object.assign(cpfGen');
        expect(content).toContain('module.exports = index_cjs');
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

      it('declares `cpfGen` function', () => {
        expect(content).toContain('declare function cpfGen');
      });

      it('declares `CpfGenerator` class', () => {
        expect(content).toContain('declare class CpfGenerator');
      });

      it('declares `CpfGeneratorOptions` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptions');
      });

      it('declares `CpfGeneratorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfGeneratorTypeError');
      });

      it('declares `CpfGeneratorOptionsTypeError` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptionsTypeError');
      });

      it('declares `CpfGeneratorException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfGeneratorException');
      });

      it('declares `CpfGeneratorOptionPrefixInvalidException` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptionPrefixInvalidException');
      });

      it('declares `CpfGeneratorOptionsInput` type', () => {
        expect(content).toContain('type CpfGeneratorOptionsInput');
      });

      it('declares `CpfGeneratorOptionsType` type', () => {
        expect(content).toContain('interface CpfGeneratorOptionsType');
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

      it('exports `cpfGen` as default', () => {
        expect(exportedResources).toContain('cpfGen as default');
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

      it('exports `CPF_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_LENGTH');
      });

      it('exports `CPF_PREFIX_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_PREFIX_MAX_LENGTH');
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

      it('declares `cpfGen` function', () => {
        expect(content).toContain('declare function cpfGen');
      });

      it('exports `cpfGen` as default', () => {
        expect(exportedResources).toContain('cpfGen as default');
      });

      it('exports `cpfGen` as named', () => {
        expect(exportedResources).toContain('cpfGen');
      });

      it('declares `CpfGenerator` class', () => {
        expect(content).toContain('declare class CpfGenerator');
      });

      it('exports `CpfGenerator` as named', () => {
        expect(exportedResources).toContain('CpfGenerator');
      });

      it('declares `CpfGeneratorOptions` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptions');
      });

      it('exports `CpfGeneratorOptions` as named', () => {
        expect(exportedResources).toContain('CpfGeneratorOptions');
      });

      it('declares `CpfGeneratorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfGeneratorTypeError');
      });

      it('exports `CpfGeneratorTypeError` as named', () => {
        expect(exportedResources).toContain('CpfGeneratorTypeError');
      });

      it('declares `CpfGeneratorOptionsTypeError` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptionsTypeError');
      });

      it('exports `CpfGeneratorOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CpfGeneratorOptionsTypeError');
      });

      it('declares `CpfGeneratorException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfGeneratorException');
      });

      it('exports `CpfGeneratorException` as named', () => {
        expect(exportedResources).toContain('CpfGeneratorException');
      });

      it('declares `CpfGeneratorOptionPrefixInvalidException` class', () => {
        expect(content).toContain('declare class CpfGeneratorOptionPrefixInvalidException');
      });

      it('exports `CpfGeneratorOptionPrefixInvalidException` as named', () => {
        expect(exportedResources).toContain('CpfGeneratorOptionPrefixInvalidException');
      });

      it('declares `CPF_LENGTH` constant', () => {
        expect(content).toContain('declare const CPF_LENGTH');
      });

      it('exports `CPF_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_LENGTH');
      });

      it('declares `CPF_PREFIX_MAX_LENGTH` constant', () => {
        expect(content).toContain('declare const CPF_PREFIX_MAX_LENGTH');
      });

      it('exports `CPF_PREFIX_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_PREFIX_MAX_LENGTH');
      });

      it('declares `CpfGeneratorOptionsInput` type', () => {
        expect(content).toContain('type CpfGeneratorOptionsInput');
      });

      it('exports `CpfGeneratorOptionsInput` as named', () => {
        expect(exportedTypes).toContain('CpfGeneratorOptionsInput');
      });

      it('declares `CpfGeneratorOptionsType` type', () => {
        expect(content).toContain('interface CpfGeneratorOptionsType');
      });

      it('exports `CpfGeneratorOptionsType` as named', () => {
        expect(exportedTypes).toContain('CpfGeneratorOptionsType');
      });
    });
  });
});
