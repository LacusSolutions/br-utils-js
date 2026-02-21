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
    describe('file `cpf-gen.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cpf-gen.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfGen: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfGen;`);

          cpfGen = makeGlobalInstance();
        });

        it('exposes a global `cpfGen` helper function', async (): Promise<void> => {
          expect(cpfGen).toBeFunction();
          expect(cpfGen()).toMatch(/^\d{11}$/);
        });

        it('exposes resources through the global `cpfGen` variable', async (): Promise<void> => {
          expect(cpfGen.CpfGenerator?.name).toBe('CpfGenerator');
          expect(cpfGen.CpfGeneratorOptions?.name).toBe('CpfGeneratorOptions');
          expect(cpfGen.CpfGeneratorTypeError?.name).toBe('CpfGeneratorTypeError');
          expect(cpfGen.OptionsTypeError?.name).toBe('CpfGeneratorOptionsTypeError');
          expect(cpfGen.CpfGeneratorException?.name).toBe('CpfGeneratorException');
          expect(cpfGen.OptionPrefixInvalidException?.name).toBe(
            'CpfGeneratorOptionPrefixInvalidException',
          );
          expect(cpfGen.CPF_LENGTH).toBe(11);
          expect(cpfGen.CPF_PREFIX_MAX_LENGTH).toBe(9);
        });

        it('exposes an instantiable `CpfGenerator` class', async (): Promise<void> => {
          const { CpfGenerator } = cpfGen;
          const generator = new CpfGenerator({ prefix: '111222333' });
          const generatedCpf = generator.generate({ prefix: '123456' });

          expect(generatedCpf).toMatch(/^123456\d{5}$/);
        });

        it('exposes an instantiable `CpfGeneratorOptions` class', async (): Promise<void> => {
          const { CpfGeneratorOptions } = cpfGen;
          const options = new CpfGeneratorOptions({
            prefix: 'ABC123XYZ456',
            format: true,
          });

          expect(options.prefix).toBe('123456');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cpfGen;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CPF generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionPrefixInvalidException` class', async (): Promise<void> => {
          const { OptionPrefixInvalidException } = cpfGen;
          const exception = new OptionPrefixInvalidException('AB123XYZ', 'some reason');

          expect(exception.actualInput).toBe('AB123XYZ');
          expect(exception.reason).toBe('some reason');
          expect(exception.message).toBe(
            'CPF generator option "prefix" with value "AB123XYZ" is invalid. some reason',
          );
        });
      });
    });

    describe('file `cpf-gen.min.js`', () => {
      const filePath = Bun.resolveSync('../dist/cpf-gen.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfGen: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfGen;`);

          cpfGen = makeGlobalInstance();
        });

        it('exposes a global `cpfGen` helper function', async () => {
          expect(cpfGen).toBeFunction();
          expect(cpfGen()).toMatch(/^\d{11}$/);
        });

        it('exposes resources through the global `cpfGen` variable', async (): Promise<void> => {
          expect(cpfGen.CpfGenerator).toBeTypeOf('function');
          expect(cpfGen.CpfGeneratorOptions).toBeTypeOf('function');
          expect(cpfGen.CpfGeneratorTypeError).toBeTypeOf('function');
          expect(cpfGen.OptionsTypeError).toBeTypeOf('function');
          expect(cpfGen.CpfGeneratorException).toBeTypeOf('function');
          expect(cpfGen.OptionPrefixInvalidException).toBeTypeOf('function');
          expect(cpfGen.CPF_LENGTH).toBe(11);
          expect(cpfGen.CPF_PREFIX_MAX_LENGTH).toBe(9);
        });

        it('exposes an instantiable `CpfGenerator` class', async (): Promise<void> => {
          const { CpfGenerator } = cpfGen;
          const generator = new CpfGenerator();
          const generatedCpf = generator.generate();

          expect(generatedCpf).toMatch(/^\d{11}$/);
        });

        it('exposes an instantiable `CpfGeneratorOptions` class', async (): Promise<void> => {
          const { CpfGeneratorOptions } = cpfGen;
          const options = new CpfGeneratorOptions({
            prefix: '123456',
            format: true,
          });

          expect(options.prefix).toBe('123456');
          expect(options.format).toBe(true);
        });

        it('exposes an instantiable `OptionsTypeError` class', async (): Promise<void> => {
          const { OptionsTypeError } = cpfGen;
          const error = new OptionsTypeError('prefix', 123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.optionName).toBe('prefix');
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe(
            'CPF generator option "prefix" must be of type string. Got integer number.',
          );
        });

        it('exposes an instantiable `OptionPrefixInvalidException` class', async (): Promise<void> => {
          const { OptionPrefixInvalidException } = cpfGen;
          const exception = new OptionPrefixInvalidException('AB123XYZ', 'some reason');

          expect(exception.actualInput).toBe('AB123XYZ');
          expect(exception.reason).toBe('some reason');
          expect(exception.message).toBe(
            'CPF generator option "prefix" with value "AB123XYZ" is invalid. some reason',
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
      await expect(file.text()).resolves.toContain('module.exports = cpfGen');
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

    it('exports `cpfGen` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfGen as default');
    });

    it('exports `cpfGen` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfGen');
    });

    it('exports `CpfGenerator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGenerator');
    });

    it('exports `CpfGeneratorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptions');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('exports `CPF_PREFIX_MAX_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_PREFIX_MAX_LENGTH');
    });

    it('exports `CpfGeneratorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorTypeError');
    });

    it('exports `CpfGeneratorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptionsTypeError');
    });

    it('exports `CpfGeneratorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorException');
    });

    it('exports `CpfGeneratorOptionPrefixInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptionPrefixInvalidException');
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

    it('declares `cpfGen` function', (): void => {
      expect(content).toContain('declare function cpfGen');
    });

    it('exports `cpfGen` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfGen as default');
    });

    it('exports `cpfGen` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfGen');
    });

    it('declares `CpfGenerator` class', (): void => {
      expect(content).toContain('declare class CpfGenerator');
    });

    it('exports `CpfGenerator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGenerator');
    });

    it('declares `CpfGeneratorOptions` class', (): void => {
      expect(content).toContain('declare class CpfGeneratorOptions');
    });

    it('exports `CpfGeneratorOptions` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptions');
    });

    it('declares `CPF_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CPF_LENGTH');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('declares `CPF_PREFIX_MAX_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CPF_PREFIX_MAX_LENGTH');
    });

    it('exports `CPF_PREFIX_MAX_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_PREFIX_MAX_LENGTH');
    });

    it('declares `CpfGeneratorTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfGeneratorTypeError');
    });

    it('exports `CpfGeneratorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorTypeError');
    });

    it('declares `CpfGeneratorOptionsTypeError` class', (): void => {
      expect(content).toContain('declare class CpfGeneratorOptionsTypeError');
    });

    it('exports `CpfGeneratorOptionsTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptionsTypeError');
    });

    it('declares `CpfGeneratorException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfGeneratorException');
    });

    it('exports `CpfGeneratorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorException');
    });

    it('declares `CpfGeneratorOptionPrefixInvalidException` class', (): void => {
      expect(content).toContain('declare class CpfGeneratorOptionPrefixInvalidException');
    });

    it('exports `CpfGeneratorOptionPrefixInvalidException` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfGeneratorOptionPrefixInvalidException');
    });
  });
});
