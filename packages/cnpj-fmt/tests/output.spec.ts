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

describe('package distributions', (): void => {
  beforeAll(
    async (): Promise<void> => {
      const packageDir = import.meta.dir.replace('/tests', '');

      await $`bun run --cwd ${packageDir} build --silent`;
    },
    { timeout: 20000 },
  );

  describe('UMD', (): void => {
    describe('file `cnpj-fmt.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cnpj-fmt.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjFmt: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjFmt;`);

          cnpjFmt = makeGlobalInstance();
        });

        it('exposes a global `cnpjFmt` helper function', async (): Promise<void> => {
          expect(cnpjFmt).toBeFunction();
          expect(cnpjFmt('01ABC234000X56')).toBe('01.ABC.234/000X-56');
        });

        it('exposes resources through the global `cnpjFmt` variable', async (): Promise<void> => {
          expect(cnpjFmt.CnpjFormatter?.name).toBe('CnpjFormatter');
          expect(cnpjFmt.CnpjFormatterOptions?.name).toBe('CnpjFormatterOptions');
          expect(cnpjFmt.CnpjFormatterTypeError?.name).toBe('CnpjFormatterTypeError');
          expect(cnpjFmt.InputTypeError?.name).toBe('CnpjFormatterInputTypeError');
          expect(cnpjFmt.OptionsTypeError?.name).toBe('CnpjFormatterOptionsTypeError');
          expect(cnpjFmt.CnpjFormatterException?.name).toBe('CnpjFormatterException');
          expect(cnpjFmt.InputLengthException?.name).toBe('CnpjFormatterInputLengthException');
          expect(cnpjFmt.OptionsHiddenRangeInvalidException?.name).toBe(
            'CnpjFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cnpjFmt.OptionsForbiddenKeyCharacterException?.name).toBe(
            'CnpjFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cnpjFmt.CNPJ_LENGTH).toBe(14);
        });

        it('exposes an instantiable `CnpjFormatter` class', async (): Promise<void> => {
          const { CnpjFormatter } = cnpjFmt;
          const formatter = new CnpjFormatter({ hidden: true });
          const formattedCnpj = formatter.format('AB123XYZ000123');

          expect(formattedCnpj).toBe('AB.123.***/****-**');
        });

        it('exposes an instantiable `CnpjFormatterOptions` class', async (): Promise<void> => {
          const { CnpjFormatterOptions } = cnpjFmt;
          const options = new CnpjFormatterOptions({
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

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cnpjFmt;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjFmt;
          const error = new OptionsTypeError('hidden', 123, 'boolean');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('hidden');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('boolean');
          expect(error.message).toBe(
            'CNPJ formatting option "hidden" must be of type boolean. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionsHiddenRangeInvalidException` class', async (): Promise<void> => {
          const { OptionsHiddenRangeInvalidException } = cnpjFmt;
          const exception = new OptionsHiddenRangeInvalidException('hiddenStart', 123, 0, 13);

          expect(exception.actualInput).toBe(123);
          expect(exception.optionName).toBe('hiddenStart');
          expect(exception.minExpectedValue).toBe(0);
          expect(exception.maxExpectedValue).toBe(13);
          expect(exception.message).toBe(
            'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 123.',
          );
        });

        it('exposes an instantiable `OptionsForbiddenKeyCharacterException` class', async (): Promise<void> => {
          const { OptionsForbiddenKeyCharacterException } = cnpjFmt;
          const exception = new OptionsForbiddenKeyCharacterException('dotKey', 'x', ['x']);

          expect(exception.actualInput).toBe('x');
          expect(exception.optionName).toBe('dotKey');
          expect(exception.forbiddenCharacters).toEqual(['x']);
          expect(exception.message).toBe(
            'Value "x" for CNPJ formatting option "dotKey" contains disallowed characters ("x").',
          );
        });

        it('exposes an instantiable `InputLengthException` class', async (): Promise<void> => {
          const { InputLengthException } = cnpjFmt;
          const exception = new InputLengthException('ABC.123', 'ABC123', 14);

          expect(exception.actualInput).toBe('ABC.123');
          expect(exception.evaluatedInput).toBe('ABC123');
          expect(exception.expectedLength).toBe(14);
          expect(exception.message).toBe(
            'CNPJ input "ABC.123" does not contain 14 characters. Got 6 in "ABC123".',
          );
        });
      });
    });

    describe('file `cnpj-fmt.min.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cnpj-fmt.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjFmt: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjFmt;`);

          cnpjFmt = makeGlobalInstance();
        });

        it('exposes a global `cnpjFmt` helper function', async (): Promise<void> => {
          expect(cnpjFmt).toBeFunction();
          expect(cnpjFmt('01ABC234000X56')).toBe('01.ABC.234/000X-56');
        });

        it('exposes resources through the global `cnpjFmt` variable', async (): Promise<void> => {
          expect(cnpjFmt.CnpjFormatter).toBeTypeOf('function');
          expect(cnpjFmt.CnpjFormatterOptions).toBeTypeOf('function');
          expect(cnpjFmt.CnpjFormatterTypeError).toBeTypeOf('function');
          expect(cnpjFmt.InputTypeError).toBeTypeOf('function');
          expect(cnpjFmt.OptionsTypeError).toBeTypeOf('function');
          expect(cnpjFmt.CnpjFormatterException).toBeTypeOf('function');
          expect(cnpjFmt.InputLengthException).toBeTypeOf('function');
          expect(cnpjFmt.OptionsHiddenRangeInvalidException).toBeTypeOf('function');
          expect(cnpjFmt.OptionsForbiddenKeyCharacterException).toBeTypeOf('function');
          expect(cnpjFmt.CNPJ_LENGTH).toBe(14);
        });

        it('exposes an instantiable `CnpjFormatter` class', async (): Promise<void> => {
          const { CnpjFormatter } = cnpjFmt;
          const formatter = new CnpjFormatter({ hidden: true });
          const formattedCnpj = formatter.format('AB123XYZ000123');

          expect(formattedCnpj).toBe('AB.123.***/****-**');
        });

        it('exposes an instantiable `CnpjFormatterOptions` class', async (): Promise<void> => {
          const { CnpjFormatterOptions } = cnpjFmt;
          const options = new CnpjFormatterOptions({
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

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cnpjFmt;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjFmt;
          const error = new OptionsTypeError('hidden', 123, 'boolean');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('hidden');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('boolean');
          expect(error.message).toBe(
            'CNPJ formatting option "hidden" must be of type boolean. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionsHiddenRangeInvalidException` class', async (): Promise<void> => {
          const { OptionsHiddenRangeInvalidException } = cnpjFmt;
          const exception = new OptionsHiddenRangeInvalidException('hiddenStart', 123, 0, 13);

          expect(exception.actualInput).toBe(123);
          expect(exception.optionName).toBe('hiddenStart');
          expect(exception.minExpectedValue).toBe(0);
          expect(exception.maxExpectedValue).toBe(13);
          expect(exception.message).toBe(
            'CNPJ formatting option "hiddenStart" must be an integer between 0 and 13. Got 123.',
          );
        });

        it('exposes an instantiable `OptionsForbiddenKeyCharacterException` class', async (): Promise<void> => {
          const { OptionsForbiddenKeyCharacterException } = cnpjFmt;
          const exception = new OptionsForbiddenKeyCharacterException('dotKey', 'x', ['x']);

          expect(exception.actualInput).toBe('x');
          expect(exception.optionName).toBe('dotKey');
          expect(exception.forbiddenCharacters).toEqual(['x']);
          expect(exception.message).toBe(
            'Value "x" for CNPJ formatting option "dotKey" contains disallowed characters ("x").',
          );
        });

        it('exposes an instantiable `InputLengthException` class', async (): Promise<void> => {
          const { InputLengthException } = cnpjFmt;
          const exception = new InputLengthException('ABC.123', 'ABC123', 14);

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

  describe('CommonJS module (index.cjs)', (): void => {
    const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
    const file = Bun.file(filePath);

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports using module.exports', async (): Promise<void> => {
      await expect(file.text()).resolves.toContain('module.exports = cnpjFmt');
    });
  });

  describe('ES Module (index.mjs)', (): void => {
    const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
    const file = Bun.file(filePath);
    let content: string;
    let exportedResources: string[];

    beforeAll(async (): Promise<void> => {
      content = await file.text();
      exportedResources = extractExportedResources(content);
    });

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('exports `cnpjFmt` as default', (): void => {
      expect(exportedResources).toContain('cnpjFmt as default');
    });

    it('exports `cnpjFmt` as named', (): void => {
      expect(exportedResources).toContain('cnpjFmt');
    });

    it('exports `CnpjFormatter` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatter');
    });

    it('exports `CnpjFormatterOptions` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptions');
    });

    it('exports `CNPJ_LENGTH` as named', (): void => {
      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('exports `CnpjFormatterTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterTypeError');
    });

    it('exports `CnpjFormatterInputTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterInputTypeError');
    });

    it('exports `CnpjFormatterOptionsTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
    });

    it('exports `CnpjFormatterException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterException');
    });

    it('exports `CnpjFormatterInputLengthException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterInputLengthException');
    });

    it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
    });

    it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
    });
  });

  describe('TypeScript declarations (index.d.ts)', (): void => {
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

    it('exists', async (): Promise<void> => {
      await expect(file.exists()).resolves.toBe(true);
    });

    it('declares `cnpjFmt` function', (): void => {
      expect(content).toContain('declare function cnpjFmt');
    });

    it('exports `cnpjFmt` function as default', (): void => {
      expect(exportedResources).toContain('cnpjFmt as default');
    });

    it('exports `cnpjFmt` function as named', (): void => {
      expect(exportedResources).toContain('cnpjFmt');
    });

    it('declares `CnpjFormatter` class', (): void => {
      expect(content).toContain('declare class CnpjFormatter');
    });

    it('exports `CnpjFormatter` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatter');
    });

    it('declares `CnpjFormatterOptions` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterOptions');
    });

    it('exports `CnpjFormatterOptions` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptions');
    });

    it('declares `CNPJ_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CNPJ_LENGTH');
    });

    it('exports `CNPJ_LENGTH` as named', (): void => {
      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('declares `CnpjFormatterTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjFormatterTypeError');
    });

    it('exports `CnpjFormatterTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterTypeError');
    });

    it('declares `CnpjFormatterInputTypeError` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterInputTypeError');
    });

    it('exports `CnpjFormatterInputTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterInputTypeError');
    });

    it('declares `CnpjFormatterOptionsTypeError` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterOptionsTypeError');
    });

    it('exports `CnpjFormatterOptionsTypeError` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsTypeError');
    });

    it('declares `CnpjFormatterException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjFormatterException');
    });

    it('exports `CnpjFormatterException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterException');
    });

    it('declares `CnpjFormatterInputLengthException` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterInputLengthException');
    });

    it('exports `CnpjFormatterInputLengthException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterInputLengthException');
    });

    it('declares `CnpjFormatterOptionsHiddenRangeInvalidException` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterOptionsHiddenRangeInvalidException');
    });

    it('exports `CnpjFormatterOptionsHiddenRangeInvalidException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsHiddenRangeInvalidException');
    });

    it('declares `CnpjFormatterOptionsForbiddenKeyCharacterException` class', (): void => {
      expect(content).toContain('declare class CnpjFormatterOptionsForbiddenKeyCharacterException');
    });

    it('exports `CnpjFormatterOptionsForbiddenKeyCharacterException` as named', (): void => {
      expect(exportedResources).toContain('CnpjFormatterOptionsForbiddenKeyCharacterException');
    });

    it('declares `CnpjFormatterOptionsInput` type', (): void => {
      expect(content).toContain('type CnpjFormatterOptionsInput');
    });

    it('exports `CnpjFormatterOptionsInput` as named', (): void => {
      expect(exportedTypes).toContain('CnpjFormatterOptionsInput');
    });

    it('declares `CnpjFormatterOptionsType` type', (): void => {
      expect(content).toContain('interface CnpjFormatterOptionsType');
    });

    it('exports `CnpjFormatterOptionsType` as named', (): void => {
      expect(exportedTypes).toContain('CnpjFormatterOptionsType');
    });

    it('declares `CnpjInput` type', (): void => {
      expect(content).toContain('type CnpjInput');
    });

    it('exports `CnpjInput` as named', (): void => {
      expect(exportedTypes).toContain('CnpjInput');
    });

    it('declares `OnFailCallback` type', (): void => {
      expect(content).toContain('type OnFailCallback');
    });

    it('exports `OnFailCallback` as named', (): void => {
      expect(exportedTypes).toContain('OnFailCallback');
    });
  });
});
