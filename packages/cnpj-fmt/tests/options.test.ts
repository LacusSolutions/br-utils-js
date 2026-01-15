import { expect, test } from 'bun:test';

import cnpjFmt from '..';

test('"03.603.568/0001-95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03.603.568/0001-95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03603568000195" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03603568000195');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03-603-568-0001-95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03-603-568-0001-95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03 603 568 / 0001 95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03 603 568 / 0001 95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03603568000195 " formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03603568000195 ');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('" 03603568000195" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt(' 03603568000195');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"0.3.6.0.3.5.6.8.0.0.0.1.9.5" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('0.3.6.0.3.5.6.8.0.0.0.1.9.5');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"0-3-6-0-3-5-6-8-/-0-0-0-1-95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('0-3-6-0-3-5-6-8-/-0-0-0-1-95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"0 3 6 0 3 5 6 8 0 0 0 1 9 5" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('0 3 6 0 3 5 6 8 0 0 0 1 9 5');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03603568slash0001dash95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('03603568slash0001dash95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"036035680001 dv 95" formats to "03.603.568/0001-95"', () => {
  const cnpj = cnpjFmt('036035680001 dv 95');

  expect(cnpj).toBe('03.603.568/0001-95');
});

test('"03603568000195" formats to "03603568/0001-95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    dotKey: '',
  });

  expect(cnpj).toBe('03603568/0001-95');
});

test('"03603568000195" formats to "03.603.568:0001-95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    slashKey: ':',
  });

  expect(cnpj).toBe('03.603.568:0001-95');
});

test('"03603568000195" formats to "03.603.568/0001.95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    dashKey: '.',
  });

  expect(cnpj).toBe('03.603.568/0001.95');
});

test('"03.603.568/0001-95" formats to "03603568000195"', () => {
  const cnpj = cnpjFmt('03.603.568/0001-95', {
    dotKey: '',
    slashKey: '',
    dashKey: '',
  });

  expect(cnpj).toBe('03603568000195');
});

test('"03603568000195" formats to "03&lt;603&lt;568&amp;0001&gt;95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    dotKey: '<',
    slashKey: '&',
    dashKey: '>',
    escape: true,
  });

  expect(cnpj).toBe('03&lt;603&lt;568&amp;0001&gt;95');
});

test('"03603568000195" formats to "03.603.***/****-**"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
  });

  expect(cnpj).toBe('03.603.***/****-**');
});

test('"03603568000195" formats to "03.603.568/****-**"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenStart: 8,
  });

  expect(cnpj).toBe('03.603.568/****-**');
});

test('"03603568000195" formats to "03.603.***/****-95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenEnd: 11,
  });

  expect(cnpj).toBe('03.603.***/****-95');
});

test('"03603568000195" formats to "**.***.***/0001-95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenStart: 0,
    hiddenEnd: 7,
  });

  expect(cnpj).toBe('**.***.***/0001-95');
});

test('"03603568000195" formats to "03.***.***/****-95"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenStart: 11,
    hiddenEnd: 2,
  });

  expect(cnpj).toBe('03.***.***/****-95');
});

test('"03603568000195" formats to "03.603.###/####-##"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenKey: '#',
  });

  expect(cnpj).toBe('03.603.###/####-##');
});

test('"03603568000195" formats to "03.603.568/####-##"', () => {
  const cnpj = cnpjFmt('03603568000195', {
    hidden: true,
    hiddenKey: '#',
    hiddenStart: 8,
  });

  expect(cnpj).toBe('03.603.568/####-##');
});

test('"abc" falls back to "ABC"', () => {
  const cnpj = cnpjFmt('abc', {
    onFail: (value: string) => String(value).toUpperCase(),
  });

  expect(cnpj).toBe('ABC');
});
