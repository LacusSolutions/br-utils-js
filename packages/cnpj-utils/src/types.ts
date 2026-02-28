import type { CnpjFormatter, CnpjFormatterOptionsInput } from './cnpj-formatter';
import type { CnpjGenerator, CnpjGeneratorOptionsInput } from './cnpj-generator';
import type { CnpjValidator, CnpjValidatorOptionsInput } from './cnpj-validator';

/**
 * TODO: describe.
 */
export interface CnpjUtilsSettingsType {
  /**
   * Custom formatter or options for the CNPJ formatter.
   */
  formatter: CnpjFormatter | CnpjFormatterOptionsInput;

  /**
   * Custom generator or options for the CNPJ generator.
   */
  generator: CnpjGenerator | CnpjGeneratorOptionsInput;

  /**
   * Custom validator or options for the CNPJ validator.
   */
  validator: CnpjValidator | CnpjValidatorOptionsInput;
}

export type CnpjUtilsSettingsInput = Partial<CnpjUtilsSettingsType>;
