import cnpjFmt from '@lacussoft/cnpj-fmt'
import numOnly from 'num-only'

import calculateDigit from './calculate-digit'
import mergeOptions from './merge-options'
import type { CnpjGeneratorOptions } from './merge-options'
import numberGenerator from './number-generator'


/**
 * Generate a valid CNPJ (Brazilian company ID) numeric sequence.
 */
function cnpjGen(options?: CnpjGeneratorOptions) {
  const userOptions = mergeOptions(options)
  const baseSequence = numOnly(userOptions.prefix)
  const prefixLength = baseSequence.length

  if (prefixLength < 0 || prefixLength > 12) {
    throw new Error('Option "prefix" must be a string containing between 1 and 12 digits.')
  }
  if (prefixLength > 8 && baseSequence.slice(8) === '0000') {
    throw new Error('The branch ID (characters 8 to 11) cannot be "0000".')
  }

  const branchID = [0, 0, 0, Math.ceil(Math.random() * 9)]
  const cnpjSequence = baseSequence
    .split('')
    .map(Number)
    .concat(numberGenerator(8 - prefixLength))
    .concat(branchID.slice(0, 12 - prefixLength))

  cnpjSequence.push(calculateDigit(cnpjSequence))
  cnpjSequence.push(calculateDigit(cnpjSequence))

  return userOptions.format
    ? cnpjFmt(cnpjSequence.join(''))
    : cnpjSequence.join('')
}

export default cnpjGen
