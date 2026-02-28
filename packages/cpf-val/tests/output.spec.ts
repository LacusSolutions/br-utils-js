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
    describe.each(['cpf-val.js', 'cpf-val.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfVal: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfVal;`);

          cpfVal = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cpfVal };

          expect(api).toEqual({
            CpfValidator: expect.anything(),
            CpfValidatorTypeError: expect.anything(),
            CpfValidatorInputTypeError: expect.anything(),
            CpfValidatorException: expect.anything(),
            CPF_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cpfVal` function', async () => {
          expect(cpfVal).toBeFunction();
          expect(cpfVal.name).toBe('cpfVal');
        });

        it('exposes other resources through the global `cpfVal` variable', async () => {
          expect(cpfVal.CpfValidator?.name).toBe('CpfValidator');
          expect(cpfVal.CpfValidatorTypeError?.name).toBe('CpfValidatorTypeError');
          expect(cpfVal.CpfValidatorInputTypeError?.name).toBe('CpfValidatorInputTypeError');
          expect(cpfVal.CpfValidatorException?.name).toBe('CpfValidatorException');
          expect(cpfVal.CPF_LENGTH).toBe(11);
        });

        it('exposes a working `cpfVal` helper function', async () => {
          expect(cpfVal('33528612690')).toBe(true);
          expect(cpfVal('33528612691')).toBe(false);
        });

        it('exposes an instantiable `CpfValidator` class', async () => {
          const validator = new cpfVal.CpfValidator();
          const result = validator.isValid('33528612690');

          expect(result).toBe(true);
        });

        it('exposes an instantiable `CpfValidatorInputTypeError` class', async () => {
          const error = new cpfVal.CpfValidatorInputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
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

        expect(content).toContain('index_cjs = Object.assign(cpfVal');
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

      it('declares `cpfVal` function', () => {
        expect(content).toContain('declare function cpfVal');
      });

      it('declares `CpfValidator` class', () => {
        expect(content).toContain('declare class CpfValidator');
      });

      it('declares `CpfValidatorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfValidatorTypeError');
      });

      it('declares `CpfValidatorInputTypeError` class', () => {
        expect(content).toContain('declare class CpfValidatorInputTypeError');
      });

      it('declares `CpfValidatorException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfValidatorException');
      });

      it('declares `CpfInput` type', () => {
        expect(content).toContain('type CpfInput');
      });
    });
  });

  describe('ES Module', () => {
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

      it('exports `cpfVal` as default', () => {
        expect(exportedResources).toContain('cpfVal as default');
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

      it('exports `CPF_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_LENGTH');
      });
    });

    describe('file `index.d.ts`', () => {
      const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
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

      it('declares `cpfVal` function', () => {
        expect(content).toContain('declare function cpfVal');
      });

      it('exports `cpfVal` as default', () => {
        expect(exportedResources).toContain('cpfVal as default');
      });

      it('exports `cpfVal` as named', () => {
        expect(exportedResources).toContain('cpfVal');
      });

      it('declares `CpfValidator` class', () => {
        expect(content).toContain('declare class CpfValidator');
      });

      it('exports `CpfValidator` as named', () => {
        expect(exportedResources).toContain('CpfValidator');
      });

      it('declares `CpfValidatorTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfValidatorTypeError');
      });

      it('exports `CpfValidatorTypeError` as named', () => {
        expect(exportedResources).toContain('CpfValidatorTypeError');
      });

      it('declares `CpfValidatorInputTypeError` class', () => {
        expect(content).toContain('declare class CpfValidatorInputTypeError');
      });

      it('exports `CpfValidatorInputTypeError` as named', () => {
        expect(exportedResources).toContain('CpfValidatorInputTypeError');
      });

      it('declares `CpfValidatorException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfValidatorException');
      });

      it('exports `CpfValidatorException` as named', () => {
        expect(exportedResources).toContain('CpfValidatorException');
      });

      it('declares `CPF_LENGTH` constant', () => {
        expect(content).toContain('declare const CPF_LENGTH');
      });

      it('exports `CPF_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_LENGTH');
      });

      it('declares `CpfInput` type', () => {
        expect(content).toContain('type CpfInput');
      });

      it('exports `CpfInput` as named', () => {
        expect(exportedResources).toContain('CpfInput');
      });
    });
  });
});
