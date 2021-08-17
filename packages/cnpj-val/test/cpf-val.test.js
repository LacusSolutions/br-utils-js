/* eslint-disable @typescript-eslint/no-var-requires */
const cnpjVal = require('..')

test('CNPJ string "22.250.620/0001-11" is valid', () => {
  expect(cnpjVal('22.250.620/0001-11')).toBeTruthy()
})

test('CNPJ string "53.975.985/0001.37" is valid', () => {
  expect(cnpjVal('53.975.985/0001.37')).toBeTruthy()
})

test('CNPJ string "31_592_118|0001_80" is valid', () => {
  expect(cnpjVal('31_592_118|0001_80')).toBeTruthy()
})

test('CNPJ string "188549330001-01" is valid', () => {
  expect(cnpjVal('188549330001-01')).toBeTruthy()
})

test('CNPJ string "19593887000105" is valid', () => {
  expect(cnpjVal('19593887000105')).toBeTruthy()
})

test('CNPJ string "99042801000187" is valid', () => {
  expect(cnpjVal('99042801000187')).toBeTruthy()
})

test('CNPJ string "27728000000169" is valid', () => {
  expect(cnpjVal('27728000000169')).toBeTruthy()
})

test('CNPJ string "72199088000123" is valid', () => {
  expect(cnpjVal('72199088000123')).toBeTruthy()
})

test('CNPJ string "00113719000139" is valid', () => {
  expect(cnpjVal('00113719000139')).toBeTruthy()
})

test('CNPJ string "50096743000185" is valid', () => {
  expect(cnpjVal('50096743000185')).toBeTruthy()
})

test('CNPJ string "68.224.994/0001-62" is NOT valid', () => {
  expect(cnpjVal('68.224.994/0001-62')).toBeFalsy()
})

test('CNPJ string "41.406.219|0001.73" is NOT valid', () => {
  expect(cnpjVal('41.406.219|0001.73')).toBeFalsy()
})

test('CNPJ string "46_063_859#0001_41" is NOT valid', () => {
  expect(cnpjVal('46_063_859#0001_41')).toBeFalsy()
})

test('CNPJ string "54964126/000106" is NOT valid', () => {
  expect(cnpjVal('54964126/000106')).toBeFalsy()
})

test('CNPJ string "03783943000127" is NOT valid', () => {
  expect(cnpjVal('03783943000127')).toBeFalsy()
})


/*
 * Other random values are invalid
 */

test('Value 123 is NOT valid', () => {
  expect(cnpjVal(123)).toBeFalsy()
})

test('Value 123456 is NOT valid', () => {
  expect(cnpjVal(123456)).toBeFalsy()
})

test('Value 123456789 is NOT valid', () => {
  expect(cnpjVal(123456789)).toBeFalsy()
})

test('Value "abc" is NOT valid', () => {
  expect(cnpjVal('abc')).toBeFalsy()
})

test('Value "abc123" is NOT valid', () => {
  expect(cnpjVal('abc123')).toBeFalsy()
})

test('Value "true" is NOT valid', () => {
  expect(cnpjVal(true)).toBeFalsy()
})

test('Value "false" is NOT valid', () => {
  expect(cnpjVal(false)).toBeFalsy()
})

test('Value "undefined" is NOT valid', () => {
  expect(cnpjVal(undefined)).toBeFalsy()
})

test('Value "Infinity" is NOT valid', () => {
  expect(cnpjVal(Infinity)).toBeFalsy()
})

test('Value "null" is NOT valid', () => {
  expect(cnpjVal(null)).toBeFalsy()
})

test('An array [1, 2, 3] is NOT valid', () => {
  expect(cnpjVal([1, 2, 3])).toBeFalsy()
})

test('An object { a: 1, b: 2, c:3 } is NOT valid', () => {
  expect(cnpjVal({ a: 1, b: 2, c: 3 })).toBeFalsy()
})

test('A function is NOT valid', () => {
  expect(cnpjVal(() => {})).toBeFalsy()
})
