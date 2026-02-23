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
    describe('file `cpf-dv.js`', () => {
      const filePath = Bun.resolveSync('../dist/cpf-dv.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        it('exposes a global CpfCheckDigits class', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CpfCheckDigits;`);
          const CpfCheckDigitsClass = makeGlobalClass();

          expect(typeof CpfCheckDigitsClass).toBe('function');
          expect(CpfCheckDigitsClass.name).toBe('CpfCheckDigits');
        });

        it('creates working instances', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CpfCheckDigits;`);
          const CpfCheckDigitsClass = makeGlobalClass();

          const instance = new CpfCheckDigitsClass('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cpf).toBe('12345678909');
        });
      });
    });

    describe('cpf-dv.min.js', () => {
      const filePath = Bun.resolveSync('../dist/cpf-dv.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        it('exposes a global CpfCheckDigits class', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CpfCheckDigits;`);
          const CpfCheckDigitsClass = makeGlobalClass();

          expect(typeof CpfCheckDigitsClass).toBe('function');
        });

        it('creates working instances', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CpfCheckDigits;`);
          const CpfCheckDigitsClass = makeGlobalClass();

          const instance = new CpfCheckDigitsClass('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cpf).toBe('12345678909');
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
      await expect(file.text()).resolves.toContain('module.exports = CpfCheckDigits');
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

    it('exports `CpfCheckDigits` as default', async () => {
      expect(exportedResources).toContain('CpfCheckDigits as default');
    });

    it('exports `CpfCheckDigits` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigits');
    });

    it('exports `CpfCheckDigitsTypeError` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsTypeError');
    });

    it('exports `CpfCheckDigitsInputTypeError` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsInputTypeError');
    });

    it('exports `CpfCheckDigitsException` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsException');
    });

    it('exports `CpfCheckDigitsInputInvalidException` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsInputInvalidException');
    });

    it('exports `CPF_MIN_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CPF_MIN_LENGTH');
    });

    it('exports `CPF_MAX_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CPF_MAX_LENGTH');
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

    it('declares `CpfCheckDigits` class', async () => {
      expect(content).toContain('declare class CpfCheckDigits');
    });

    it('exports `CpfCheckDigits` as default', async () => {
      expect(exportedResources).toContain('CpfCheckDigits as default');
    });

    it('exports `CpfCheckDigits` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigits');
    });

    it('declares `CpfCheckDigitsTypeError` abstract class', async () => {
      expect(content).toContain('declare abstract class CpfCheckDigitsTypeError');
    });

    it('exports `CpfCheckDigitsTypeError` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsTypeError');
    });

    it('declares `CpfCheckDigitsInputTypeError` class', async () => {
      expect(content).toContain('declare class CpfCheckDigitsInputTypeError');
    });

    it('exports `CpfCheckDigitsInputTypeError` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsInputTypeError');
    });

    it('declares `CpfCheckDigitsException` abstract class', async () => {
      expect(content).toContain('declare abstract class CpfCheckDigitsException');
    });

    it('exports `CpfCheckDigitsException` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsException');
    });

    it('declares `CpfCheckDigitsInputInvalidException` class', async () => {
      expect(content).toContain('declare class CpfCheckDigitsInputInvalidException');
    });

    it('exports `CpfCheckDigitsInputInvalidException` as named', async () => {
      expect(exportedResources).toContain('CpfCheckDigitsInputInvalidException');
    });

    it('declares `CPF_MIN_LENGTH` constant', async () => {
      expect(content).toContain('declare const CPF_MIN_LENGTH');
    });

    it('exports `CPF_MIN_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CPF_MIN_LENGTH');
    });

    it('declares `CPF_MAX_LENGTH` constant', async () => {
      expect(content).toContain('declare const CPF_MAX_LENGTH');
    });

    it('exports `CPF_MAX_LENGTH` as named', async () => {
      expect(exportedResources).toContain('CPF_MAX_LENGTH');
    });

    it('declares `CpfInput` type', async () => {
      expect(content).toContain('type CpfInput');
    });

    it('exports `CpfInput` as named', async () => {
      expect(exportedTypes).toContain('CpfInput');
    });
  });
});
