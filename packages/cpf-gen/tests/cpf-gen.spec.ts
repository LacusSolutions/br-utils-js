import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfGen } from '../src/cpf-gen';
import { CpfGenerator } from '../src/cpf-generator';

describe('cpfGen', () => {
  let generateSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    generateSpy = spyOn(CpfGenerator.prototype, 'generate').mockImplementation((): string => '');
  });

  afterEach(() => {
    generateSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `generate` method on the `CpfGenerator` instance', () => {
      cpfGen();

      expect(generateSpy).toHaveBeenCalled();
    });
  });
});
