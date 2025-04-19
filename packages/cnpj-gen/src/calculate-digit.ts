/**
 * Calculate the verifier digit based on CNPJ base numeric sequence.
 */
function calculateDigit(cnpjSequence: number[]): number {
  let index = 2;
  const sum = [...cnpjSequence].reduceRight((previousResult, number) => {
    const result = previousResult + number * index;
    index = index === 9 ? 2 : index + 1;

    return result;
  }, 0);

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}

export default calculateDigit;
