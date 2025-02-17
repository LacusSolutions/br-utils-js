import cnpjGen from '@lacussoft/cnpj-gen'
import numOnly from 'num-only'

/**
 * Validate a given CNPJ (Brazilian company ID) char sequence.
 */
function cnpjVal(cnpjString: string) {
  const CNPJ_LENGTH = 14
  const cnpjDigits = numOnly(cnpjString)

  if (cnpjDigits.length !== CNPJ_LENGTH) {
    return false
  }

  return cnpjDigits === cnpjGen({
    prefix: cnpjDigits.slice(0, 12),
  })
}

export default cnpjVal
