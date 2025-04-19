/**
 * Generate an array of random stringified numbers between 0 and  9.
 */
function numberGenerator(length: number): number[] {
  const numericSequence: number[] = [];

  while (numericSequence.length < length) {
    const random = Math.random() * 10;
    const integer = Math.floor(random);

    numericSequence.push(integer);
  }

  return numericSequence;
}

export default numberGenerator;
