import Bun, { $ } from 'bun';
import { beforeAll, describe, expect, it } from 'bun:test';

function extractExportedResources(content: string): string[] {
  return (
    content
      ?.match(/export \{([^}]+)\}/)
      ?.at(1)
      ?.split(',')
      ?.map((resource) => resource.trim()) ?? []
  );
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
        it('exposes a global CnpjCheckDigits class', async () => {
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

          const instance = new CnpjCheckDigitsClass('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cnpj).toBe('12345678909');
        });
      });
    });

    describe('cnpj-dv.min.js', () => {
      const filePath = Bun.resolveSync('../dist/cnpj-dv.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        it('exposes a global CnpjCheckDigits class', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          expect(typeof CnpjCheckDigitsClass).toBe('function');
        });

        it('creates working instances', async () => {
          const fileContent = await file.text();
          const makeGlobalClass = new Function(`${fileContent}\nreturn CnpjCheckDigits;`);
          const CnpjCheckDigitsClass = makeGlobalClass();

          const instance = new CnpjCheckDigitsClass('123456789');

          expect(instance.first).toBe('0');
          expect(instance.second).toBe('9');
          expect(instance.cnpj).toBe('12345678909');
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

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports CnpjCheckDigits as default', async () => {
      const content = await file.text();
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjCheckDigits as default');
    });

    it('exports CnpjCheckDigits as named', async () => {
      const content = await file.text();
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjCheckDigits');
    });
  });

  describe('TypeScript declarations (index.d.ts)', () => {
    const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
    const file = Bun.file(filePath);

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('declares the CnpjCheckDigits class', async () => {
      const content = await file.text();

      expect(content).toContain('declare class CnpjCheckDigits');
    });

    it('exports CnpjCheckDigits as default', async () => {
      const content = await file.text();
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjCheckDigits as default');
    });

    it('exports CnpjCheckDigits as named', async () => {
      const content = await file.text();
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjCheckDigits');
    });
  });
});
