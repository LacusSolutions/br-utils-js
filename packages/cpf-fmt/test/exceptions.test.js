import { expect, test } from 'bun:test';

import cpfFmt from '..';

test('Option with range start -1 throws TypeError', () => {
  function testCase() {
    return cpfFmt('80976511061', {
      hidden: true,
      hiddenRange: { start: -1 },
    });
  }

  expect(testCase).toThrow(TypeError);
});

test('Option with range start greater than 10 throws TypeError', () => {
  function testCase() {
    return cpfFmt('80976511061', {
      hidden: true,
      hiddenRange: { start: 11 },
    });
  }

  expect(testCase).toThrow(TypeError);
});

test('Option with range end -1 throws TypeError', () => {
  function testCase() {
    return cpfFmt('80976511061', {
      hidden: true,
      hiddenRange: { end: -1 },
    });
  }

  expect(testCase).toThrow(TypeError);
});

test('Option with range end greater than 10 throws TypeError', () => {
  function testCase() {
    return cpfFmt('80976511061', {
      hidden: true,
      hiddenRange: { end: 11 },
    });
  }

  expect(testCase).toThrow(TypeError);
});

test('Option with onfail as not a function throws TypeError', () => {
  function testCase() {
    return cpfFmt('80976511061', { onFail: 'testing' });
  }

  expect(testCase).toThrow(TypeError);
});
