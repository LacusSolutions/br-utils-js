import { describe, expect, it } from 'bun:test';

import { escapeHTML } from '../src/escape-html';

describe('escapeHTML', (): void => {
  describe('when given a "&" character', (): void => {
    it('returns "&amp;"', (): void => {
      const result = escapeHTML('&');

      expect(result).toBe('&amp;');
    });
  });

  describe('when given a "<" character', (): void => {
    it('returns "&lt;"', (): void => {
      const result = escapeHTML('<');

      expect(result).toBe('&lt;');
    });
  });

  describe('when given a ">" character', (): void => {
    it('returns "&gt;"', (): void => {
      const result = escapeHTML('>');

      expect(result).toBe('&gt;');
    });
  });

  describe("when given a '\"' character", (): void => {
    it('returns "&quot;"', (): void => {
      const result = escapeHTML('"');

      expect(result).toBe('&quot;');
    });
  });

  describe('when given a "\'" character', (): void => {
    it('returns "&#039;"', (): void => {
      const result = escapeHTML("'");

      expect(result).toBe('&#039;');
    });
  });
});
