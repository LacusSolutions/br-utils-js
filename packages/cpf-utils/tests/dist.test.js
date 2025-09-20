import Bun from 'bun';
import { describe, expect, test } from 'bun:test';

describe('UMD file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-utils.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object called "cpfUtils"', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cpfUtils;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(globalObject).not.toBe(null);
    expect(typeof globalObject?.format).toBe('function');
    expect(typeof globalObject?.generate).toBe('function');
    expect(typeof globalObject?.isValid).toBe('function');
  });
});

describe('UMD minified file', () => {
  const filePath = Bun.resolveSync('../dist/cpf-utils.min.js', import.meta.dir);
  const file = Bun.file(filePath);

  test('file exists', async () => {
    await expect(file.exists()).resolves.toBe(true);
  });

  test('file evaluates to a global object called "cpfUtils"', async () => {
    const fileContent = await file.text();
    const makeGlobalObject = new Function(`${fileContent}\nreturn cpfUtils;`);
    const globalObject = makeGlobalObject();

    expect(typeof globalObject).toBe('object');
    expect(globalObject).not.toBe(null);
    expect(typeof globalObject?.format).toBe('function');
    expect(typeof globalObject?.generate).toBe('function');
    expect(typeof globalObject?.isValid).toBe('function');
  });
});
