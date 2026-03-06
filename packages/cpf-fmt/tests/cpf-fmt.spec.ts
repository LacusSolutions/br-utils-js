import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cpfFmt } from '../src/cpf-fmt';
import { CpfFormatter } from '../src/cpf-formatter';

describe('cpfFmt', () => {
  let formatSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    formatSpy = spyOn(CpfFormatter.prototype, 'format').mockImplementation((): string => '');
  });

  afterEach(() => {
    formatSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `format` method on the `CpfFormatter` instance', () => {
      cpfFmt('12345678910');

      expect(formatSpy).toHaveBeenCalledWith('12345678910');
    });
  });
});
