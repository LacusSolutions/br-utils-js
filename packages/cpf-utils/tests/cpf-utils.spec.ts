import {
  CpfFormatter,
  CpfFormatterOptions,
  type CpfFormatterOptionsInput,
} from '@lacussoft/cpf-fmt';
import {
  CpfGenerator,
  CpfGeneratorOptions,
  type CpfGeneratorOptionsInput,
} from '@lacussoft/cpf-gen';
import { CpfValidator } from '@lacussoft/cpf-val';
import { afterEach, beforeEach, describe, expect, it, type Mock, spyOn } from 'bun:test';

import { CpfUtils } from '../src/cpf-utils';

describe('default instance', () => {
  it('exports an instance of CpfUtils class', async () => {
    const cpfUtils = await import('../src/index.esm');

    expect(cpfUtils.default).toBeInstanceOf(CpfUtils);
  });
});

describe('CpfUtils', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with resources in their default state', () => {
        const utils = new CpfUtils();

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.validator).toBeInstanceOf(CpfValidator);
      });
    });

    describe('when called with instances of resources', () => {
      it('uses the passed formatter directly', () => {
        const formatter = new CpfFormatter();

        const utils = new CpfUtils({ formatter });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter).toBe(formatter);
      });

      it('uses the passed generator directly', () => {
        const generator = new CpfGenerator();

        const utils = new CpfUtils({ generator });

        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator).toBe(generator);
      });

      it('uses the passed validator directly', () => {
        const validator = new CpfValidator();

        const utils = new CpfUtils({ validator });

        expect(utils.validator).toBeInstanceOf(CpfValidator);
        expect(utils.validator).toBe(validator);
      });

      it('uses the passed resources directly', () => {
        const formatter = new CpfFormatter();
        const generator = new CpfGenerator();
        const validator = new CpfValidator();

        const utils = new CpfUtils({
          formatter,
          generator,
          validator,
        });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter).toBe(formatter);
        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator).toBe(generator);
        expect(utils.validator).toBeInstanceOf(CpfValidator);
        expect(utils.validator).toBe(validator);
      });
    });

    describe('when called with instances of resources options', () => {
      it('creates a new formatter instance with the passed options', () => {
        const formatterOptions = new CpfFormatterOptions();

        const utils = new CpfUtils({ formatter: formatterOptions });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter.options).toBe(formatterOptions);
      });

      it('creates a new generator instance with the passed options', () => {
        const generatorOptions = new CpfGeneratorOptions();

        const utils = new CpfUtils({ generator: generatorOptions });

        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator.options).toBe(generatorOptions);
      });

      it('creates new resources instances with the passed options', () => {
        const formatterOptions = new CpfFormatterOptions();
        const generatorOptions = new CpfGeneratorOptions();

        const utils = new CpfUtils({
          formatter: formatterOptions,
          generator: generatorOptions,
        });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter.options).toBe(formatterOptions);
        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator.options).toBe(generatorOptions);
        expect(utils.validator).toBeInstanceOf(CpfValidator);
      });
    });

    describe('when called with partial options of resources', () => {
      it('creates a new formatter instance with the passed options', () => {
        const formatterOptions: CpfFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 10,
          dotKey: '_',
          dashKey: ' dv ',
        };

        const utils = new CpfUtils({ formatter: formatterOptions });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
      });

      it('creates a new generator instance with the passed options', () => {
        const generatorOptions: CpfGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
        };

        const utils = new CpfUtils({ generator: generatorOptions });

        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
      });

      it('creates new resources instances with the passed options', () => {
        const formatterOptions: CpfFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 10,
          dotKey: '_',
          dashKey: ' dv ',
        };
        const generatorOptions: CpfGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
        };

        const utils = new CpfUtils({
          formatter: formatterOptions,
          generator: generatorOptions,
        });

        expect(utils.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
        expect(utils.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
        expect(utils.validator).toBeInstanceOf(CpfValidator);
      });
    });
  });

  describe('`formatter` setter', () => {
    describe('when called with a complete new instance of `CpfFormatter`', () => {
      it('sets the formatter instance', () => {
        const utils = new CpfUtils();
        const formatter = new CpfFormatter();

        utils.formatter = formatter;

        expect(utils.formatter).toBe(formatter);
      });
    });

    describe('when called with an instance of `CpfFormatterOptions`', () => {
      it('sets the formatter instance', () => {
        const utils = new CpfUtils();
        const formatterOptions = new CpfFormatterOptions();

        utils.formatter = formatterOptions;

        expect(utils.formatter.options).toBe(formatterOptions);
      });
    });

    describe('when called with a partial object with options to the formatter options', () => {
      it('sets the formatter instance with options', () => {
        const utils = new CpfUtils();
        const formatterOptions: CpfFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 10,
          dotKey: '_',
          dashKey: ' dv ',
        };

        utils.formatter = formatterOptions;

        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
      });

      it('sets the formatter instance with empty object', () => {
        const utils = new CpfUtils();
        const originalFormatter = utils.formatter;
        const originalFormatterOptions = originalFormatter.options.all;

        utils.formatter = {};

        expect(utils.formatter).not.toBe(originalFormatter);
        expect(utils.formatter.options.all).toEqual(originalFormatterOptions);
      });
    });
  });

  describe('`generator` setter', () => {
    describe('when called with a complete new instance of `CpfGenerator`', () => {
      it('sets the generator instance', () => {
        const utils = new CpfUtils();
        const generator = new CpfGenerator();

        utils.generator = generator;

        expect(utils.generator).toBe(generator);
      });
    });

    describe('when called with an instance of `CpfGeneratorOptions`', () => {
      it('sets the generator instance', () => {
        const utils = new CpfUtils();
        const generatorOptions = new CpfGeneratorOptions();

        utils.generator = generatorOptions;

        expect(utils.generator.options).toBe(generatorOptions);
      });
    });

    describe('when called with a partial object with options to the generator options', () => {
      it('sets the generator instance with options', () => {
        const utils = new CpfUtils();
        const generatorOptions: CpfGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
        };

        utils.generator = generatorOptions;

        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
      });

      it('sets the generator instance with empty object', () => {
        const utils = new CpfUtils();
        const originalGenerator = utils.generator;
        const originalGeneratorOptions = originalGenerator.options.all;

        utils.generator = {};

        expect(utils.generator).not.toBe(originalGenerator);
        expect(utils.generator.options.all).toEqual(originalGeneratorOptions);
      });
    });
  });

  describe('`validator` setter', () => {
    describe('when called with a complete new instance of `CpfValidator`', () => {
      it('sets the validator instance', () => {
        const utils = new CpfUtils();
        const validator = new CpfValidator();

        utils.validator = validator;

        expect(utils.validator).toBe(validator);
      });
    });
  });

  describe('`format` method', () => {
    let formatSpy: Mock<typeof CpfFormatter.prototype.format>;

    beforeEach(() => {
      formatSpy = spyOn(CpfFormatter.prototype, 'format');
    });

    afterEach(() => {
      formatSpy.mockRestore();
    });

    it('invokes the formatter method with the same arguments', () => {
      const cpf = 'AB123CDE000145';
      const options = new CpfFormatterOptions();

      new CpfUtils().format(cpf, options);

      expect(formatSpy).toHaveBeenCalledTimes(1);
      expect(formatSpy).toHaveBeenCalledWith(cpf, options);
    });

    it('returns the formatted CPF', () => {
      formatSpy.mockReturnValue('formatted-cpf');

      const result = new CpfUtils().format('12345678909');

      expect(result).toBe('formatted-cpf');
    });

    it('throws any error the formatter throws', (): void => {
      formatSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CpfUtils().format('12345678909')).toThrow('test error');
    });
  });

  describe('`generate` method', () => {
    let generateSpy: Mock<typeof CpfGenerator.prototype.generate>;

    beforeEach(() => {
      generateSpy = spyOn(CpfGenerator.prototype, 'generate');
    });

    afterEach(() => {
      generateSpy.mockRestore();
    });

    it('invokes the generator method with the same arguments', () => {
      const options = new CpfGeneratorOptions();

      new CpfUtils().generate(options);

      expect(generateSpy).toHaveBeenCalledTimes(1);
      expect(generateSpy).toHaveBeenCalledWith(options);
    });

    it('returns the generated CPF', () => {
      generateSpy.mockReturnValue('generated-cpf');

      const result = new CpfUtils().generate();

      expect(result).toBe('generated-cpf');
    });

    it('throws any error the generator throws', (): void => {
      generateSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CpfUtils().generate()).toThrow('test error');
    });
  });

  describe('`isValid` method', () => {
    let isValidSpy: Mock<typeof CpfValidator.prototype.isValid>;

    beforeEach(() => {
      isValidSpy = spyOn(CpfValidator.prototype, 'isValid');
    });

    afterEach(() => {
      isValidSpy.mockRestore();
    });

    it('invokes the validator method with the same arguments', () => {
      const cpf = 'AB123CDE000145';

      new CpfUtils().isValid(cpf);

      expect(isValidSpy).toHaveBeenCalledTimes(1);
      expect(isValidSpy).toHaveBeenCalledWith(cpf);
    });

    it('returns the validation result', () => {
      isValidSpy.mockReturnValue('validated-cpf' as unknown as boolean);

      const result = new CpfUtils().isValid('AB123CDE000145');

      expect(result).toBe('validated-cpf' as unknown as boolean);
    });

    it('throws any error the validator throws', (): void => {
      isValidSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CpfUtils().isValid('AB123CDE000145')).toThrow('test error');
    });
  });
});
