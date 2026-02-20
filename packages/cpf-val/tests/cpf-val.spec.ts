import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfVal } from '../src/cpf-val';
import { CpfValidator } from '../src/cpf-validator';

describe('cpfVal', (): void => {
  let isValidSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    isValidSpy = spyOn(CpfValidator.prototype, 'isValid').mockImplementation((): boolean => true);
  });

  afterEach((): void => {
    isValidSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `isValid` method on the `CpfValidator` instance', (): void => {
      cpfVal('12345678910');

      expect(isValidSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
