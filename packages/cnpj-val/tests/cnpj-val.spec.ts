import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjVal } from '../src/cnpj-val';
import { CnpjValidator } from '../src/cnpj-validator';

describe('cnpjVal', (): void => {
  let isValidSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    isValidSpy = spyOn(CnpjValidator.prototype, 'isValid').mockImplementation((): boolean => true);
  });

  afterEach((): void => {
    isValidSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `generate` method on the `CnpjGenerator` instance', (): void => {
      cnpjVal('12345678910');

      expect(isValidSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
