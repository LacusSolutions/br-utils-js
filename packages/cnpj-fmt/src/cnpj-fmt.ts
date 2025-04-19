import { escape as escapeHTML } from 'html-escaper';
import numOnly from 'num-only';

import mergeOptions from './merge-options';
import type { CnpjFormattingOptions } from './merge-options';

/**
 * Validate a given CNPJ char sequence.
 */
function cnpjFmt<OnErrFallback = string>(
  cnpjString: string,
  options?: CnpjFormattingOptions<OnErrFallback>,
): string {
  const CNPJ_LENGTH = 14;
  const cnpjArray = numOnly(cnpjString).split('');
  const customOptions = mergeOptions(options);

  if (cnpjArray.length !== CNPJ_LENGTH) {
    const error = new Error(`Parameter "${cnpjString}" does not contain ${CNPJ_LENGTH} digits.`);

    return customOptions.onFail(cnpjString, error) as string;
  }

  if (customOptions.hidden) {
    for (let i = customOptions.hiddenRange.start; i <= customOptions.hiddenRange.end; i++) {
      cnpjArray[i] = customOptions.hiddenKey;
    }
  }

  cnpjArray.splice(12, 0, customOptions.delimiters.dash);
  cnpjArray.splice(8, 0, customOptions.delimiters.slash);
  cnpjArray.splice(5, 0, customOptions.delimiters.dot);
  cnpjArray.splice(2, 0, customOptions.delimiters.dot);
  const cnpjPretty = cnpjArray.join('');

  if (customOptions.escape) {
    return escapeHTML(cnpjPretty);
  }

  return cnpjPretty;
}

export default cnpjFmt;
