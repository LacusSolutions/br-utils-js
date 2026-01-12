import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    await expect(file.text()).resolves.toContain('module.exports = cpfFmt');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfFmt as default }');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfFmt as default }');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-fmt.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfFmt"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfFmt;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('cpfFmt');
    expect(globalFunction(12345678910)).toBe('123.456.789-10');
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-fmt.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfFmt"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfFmt;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('');
    expect(globalFunction(12345678910)).toBe('123.456.789-10');
  });
});
