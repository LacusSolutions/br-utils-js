import type { CnpjUtils, CnpjUtilsSettingsInput } from './cnpj-utils';
import type { CpfUtils, CpfUtilsSettingsInput } from './cpf-utils';

/**
 * Configuration for the `BrUtils` instance. Each property can be either a
 * ready-to-use instance (e.g. `CnpjUtils`) or an options object that will be
 * used to create one (cnpj, cpf).
 */
export interface BrUtilsSettingsType {
  /**
   * Custom CNPJ utils instance or options for the CNPJ utils.
   */
  cnpj: CnpjUtils | CnpjUtilsSettingsInput;

  /**
   * Custom CPF utils instance or options for the CPF utils.
   */
  cpf: CpfUtils | CpfUtilsSettingsInput;
}

export type BrUtilsSettingsInput = Partial<BrUtilsSettingsType>;
