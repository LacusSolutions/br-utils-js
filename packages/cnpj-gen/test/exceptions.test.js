import { expect, test } from 'bun:test';

import cnpjGen from '..';

test('Prefixed value cannot accept string with more than 12 digits', () => {
  expect(() => cnpjGen({ prefix: '12.345.678/0000-99' })).toThrow(Error);
  expect(() => cnpjGen({ prefix: '12345678000099' })).toThrow(Error);
});
