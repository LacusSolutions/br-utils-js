import { CpfFormatter } from './cpf-formatter';
import type { CpfFormatterOptionsInput, CpfInput } from './types';

/**
 * Helper function to simplify the usage of the {@link CpfFormatter} class.
 *
 * Formats a CPF string according to the given options. With no options, returns
 * the traditional CPF format (e.g. `123.456.789-10`). Invalid input or length
 * is handled by the configured `onFail` callback instead of throwing.
 *
 * @param {CpfInput} cpfInput - CPF as a string or array of strings (e.g. raw
 *   digits or preformatted). Arrays are joined with no separator before
 *   processing.
 * @param {CpfFormatterOptionsInput} [options] - Optional formatting options
 *   (delimiters, masking, HTML escape, URL encode, `onFail` callback).
 * @returns {string}
 */
export function cpfFmt(cpfInput: CpfInput, options?: CpfFormatterOptionsInput): string {
  return new CpfFormatter(options).format(cpfInput);
}
