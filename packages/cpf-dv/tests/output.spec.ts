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
    describe.each(['cpf-dv.js', 'cpf-dv.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let DefaultClass: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CpfCheckDigits;`);

          DefaultClass = makeGlobalClass();
        });

        it('follows the API', () => {
          const api = { ...DefaultClass };

          expect(api).toEqual({
            CpfCheckDigits: expect.anything(),
            CpfCheckDigitsTypeError: expect.anything(),
            CpfCheckDigitsInputTypeError: expect.anything(),
            CpfCheckDigitsException: expect.anything(),
            CpfCheckDigitsInputInvalidException: expect.anything(),
            CpfCheckDigitsInputLengthException: expect.anything(),
            CPF_MIN_LENGTH: expect.any(Number),
            CPF_MAX_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `CpfCheckDigits` class', async () => {
          expect(DefaultClass).toBeFunction();
          expect(DefaultClass.name).toBe('CpfCheckDigits');
        });

        it('exposes other resources through the global variable', async () => {
          expect(DefaultClass.CpfCheckDigits?.name).toBe('CpfCheckDigits');
          expect(DefaultClass.CpfCheckDigitsTypeError?.name).toBe('CpfCheckDigitsTypeError');
          expect(DefaultClass.CpfCheckDigitsInputTypeError?.name).toBe(
            'CpfCheckDigitsInputTypeError',
          );
          expect(DefaultClass.CpfCheckDigitsException?.name).toBe('CpfCheckDigitsException');
          expect(DefaultClass.CpfCheckDigitsInputInvalidException?.name).toBe(
            'CpfCheckDigitsInputInvalidException',
          );
          expect(DefaultClass.CpfCheckDigitsInputLengthException?.name).toBe(
            'CpfCheckDigitsInputLengthException',
          );
          expect(DefaultClass.CPF_MIN_LENGTH).toBe(9);
          expect(DefaultClass.CPF_MAX_LENGTH).toBe(11);
        });

        it('exposes an instantiable `CpfCheckDigits` class (root)', async () => {
          const instance = new DefaultClass('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cpf).toBe('12345678909');
        });

        it('exposes an instantiable `CpfCheckDigits` class (inner)', async () => {
          const instance = new DefaultClass.CpfCheckDigits('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cpf).toBe('12345678909');
        });

        it('exposes an instantiable `CpfCheckDigitsInputTypeError` class', async () => {
          const instance = new DefaultClass.CpfCheckDigitsInputTypeError(123, 'string');

          expect(instance.actualInput).toBe(123);
          expect(instance.actualType).toBe('integer number');
          expect(instance.expectedType).toBe('string');
          expect(instance.message).toBe('CPF input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `CpfCheckDigitsInputInvalidException` class', async () => {
          const instance = new DefaultClass.CpfCheckDigitsInputInvalidException(
            '123',
            'some reason',
          );

          expect(instance.actualInput).toBe('123');
          expect(instance.reason).toBe('some reason');
          expect(instance.message).toBe('CPF input "123" is invalid. some reason');
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

        expect(content).toContain('index_cjs = Object.assign(CpfCheckDigits');
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

      it('declares `CpfCheckDigits` class', () => {
        expect(content).toContain('declare class CpfCheckDigits');
      });

      it('declares `CpfCheckDigitsTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfCheckDigitsTypeError');
      });

      it('declares `CpfCheckDigitsInputTypeError` class', () => {
        expect(content).toContain('declare class CpfCheckDigitsInputTypeError');
      });

      it('declares `CpfCheckDigitsException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfCheckDigitsException');
      });

      it('declares `CpfCheckDigitsInputInvalidException` class', () => {
        expect(content).toContain('declare class CpfCheckDigitsInputInvalidException');
      });

      it('declares `CpfInput` type', () => {
        expect(content).toContain('type CpfInput');
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

      it('exports `CpfCheckDigits` as default', () => {
        expect(exportedResources).toContain('CpfCheckDigits as default');
      });

      it('exports `CpfCheckDigits` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigits');
      });

      it('exports `CpfCheckDigitsTypeError` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsTypeError');
      });

      it('exports `CpfCheckDigitsInputTypeError` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsInputTypeError');
      });

      it('exports `CpfCheckDigitsException` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsException');
      });

      it('exports `CpfCheckDigitsInputInvalidException` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsInputInvalidException');
      });

      it('exports `CPF_MIN_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_MIN_LENGTH');
      });

      it('exports `CPF_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_MAX_LENGTH');
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

      it('declares `CpfCheckDigits` class', () => {
        expect(content).toContain('declare class CpfCheckDigits');
      });

      it('exports `CpfCheckDigits` as default', () => {
        expect(exportedResources).toContain('CpfCheckDigits as default');
      });

      it('exports `CpfCheckDigits` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigits');
      });

      it('declares `CpfCheckDigitsTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfCheckDigitsTypeError');
      });

      it('exports `CpfCheckDigitsTypeError` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsTypeError');
      });

      it('declares `CpfCheckDigitsInputTypeError` class', () => {
        expect(content).toContain('declare class CpfCheckDigitsInputTypeError');
      });

      it('exports `CpfCheckDigitsInputTypeError` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsInputTypeError');
      });

      it('declares `CpfCheckDigitsException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfCheckDigitsException');
      });

      it('exports `CpfCheckDigitsException` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsException');
      });

      it('declares `CpfCheckDigitsInputInvalidException` class', () => {
        expect(content).toContain('declare class CpfCheckDigitsInputInvalidException');
      });

      it('exports `CpfCheckDigitsInputInvalidException` as named', () => {
        expect(exportedResources).toContain('CpfCheckDigitsInputInvalidException');
      });

      it('declares `CPF_MIN_LENGTH` constant', () => {
        expect(content).toContain('declare const CPF_MIN_LENGTH');
      });

      it('exports `CPF_MIN_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_MIN_LENGTH');
      });

      it('declares `CPF_MAX_LENGTH` constant', () => {
        expect(content).toContain('declare const CPF_MAX_LENGTH');
      });

      it('exports `CPF_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CPF_MAX_LENGTH');
      });

      it('declares `CpfInput` type', () => {
        expect(content).toContain('type CpfInput');
      });

      it('exports `CpfInput` as named', () => {
        expect(exportedTypes).toContain('CpfInput');
      });
    });
  });
});
