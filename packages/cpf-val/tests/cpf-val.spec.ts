import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfVal } from '../src/cpf-val';
import { CpfValidator } from '../src/cpf-validator';

describe('cpfVal', () => {
  let isValidSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    isValidSpy = spyOn(CpfValidator.prototype, 'isValid').mockImplementation((): boolean => true);
  });

  afterEach(() => {
    isValidSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `isValid` method on the `CpfValidator` instance', () => {
      cpfVal('12345678910');

      expect(isValidSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
