import { describe, expect, it, type Test } from 'bun:test';

import { generateRandomSequence } from '../src/generate-random-sequence';
import type { SequenceType } from '../src/types';

describe('generateRandomSequence', () => {
  interface Sequence {
    index: number;
    result: string;
  }

  function assertEach(times: number, size: number, type: SequenceType): Test<[Sequence]> {
    const results: Sequence[] = [];

    for (let i = 0; i < times; i++) {
      results.push({
        result: generateRandomSequence(size, type),
        index: i + 1,
      });
    }

    return it.each(results);
  }

  describe('when generating numeric sequences', () => {
    assertEach(
      20,
      32,
      'numeric',
    )('generated 32-length sequences (#$index)', ({ result }) => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'numeric',
    )('does not contain letters (#$index)', ({ result }) => {
      expect(result).not.toMatch(/\D/);
    });

    assertEach(
      50,
      100,
      'numeric',
    )('only contains numbers (#$index)', ({ result }) => {
      expect(result).toMatch(/^\d+$/);
    });
  });

  describe('when generating alphabetic sequences', () => {
    assertEach(
      20,
      32,
      'alphabetic',
    )('generated 32-length sequences (#$index)', ({ result }) => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('does not contain numbers (#$index)', ({ result }) => {
      expect(result).not.toMatch(/\d/);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('does not contain lowercase letters (#$index)', ({ result }) => {
      expect(result).not.toMatch(/[a-z]/);
    });

    assertEach(
      50,
      100,
      'alphabetic',
    )('only contains uppercase letters (#$index)', ({ result }) => {
      expect(result).toMatch(/^[A-Z]+$/);
    });
  });

  describe('when generating alphanumeric sequences', () => {
    assertEach(
      20,
      32,
      'alphanumeric',
    )('generated 32-length sequences (#$index)', ({ result }) => {
      expect(result).toHaveLength(32);
    });

    assertEach(
      50,
      100,
      'alphanumeric',
    )('does not contain lowercase letters (#$index)', ({ result }) => {
      expect(result).not.toMatch(/[a-z]/);
    });

    assertEach(
      50,
      100,
      'alphanumeric',
    )('only contains numbers and uppercase letters (#$index)', ({ result }) => {
      expect(result).toMatch(/^[0-9A-Z]+$/);
    });
  });
});
