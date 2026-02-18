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
    describe('file `cnpj-gen.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cnpj-gen.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjGen: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjGen;`);

          cnpjGen = makeGlobalInstance();
        });

        it('exposes a global `cnpjGen` helper function', async (): Promise<void> => {
          expect(cnpjGen).toBeFunction();
          expect(cnpjGen()).toMatch(/^[0-9A-Z]{14}$/);
        });

        it('exposes resources through the global `cnpjGen` variable', async (): Promise<void> => {
          expect(cnpjGen.CnpjGenerator?.name).toBe('CnpjGenerator');
          expect(cnpjGen.CnpjGeneratorOptions?.name).toBe('CnpjGeneratorOptions');
          expect(cnpjGen.CnpjGeneratorTypeError?.name).toBe('CnpjGeneratorTypeError');
          expect(cnpjGen.OptionsTypeError?.name).toBe('CnpjGeneratorOptionsTypeError');
          expect(cnpjGen.CnpjGeneratorException?.name).toBe('CnpjGeneratorException');
          expect(cnpjGen.OptionPrefixInvalidException?.name).toBe(
            'CnpjGeneratorOptionPrefixInvalidException',
          );
          expect(cnpjGen.OptionsTypeError?.name).toBe('CnpjGeneratorOptionsTypeError');
          expect(cnpjGen.CNPJ_LENGTH).toBe(14);
          expect(cnpjGen.CNPJ_PREFIX_MAX_LENGTH).toBe(12);
        });

        it('exposes an instantiable `CnpjGenerator` class', async (): Promise<void> => {
          const { CnpjGenerator } = cnpjGen;
          const generator = new CnpjGenerator({ hidden: true });
          const generatedCnpj = generator.generate();

          expect(generatedCnpj).toMatch(/^[0-9A-Z]{14}$/);
        });

        it('exposes an instantiable `CnpjGeneratorOptions` class', async (): Promise<void> => {
          const { CnpjGeneratorOptions } = cnpjGen;
          const options = new CnpjGeneratorOptions({
            prefix: 'AB123XYZ',
            type: 'numeric',
            format: true,
          });

          expect(options.prefix).toBe('AB123XYZ');
          expect(options.type).toBe('numeric');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjGen;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionPrefixInvalidException` class', async (): Promise<void> => {
          const { OptionPrefixInvalidException } = cnpjGen;
          const exception = new OptionPrefixInvalidException('AB123XYZ', 'some reason');

          expect(exception.actualInput).toBe('AB123XYZ');
          expect(exception.reason).toBe('some reason');
          expect(exception.message).toBe(
            'CNPJ generator option "prefix" with value "AB123XYZ" is invalid. some reason',
          );
        });

        it('exposes an instantiable `OptionTypeInvalidException` class', async (): Promise<void> => {
          const { OptionTypeInvalidException } = cnpjGen;
          const exception = new OptionTypeInvalidException('string', ['numeric']);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
          expect(exception.message).toBe(
            'CNPJ generator option "type" accepts only the following values: "numeric". Got "string".',
          );
        });
      });
    });

    describe('file `cnpj-gen.min.js`', () => {
      const filePath = Bun.resolveSync('../dist/cnpj-gen.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cnpjGen: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cnpjGen;`);

          cnpjGen = makeGlobalInstance();
        });

        it('exposes a global `cnpjGen` helper function', async () => {
          expect(cnpjGen).toBeFunction();
          expect(cnpjGen()).toMatch(/^[0-9A-Z]{14}$/);
        });

        it('exposes resources through the global `cnpjGen` variable', async (): Promise<void> => {
          expect(cnpjGen.CnpjGenerator).toBeTypeOf('function');
          expect(cnpjGen.CnpjGeneratorOptions).toBeTypeOf('function');
          expect(cnpjGen.CnpjGeneratorTypeError).toBeTypeOf('function');
          expect(cnpjGen.OptionsTypeError).toBeTypeOf('function');
          expect(cnpjGen.CnpjGeneratorException).toBeTypeOf('function');
          expect(cnpjGen.OptionPrefixInvalidException).toBeTypeOf('function');
          expect(cnpjGen.OptionTypeInvalidException).toBeTypeOf('function');
          expect(cnpjGen.CNPJ_LENGTH).toBe(14);
          expect(cnpjGen.CNPJ_PREFIX_MAX_LENGTH).toBe(12);
        });

        it('exposes an instantiable `CnpjGenerator` class', async (): Promise<void> => {
          const { CnpjGenerator } = cnpjGen;
          const generator = new CnpjGenerator();
          const generatedCnpj = generator.generate();

          expect(generatedCnpj).toMatch(/^[0-9A-Z]{14}$/);
        });

        it('exposes an instantiable `CnpjGeneratorOptions` class', async (): Promise<void> => {
          const { CnpjGeneratorOptions } = cnpjGen;
          const options = new CnpjGeneratorOptions({
            prefix: 'AB123XYZ',
            type: 'numeric',
            format: true,
          });

          expect(options.prefix).toBe('AB123XYZ');
          expect(options.type).toBe('numeric');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cnpjGen;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CNPJ generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionPrefixInvalidException` class', async (): Promise<void> => {
          const { OptionPrefixInvalidException } = cnpjGen;
          const exception = new OptionPrefixInvalidException('AB123XYZ', 'some reason');

          expect(exception.actualInput).toBe('AB123XYZ');
          expect(exception.reason).toBe('some reason');
          expect(exception.message).toBe(
            'CNPJ generator option "prefix" with value "AB123XYZ" is invalid. some reason',
          );
        });

        it('exposes an instantiable `OptionTypeInvalidException` class', async (): Promise<void> => {
          const { OptionTypeInvalidException } = cnpjGen;
          const exception = new OptionTypeInvalidException('string', ['numeric']);

          expect(exception.actualInput).toBe('string');
          expect(exception.expectedValues).toEqual(['numeric']);
          expect(exception.message).toBe(
            'CNPJ generator option "type" accepts only the following values: "numeric". Got "string".',
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
      await expect(file.text()).resolves.toContain('module.exports = cnpjGen');
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

    it('exports `cnpjGen` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjGen as default');
    });

    it('exports `cnpjGen` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjGen');
    });

    it('exports `CnpjGenerator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGenerator');
    });

    it('exports `CnpjGeneratorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptions');
    });

    it('exports `CNPJ_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('exports `CNPJ_PREFIX_MAX_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_PREFIX_MAX_LENGTH');
    });

    it('exports `CnpjGeneratorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorTypeError');
    });

    it('exports `CnpjGeneratorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionsTypeError');
    });

    it('exports `CnpjGeneratorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorException');
    });

    it('exports `CnpjGeneratorOptionPrefixInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionPrefixInvalidException');
    });

    it('exports `CnpjGeneratorOptionTypeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionTypeInvalidException');
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

    it('declares the `cnpjGen` function', (): void => {
      expect(content).toContain('declare function cnpjGen');
    });

    it('exports `cnpjGen` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjGen as default');
    });

    it('exports `cnpjGen` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cnpjGen');
    });

    it('declares the `CnpjGenerator` class', (): void => {
      expect(content).toContain('declare class CnpjGenerator');
    });

    it('exports `CnpjGenerator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGenerator');
    });

    it('declares the `CnpjGeneratorOptions` class', (): void => {
      expect(content).toContain('declare class CnpjGeneratorOptions');
    });

    it('exports `CnpjGeneratorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptions');
    });

    it('declares the `CNPJ_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CNPJ_LENGTH');
    });

    it('exports `CNPJ_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_LENGTH');
    });

    it('declares the `CNPJ_PREFIX_MAX_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CNPJ_PREFIX_MAX_LENGTH');
    });

    it('exports `CNPJ_PREFIX_MAX_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CNPJ_PREFIX_MAX_LENGTH');
    });

    it('declares the `CnpjGeneratorTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjGeneratorTypeError');
    });

    it('exports `CnpjGeneratorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorTypeError');
    });

    it('declares the `CnpjGeneratorOptionsTypeError` class', (): void => {
      expect(content).toContain('declare class CnpjGeneratorOptionsTypeError');
    });

    it('exports `CnpjGeneratorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionsTypeError');
    });

    it('declares the `CnpjGeneratorException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CnpjGeneratorException');
    });

    it('exports `CnpjGeneratorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorException');
    });

    it('declares the `CnpjGeneratorOptionPrefixInvalidException` class', (): void => {
      expect(content).toContain('declare class CnpjGeneratorOptionPrefixInvalidException');
    });

    it('exports `CnpjGeneratorOptionPrefixInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionPrefixInvalidException');
    });

    it('declares the `CnpjGeneratorOptionTypeInvalidException` class', (): void => {
      expect(content).toContain('declare class CnpjGeneratorOptionTypeInvalidException');
    });

    it('exports `CnpjGeneratorOptionTypeInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CnpjGeneratorOptionTypeInvalidException');
    });
  });
});
