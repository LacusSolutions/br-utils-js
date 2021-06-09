import cnpjGen from '@lacussoft/cnpj-gen';
import numOnly from 'num-only';

/**
 * Validate a given CNPJ (Brazilian employer ID) char sequence.
 *
 * @param {string} cnpjString
 * @return {boolean}
 */
function cnpjVal(cnpjString) {
  const CNPJ_LENGTH = 14;
  const cnpjDigits = numOnly(cnpjString);

  if (cnpjDigits.length !== CNPJ_LENGTH) {
    return false;
  }

  return cnpjDigits === cnpjGen({
    prefix: cnpjDigits.slice(0, 12),
  });
}

export default cnpjVal;
