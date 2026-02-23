import Bun, { $ } from 'bun';
import { beforeAll, describe, expect, it } from 'bun:test';

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

describe('package distributions', () => {
  beforeAll(
    async () => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} build --silent`;
    },
    { timeout: 20000 },
  );

  describe('UMD', () => {
    describe('file `cnpj-dv.js`', () => {
      const filePath = Bun.resolveSync('../dist/cnpj-dv.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        it('exposes a global `CnpjCheckDigits` class', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          expect(typeof CnpjCheckDigitsClass).toBe('function');
          expect(CnpjCheckDigitsClass.name).toBe('CnpjCheckDigits');
        });

        it('creates working instances', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          const instance = new CnpjCheckDigitsClass('914157320007');

          expect(instance.first).toBe('9');
          expect(instance.second).toBe('3');
          expect(instance.cnpj).toBe('91415732000793');
        });
      });
    });

    describe('file `cnpj-dv.min.js`', () => {
      const filePath = Bun.resolveSync('../dist/cnpj-dv.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        it('exposes a global `CnpjCheckDigits` class', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          expect(typeof CnpjCheckDigitsClass).toBe('function');
        });

        it('creates working instances', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          const instance = new CnpjCheckDigitsClass('914157320007');

          expect(instance.first).toBe('9');
          expect(instance.second).toBe('3');
          expect(instance.cnpj).toBe('91415732000793');
        });
      });
    });
  });

  describe('CommonJS module (index.cjs)', () => {
    const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
    const file = Bun.file(filePath);

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports using module.exports', async () => {
      await expect(file.text()).resolves.toContain('module.exports = CnpjCheckDigits');
    });
  });

  describe('ES Module (index.mjs)', () => {
    const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
    const file = Bun.file(filePath);
    let content: string;
    let exportedResources: string[];

    beforeAll(async (): Promise<void> => {
      content = await file.text();
      exportedResources = extractExportedResources(content);
    });

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports `CnpjCheckDigits` as default', async () => {
      expect(exportedResources).toContain('CnpjCheckDigits as default');
    });

    it('exports `CnpjCheckDigits` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigits');
    });

    it('exports `CnpjCheckDigitsTypeError` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsTypeError');
    });

    it('exports `CnpjCheckDigitsInputTypeError` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsInputTypeError');
    });

    it('exports `CnpjCheckDigitsException` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsException');
    });

    it('exports `CnpjCheckDigitsInputInvalidException` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsInputInvalidException');
    });

    it('exports `CNPJ_MAX_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CNPJ_MAX_LENGTH');
    });

    it('exports `CNPJ_MIN_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CNPJ_MIN_LENGTH');
    });
  });

  describe('TypeScript declarations (index.d.ts)', () => {
    const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
    const file = Bun.file(filePath);
    let content: string;
    let exportedResources: string[];
    let exportedTypes: string[];

    beforeAll(async (): Promise<void> => {
      content = await file.text();
      exportedResources = extractExportedResources(content);
      exportedTypes = extractExportedTypes(content);
    });

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('declares `CnpjCheckDigits` class', async () => {
      expect(content).toContain('declare class CnpjCheckDigits');
    });

    it('exports `CnpjCheckDigits` as default', async () => {
      expect(exportedResources).toContain('CnpjCheckDigits as default');
    });

    it('exports `CnpjCheckDigits` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigits');
    });

    it('declares `CnpjCheckDigitsTypeError` abstract class', async () => {
      expect(content).toContain('declare abstract class CnpjCheckDigitsTypeError');
    });

    it('exports `CnpjCheckDigitsTypeError` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsTypeError');
    });

    it('declares `CnpjCheckDigitsInputTypeError` class', async () => {
      expect(content).toContain('declare class CnpjCheckDigitsInputTypeError');
    });

    it('exports `CnpjCheckDigitsInputTypeError` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsInputTypeError');
    });

    it('declares `CnpjCheckDigitsException` abstract class', async () => {
      expect(content).toContain('declare abstract class CnpjCheckDigitsException');
    });

    it('exports `CnpjCheckDigitsException` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsException');
    });

    it('declares `CnpjCheckDigitsInputInvalidException` class', async () => {
      expect(content).toContain('declare class CnpjCheckDigitsInputInvalidException');
    });

    it('exports `CnpjCheckDigitsInputInvalidException` as named', async () => {
      expect(exportedResources).toContain('CnpjCheckDigitsInputInvalidException');
    });

    it('declares `CNPJ_MAX_LENGTH` constant', async () => {
      expect(content).toContain('declare const CNPJ_MAX_LENGTH');
    });

    it('exports `CNPJ_MAX_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CNPJ_MAX_LENGTH');
    });

    it('declares `CNPJ_MIN_LENGTH` constant', async () => {
      expect(content).toContain('declare const CNPJ_MIN_LENGTH');
    });

    it('exports `CNPJ_MIN_LENGTH` as named', async () => {
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
