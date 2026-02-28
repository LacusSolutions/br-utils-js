import type { CpfFormatter, CpfFormatterOptionsInput } from './cpf-formatter';
import type { CpfGenerator, CpfGeneratorOptionsInput } from './cpf-generator';
import type { CpfValidator } from './cpf-validator';

/**
 * Configuration for the `CpfUtils` instance. Each property can be either a
 * ready-to-use instance (e.g. `CpfFormatter`) or an options object that will be
 * used to create one (formatter, generator, validator).
 */
export interface CpfUtilsSettingsType {
  /**
   * Custom formatter or options for the CPF formatter.
   */
  formatter: CpfFormatter | CpfFormatterOptionsInput;

  /**
   * Custom generator or options for the CPF generator.
   */
  generator: CpfGenerator | CpfGeneratorOptionsInput;

  /**
   * Custom CPF validator instance.
   */
  validator: CpfValidator;
}

export type CpfUtilsSettingsInput = Partial<CpfUtilsSettingsType>;
