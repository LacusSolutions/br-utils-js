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
    describe('file `cnpj-val.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cnpj-val.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjVal: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjVal;`);

          cnpjVal = makeGlobalInstance();
        });

        it('exposes a global `cnpjVal` helper function', async (): Promise<void> => {
          expect(cnpjVal).toBeFunction();
          expect(cnpjVal('9JN7MGLJZXIO50')).toBe(true);
          expect(cnpjVal('9JN7MGLJZXIO51')).toBe(false);
        });

        it('exposes resources through the global `cnpjVal` variable', async (): Promise<void> => {
          expect(cnpjVal.CnpjValidator?.name).toBe('CnpjValidator');
          expect(cnpjVal.CnpjValidatorOptions?.name).toBe('CnpjValidatorOptions');
          expect(cnpjVal.CnpjValidatorTypeError?.name).toBe('CnpjValidatorTypeError');
          expect(cnpjVal.InputTypeError?.name).toBe('CnpjValidatorInputTypeError');
          expect(cnpjVal.OptionsTypeError?.name).toBe('CnpjValidatorOptionsTypeError');
          expect(cnpjVal.CnpjValidatorException?.name).toBe('CnpjValidatorException');
          expect(cnpjVal.OptionTypeInvalidException?.name).toBe(
            'CnpjValidatorOptionTypeInvalidException',
          );
          expect(cnpjVal.CNPJ_LENGTH).toBe(14);
        });

        it('exposes an instantiable `CnpjValidator` class', async (): Promise<void> => {
          const { CnpjValidator } = cnpjVal;
          const validator = new CnpjValidator({ type: 'numeric' });
          const isValidCnpj = validator.isValid('12651319934215');

          expect(isValidCnpj).toBe(true);
        });

        it('exposes an instantiable `CnpjValidatorOptions` class', async (): Promise<void> => {
          const { CnpjValidatorOptions } = cnpjVal;
          const options = new CnpjValidatorOptions({
            caseSensitive: false,
            type: 'numeric',
          });

          expect(options.caseSensitive).toBe(false);
          expect(options.type).toBe('numeric');
        });

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cnpjVal;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjVal;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ validator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionTypeInvalidException` class', async (): Promise<void> => {
          const { OptionTypeInvalidException } = cnpjVal;
          const exception = new OptionTypeInvalidException('string', ['numeric']);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
          expect(exception.message).toBe(
            'CNPJ validator option "type" accepts only the following values: "numeric". Got "string".',
          );
        });
      });
    });

    describe('file `cnpj-val.min.js`', () => {
      const filePath = Bun.resolveSync('../dist/cnpj-val.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjVal: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjVal;`);

          cnpjVal = makeGlobalInstance();
        });

        it('exposes a global `cnpjVal` helper function', async () => {
          expect(cnpjVal).toBeFunction();
          expect(cnpjVal('9JN7MGLJZXIO50')).toBe(true);
          expect(cnpjVal('9JN7MGLJZXIO51')).toBe(false);
        });

        it('exposes resources through the global `cnpjVal` variable', async (): Promise<void> => {
          expect(cnpjVal.CnpjValidator).toBeTypeOf('function');
          expect(cnpjVal.CnpjValidatorOptions).toBeTypeOf('function');
          expect(cnpjVal.CnpjValidatorTypeError).toBeTypeOf('function');
          expect(cnpjVal.InputTypeError).toBeTypeOf('function');
          expect(cnpjVal.OptionsTypeError).toBeTypeOf('function');
          expect(cnpjVal.CnpjValidatorException).toBeTypeOf('function');
          expect(cnpjVal.OptionTypeInvalidException).toBeTypeOf('function');
          expect(cnpjVal.CNPJ_LENGTH).toBe(14);
        });

        it('exposes an instantiable `CnpjValidator` class', async (): Promise<void> => {
          const { CnpjValidator } = cnpjVal;
          const validator = new CnpjValidator();
          const isValidCnpj = validator.isValid('AJQLBWZV6Y8L34');

          expect(isValidCnpj).toBe(true);
        });

        it('exposes an instantiable `CnpjValidatorOptions` class', async (): Promise<void> => {
          const { CnpjValidatorOptions } = cnpjVal;
          const options = new CnpjValidatorOptions({
            caseSensitive: false,
            type: 'numeric',
          });

          expect(options.caseSensitive).toBe(false);
          expect(options.type).toBe('numeric');
        });

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cnpjVal;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CNPJ input must be of type string. Got integer number.');
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjVal;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ validator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionTypeInvalidException` class', async (): Promise<void> => {
          const { OptionTypeInvalidException } = cnpjVal;
          const exception = new OptionTypeInvalidException('string', ['numeric']);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
          expect(exception.message).toBe(
            'CNPJ validator option "type" accepts only the following values: "numeric". Got "string".',
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
      await expect(file.text()).resolves.toContain('module.exports = cnpjVal');
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

    it('exports `cnpjVal` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjVal as default');
    });

    it('exports `cnpjVal` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjVal');
    });

    it('exports `CnpjValidator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidator');
    });

    it('exports `CnpjValidatorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptions');
    });

    it('exports `CNPJ_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('exports `CnpjValidatorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorTypeError');
    });

    it('exports `CnpjValidatorInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorInputTypeError');
    });

    it('exports `CnpjValidatorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
    });

    it('exports `CnpjValidatorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorException');
    });

    it('exports `CnpjValidatorOptionTypeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
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

    it('declares the `cnpjVal` function', (): void => {
      expect(content).toContain('declare function cnpjVal');
    });

    it('exports `cnpjVal` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjVal as default');
    });

    it('exports `cnpjVal` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjVal');
    });

    it('declares the `CnpjValidator` class', (): void => {
      expect(content).toContain('declare class CnpjValidator');
    });

    it('exports `CnpjValidator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidator');
    });

    it('declares the `CnpjValidatorOptions` class', (): void => {
      expect(content).toContain('declare class CnpjValidatorOptions');
    });

    it('exports `CnpjValidatorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptions');
    });

    it('declares the `CNPJ_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CNPJ_LENGTH');
    });

    it('exports `CNPJ_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('declares the `CnpjValidatorTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjValidatorTypeError');
    });

    it('exports `CnpjValidatorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorTypeError');
    });

    it('declares the `CnpjValidatorInputTypeError` class', (): void => {
      expect(content).toContain('declare class CnpjValidatorInputTypeError');
    });

    it('exports `CnpjValidatorInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorInputTypeError');
    });

    it('declares the `CnpjValidatorOptionsTypeError` class', (): void => {
      expect(content).toContain('declare class CnpjValidatorOptionsTypeError');
    });

    it('exports `CnpjValidatorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptionsTypeError');
    });

    it('declares the `CnpjValidatorException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjValidatorException');
    });

    it('exports `CnpjValidatorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorException');
    });

    it('declares the `CnpjValidatorOptionTypeInvalidException` class', (): void => {
      expect(content).toContain('declare class CnpjValidatorOptionTypeInvalidException');
    });

    it('exports `CnpjValidatorOptionTypeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjValidatorOptionTypeInvalidException');
    });
  });
});
