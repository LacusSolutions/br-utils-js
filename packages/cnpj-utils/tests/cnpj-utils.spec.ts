import {
  CnpjFormatter,
  CnpjFormatterOptions,
  type CnpjFormatterOptionsInput,
} from '@lacussoft/cnpj-fmt';
import {
  CnpjGenerator,
  CnpjGeneratorOptions,
  type CnpjGeneratorOptionsInput,
} from '@lacussoft/cnpj-gen';
import {
  CnpjValidator,
  CnpjValidatorOptions,
  type CnpjValidatorOptionsInput,
} from '@lacussoft/cnpj-val';
import { afterEach, beforeEach, describe, expect, it, type Mock, spyOn } from 'bun:test';

import { CnpjUtils } from '../src/cnpj-utils';

describe('default instance', () => {
  it('exports an instance onFail CnpjUtils class', async () => {
    const cnpjUtils = await import('../src/index.esm');

    expect(cnpjUtils.default).toBeInstanceOf(CnpjUtils);
  });
});

describe('CnpjUtils', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with resources in their default state', () => {
        const utils = new CnpjUtils();

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.validator).toBeInstanceOf(CnpjValidator);
      });
    });

    describe('when called with instances of resources', () => {
      it('uses the passed formatter directly', () => {
        const formatter = new CnpjFormatter();

        const utils = new CnpjUtils({ formatter });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter).toBe(formatter);
      });

      it('uses the passed generator directly', () => {
        const generator = new CnpjGenerator();

        const utils = new CnpjUtils({ generator });

        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator).toBe(generator);
      });

      it('uses the passed validator directly', () => {
        const validator = new CnpjValidator();

        const utils = new CnpjUtils({ validator });

        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator).toBe(validator);
      });

      it('uses the passed resources directly', () => {
        const formatter = new CnpjFormatter();
        const generator = new CnpjGenerator();
        const validator = new CnpjValidator();

        const utils = new CnpjUtils({
          formatter,
          generator,
          validator,
        });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter).toBe(formatter);
        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator).toBe(generator);
        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator).toBe(validator);
      });
    });

    describe('when called with instances of resources options', () => {
      it('creates a new formatter instance with the passed options', () => {
        const formatterOptions = new CnpjFormatterOptions();

        const utils = new CnpjUtils({ formatter: formatterOptions });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter.options).toBe(formatterOptions);
      });

      it('creates a new generator instance with the passed options', () => {
        const generatorOptions = new CnpjGeneratorOptions();

        const utils = new CnpjUtils({ generator: generatorOptions });

        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator.options).toBe(generatorOptions);
      });

      it('creates a new validator instance with the passed options', () => {
        const validatorOptions = new CnpjValidatorOptions();

        const utils = new CnpjUtils({ validator: validatorOptions });

        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator.options).toBe(validatorOptions);
      });

      it('creates new resources instances with the passed options', () => {
        const formatterOptions = new CnpjFormatterOptions();
        const generatorOptions = new CnpjGeneratorOptions();
        const validatorOptions = new CnpjValidatorOptions();

        const utils = new CnpjUtils({
          formatter: formatterOptions,
          generator: generatorOptions,
          validator: validatorOptions,
        });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter.options).toBe(formatterOptions);
        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator.options).toBe(generatorOptions);
        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator.options).toBe(validatorOptions);
      });
    });

    describe('when called with partial options of resources', () => {
      it('creates a new formatter instance with the passed options', () => {
        const formatterOptions: CnpjFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 11,
          dotKey: '_',
          slashKey: '|',
          dashKey: ' dv ',
        };

        const utils = new CnpjUtils({ formatter: formatterOptions });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
      });

      it('creates a new generator instance with the passed options', () => {
        const generatorOptions: CnpjGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
          type: 'numeric',
        };

        const utils = new CnpjUtils({ generator: generatorOptions });

        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
      });

      it('creates a new validator instance with the passed options', () => {
        const validatorOptions: CnpjValidatorOptionsInput = {
          caseSensitive: true,
          type: 'numeric',
        };

        const utils = new CnpjUtils({ validator: validatorOptions });

        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator.options.all).toEqual(expect.objectContaining(validatorOptions));
      });

      it('creates new resources instances with the passed options', () => {
        const formatterOptions: CnpjFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 11,
          dotKey: '_',
          slashKey: '|',
          dashKey: ' dv ',
        };
        const generatorOptions: CnpjGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
          type: 'numeric',
        };
        const validatorOptions: CnpjValidatorOptionsInput = {
          caseSensitive: true,
          type: 'numeric',
        };

        const utils = new CnpjUtils({
          formatter: formatterOptions,
          generator: generatorOptions,
          validator: validatorOptions,
        });

        expect(utils.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
        expect(utils.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
        expect(utils.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.validator.options.all).toEqual(expect.objectContaining(validatorOptions));
      });
    });
  });

  describe('`formatter` setter', () => {
    describe('when called with a complete new instance of `CnpjFormatter`', () => {
      it('sets the formatter instance', () => {
        const utils = new CnpjUtils();
        const formatter = new CnpjFormatter();

        utils.formatter = formatter;

        expect(utils.formatter).toBe(formatter);
      });
    });

    describe('when called with a instance of `CnpjFormatterOptions`', () => {
      it('sets the formatter instance', () => {
        const utils = new CnpjUtils();
        const formatterOptions = new CnpjFormatterOptions();

        utils.formatter = formatterOptions;

        expect(utils.formatter.options).toBe(formatterOptions);
      });
    });

    describe('when called with a partial object with options to the formatter options', () => {
      it('sets the formatter instance with options', () => {
        const utils = new CnpjUtils();
        const formatterOptions: CnpjFormatterOptionsInput = {
          hidden: true,
          hiddenKey: '#',
          hiddenStart: 8,
          hiddenEnd: 11,
          dotKey: '_',
          slashKey: '|',
          dashKey: ' dv ',
        };

        utils.formatter = formatterOptions;

        expect(utils.formatter.options.all).toEqual(expect.objectContaining(formatterOptions));
      });

      it('sets the formatter instance with empty object', () => {
        const utils = new CnpjUtils();
        const originalFormatter = utils.formatter;
        const originalFormatterOptions = originalFormatter.options.all;

        utils.formatter = {};

        expect(utils.formatter).not.toBe(originalFormatter);
        expect(utils.formatter.options.all).toEqual(originalFormatterOptions);
      });
    });
  });

  describe('`generator` setter', () => {
    describe('when called with a complete new instance of `CnpjGenerator`', () => {
      it('sets the generator instance', () => {
        const utils = new CnpjUtils();
        const generator = new CnpjGenerator();

        utils.generator = generator;

        expect(utils.generator).toBe(generator);
      });
    });

    describe('when called with a instance of `CnpjGeneratorOptions`', () => {
      it('sets the generator instance', () => {
        const utils = new CnpjUtils();
        const generatorOptions = new CnpjGeneratorOptions();

        utils.generator = generatorOptions;

        expect(utils.generator.options).toBe(generatorOptions);
      });
    });

    describe('when called with a partial object with options to the generator options', () => {
      it('sets the generator instance with options', () => {
        const utils = new CnpjUtils();
        const generatorOptions: CnpjGeneratorOptionsInput = {
          format: true,
          prefix: '12345678',
          type: 'numeric',
        };

        utils.generator = generatorOptions;

        expect(utils.generator.options.all).toEqual(expect.objectContaining(generatorOptions));
      });

      it('sets the generator instance with empty object', () => {
        const utils = new CnpjUtils();
        const originalGenerator = utils.generator;
        const originalGeneratorOptions = originalGenerator.options.all;

        utils.generator = {};

        expect(utils.generator).not.toBe(originalGenerator);
        expect(utils.generator.options.all).toEqual(originalGeneratorOptions);
      });
    });
  });

  describe('`validator` setter', () => {
    describe('when called with a complete new instance of `CnpjValidator`', () => {
      it('sets the validator instance', () => {
        const utils = new CnpjUtils();
        const validator = new CnpjValidator();

        utils.validator = validator;

        expect(utils.validator).toBe(validator);
      });
    });

    describe('when called with a instance of `CnpjValidatorOptions`', () => {
      it('sets the validator instance', () => {
        const utils = new CnpjUtils();
        const validatorOptions = new CnpjValidatorOptions();

        utils.validator = validatorOptions;

        expect(utils.validator.options).toBe(validatorOptions);
      });
    });

    describe('when called with a partial object with options to the validator options', () => {
      it('sets the validator instance with options', () => {
        const utils = new CnpjUtils();
        const validatorOptions: CnpjValidatorOptionsInput = {
          caseSensitive: true,
          type: 'numeric',
        };

        utils.validator = validatorOptions;

        expect(utils.validator.options.all).toEqual(expect.objectContaining(validatorOptions));
      });

      it('sets the validator instance with empty object', () => {
        const utils = new CnpjUtils();
        const originalValidator = utils.validator;
        const originalValidatorOptions = originalValidator.options.all;

        utils.validator = {};

        expect(utils.validator).not.toBe(originalValidator);
        expect(utils.validator.options.all).toEqual(originalValidatorOptions);
      });
    });
  });

  describe('`format` method', () => {
    let formatSpy: Mock<typeof CnpjFormatter.prototype.format>;

    beforeEach(() => {
      formatSpy = spyOn(CnpjFormatter.prototype, 'format');
    });

    afterEach(() => {
      formatSpy.mockRestore();
    });

    it('invokes the formatter method with the same arguments', () => {
      const cnpj = 'AB123CDE000145';
      const options = new CnpjFormatterOptions();

      new CnpjUtils().format(cnpj, options);

      expect(formatSpy).toHaveBeenCalledTimes(1);
      expect(formatSpy).toHaveBeenCalledWith(cnpj, options);
    });

    it('returns the formatted CNPJ', () => {
      formatSpy.mockReturnValue('formatted-cnpj');

      const result = new CnpjUtils().format('12345678000190');

      expect(result).toBe('formatted-cnpj');
    });

    it('throws any error the formatter throws', (): void => {
      formatSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CnpjUtils().format('12345678000190')).toThrow('test error');
    });
  });

  describe('`generate` method', () => {
    let generateSpy: Mock<typeof CnpjGenerator.prototype.generate>;

    beforeEach(() => {
      generateSpy = spyOn(CnpjGenerator.prototype, 'generate');
    });

    afterEach(() => {
      generateSpy.mockRestore();
    });

    it('invokes the generator method with the same arguments', () => {
      const options = new CnpjGeneratorOptions();

      new CnpjUtils().generate(options);

      expect(generateSpy).toHaveBeenCalledTimes(1);
      expect(generateSpy).toHaveBeenCalledWith(options);
    });

    it('returns the generated CNPJ', () => {
      generateSpy.mockReturnValue('generated-cnpj');

      const result = new CnpjUtils().generate();

      expect(result).toBe('generated-cnpj');
    });

    it('throws any error the formatter throws', (): void => {
      generateSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CnpjUtils().generate()).toThrow('test error');
    });
  });

  describe('`isValid` method', () => {
    let isValidSpy: Mock<typeof CnpjValidator.prototype.isValid>;

    beforeEach(() => {
      isValidSpy = spyOn(CnpjValidator.prototype, 'isValid');
    });

    afterEach(() => {
      isValidSpy.mockRestore();
    });

    it('invokes the validator method with the same arguments', () => {
      const cnpj = 'AB123CDE000145';
      const options = new CnpjValidatorOptions();

      new CnpjUtils().isValid(cnpj, options);

      expect(isValidSpy).toHaveBeenCalledTimes(1);
      expect(isValidSpy).toHaveBeenCalledWith(cnpj, options);
    });

    it('returns the validation result', () => {
      isValidSpy.mockReturnValue('validated-cnpj' as unknown as boolean);

      const result = new CnpjUtils().isValid('AB123CDE000145');

      expect(result).toBe('validated-cnpj' as unknown as boolean);
    });

    it('throws any error the validator throws', (): void => {
      isValidSpy.mockImplementation(() => {
        throw new Error('test error');
      });

      expect(() => new CnpjUtils().isValid('AB123CDE000145')).toThrow('test error');
    });
  });
});
