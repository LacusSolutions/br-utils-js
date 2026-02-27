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
    describe.each(['utils.js', 'utils.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lacusUtils: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn lacusUtils;`);

          lacusUtils = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...lacusUtils };

          expect(api).toEqual({
            describeType: expect.anything(),
            escapeHTML: expect.anything(),
            generateRandomSequence: expect.anything(),
          });
        });

        it('exposes a global `lacusUtils` variable', async () => {
          expect(lacusUtils).toBeTypeOf('object');
        });

        it('exposes resources through the global `lacusUtils` variable', async () => {
          expect(lacusUtils.describeType?.name).toBe('describeType');
          expect(lacusUtils.escapeHTML?.name).toBe('escapeHTML');
          expect(lacusUtils.generateRandomSequence?.name).toBe('generateRandomSequence');
        });

        it('exposes a `describeType` function', async () => {
          const { describeType } = lacusUtils;
          const result = describeType(42);

          expect(result).toBe('integer number');
        });

        it('exposes an `escapeHTML` function', async () => {
          const { escapeHTML } = lacusUtils;
          const result = escapeHTML('<script>alert("Hello, world!");</script>');

          expect(result).toBe('&lt;script&gt;alert(&quot;Hello, world!&quot;);&lt;/script&gt;');
        });

        it('exposes a `generateRandomSequence` function', async () => {
          const { generateRandomSequence } = lacusUtils;
          const result = generateRandomSequence(10, 'numeric');

          expect(result).toHaveLength(10);
          expect(result).toMatch(/^\d+$/);
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
        await expect(file.text()).resolves.toContain('module.exports = lacusUtils');
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

      it('declares `lacusUtils` object', () => {
        expect(content).toContain('declare const lacusUtils');
      });

      it.skip('declares `Nullable` type', () => {
        // This should not be included, because it's not used by the actual codebase
        expect(content).toContain('type Nullable');
      });

      it('declares `SequenceType` type', () => {
        expect(content).toContain('type SequenceType');
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

      it('exports `describeType` function as named', () => {
        expect(exportedResources).toContain('describeType');
      });

      it('exports `escapeHTML` function as named', () => {
        expect(exportedResources).toContain('escapeHTML');
      });

      it('exports `generateRandomSequence` function as named', () => {
        expect(exportedResources).toContain('generateRandomSequence');
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

      it('declares `describeType` function', () => {
        expect(content).toContain('declare function describeType');
      });

      it('exports `describeType` function as named', () => {
        expect(exportedResources).toContain('describeType');
      });

      it('declares `escapeHTML` function', () => {
        expect(content).toContain('declare function escapeHTML');
      });

      it('exports `escapeHTML` function as named', () => {
        expect(exportedResources).toContain('escapeHTML');
      });

      it('declares `generateRandomSequence` function', () => {
        expect(content).toContain('declare function generateRandomSequence');
      });

      it('exports `generateRandomSequence` function as named', () => {
        expect(exportedResources).toContain('generateRandomSequence');
      });

      it('declares `SequenceType` type', () => {
        expect(content).toContain('type SequenceType');
      });

      it('exports `SequenceType` type as named', () => {
        expect(exportedTypes).toContain('SequenceType');
      });

      it('declares `Nullable` type', () => {
        expect(content).toContain('type Nullable');
      });

      it('exports `Nullable` type as named', () => {
        expect(exportedTypes).toContain('Nullable');
      });
    });
  });
});
