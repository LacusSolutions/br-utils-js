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
    describe.each(['cpf-fmt.js', 'cpf-fmt.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfFmt: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfFmt;`);

          cpfFmt = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cpfFmt };

          expect(api).toEqual({
            CpfFormatter: expect.anything(),
            CpfFormatterOptions: expect.anything(),
            CpfFormatterTypeError: expect.anything(),
            CpfFormatterInputTypeError: expect.anything(),
            CpfFormatterOptionsTypeError: expect.anything(),
            CpfFormatterException: expect.anything(),
            CpfFormatterInputLengthException: expect.anything(),
            CpfFormatterOptionsHiddenRangeInvalidException: expect.anything(),
            CpfFormatterOptionsForbiddenKeyCharacterException: expect.anything(),
            CPF_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cpfFmt` function', async () => {
          expect(cpfFmt).toBeFunction();
          expect(cpfFmt.name).toBe('cpfFmt');
        });

        it('exposes other resources through the global `cpfFmt` variable', async () => {
          expect(cpfFmt.CpfFormatter?.name).toBe('CpfFormatter');
          expect(cpfFmt.CpfFormatterOptions?.name).toBe('CpfFormatterOptions');
          expect(cpfFmt.CpfFormatterTypeError?.name).toBe('CpfFormatterTypeError');
          expect(cpfFmt.CpfFormatterInputTypeError?.name).toBe('CpfFormatterInputTypeError');
          expect(cpfFmt.CpfFormatterOptionsTypeError?.name).toBe('CpfFormatterOptionsTypeError');
          expect(cpfFmt.CpfFormatterException?.name).toBe('CpfFormatterException');
          expect(cpfFmt.CpfFormatterInputLengthException?.name).toBe(
            'CpfFormatterInputLengthException',
          );
          expect(cpfFmt.CpfFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CpfFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cpfFmt.CpfFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CpfFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cpfFmt.CPF_LENGTH).toBe(11);
        });

        it('exposes a working `cpfFmt` function', async () => {
          const result = cpfFmt('12345678910');

          expect(result).toBe('123.456.789-10');
        });

        it('exposes an instantiable `CpfFormatter` class', async () => {
          const formatter = new cpfFmt.CpfFormatter({ hidden: true });
          const result = formatter.format('12345678910');

          expect(result).toBe('123.***.***-**');
        });

        it('exposes an instantiable `CpfFormatterOptions` class', async () => {
          const options = new cpfFmt.CpfFormatterOptions({
            hidden: true,
            hiddenKey: 'X',
            dotKey: ' ',
            dashKey: '_',
          });

          expect(options.hidden).toBe(true);
          expect(options.hiddenKey).toBe('X');
          expect(options.dotKey).toBe(' ');
          expect(options.dashKey).toBe('_');
        });

        it('exposes an instantiable `CpfFormatterInputTypeError` class', async () => {
          const error = new cpfFmt.CpfFormatterInputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CPF input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `CpfFormatterOptionsTypeError` class', async () => {
          const error = new cpfFmt.CpfFormatterOptionsTypeError('hidden', 123, 'boolean');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('hidden');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('boolean');
          expect(error.message).toBe(
            'CPF formatting option "hidden" must be of type boolean. Got integer number.',
          );
        });

        it('exposes an instantiable `CpfFormatterOptionsHiddenRangeInvalidException` class', async () => {
          const exception = new cpfFmt.CpfFormatterOptionsHiddenRangeInvalidException(
            'hiddenStart',
            123,
            0,
            10,
          );

          expect(exception.actualInput).toBe(123);
          expect(exception.optionName).toBe('hiddenStart');
          expect(exception.minExpectedValue).toBe(0);
          expect(exception.maxExpectedValue).toBe(10);
          expect(exception.message).toBe(
            'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got 123.',
          );
        });

        it('exposes an instantiable `CpfFormatterOptionsForbiddenKeyCharacterException` class', async () => {
          const exception = new cpfFmt.CpfFormatterOptionsForbiddenKeyCharacterException(
            'dotKey',
            'x',
            ['x'],
          );

          expect(exception.actualInput).toBe('x');
          expect(exception.optionName).toBe('dotKey');
          expect(exception.forbiddenCharacters).toEqual(['x']);
          expect(exception.message).toBe(
            'Value "x" for CPF formatting option "dotKey" contains disallowed characters ("x").',
          );
        });

        it('exposes an instantiable `CpfFormatterInputLengthException` class', async () => {
          const exception = new cpfFmt.CpfFormatterInputLengthException('ABC.123', 'ABC123', 11);

          expect(exception.actualInput).toBe('ABC.123');
          expect(exception.evaluatedInput).toBe('ABC123');
          expect(exception.expectedLength).toBe(11);
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

        expect(content).toContain('index_cjs = Object.assign(cpfFmt');
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

      it('declares `cpfFmt` function', () => {
        expect(content).toContain('declare function cpfFmt');
      });

      it('declares `CpfFormatter` class', () => {
        expect(content).toContain('declare class CpfFormatter');
      });

      it('declares `CpfFormatterOptions` class', () => {
        expect(content).toContain('declare class CpfFormatterOptions');
      });

      it('declares `CpfFormatterTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfFormatterTypeError');
      });

      it('declares `CpfFormatterInputTypeError` class', () => {
        expect(content).toContain('declare class CpfFormatterInputTypeError');
      });

      it('declares `CpfFormatterOptionsTypeError` class', () => {
        expect(content).toContain('declare class CpfFormatterOptionsTypeError');
      });

      it('declares `CpfFormatterException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfFormatterException');
      });

      it('declares `CpfFormatterInputLengthException` class', () => {
        expect(content).toContain('declare class CpfFormatterInputLengthException');
      });

      it('declares `CpfFormatterOptionsHiddenRangeInvalidException` class', () => {
        expect(content).toContain('declare class CpfFormatterOptionsHiddenRangeInvalidException');
      });

      it('declares `CpfFormatterOptionsForbiddenKeyCharacterException` class', () => {
        expect(content).toContain(
          'declare class CpfFormatterOptionsForbiddenKeyCharacterException',
        );
      });

      it('declares `CpfInput` type', () => {
        expect(content).toContain('type CpfInput');
      });

      it('declares `OnFailCallback` type', () => {
        expect(content).toContain('type OnFailCallback');
      });

      it('declares `CpfFormatterOptionsInput` type', () => {
        expect(content).toContain('type CpfFormatterOptionsInput');
      });

      it('declares `CpfFormatterOptionsType` type', () => {
        expect(content).toContain('interface CpfFormatterOptionsType');
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

      it('exports `cpfFmt` as default', () => {
        expect(exportedResources).toContain('cpfFmt as default');
      });

      it('exports `cpfFmt` as named', () => {
        expect(exportedResources).toContain('cpfFmt');
      });

      it('exports `CpfFormatter` as named', () => {
        expect(exportedResources).toContain('CpfFormatter');
      });

      it('exports `CpfFormatterOptions` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptions');
      });

      it('exports `CpfFormatterTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterTypeError');
      });

      it('exports `CpfFormatterInputTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterInputTypeError');
      });

      it('exports `CpfFormatterOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
      });

      it('exports `CpfFormatterException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterException');
      });

      it('exports `CpfFormatterInputLengthException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterInputLengthException');
      });

      it('exports `CpfFormatterOptionsHiddenRangeInvalidException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
      });

      it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
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

      it('declares `cpfFmt` function', () => {
        expect(content).toContain('declare function cpfFmt');
      });

      it('exports `cpfFmt` as default', () => {
        expect(exportedResources).toContain('cpfFmt as default');
      });

      it('exports `cpfFmt` as named', () => {
        expect(exportedResources).toContain('cpfFmt');
      });

      it('declares `CpfFormatter` class', () => {
        expect(content).toContain('declare class CpfFormatter');
      });

      it('exports `CpfFormatter` as named', () => {
        expect(exportedResources).toContain('CpfFormatter');
      });

      it('declares `CpfFormatterOptions` class', () => {
        expect(content).toContain('declare class CpfFormatterOptions');
      });

      it('exports `CpfFormatterOptions` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptions');
      });

      it('declares `CpfFormatterTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CpfFormatterTypeError');
      });

      it('exports `CpfFormatterTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterTypeError');
      });

      it('declares `CpfFormatterInputTypeError` class', () => {
        expect(content).toContain('declare class CpfFormatterInputTypeError');
      });

      it('exports `CpfFormatterInputTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterInputTypeError');
      });

      it('declares `CpfFormatterOptionsTypeError` class', () => {
        expect(content).toContain('declare class CpfFormatterOptionsTypeError');
      });

      it('exports `CpfFormatterOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
      });

      it('declares `CpfFormatterException` abstract class', () => {
        expect(content).toContain('declare abstract class CpfFormatterException');
      });

      it('exports `CpfFormatterException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterException');
      });

      it('declares `CpfFormatterInputLengthException` class', () => {
        expect(content).toContain('declare class CpfFormatterInputLengthException');
      });

      it('exports `CpfFormatterInputLengthException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterInputLengthException');
      });

      it('declares `CpfFormatterOptionsHiddenRangeInvalidException` class', () => {
        expect(content).toContain('declare class CpfFormatterOptionsHiddenRangeInvalidException');
      });

      it('exports `CpfFormatterOptionsHiddenRangeInvalidException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
      });

      it('declares `CpfFormatterOptionsForbiddenKeyCharacterException` class', () => {
        expect(content).toContain(
          'declare class CpfFormatterOptionsForbiddenKeyCharacterException',
        );
      });

      it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
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

      it('declares `OnFailCallback` type', () => {
        expect(content).toContain('type OnFailCallback');
      });

      it('exports `OnFailCallback` as named', () => {
        expect(exportedResources).toContain('OnFailCallback');
      });

      it('declares `CpfFormatterOptionsInput` type', () => {
        expect(content).toContain('type CpfFormatterOptionsInput');
      });

      it('exports `CpfFormatterOptionsInput` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsInput');
      });

      it('declares `CpfFormatterOptionsType` type', () => {
        expect(content).toContain('interface CpfFormatterOptionsType');
      });

      it('exports `CpfFormatterOptionsType` as named', () => {
        expect(exportedResources).toContain('CpfFormatterOptionsType');
      });
    });
  });
});
