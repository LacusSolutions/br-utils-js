import numOnly from 'num-only';
import html from 'html-escaper';
import mergeOptions from './merge-options';

/**
 * Validate a given CNPJ char sequence.
 *
 * @param {string} cnpjString
 * @param {CnpjFormattingOptions} [options]
 * @return {string}
 */
function cnpjFmt(cnpjString, options = {}) {
  const CNPJ_LENGTH = 14;
  const cnpjArray = numOnly(cnpjString).split('');
  const userOptions = mergeOptions(options);

  if (cnpjArray.length !== CNPJ_LENGTH) {
    return userOptions.onFail(cnpjString);
  }

  if (userOptions.hidden) {
    for (let i = userOptions.hiddenRange.start; i <= userOptions.hiddenRange.end; i++) {
      cnpjArray[i] = userOptions.hiddenSymbol;
    }
  }

  cnpjArray.splice(12, 0, userOptions.delimiters.dash);
  cnpjArray.splice(8, 0, userOptions.delimiters.slash);
  cnpjArray.splice(5, 0, userOptions.delimiters.dot);
  cnpjArray.splice(2, 0, userOptions.delimiters.dot);
  const cnpjPretty = cnpjArray.join('');

  if (userOptions.escape) {
    return html.escape(cnpjPretty);
  }

  return cnpjPretty;
}

export default cnpjFmt;
