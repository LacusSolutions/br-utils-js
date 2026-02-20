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
    describe('file `cpf-val.js`', (): void => {
      const filePath = Bun.resolveSync('../dist/cpf-val.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async (): Promise<void> => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfVal: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfVal;`);

          cpfVal = makeGlobalInstance();
        });

        it('exposes a global `cpfVal` helper function', async (): Promise<void> => {
          expect(cpfVal).toBeFunction();
          expect(cpfVal('33528612690')).toBe(true);
          expect(cpfVal('33528612691')).toBe(false);
        });

        it('exposes resources through the global `cpfVal` variable', async (): Promise<void> => {
          expect(cpfVal.CpfValidator?.name).toBe('CpfValidator');
          expect(cpfVal.CpfValidatorTypeError?.name).toBe('CpfValidatorTypeError');
          expect(cpfVal.InputTypeError?.name).toBe('CpfValidatorInputTypeError');
          expect(cpfVal.CpfValidatorException?.name).toBe('CpfValidatorException');
          expect(cpfVal.CPF_LENGTH).toBe(11);
        });

        it('exposes an instantiable `CpfValidator` class', async (): Promise<void> => {
          const { CpfValidator } = cpfVal;
          const validator = new CpfValidator();
          const isValidCpf = validator.isValid('33528612690');

          expect(isValidCpf).toBe(true);
        });

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cpfVal;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CPF input must be of type string. Got integer number.');
        });
      });
    });

    describe('file `cpf-val.min.js`', () => {
      const filePath = Bun.resolveSync('../dist/cpf-val.min.js', import.meta.dir);
      const file = Bun.file(filePath);

      it('exists', async () => {
        await expect(file.exists()).resolves.toBe(true);
      });

      describe('when evaluated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cpfVal: any;

        beforeAll(async (): Promise<void> => {
          const fileContent = await file.text();
          const makeGlobalInstance = new Function(`${fileContent}\nreturn cpfVal;`);

          cpfVal = makeGlobalInstance();
        });

        it('exposes a global `cpfVal` helper function', async () => {
          expect(cpfVal).toBeFunction();
          expect(cpfVal('33528612690')).toBe(true);
          expect(cpfVal('33528612691')).toBe(false);
        });

        it('exposes resources through the global `cpfVal` variable', async (): Promise<void> => {
          expect(cpfVal.CpfValidator).toBeTypeOf('function');
          expect(cpfVal.CpfValidatorTypeError).toBeTypeOf('function');
          expect(cpfVal.InputTypeError).toBeTypeOf('function');
          expect(cpfVal.CpfValidatorException).toBeTypeOf('function');
          expect(cpfVal.CPF_LENGTH).toBe(11);
        });

        it('exposes an instantiable `CpfValidator` class', async (): Promise<void> => {
          const { CpfValidator } = cpfVal;
          const validator = new CpfValidator();
          const isValidCpf = validator.isValid('33528612690');

          expect(isValidCpf).toBe(true);
        });

        it('exposes an instantiable `InputTypeError` class', async (): Promise<void> => {
          const { InputTypeError } = cpfVal;
          const error = new InputTypeError(123, 'string');

          expect(error.actualInput).toBe(123);
          expect(error.actualType).toBe('integer number');
          expect(error.expectedType).toBe('string');
          expect(error.message).toBe('CPF input must be of type string. Got integer number.');
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
      await expect(file.text()).resolves.toContain('module.exports = cpfVal');
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

    it('exports `cpfVal` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfVal as default');
    });

    it('exports `cpfVal` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfVal');
    });

    it('exports `CpfValidator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidator');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('exports `CpfValidatorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorTypeError');
    });

    it('exports `CpfValidatorInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorInputTypeError');
    });

    it('exports `CpfValidatorException` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorException');
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

    it('declares `cpfVal` function', (): void => {
      expect(content).toContain('declare function cpfVal');
    });

    it('exports `cpfVal` function as default', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfVal as default');
    });

    it('exports `cpfVal` function as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('cpfVal');
    });

    it('declares `CpfValidator` class', (): void => {
      expect(content).toContain('declare class CpfValidator');
    });

    it('exports `CpfValidator` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidator');
    });

    it('declares `CPF_LENGTH` constant', (): void => {
      expect(content).toContain('declare const CPF_LENGTH');
    });

    it('exports `CPF_LENGTH` constant as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CPF_LENGTH');
    });

    it('declares `CpfValidatorTypeError` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfValidatorTypeError');
    });

    it('exports `CpfValidatorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorTypeError');
    });

    it('exports `CpfValidatorTypeError` abstract class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorTypeError');
    });

    it('declares `CpfValidatorInputTypeError` class', (): void => {
      expect(content).toContain('declare class CpfValidatorInputTypeError');
    });

    it('exports `CpfValidatorInputTypeError` class as named', (): void => {
      const exportedResources = extractExportedResources(content);

      expect(exportedResources).toContain('CpfValidatorInputTypeError');
    });

    it('declares `CpfValidatorException` abstract class', (): void => {
      expect(content).toContain('declare abstract class CpfValidatorException');
    });
  });
});
