import { CpfFormatter } from './cpf-formatter';
import type { CpfFormatterOptionsInput, CpfInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CpfFormatter} class.
 *
 * Formats a CPF string according to the given options. With no options, returns
 * the traditional CPF format (e.g. `123.456.789-10`). Invalid input or length
 * is handled by the configured `onFail` callback instead of throwing.
 */
export function cpfFmt(cpfInput: CpfInput, options?: CpfFormatterOptionsInput): string {
  return new CpfFormatter(options).format(cpfInput);
}
