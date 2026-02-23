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

describe('package distributions', (): void => {
  beforeAll(
    async (): Promise<void> => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} build --silent`;
    },
    { timeout: 20000 },
  );

  describe('UMD', (): void => {
    describe('file `utils.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/utils.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lacusUtils: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn lacusUtils;`);

          lacusUtils = makeGlobalInstance();
        });

        it('exposes a global `lacusUtils` variable', async (): Promise<void> => {
          expect(lacusUtils).toBeTypeOf('object');
        });

        it('exposes resources through the global `lacusUtils` variable', async (): Promise<void> => {
          expect(lacusUtils.describeType?.name).toBe('describeType');
          expect(lacusUtils.escapeHTML?.name).toBe('escapeHTML');
          expect(lacusUtils.generateRandomSequence?.name).toBe('generateRandomSequence');
        });

        it('exposes a `describeType` function', async (): Promise<void> => {
          const { describeType } = lacusUtils;
          const result = describeType(42);

          expect(result).toBe('integer number');
        });

        it('exposes an `escapeHTML` function', async (): Promise<void> => {
          const { escapeHTML } = lacusUtils;
          const result = escapeHTML('<script>alert("Hello, world!");</script>');

          expect(result).toBe('&lt;script&gt;alert(&quot;Hello, world!&quot;);&lt;/script&gt;');
        });

        it('exposes a `generateRandomSequence` function', async (): Promise<void> => {
          const { generateRandomSequence } = lacusUtils;
          const result = generateRandomSequence(10, 'numeric');

          expect(result).toHaveLength(10);
          expect(result).toMatch(/^\d+$/);
        });
      });
    });

    describe('file `utils.min.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/utils.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lacusUtils: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn lacusUtils;`);

          lacusUtils = makeGlobalInstance();
        });

        it('exposes a global `lacusUtils` helper function', async (): Promise<void> => {
          expect(lacusUtils).toBeTypeOf('object');
        });

        it('exposes resources through the global `lacusUtils` variable', async (): Promise<void> => {
          expect(lacusUtils.describeType).toBeFunction();
          expect(lacusUtils.escapeHTML).toBeFunction();
          expect(lacusUtils.generateRandomSequence).toBeFunction();
        });

        it('exposes a `describeType` function', async (): Promise<void> => {
          const { describeType } = lacusUtils;
          const result = describeType(3.14);

          expect(result).toBe('float number');
        });

        it('exposes an `escapeHTML` function', async (): Promise<void> => {
          const { escapeHTML } = lacusUtils;
          const result = escapeHTML('<script>alert("Hello, world!");</script>');

          expect(result).toBe('&lt;script&gt;alert(&quot;Hello, world!&quot;);&lt;/script&gt;');
        });

        it('exposes a `generateRandomSequence` function', async (): Promise<void> => {
          const { generateRandomSequence } = lacusUtils;
          const result = generateRandomSequence(10, 'alphabetic');

          expect(result).toHaveLength(10);
          expect(result).toMatch(/^[A-Z]+$/);
        });
      });
    });
  });

  describe('CommonJS module (index.cjs)', (): void => {
    const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
    const file = Bun.file(filePath);

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports using module.exports', async (): Promise<void> => {
      await expect(file.text()).resolves.toContain('module.exports = lacusUtils');
    });
  });

  describe('ES Module (index.mjs)', (): void => {
    const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
    const file = Bun.file(filePath);
    let content: string;

    beforeAll(async (): Promise<void> => {
      content = await file.text();
    });

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports `describeType` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('describeType');
    });

    it('exports `escapeHTML` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('escapeHTML');
    });

    it('exports `generateRandomSequence` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('generateRandomSequence');
    });
  });

  describe('TypeScript declarations (index.d.ts)', (): void => {
    const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
    const file = Bun.file(filePath);
    let content: string;

    beforeAll(async (): Promise<void> => {
      content = await file.text();
    });

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('declares `describeType` function', (): void => {
      expect(content).toContain('declare function describeType');
    });

    it('exports `describeType` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('describeType');
    });

    it('declares `escapeHTML` function', (): void => {
      expect(content).toContain('declare function escapeHTML');
    });

    it('exports `escapeHTML` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('escapeHTML');
    });

    it('declares `generateRandomSequence` function', (): void => {
      expect(content).toContain('declare function generateRandomSequence');
    });

    it('exports `generateRandomSequence` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('generateRandomSequence');
    });
  });
});
