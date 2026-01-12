import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    await expect(file.text()).resolves.toContain('module.exports = cpfVal');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfVal as default }');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfVal as default }');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-val.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfVal"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfVal;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('cpfVal');
    expect(globalFunction('86244870050')).toBe(true);
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-val.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfVal"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfVal;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('');
    expect(globalFunction('86244870050')).toBe(true);
  });
});
