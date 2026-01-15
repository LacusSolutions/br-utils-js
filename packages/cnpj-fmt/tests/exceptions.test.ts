import { expect, test } from 'bun:test';

import cnpjFmt from '..';

test('Option with range start -1 throws CnpjFormatterHiddenRangeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenStart: -1,
    });
  }

  expect(cnpj).toThrow();
});

test('Option with range start greater than 13 throws CnpjFormatterHiddenRangeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenStart: 14,
    });
  }

  expect(cnpj).toThrow();
});

test('Option with range end -1 throws CnpjFormatterHiddenRangeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenEnd: -1,
    });
  }

  expect(cnpj).toThrow();
});

test('Option with range end greater than 13 throws CnpjFormatterHiddenRangeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenEnd: 14,
    });
  }

  expect(cnpj).toThrow();
});

test('Option with onFail as not a function throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', { onFail: 'testing' as unknown as () => string });
  }

  expect(cnpj).toThrow(TypeError);
});
