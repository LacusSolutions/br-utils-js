import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../build/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    const codebase = await file.text();

    expect(codebase).toContain('exports.cnpj = ');
    expect(codebase).toContain('exports.cpf = ');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../build/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    const codebase = await file.text();

    expect(codebase).toMatch(/export \{.* default/);
    expect(codebase).toMatch(/export \{.* cnpj/);
    expect(codebase).toMatch(/export \{.* cpf/);
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../build/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    const codebase = await file.text();

    expect(codebase).toMatch(/export \{.* default/);
    expect(codebase).toMatch(/export \{.* cnpj/);
    expect(codebase).toMatch(/export \{.* cpf/);
  });
});
