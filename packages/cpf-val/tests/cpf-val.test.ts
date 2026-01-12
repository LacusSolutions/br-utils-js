import { expect, test } from 'bun:test';

import cpfVal from '..';

test('CPF string "499.784.420-90" is valid', () => {
  expect(cpfVal('499.784.420-90')).toBeTruthy();
});

test('CPF string "028.062.110.85" is valid', () => {
  expect(cpfVal('028.062.110.85')).toBeTruthy();
});

test('CPF string "011_258_960_00" is valid', () => {
  expect(cpfVal('011_258_960_00')).toBeTruthy();
});

test('CPF string "779953010-30" is valid', () => {
  expect(cpfVal('779953010-30')).toBeTruthy();
});

test('CPF string "86244870050" is valid', () => {
  expect(cpfVal('86244870050')).toBeTruthy();
});

test('CPF string "22312659077" is valid', () => {
  expect(cpfVal('22312659077')).toBeTruthy();
});

test('CPF string "96215666068" is valid', () => {
  expect(cpfVal('96215666068')).toBeTruthy();
});

test('CPF string "67107095072" is valid', () => {
  expect(cpfVal('67107095072')).toBeTruthy();
});

test('CPF string "48039958008" is valid', () => {
  expect(cpfVal('48039958008')).toBeTruthy();
});

test('CPF string "20954431014" is valid', () => {
  expect(cpfVal('20954431014')).toBeTruthy();
});

test('CPF string "090.871.219-71" is NOT valid', () => {
  expect(cpfVal('090.871.219-71')).toBeFalsy();
});

test('CPF string "081.465.729.10" is NOT valid', () => {
  expect(cpfVal('081.465.729.10')).toBeFalsy();
});

test('CPF string "011_258_960_99" is NOT valid', () => {
  expect(cpfVal('011_258_960_99')).toBeFalsy();
});

test('CPF string "499784420-75" is NOT valid', () => {
  expect(cpfVal('499784420-75')).toBeFalsy();
});

test('CPF string "86244870011" is NOT valid', () => {
  expect(cpfVal('86244870011')).toBeFalsy();
});

/*
 * Other random values are invalid
 */

test('Value 123 is NOT valid', () => {
  expect(cpfVal(123 as unknown as string)).toBeFalsy();
});

test('Value 123456 is NOT valid', () => {
  expect(cpfVal(123456 as unknown as string)).toBeFalsy();
});

test('Value 123456789 is NOT valid', () => {
  expect(cpfVal(123456789 as unknown as string)).toBeFalsy();
});

test('Value "abc" is NOT valid', () => {
  expect(cpfVal('abc')).toBeFalsy();
});

test('Value "abc123" is NOT valid', () => {
  expect(cpfVal('abc123')).toBeFalsy();
});

test('Value "true" is NOT valid', () => {
  expect(cpfVal(true as unknown as string)).toBeFalsy();
});

test('Value "false" is NOT valid', () => {
  expect(cpfVal(false as unknown as string)).toBeFalsy();
});

test('Value "undefined" is NOT valid', () => {
  expect(cpfVal(undefined as unknown as string)).toBeFalsy();
});

test('Value "Infinity" is NOT valid', () => {
  expect(cpfVal(Infinity as unknown as string)).toBeFalsy();
});

test('Value "null" is NOT valid', () => {
  expect(cpfVal(null as unknown as string)).toBeFalsy();
});

test('An array [1, 2, 3] is NOT valid', () => {
  expect(cpfVal([1, 2, 3] as unknown as string)).toBeFalsy();
});

test('An object { a: 1, b: 2, c:3 } is NOT valid', () => {
  expect(cpfVal({ a: 1, b: 2, c: 3 } as unknown as string)).toBeFalsy();
});

test('A function is NOT valid', () => {
  expect(cpfVal((() => {}) as unknown as string)).toBeFalsy();
});
