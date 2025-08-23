import cpfGen from '@lacussoft/cpf-gen';
import numOnly from 'num-only';

/**
 * Validate a given CPF (Brazilian ID document) char sequence.
 */
function cpfVal(cpfString: string): boolean {
  const CPF_LENGTH = 11;
  const cpfDigits = numOnly(cpfString);

  if (cpfDigits.length !== CPF_LENGTH) {
    return false;
  }

  return (
    cpfDigits ===
    cpfGen({
      prefix: cpfDigits.substring(0, 9),
    })
  );
}

export default cpfVal;
