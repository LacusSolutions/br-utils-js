import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjGen } from '../src/cnpj-gen';
import { CnpjGenerator } from '../src/cnpj-generator';

describe('cnpjGen', () => {
  let generateSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    generateSpy = spyOn(CnpjGenerator.prototype, 'generate').mockImplementation((): string => '');
  });

  afterEach(() => {
    generateSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `generate` method on the `CnpjGenerator` instance', () => {
      cnpjGen();

      expect(generateSpy).toHaveBeenCalled();
    });
  });
});
