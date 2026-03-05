import { describe, expect, it } from 'bun:test';
import {
  CnpjFormatter,
  CnpjFormatterOptions,
  CnpjGenerator,
  CnpjGeneratorOptions,
  CnpjUtils,
  type CnpjUtilsSettingsInput,
  CnpjValidator,
  CnpjValidatorOptions,
} from 'cnpj-utils';
import {
  CpfFormatter,
  CpfFormatterOptions,
  CpfGenerator,
  CpfGeneratorOptions,
  CpfUtils,
  type CpfUtilsSettingsInput,
} from 'cpf-utils';

import { BrUtils } from '../src/br-utils';

describe('default instance', () => {
  it('exports an instance of `BrUtils` class', async () => {
    const brUtils = await import('../src/index.esm');

    expect(brUtils.default).toBeInstanceOf(BrUtils);
  });
});

describe('BrUtils', () => {
  describe('constructor', () => {
    describe('when called with no arguments', () => {
      it('creates an instance with necessary resource instances', () => {
        const utils = new BrUtils();

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cpf).toBeInstanceOf(CpfUtils);
      });
    });

    describe('when called with instances of resources', () => {
      it('uses the passed `CnpjUtils` directly', () => {
        const cnpjUtils = new CnpjUtils();

        const utils = new BrUtils({ cnpj: cnpjUtils });

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cnpj).toBe(cnpjUtils);
      });

      it('uses the passed `CpfUtils` directly', () => {
        const cpfUtils = new CpfUtils();

        const utils = new BrUtils({ cpf: cpfUtils });

        expect(utils.cpf).toBeInstanceOf(CpfUtils);
        expect(utils.cpf).toBe(cpfUtils);
      });

      it('uses the passed resources directly', () => {
        const cnpjUtils = new CnpjUtils();
        const cpfUtils = new CpfUtils();

        const utils = new BrUtils({ cnpj: cnpjUtils, cpf: cpfUtils });

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cnpj).toBe(cnpjUtils);
        expect(utils.cpf).toBeInstanceOf(CpfUtils);
        expect(utils.cpf).toBe(cpfUtils);
      });
    });

    describe('when called with literal object parameters', () => {
      it('creates a new `BrUtils` instance with the CNPJ options', () => {
        const cnpjUtilsOptions: CnpjUtilsSettingsInput = {
          formatter: {
            hidden: true,
            hiddenKey: '#',
            hiddenStart: 8,
            hiddenEnd: 11,
            dotKey: '_',
            slashKey: '|',
            dashKey: ' dv ',
          },
          generator: {
            format: true,
            prefix: '12345678',
            type: 'numeric',
          },
          validator: {
            type: 'numeric',
          },
        };

        const utils = new BrUtils({ cnpj: cnpjUtilsOptions });

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cnpj.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.cnpj.formatter.options).toBeInstanceOf(CnpjFormatterOptions);
        expect(utils.cnpj.formatter.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.formatter!),
        );
        expect(utils.cnpj.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.cnpj.generator.options).toBeInstanceOf(CnpjGeneratorOptions);
        expect(utils.cnpj.generator.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.generator!),
        );
        expect(utils.cnpj.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.cnpj.validator.options).toBeInstanceOf(CnpjValidatorOptions);
        expect(utils.cnpj.validator.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.validator!),
        );
      });

      it('creates a new `BrUtils` instance with the CPF options', () => {
        const cpfUtilsOptions: CpfUtilsSettingsInput = {
          formatter: {
            hidden: true,
            hiddenKey: '#',
            hiddenStart: 8,
            hiddenEnd: 10,
            dotKey: '_',
            dashKey: ' dv ',
          },
          generator: {
            format: true,
            prefix: '12345678',
          },
        };

        const utils = new BrUtils({ cpf: cpfUtilsOptions });

        expect(utils.cpf).toBeInstanceOf(CpfUtils);
        expect(utils.cpf.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.cpf.formatter.options).toBeInstanceOf(CpfFormatterOptions);
        expect(utils.cpf.formatter.options.all).toEqual(
          expect.objectContaining(cpfUtilsOptions.formatter!),
        );
        expect(utils.cpf.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.cpf.generator.options).toBeInstanceOf(CpfGeneratorOptions);
        expect(utils.cpf.generator.options.all).toEqual(
          expect.objectContaining(cpfUtilsOptions.generator!),
        );
      });
    });
  });

  describe('`cnpj` setter', () => {
    describe('when called with a complete new instance of `CnpjUtils`', () => {
      it('sets the `CnpjUtils` instance', () => {
        const utils = new BrUtils();
        const cnpjUtils = new CnpjUtils();

        utils.cnpj = cnpjUtils;

        expect(utils.cnpj).toBe(cnpjUtils);
      });
    });

    describe('when called with literal object parameters', () => {
      it('sets the `CnpjUtils` instance with options', () => {
        const utils = new BrUtils();
        const cnpjUtilsOptions: CnpjUtilsSettingsInput = {
          formatter: {
            hidden: true,
            hiddenKey: '#',
            hiddenStart: 8,
            hiddenEnd: 11,
            dotKey: '_',
            slashKey: '|',
            dashKey: ' dv ',
          },
          generator: {
            format: true,
            prefix: '12345678',
            type: 'numeric',
          },
          validator: {
            type: 'numeric',
          },
        };

        utils.cnpj = cnpjUtilsOptions;

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cnpj.formatter).toBeInstanceOf(CnpjFormatter);
        expect(utils.cnpj.formatter.options).toBeInstanceOf(CnpjFormatterOptions);
        expect(utils.cnpj.formatter.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.formatter!),
        );
        expect(utils.cnpj.generator).toBeInstanceOf(CnpjGenerator);
        expect(utils.cnpj.generator.options).toBeInstanceOf(CnpjGeneratorOptions);
        expect(utils.cnpj.generator.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.generator!),
        );
        expect(utils.cnpj.validator).toBeInstanceOf(CnpjValidator);
        expect(utils.cnpj.validator.options).toBeInstanceOf(CnpjValidatorOptions);
        expect(utils.cnpj.validator.options.all).toEqual(
          expect.objectContaining(cnpjUtilsOptions.validator!),
        );
      });
    });

    describe.each([null, undefined])('when called with `%s`', (nullishValue) => {
      it('creates a new `CnpjUtils` instance with default options', () => {
        const utils = new BrUtils();
        const originalCnpjUtils = utils.cnpj;

        utils.cnpj = nullishValue;

        expect(utils.cnpj).toBeInstanceOf(CnpjUtils);
        expect(utils.cnpj).not.toBe(originalCnpjUtils);
      });
    });
  });

  describe('`cpf` setter', () => {
    describe('when called with a complete new instance of `CpfUtils`', () => {
      it('sets the `CpfUtils` instance', () => {
        const utils = new BrUtils();
        const cpfUtils = new CpfUtils();

        utils.cpf = cpfUtils;

        expect(utils.cpf).toBe(cpfUtils);
      });
    });

    describe('when called with literal object parameters', () => {
      it('sets the `CnpjUtils` instance with options', () => {
        const utils = new BrUtils();
        const cpfUtilsOptions: CpfUtilsSettingsInput = {
          formatter: {
            hidden: true,
            hiddenKey: '#',
            hiddenStart: 8,
            hiddenEnd: 10,
            dotKey: '_',
            dashKey: ' dv ',
          },
          generator: {
            format: true,
            prefix: '12345678',
          },
        };

        utils.cpf = cpfUtilsOptions;

        expect(utils.cpf).toBeInstanceOf(CpfUtils);
        expect(utils.cpf.formatter).toBeInstanceOf(CpfFormatter);
        expect(utils.cpf.formatter.options).toBeInstanceOf(CpfFormatterOptions);
        expect(utils.cpf.formatter.options.all).toEqual(
          expect.objectContaining(cpfUtilsOptions.formatter!),
        );
        expect(utils.cpf.generator).toBeInstanceOf(CpfGenerator);
        expect(utils.cpf.generator.options).toBeInstanceOf(CpfGeneratorOptions);
        expect(utils.cpf.generator.options.all).toEqual(
          expect.objectContaining(cpfUtilsOptions.generator!),
        );
      });
    });

    describe.each([null, undefined])('when called with `%s`', (nullishValue) => {
      it('creates a new `CpfUtils` instance with default options', () => {
        const utils = new BrUtils();
        const originalCpfUtils = utils.cpf;

        utils.cpf = nullishValue;

        expect(utils.cpf).toBeInstanceOf(CpfUtils);
        expect(utils.cpf).not.toBe(originalCpfUtils);
      });
    });
  });
});
