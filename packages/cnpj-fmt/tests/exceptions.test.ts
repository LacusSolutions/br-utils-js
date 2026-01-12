import { expect, test } from 'bun:test';

import cnpjFmt from '..';

test('Option with range start -1 throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenRange: { start: -1 },
    });
  }

  expect(cnpj).toThrow(TypeError);
});

test('Option with range start greater than 13 throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenRange: { start: 14 },
    });
  }

  expect(cnpj).toThrow(TypeError);
});

test('Option with range end -1 throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenRange: { end: -1 },
    });
  }

  expect(cnpj).toThrow(TypeError);
});

test('Option with range end greater than 13 throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', {
      hidden: true,
      hiddenRange: { end: 14 },
    });
  }

  expect(cnpj).toThrow(TypeError);
});

test('Option with onFail as not a function throws TypeError', () => {
  function cnpj() {
    return cnpjFmt('03603568000195', { onFail: 'testing' });
  }

  expect(cnpj).toThrow(TypeError);
});
