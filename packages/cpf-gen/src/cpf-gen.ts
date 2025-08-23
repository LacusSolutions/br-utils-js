import cpfFmt from '@lacussoft/cpf-fmt';
import numOnly from 'num-only';

import mergeOptions from './merge-options';
import type { CpfGeneratorOptions } from './merge-options';
import numberGenerator from './number-generator';

/**
 * Generate a valid CPF (Brazilian ID document) numeric sequence.
 */
function cpfGen(options?: CpfGeneratorOptions): string {
  const userOptions = mergeOptions(options);
  const baseSequence = numOnly(userOptions.prefix);
  const prefixLength = baseSequence.length;

  if (prefixLength < 0 || prefixLength > 9) {
    throw new Error('Option "prefix" must be a string containing between 1 and 9 digits.');
  }

  const cpfSequence = baseSequence
    .split('')
    .map(Number)
    .concat(numberGenerator(9 - prefixLength));
  [9, 10].forEach((nextNumIndex) => {
    let factor = nextNumIndex + 1;
    let sum = 0;

    for (let n = 0; n < nextNumIndex; n++, factor--) {
      sum += cpfSequence[n] * factor;
    }

    const remainder = 11 - (sum % 11);
    cpfSequence.push(remainder > 9 ? 0 : remainder);
  });

  return userOptions.format ? cpfFmt(cpfSequence.join('')) : cpfSequence.join('');
}

export default cpfGen;
