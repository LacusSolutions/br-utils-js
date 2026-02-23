import { describe, expect, it, type Test } from 'bun:test';

import { generateRandomSequence } from '../src/generate-random-sequence';
import type { CnpjType } from '../src/types';

describe('generateRandomSequence', (): void => {
  interface Sequence {
    index: number;
    result: string;
  }

  function assertEach(times: number, size: number, type: CnpjType): Test<[Sequence]> {
    const results: Sequence[] = [];

    for (let i = 0; i < times; i++) {
      results.push({
        result: generateRandomSequence(size, type),
        index: i + 1,
      });
    }

    return it.each(results);
  }

  describe('when generating numeric sequences', (): void => {
    assertEach(
      20,
      32,
      'numeric',
    )('generated 32-length sequences (#$index)', ({ result }): void => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'numeric',
    )('does not contain letters (#$index)', ({ result }): void => {
      expect(result).not.toMatch(/\D/);
    });

    assertEach(
      50,
      100,
      'numeric',
    )('only contains numbers (#$index)', ({ result }): void => {
      expect(result).toMatch(/^\d+$/);
    });
  });

  describe('when generating alphabetic sequences', (): void => {
    assertEach(
      20,
      32,
      'alphabetic',
    )('generated 32-length sequences (#$index)', ({ result }): void => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('does not contain numbers (#$index)', ({ result }): void => {
      expect(result).not.toMatch(/\d/);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('does not contain lowercase letters (#$index)', ({ result }): void => {
      expect(result).not.toMatch(/[a-z]/);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('only contains uppercase letters (#$index)', ({ result }): void => {
      expect(result).toMatch(/^[A-Z]+$/);
    });
  });

  describe('when generating alphanumeric sequences', (): void => {
    assertEach(
      20,
      32,
      'alphanumeric',
    )('generated 32-length sequences (#$index)', ({ result }): void => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'alphanumeric',
    )('does not contain lowercase letters (#$index)', ({ result }): void => {
      expect(result).not.toMatch(/[a-z]/);
    });

    assertEach(
      50,
      100,
      'alphanumeric',
    )('only contains numbers and uppercase letters (#$index)', ({ result }): void => {
      expect(result).toMatch(/^[0-9A-Z]+$/);
    });
  });
});
