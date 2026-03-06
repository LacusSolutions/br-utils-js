import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjVal } from '../src/cnpj-val';
import { CnpjValidator } from '../src/cnpj-validator';

describe('cnpjVal', () => {
  let isValidSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    isValidSpy = spyOn(CnpjValidator.prototype, 'isValid').mockImplementation((): boolean => true);
  });

  afterEach(() => {
    isValidSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `isValid` method on the `CnpjValidator` instance', () => {
      cnpjVal('12345678910');

      expect(isValidSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
