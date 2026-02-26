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
    describe.each(['cnpj-dv.js', 'cnpj-dv.min.js'])('file `%s`', (fileName) => {
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
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);

          DefaultClass = makeGlobalClass();
        });

        it('follows the API', () => {
          const api = { ...DefaultClass };

          expect(api).toEqual(
            expect.objectContaining({
              CnpjCheckDigits: expect.anything(),
              CnpjCheckDigitsTypeError: expect.anything(),
              CnpjCheckDigitsInputTypeError: expect.anything(),
              CnpjCheckDigitsException: expect.anything(),
              CnpjCheckDigitsInputInvalidException: expect.anything(),
              CNPJ_MIN_LENGTH: expect.any(Number),
              CNPJ_MAX_LENGTH: expect.any(Number),
            }),
          );
        });

        it('exposes a global `CnpjCheckDigits` class', async () => {
          expect(DefaultClass).toBeFunction();
          expect(DefaultClass.name).toBe('CnpjCheckDigits');
        });

        it('exposes other resources through the global variable', async (): Promise<void> => {
          expect(DefaultClass.CnpjCheckDigits?.name).toBe('CnpjCheckDigits');
          expect(DefaultClass.CnpjCheckDigitsTypeError?.name).toBe('CnpjCheckDigitsTypeError');
          expect(DefaultClass.CnpjCheckDigitsInputTypeError?.name).toBe(
            'CnpjCheckDigitsInputTypeError',
          );
          expect(DefaultClass.CnpjCheckDigitsException?.name).toBe('CnpjCheckDigitsException');
          expect(DefaultClass.CnpjCheckDigitsInputInvalidException?.name).toBe(
            'CnpjCheckDigitsInputInvalidException',
          );
          expect(DefaultClass.CNPJ_MIN_LENGTH).toBe(12);
          expect(DefaultClass.CNPJ_MAX_LENGTH).toBe(14);
        });

        it('exposes an instantiable `CnpjCheckDigits` class (root)', async () => {
          const instance = new DefaultClass('914157320007');

          expect(instance.first).toBe('9');
          expect(instance.second).toBe('3');
          expect(instance.cnpj).toBe('91415732000793');
        });

        it('exposes an instantiable `CnpjCheckDigits` class (inner)', async () => {
          const instance = new DefaultClass.CnpjCheckDigits('914157320007');

          expect(instance.first).toBe('9');
          expect(instance.second).toBe('3');
          expect(instance.cnpj).toBe('91415732000793');
        });

        it('exposes an instantiable `CnpjCheckDigitsInputTypeError` class', async () => {
          const instance = new DefaultClass.CnpjCheckDigitsInputTypeError(123, 'string');

          expect(instance.actualInput).toBe(123);
          expect(instance.actualType).toBe('integer number');
          expect(instance.expectedType).toBe('string');
          expect(instance.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `CnpjCheckDigitsInputInvalidException` class', async () => {
          const instance = new DefaultClass.CnpjCheckDigitsInputInvalidException(
            '123',
            'some reason',
          );

          expect(instance.actualInput).toBe('123');
          expect(instance.reason).toBe('some reason');
          expect(instance.message).toBe('CNPJ input "123" is invalid. some reason');
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

        expect(content).toContain('index_cjs = Object.assign(CnpjCheckDigits');
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

      it('declares `CnpjCheckDigits` class as default', () => {
        expect(content).toContain('declare const _default: typeof CnpjCheckDigit');
      });

      it('declares `CnpjCheckDigits` class', () => {
        expect(content).toContain('declare class CnpjCheckDigits');
      });

      it('declares `CnpjCheckDigitsTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjCheckDigitsTypeError');
      });

      it('declares `CnpjCheckDigitsInputTypeError` class', () => {
        expect(content).toContain('declare class CnpjCheckDigitsInputTypeError');
      });

      it('declares `CnpjCheckDigitsException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjCheckDigitsException');
      });

      it('declares `CnpjCheckDigitsInputInvalidException` class', () => {
        expect(content).toContain('declare class CnpjCheckDigitsInputInvalidException');
      });

      it('declares `CnpjInput` type', (): void => {
        expect(content).toContain('type CnpjInput');
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

      it('exports `CnpjCheckDigits` as default', () => {
        expect(exportedResources).toContain('CnpjCheckDigits as default');
      });

      it('exports `CnpjCheckDigits` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigits');
      });

      it('exports `CnpjCheckDigitsTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsTypeError');
      });

      it('exports `CnpjCheckDigitsInputTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsInputTypeError');
      });

      it('exports `CnpjCheckDigitsException` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsException');
      });

      it('exports `CnpjCheckDigitsInputInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsInputInvalidException');
      });

      it('exports `CNPJ_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_MAX_LENGTH');
      });

      it('exports `CNPJ_MIN_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_MIN_LENGTH');
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

      it('declares `CnpjCheckDigits` class', () => {
        expect(content).toContain('declare class CnpjCheckDigits');
      });

      it('exports `CnpjCheckDigits` as default', () => {
        expect(exportedResources).toContain('CnpjCheckDigits as default');
      });

      it('exports `CnpjCheckDigits` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigits');
      });

      it('declares `CnpjCheckDigitsTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjCheckDigitsTypeError');
      });

      it('exports `CnpjCheckDigitsTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsTypeError');
      });

      it('declares `CnpjCheckDigitsInputTypeError` class', () => {
        expect(content).toContain('declare class CnpjCheckDigitsInputTypeError');
      });

      it('exports `CnpjCheckDigitsInputTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsInputTypeError');
      });

      it('declares `CnpjCheckDigitsException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjCheckDigitsException');
      });

      it('exports `CnpjCheckDigitsException` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsException');
      });

      it('declares `CnpjCheckDigitsInputInvalidException` class', () => {
        expect(content).toContain('declare class CnpjCheckDigitsInputInvalidException');
      });

      it('exports `CnpjCheckDigitsInputInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjCheckDigitsInputInvalidException');
      });

      it('declares `CNPJ_MAX_LENGTH` constant', () => {
        expect(content).toContain('declare const CNPJ_MAX_LENGTH');
      });

      it('exports `CNPJ_MAX_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_MAX_LENGTH');
      });

      it('declares `CNPJ_MIN_LENGTH` constant', () => {
        expect(content).toContain('declare const CNPJ_MIN_LENGTH');
      });

      it('exports `CNPJ_MIN_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_MIN_LENGTH');
      });

      it('declares `CnpjInput` type', (): void => {
        expect(content).toContain('type CnpjInput');
      });

      it('exports `CnpjInput` as named', (): void => {
        expect(exportedTypes).toContain('CnpjInput');
      });
    });
  });
});
