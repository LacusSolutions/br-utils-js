import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjGen } from '../src/cnpj-gen';
import { CnpjGenerator } from '../src/cnpj-generator';

describe('cnpjGen', (): void => {
  let generateSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    generateSpy = spyOn(CnpjGenerator.prototype, 'generate').mockImplementation((): string => '');
  });

  afterEach((): void => {
    generateSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `generate` method on the `CnpjGenerator` instance', (): void => {
      cnpjGen();

      expect(generateSpy).toHaveBeenCalled();
    });
  });
});
