import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfGen } from '../src/cpf-gen';
import { CpfGenerator } from '../src/cpf-generator';

describe('cpfGen', (): void => {
  let generateSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    generateSpy = spyOn(CpfGenerator.prototype, 'generate').mockImplementation((): string => '');
  });

  afterEach((): void => {
    generateSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `generate` method on the `CpfGenerator` instance', (): void => {
      cpfGen();

      expect(generateSpy).toHaveBeenCalled();
    });
  });
});
