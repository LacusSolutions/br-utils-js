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
    describe.each(['cnpj-fmt.js', 'cnpj-fmt.min.js'])('file `%s`', (fileName) => {
      const filePath = Bun.resolveSync(`../dist/${fileName}`, import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjFmt: any;

        beforeAll(async () => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjFmt;`);

          cnpjFmt = makeGlobalInstance();
        });

        it('follows the API', () => {
          const api = { ...cnpjFmt };

          expect(api).toEqual({
            CnpjFormatter: expect.anything(),
            CnpjFormatterOptions: expect.anything(),
            CnpjFormatterTypeError: expect.anything(),
            CnpjFormatterInputTypeError: expect.anything(),
            CnpjFormatterOptionsTypeError: expect.anything(),
            CnpjFormatterException: expect.anything(),
            CnpjFormatterInputLengthException: expect.anything(),
            CnpjFormatterOptionsHiddenRangeInvalidException: expect.anything(),
            CnpjFormatterOptionsForbiddenKeyCharacterException: expect.anything(),
            CNPJ_LENGTH: expect.any(Number),
          });
        });

        it('exposes a global `cnpjFmt` function', async () => {
          expect(cnpjFmt).toBeFunction();
          expect(cnpjFmt.name).toBe('cnpjFmt');
        });

        it('exposes other resources through the global `cnpjFmt` variable', async () => {
          expect(cnpjFmt.CnpjFormatter?.name).toBe('CnpjFormatter');
          expect(cnpjFmt.CnpjFormatterOptions?.name).toBe('CnpjFormatterOptions');
          expect(cnpjFmt.CnpjFormatterTypeError?.name).toBe('CnpjFormatterTypeError');
          expect(cnpjFmt.CnpjFormatterInputTypeError?.name).toBe('CnpjFormatterInputTypeError');
          expect(cnpjFmt.CnpjFormatterOptionsTypeError?.name).toBe('CnpjFormatterOptionsTypeError');
          expect(cnpjFmt.CnpjFormatterException?.name).toBe('CnpjFormatterException');
          expect(cnpjFmt.CnpjFormatterInputLengthException?.name).toBe(
            'CnpjFormatterInputLengthException',
          );
          expect(cnpjFmt.CnpjFormatterOptionsHiddenRangeInvalidException?.name).toBe(
            'CnpjFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cnpjFmt.CnpjFormatterOptionsForbiddenKeyCharacterException?.name).toBe(
            'CnpjFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cnpjFmt.CNPJ_LENGTH).toBe(14);
        });

        it('exposes a working `cnpjFmt` function', async () => {
          const result = cnpjFmt('01ABC234000X56', { slashKey: '|' });

          expect(result).toBe('01.ABC.234|000X-56');
        });

        it('exposes an instantiable `CnpjFormatter` class', async () => {
          const formatter = new cnpjFmt.CnpjFormatter({ hidden: true });
          const result = formatter.format('AB123XYZ000123');

          expect(result).toBe('AB.123.***/****-**');
        });

        it('exposes an instantiable `CnpjFormatterOptions` class', async () => {
          const options = new cnpjFmt.CnpjFormatterOptions({
            hidden: true,
            hiddenKey: 'X',
            dotKey: ' ',
            slashKey: '|',
            dashKey: '_',
          });

          expect(options.hidden).toBe(true);
          expect(options.hiddenKey).toBe('X');
          expect(options.dotKey).toBe(' ');
          expect(options.slashKey).toBe('|');
          expect(options.dashKey).toBe('_');
        });

        it('exposes an instantiable `CnpjFormatterInputTypeError` class', async () => {
          const error = new cnpjFmt.CnpjFormatterInputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `CnpjFormatterOptionsTypeError` class', async () => {
          const error = new cnpjFmt.CnpjFormatterOptionsTypeError('hidden', 123, 'boolean');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('hidden');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('boolean');
          expect(error.message).toBe(
            'CNPJ formatting option "hidden" must be of type boolean. Got integer number.',
          );
        });

        it('exposes an instantiable `CnpjFormatterOptionsHiddenRangeInvalidException` class', async () => {
          const exception = new cnpjFmt.CnpjFormatterOptionsHiddenRangeInvalidException(
            'hiddenStart',
            123,
            0,
            13,
          );

          expect(exception.actualInput).toBe(123);
          expect(exception.optionName).toBe('hiddenStart');
          expect(exception.minExpectedValue).toBe(0);
          expect(exception.maxExpectedValue).toBe(13);
          expect(exception.message).toBe(
            'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 123.',
          );
        });

        it('exposes an instantiable `CnpjFormatterOptionsForbiddenKeyCharacterException` class', async () => {
          const exception = new cnpjFmt.CnpjFormatterOptionsForbiddenKeyCharacterException(
            'dotKey',
            'x',
            ['x'],
          );

          expect(exception.actualInput).toBe('x');
          expect(exception.optionName).toBe('dotKey');
          expect(exception.forbiddenCharacters).toEqual(['x']);
          expect(exception.message).toBe(
            'Value "x" for CNPJ formatting option "dotKey" contains disallowed characters ("x").',
          );
        });

        it('exposes an instantiable `CnpjFormatterInputLengthException` class', async () => {
          const exception = new cnpjFmt.CnpjFormatterInputLengthException('ABC.123', 'ABC123', 14);

          expect(exception.actualInput).toBe('ABC.123');
          expect(exception.evaluatedInput).toBe('ABC123');
          expect(exception.expectedLength).toBe(14);
          expect(exception.message).toBe(
            'CNPJ input "ABC.123" does not contain 14 characters. Got 6 in "ABC123".',
          );
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

        expect(content).toContain('index_cjs = Object.assign(cnpjFmt');
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

      it('declares `cnpjFmt` function', () => {
        expect(content).toContain('declare function cnpjFmt');
      });

      it('declares `CnpjFormatter` class', () => {
        expect(content).toContain('declare class CnpjFormatter');
      });

      it('declares `CnpjFormatterOptions` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptions');
      });

      it('declares `CnpjFormatterTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjFormatterTypeError');
      });

      it('declares `CnpjFormatterInputTypeError` class', () => {
        expect(content).toContain('declare class CnpjFormatterInputTypeError');
      });

      it('declares `CnpjFormatterOptionsTypeError` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptionsTypeError');
      });

      it('declares `CnpjFormatterException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjFormatterException');
      });

      it('declares `CnpjFormatterInputLengthException` class', () => {
        expect(content).toContain('declare class CnpjFormatterInputLengthException');
      });

      it('declares `CnpjFormatterOptionsHiddenRangeInvalidException` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptionsHiddenRangeInvalidException');
      });

      it('declares `CnpjFormatterOptionsForbiddenKeyCharacterException` class', () => {
        expect(content).toContain(
          'declare class CnpjFormatterOptionsForbiddenKeyCharacterException',
        );
      });

      it('declares `CnpjFormatterOptionsInput` type', () => {
        expect(content).toContain('type CnpjFormatterOptionsInput');
      });

      it('declares `CnpjFormatterOptionsType` type', () => {
        expect(content).toContain('interface CnpjFormatterOptionsType');
      });

      it('declares `CnpjInput` type', () => {
        expect(content).toContain('type CnpjInput');
      });

      it('declares `OnFailCallback` type', () => {
        expect(content).toContain('type OnFailCallback');
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

      it('exports `cnpjFmt` as default', () => {
        expect(exportedResources).toContain('cnpjFmt as default');
      });

      it('exports `cnpjFmt` as named', () => {
        expect(exportedResources).toContain('cnpjFmt');
      });

      it('exports `CnpjFormatter` as named', () => {
        expect(exportedResources).toContain('CnpjFormatter');
      });

      it('exports `CnpjFormatterOptions` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptions');
      });

      it('exports `CNPJ_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });

      it('exports `CnpjFormatterTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterTypeError');
      });

      it('exports `CnpjFormatterInputTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterInputTypeError');
      });

      it('exports `CnpjFormatterOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
      });

      it('exports `CnpjFormatterException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterException');
      });

      it('exports `CnpjFormatterInputLengthException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterInputLengthException');
      });

      it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
      });

      it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
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

      it('declares `cnpjFmt` function', () => {
        expect(content).toContain('declare function cnpjFmt');
      });

      it('exports `cnpjFmt` function as default', () => {
        expect(exportedResources).toContain('cnpjFmt as default');
      });

      it('exports `cnpjFmt` function as named', () => {
        expect(exportedResources).toContain('cnpjFmt');
      });

      it('declares `CnpjFormatter` class', () => {
        expect(content).toContain('declare class CnpjFormatter');
      });

      it('exports `CnpjFormatter` as named', () => {
        expect(exportedResources).toContain('CnpjFormatter');
      });

      it('declares `CnpjFormatterOptions` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptions');
      });

      it('exports `CnpjFormatterOptions` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptions');
      });

      it('declares `CNPJ_LENGTH` constant', () => {
        expect(content).toContain('declare const CNPJ_LENGTH');
      });

      it('exports `CNPJ_LENGTH` as named', () => {
        expect(exportedResources).toContain('CNPJ_LENGTH');
      });

      it('declares `CnpjFormatterTypeError` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjFormatterTypeError');
      });

      it('exports `CnpjFormatterTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterTypeError');
      });

      it('declares `CnpjFormatterInputTypeError` class', () => {
        expect(content).toContain('declare class CnpjFormatterInputTypeError');
      });

      it('exports `CnpjFormatterInputTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterInputTypeError');
      });

      it('declares `CnpjFormatterOptionsTypeError` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptionsTypeError');
      });

      it('exports `CnpjFormatterOptionsTypeError` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
      });

      it('declares `CnpjFormatterException` abstract class', () => {
        expect(content).toContain('declare abstract class CnpjFormatterException');
      });

      it('exports `CnpjFormatterException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterException');
      });

      it('declares `CnpjFormatterInputLengthException` class', () => {
        expect(content).toContain('declare class CnpjFormatterInputLengthException');
      });

      it('exports `CnpjFormatterInputLengthException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterInputLengthException');
      });

      it('declares `CnpjFormatterOptionsHiddenRangeInvalidException` class', () => {
        expect(content).toContain('declare class CnpjFormatterOptionsHiddenRangeInvalidException');
      });

      it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
      });

      it('declares `CnpjFormatterOptionsForbiddenKeyCharacterException` class', () => {
        expect(content).toContain(
          'declare class CnpjFormatterOptionsForbiddenKeyCharacterException',
        );
      });

      it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', () => {
        expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
      });

      it('declares `CnpjFormatterOptionsInput` type', () => {
        expect(content).toContain('type CnpjFormatterOptionsInput');
      });

      it('exports `CnpjFormatterOptionsInput` as named', () => {
        expect(exportedTypes).toContain('CnpjFormatterOptionsInput');
      });

      it('declares `CnpjFormatterOptionsType` type', () => {
        expect(content).toContain('interface CnpjFormatterOptionsType');
      });

      it('exports `CnpjFormatterOptionsType` as named', () => {
        expect(exportedTypes).toContain('CnpjFormatterOptionsType');
      });

      it('declares `CnpjInput` type', () => {
        expect(content).toContain('type CnpjInput');
      });

      it('exports `CnpjInput` as named', () => {
        expect(exportedTypes).toContain('CnpjInput');
      });

      it('declares `OnFailCallback` type', () => {
        expect(content).toContain('type OnFailCallback');
      });

      it('exports `OnFailCallback` as named', () => {
        expect(exportedTypes).toContain('OnFailCallback');
      });
    });
  });
});
