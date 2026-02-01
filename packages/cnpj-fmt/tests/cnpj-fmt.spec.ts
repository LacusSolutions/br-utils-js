import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

import { cnpjFmt } from '../src/cnpj-fmt';
import { CnpjFormatter } from '../src/cnpj-formatter';

describe('cnpjFmt', (): void => {
  let formatSpy: ReturnType<typeof spyOn>;

  beforeEach((): void => {
    formatSpy = spyOn(CnpjFormatter.prototype, 'format').mockImplementation((): string => '');
  });

  afterEach((): void => {
    formatSpy.mockRestore();
  });

  describe('when called', (): void => {
    it('calls the `format` method on the `CnpjFormatter` instance', (): void => {
      cnpjFmt('91415732000793');

      expect(formatSpy).toHaveBeenCalledWith('91415732000793');
    });
  });
});
