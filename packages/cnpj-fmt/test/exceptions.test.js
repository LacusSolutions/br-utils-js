/* eslint-disable @typescript-eslint/no-var-requires */
const cnpjFmt = require('..')

test('Option with range start -1 throws TypeError', () => {
  const cnpj = () => cnpjFmt('03603568000195', {
    hidden: true,
    hiddenRange: { start: -1 },
  })
  expect(cnpj).toThrow(TypeError)
})

test('Option with range start greater than 13 throws TypeError', () => {
  const cnpj = () => cnpjFmt('03603568000195', {
    hidden: true,
    hiddenRange: { start: 14 },
  })
  expect(cnpj).toThrow(TypeError)
})

test('Option with range end -1 throws TypeError', () => {
  const cnpj = () => cnpjFmt('03603568000195', {
    hidden: true,
    hiddenRange: { end: -1 },
  })
  expect(cnpj).toThrow(TypeError)
})

test('Option with range end greater than 13 throws TypeError', () => {
  const cnpj = () => cnpjFmt('03603568000195', {
    hidden: true,
    hiddenRange: { end: 14 },
  })
  expect(cnpj).toThrow(TypeError)
})

test('Option with onfail as not a function throws TypeError', () => {
  const cnpj = () => cnpjFmt('03603568000195', { onFail: 'testing' })
  expect(cnpj).toThrow(TypeError)
})
