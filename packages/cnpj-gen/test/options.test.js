/* eslint-disable @typescript-eslint/no-var-requires */
const { validate } = require('cnpj')
const cnpjGen = require('..')

test('Result length equals to 14 (no formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cnpj = cnpjGen()
    expect(cnpj.length).toBe(14)
  }
})

test('Result length equals to 18 (with formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cnpj = cnpjGen({ format: true })
    expect(cnpj.length).toBe(18)
  }
})

test('Generated CNPJ is valid (no formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cnpj = cnpjGen()
    expect(validate(cnpj)).toBeTruthy()
  }
})

test('Generated formatted CNPJ is valid (with formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cnpj = cnpjGen({ format: true })
    expect(validate(cnpj)).toBeTruthy()
  }
})

test('Generated CNPJ is valid (with prefix)', () => {
  Array.from([
    '1', '12', '123', '1234', '12345', '123456', '1234567',
    '12345678', '123456789', '1234567890', '12345678900',
    '123456789000', '123456780009', '12.345.678/0009',
  ]).forEach((prefix) => {
    const cnpj = cnpjGen({ prefix })
    expect(validate(cnpj)).toBeTruthy()
  })
})

test('Formatted CNPJ matches "##.###.###/####-##"', () => {
  for (let i = 0; i < 25; i++) {
    const cnpj = cnpjGen({ format: true })
    expect(cnpj).toMatch(/(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})/)
  }
})
