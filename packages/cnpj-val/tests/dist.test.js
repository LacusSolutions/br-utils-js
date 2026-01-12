import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    await expect(file.text()).resolves.toContain('module.exports = cnpjVal');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cnpjVal as default }');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cnpjVal as default }');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-val.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cnpjVal"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cnpjVal;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('cnpjVal');
    expect(globalFunction('45924295000805')).toBe(true);
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-val.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cnpjVal"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cnpjVal;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('');
    expect(globalFunction('45924295000805')).toBe(true);
  });
});
