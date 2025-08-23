import { expect, test } from 'bun:test';
import { validate } from 'cpf-check';

import cpfGen from '..';

test('Result length equals to 11 (no formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cpf = cpfGen();

    expect(cpf.length).toBe(11);
  }
});

test('Result length equals to 14 (with formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cpf = cpfGen({ format: true });

    expect(cpf.length).toBe(14);
  }
});

test('Generated CPF is valid (no formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cpf = cpfGen();

    expect(validate(cpf)).toBeTruthy();
  }
});

test('Generated formatted CPF is valid (with formatting)', () => {
  for (let i = 0; i < 25; i++) {
    const cpf = cpfGen({ format: true });

    expect(validate(cpf)).toBeTruthy();
  }
});

test('Generated CPF is valid (with prefix)', () => {
  Array.from([
    '1',
    '12',
    '123',
    '1234',
    '12345',
    '123456',
    '1234567',
    '12345678',
    '123456789',
    '123.456.789',
  ]).forEach((prefix) => {
    const cpf = cpfGen({ prefix });

    expect(validate(cpf)).toBeTruthy();
  });
});

test('Formatted CPF matches "###.###.###-##"', () => {
  for (let i = 0; i < 25; i++) {
    const cpf = cpfGen({ format: true });

    expect(cpf).toMatch(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/);
  }
});
