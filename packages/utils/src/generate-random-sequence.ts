import type { CnpjType } from './types';

const NUMERIC_CHARACTERS = '0123456789';
const ALPHABETIC_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUMERIC_CHARACTERS = NUMERIC_CHARACTERS + ALPHABETIC_CHARACTERS;

/**
 * Generates a random character sequence of the given length and type (numeric,
 * alphabetic, or alphanumeric).
 *
 * @example
 *   generateRandomSequence(10, 'numeric'); // e.g. '9956000611'
 *   generateRandomSequence(6, 'alphabetic'); // e.g. 'AXQMZB'
 *   generateRandomSequence(8, 'alphanumeric'); // e.g. '8ZFB2K09'
 */
export function generateRandomSequence(size: number, type: CnpjType): string {
  const charactersSequence: string[] = [];
  let charactersRange = ALPHANUMERIC_CHARACTERS;

  if (type === 'numeric') {
    charactersRange = NUMERIC_CHARACTERS;
  } else if (type === 'alphabetic') {
    charactersRange = ALPHABETIC_CHARACTERS;
  }

  while (charactersSequence.length < size) {
    const random = Math.random();
    const randomFloat = random * charactersRange.length;
    const randomInteger = Math.floor(randomFloat);
    const randomCharacter = charactersRange[randomInteger];

    charactersSequence.push(randomCharacter);
  }

  return charactersSequence.join('');
}
