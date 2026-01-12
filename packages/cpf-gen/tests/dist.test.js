import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    await expect(file.text()).resolves.toContain('module.exports = cpfGen');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfGen as default }');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cpfGen as default }');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-gen.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfGen"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfGen;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('cpfGen');
    expect(globalFunction()).toMatch(/\d{11}/);
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-gen.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cpfGen"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cpfGen;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('');
    expect(globalFunction()).toMatch(/\d{11}/);
  });
});
