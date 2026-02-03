import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfFmt } from '../src/cpf-fmt';
import { CpfFormatter } from '../src/cpf-formatter';

describe('cpfFmt', (): void => {
  let formatSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    formatSpy = spyOn(CpfFormatter.prototype, 'format').mockImplementation((): string => '');
  });

  afterEach((): void => {
    formatSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `format` method on the `CpfFormatter` instance', (): void => {
      cpfFmt('12345678910');

      expect(formatSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
