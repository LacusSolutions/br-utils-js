import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    await expect(file.text()).resolves.toContain('module.exports = cnpjFmt');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cnpjFmt as default }');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    await expect(file.text()).resolves.toContain('export { cnpjFmt as default }');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-fmt.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cnpjFmt"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cnpjFmt;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('cnpjFmt');
    expect(globalFunction('12345678000910')).toBe('12.345.678/0009-10');
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-fmt.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global function called "cnpjFmt"', async () => {
    const fileContent = await file.text();
    const makeGlobalFunction = new Function(`${fileContent}\nreturn cnpjFmt;`);
    const globalFunction = makeGlobalFunction();

    expect(typeof globalFunction).toBe('function');
    expect(globalFunction.name).toBe('');
    expect(globalFunction('12345678000910')).toBe('12.345.678/0009-10');
  });
});
