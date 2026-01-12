import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('build in CommonJS', () => {
  const filePath = Bun.resolveSync('../dist/index.cjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains a "module.exports" assignment', async () => {
    const codebase = await file.text();

    expect(codebase).toContain('exports.format = ');
    expect(codebase).toContain('exports.generate = ');
    expect(codebase).toContain('exports.isValid = ');
  });
});

describe('build in ES Module', () => {
  const filePath = Bun.resolveSync('../dist/index.mjs', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    const codebase = await file.text();

    expect(codebase).toMatch(/export \{ .+ default/);
    expect(codebase).toMatch(/export \{ .+ format/);
    expect(codebase).toMatch(/export \{ .+ generate/);
    expect(codebase).toMatch(/export \{ .+ isValid/);
  });
});

describe('build types', () => {
  const filePath = Bun.resolveSync('../dist/index.d.ts', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file contains an "export default" expression', async () => {
    const codebase = await file.text();

    expect(codebase).toMatch(/export \{ .+ default/);
    expect(codebase).toMatch(/export \{ .+ format/);
    expect(codebase).toMatch(/export \{ .+ generate/);
    expect(codebase).toMatch(/export \{ .+ isValid/);
  });
});

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-utils.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object called "cnpjUtils"', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cnpjUtils;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(globalObject).not.toBe(null);
    expect(typeof globalObject?.format).toBe('function');
    expect(typeof globalObject?.generate).toBe('function');
    expect(typeof globalObject?.isValid).toBe('function');
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cnpj-utils.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object called "cnpjUtils"', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cnpjUtils;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(globalObject).not.toBe(null);
    expect(typeof globalObject?.format).toBe('function');
    expect(typeof globalObject?.generate).toBe('function');
    expect(typeof globalObject?.isValid).toBe('function');
  });
});
