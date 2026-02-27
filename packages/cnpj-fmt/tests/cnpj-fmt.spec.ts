import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjFmt } from '../src/cnpj-fmt';
import { CnpjFormatter } from '../src/cnpj-formatter';

describe('cnpjFmt', () => {
  let formatSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    formatSpy = spyOn(CnpjFormatter.prototype, 'format').mockImplementation((): string => '');
  });

  afterEach(() => {
    formatSpy.mockRestore();
  });

  describe('when called', () => {
    it('calls the `format` method on the `CnpjFormatter` instance', () => {
      cnpjFmt('91415732000793');

      expect(formatSpy).toHaveBeenCalledWith('91415732000793');
    });
  });
});
