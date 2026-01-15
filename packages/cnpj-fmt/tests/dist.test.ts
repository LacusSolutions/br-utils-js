import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file exports cnpjFmt as named export', async () => {
    await expect(file.text()).resolves.toContain('exports.cnpjFmt = cnpjFmt');
  });

  test('file exports default as cnpjFmt', async () => {
    await expect(file.text()).resolves.toContain('exports.default = cnpjFmt');
  });

  test('file exports CnpjFormatter class', async () => {
    await expect(file.text()).resolves.toContain('exports.CnpjFormatter = CnpjFormatter');
  });

  test('file exports CnpjFormatterOptions class', async () => {
    await expect(file.text()).resolves.toContain('exports.CnpjFormatterOptions = CnpjFormatterOptions');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains named exports including cnpjFmt as default', async () => {
    await expect(file.text()).resolves.toContain('cnpjFmt as default');
  });

  test('file contains CnpjFormatter export', async () => {
    await expect(file.text()).resolves.toContain('CnpjFormatter');
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains cnpjFmt as default export', async () => {
    await expect(file.text()).resolves.toContain('cnpjFmt as default');
  });

  test('file contains CnpjFormatter class declaration', async () => {
    await expect(file.text()).resolves.toContain('declare class CnpjFormatter');
  });

  test('file contains CnpjFormatterOptions class declaration', async () => {
    await expect(file.text()).resolves.toContain('declare class CnpjFormatterOptions');
  });

  test('file contains exception class declarations', async () => {
    const content = await file.text();
    expect(content).toContain('declare class CnpjFormatterError');
    expect(content).toContain('declare class CnpjFormatterInvalidLengthError');
    expect(content).toContain('declare class CnpjFormatterHiddenRangeError');
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-fmt.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object with cnpjFmt function', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cnpjFmt;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(typeof globalObject.cnpjFmt).toBe('function');
    expect(typeof globalObject.default).toBe('function');
    expect(typeof globalObject.CnpjFormatter).toBe('function');
    expect(globalObject.cnpjFmt('12345678000910')).toBe('12.345.678/0009-10');
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-fmt.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object with cnpjFmt function', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cnpjFmt;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(typeof globalObject.cnpjFmt).toBe('function');
    expect(typeof globalObject.default).toBe('function');
    expect(globalObject.cnpjFmt('12345678000910')).toBe('12.345.678/0009-10');
  });
});
