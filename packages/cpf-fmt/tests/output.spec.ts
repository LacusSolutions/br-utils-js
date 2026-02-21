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
    describe('file `cpf-fmt.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cpf-fmt.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfFmt: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfFmt;`);

          cpfFmt = makeGlobalInstance();
        });

        it('exposes a global `cpfFmt` helper function', async (): Promise<void> => {
          expect(cpfFmt).toBeFunction();
          expect(cpfFmt('12345678910')).toBe('123.456.789-10');
        });

        it('exposes resources through the global `cpfFmt` variable', async (): Promise<void> => {
          expect(cpfFmt.CpfFormatter?.name).toBe('CpfFormatter');
          expect(cpfFmt.CpfFormatterOptions?.name).toBe('CpfFormatterOptions');
          expect(cpfFmt.CpfFormatterTypeError?.name).toBe('CpfFormatterTypeError');
          expect(cpfFmt.InputTypeError?.name).toBe('CpfFormatterInputTypeError');
          expect(cpfFmt.OptionsTypeError?.name).toBe('CpfFormatterOptionsTypeError');
          expect(cpfFmt.CpfFormatterException?.name).toBe('CpfFormatterException');
          expect(cpfFmt.InputLengthException?.name).toBe('CpfFormatterInputLengthException');
          expect(cpfFmt.OptionsHiddenRangeInvalidException?.name).toBe(
            'CpfFormatterOptionsHiddenRangeInvalidException',
          );
          expect(cpfFmt.OptionsForbiddenKeyCharacterException?.name).toBe(
            'CpfFormatterOptionsForbiddenKeyCharacterException',
          );
          expect(cpfFmt.CPF_LENGTH).toBe(11);
        });

        it('exposes an instantiable `CpfFormatter` class', async (): Promise<void> => {
          const { CpfFormatter } = cpfFmt;
          const formatter = new CpfFormatter({ hidden: true });
          const formattedCpf = formatter.format('12345678910');

          expect(formattedCpf).toBe('123.***.***-**');
        });

        it('exposes an instantiable `CpfFormatterOptions` class', async (): Promise<void> => {
          const { CpfFormatterOptions } = cpfFmt;
          const options = new CpfFormatterOptions({
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

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cpfFmt;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CPF input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cpfFmt;
          const error = new OptionsTypeError('hidden', 123, 'boolean');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('hidden');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('boolean');
          expect(error.message).toBe(
            'CPF formatting option "hidden" must be of type boolean. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionsHiddenRangeInvalidException` class', async (): Promise<void> => {
          const { OptionsHiddenRangeInvalidException } = cpfFmt;
          const exception = new OptionsHiddenRangeInvalidException('hiddenStart', 123, 0, 10);

          expect(exception.actualInput).toBe(123);
          expect(exception.optionName).toBe('hiddenStart');
          expect(exception.minExpectedValue).toBe(0);
          expect(exception.maxExpectedValue).toBe(10);
          expect(exception.message).toBe(
            'CPF formatting option "hiddenStart" must be an integer between 0 and 10. Got 123.',
          );
        });

        it('exposes an instantiable `OptionsForbiddenKeyCharacterException` class', async (): Promise<void> => {
          const { OptionsForbiddenKeyCharacterException } = cpfFmt;
          const exception = new OptionsForbiddenKeyCharacterException('dotKey', 'x', ['x']);

          expect(exception.actualInput).toBe('x');
          expect(exception.optionName).toBe('dotKey');
          expect(exception.forbiddenCharacters).toEqual(['x']);
          expect(exception.message).toBe(
            'Value "x" for CPF formatting option "dotKey" contains disallowed characters ("x").',
          );
        });

        it('exposes an instantiable `InputLengthException` class', async (): Promise<void> => {
          const { InputLengthException } = cpfFmt;
          const exception = new InputLengthException('ABC.123', 'ABC123', 11);

          expect(exception.actualInput).toBe('ABC.123');
          expect(exception.evaluatedInput).toBe('ABC123');
          expect(exception.expectedLength).toBe(11);
          expect(exception.message).toBe(
            'CPF input "ABC.123" does not contain 11 digits. Got 6 in "ABC123".',
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
      await expect(file.text()).resolves.toContain('module.exports = cpfFmt');
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

    it('exports `cpfFmt` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfFmt as default');
    });

    it('exports `cpfFmt` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfFmt');
    });

    it('exports `CpfFormatter` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatter');
    });

    it('exports `CpfFormatterOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptions');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('exports `CpfFormatterTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterTypeError');
    });

    it('exports `CpfFormatterInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterInputTypeError');
    });

    it('exports `CpfFormatterOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
    });

    it('exports `CpfFormatterException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterException');
    });

    it('exports `CpfFormatterInputLengthException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterInputLengthException');
    });

    it('exports `CpfFormatterOptionsHiddenRangeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
    });

    it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
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

    it('declares `cpfFmt` function', (): void => {
      expect(content).toContain('declare function cpfFmt');
    });

    it('exports `cpfFmt` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfFmt as default');
    });

    it('exports `cpfFmt` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfFmt');
    });

    it('declares `CpfFormatter` class', (): void => {
      expect(content).toContain('declare class CpfFormatter');
    });

    it('exports `CpfFormatter` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatter');
    });

    it('declares `CpfFormatterOptions` class', (): void => {
      expect(content).toContain('declare class CpfFormatterOptions');
    });

    it('exports `CpfFormatterOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptions');
    });

    it('declares `CPF_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CPF_LENGTH');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('declares `CpfFormatterTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfFormatterTypeError');
    });

    it('exports `CpfFormatterTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterTypeError');
    });

    it('declares `CpfFormatterInputTypeError` class', (): void => {
      expect(content).toContain('declare class CpfFormatterInputTypeError');
    });

    it('exports `CpfFormatterInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterInputTypeError');
    });

    it('declares `CpfFormatterOptionsTypeError` class', (): void => {
      expect(content).toContain('declare class CpfFormatterOptionsTypeError');
    });

    it('exports `CpfFormatterOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsTypeError');
    });

    it('declares `CpfFormatterException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfFormatterException');
    });

    it('exports `CpfFormatterException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterException');
    });

    it('declares `CpfFormatterInputLengthException` class', (): void => {
      expect(content).toContain('declare class CpfFormatterInputLengthException');
    });

    it('exports `CpfFormatterInputLengthException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterInputLengthException');
    });

    it('declares `CpfFormatterOptionsHiddenRangeInvalidException` class', (): void => {
      expect(content).toContain('declare class CpfFormatterOptionsHiddenRangeInvalidException');
    });

    it('exports `CpfFormatterOptionsHiddenRangeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsHiddenRangeInvalidException');
    });

    it('declares `CpfFormatterOptionsForbiddenKeyCharacterException` class', (): void => {
      expect(content).toContain('declare class CpfFormatterOptionsForbiddenKeyCharacterException');
    });

    it('exports `CpfFormatterOptionsForbiddenKeyCharacterException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfFormatterOptionsForbiddenKeyCharacterException');
    });
  });
});
