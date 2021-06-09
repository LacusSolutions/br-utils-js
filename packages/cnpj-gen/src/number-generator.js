
/**
 * Generate an array of random numbers (as string) between 0 and  9.
 *
 * @param {number} length
 * @return {number[]}
 */
function numberGenerator(length) {
  const numericSequence = [];

  while (numericSequence.length < length) {
    const random = Math.random() * 10;
    const integer = Math.floor(random);

    numericSequence.push(integer);
  }

  return numericSequence;
}

export default numberGenerator;
