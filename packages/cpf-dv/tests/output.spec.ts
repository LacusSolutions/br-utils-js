import Bun, { $ } from 'bun';
import { beforeAll, describe, expect, it } from 'bun:test';

describe('package distributions', () => {
  beforeAll(
    async () => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} dist --silent`;
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

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports CpfCheckDigits as default', async () => {
      const content = await file.text();
      const exportedResources = content
        ?.match(/export \{([^}]+)\}/)
        ?.at(1)
        ?.split(',')
        ?.map((resource) => resource.trim());

      expect(exportedResources).toContain('CpfCheckDigits as default');
    });

    it('exports CpfCheckDigits as named', async () => {
      const content = await file.text();
      const exportedResources = content
        ?.match(/export \{([^}]+)\}/)
        ?.at(1)
        ?.split(',')
        ?.map((resource) => resource.trim());

      expect(exportedResources).toContain('CpfCheckDigits');
    });
  });

  describe('TypeScript declarations (index.d.ts)', () => {
    const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
    const file = Bun.file(filePath);

    it('exists', async () => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('declares the CpfCheckDigits class', async () => {
      const content = await file.text();

      expect(content).toContain('declare class CpfCheckDigits');
    });

    it('exports CpfCheckDigits as default', async () => {
      const content = await file.text();
      const exportedResources = content
        ?.match(/export \{([^}]+)\}/)
        ?.at(1)
        ?.split(',')
        ?.map((resource) => resource.trim());

      expect(exportedResources).toContain('CpfCheckDigits as default');
    });

    it('exports CpfCheckDigits as named', async () => {
      const content = await file.text();
      const exportedResources = content
        ?.match(/export \{([^}]+)\}/)
        ?.at(1)
        ?.split(',')
        ?.map((resource) => resource.trim());

      expect(exportedResources).toContain('CpfCheckDigits');
    });
  });
});
