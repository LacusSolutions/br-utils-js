import { describe, expect, it } from 'bun:test';

import { escapeHTML } from '../src/escape-html';

describe('escapeHTML', () => {
  describe('when given a "&" character', () => {
    it('returns "&amp;"', () => {
      const result = escapeHTML('&');

      expect(result).toBe('&amp;');
    });
  });

  describe('when given a "<" character', () => {
    it('returns "&lt;"', () => {
      const result = escapeHTML('<');

      expect(result).toBe('&lt;');
    });
  });

  describe('when given a ">" character', () => {
    it('returns "&gt;"', () => {
      const result = escapeHTML('>');

      expect(result).toBe('&gt;');
    });
  });

  describe("when given a '\"' character", () => {
    it('returns "&quot;"', () => {
      const result = escapeHTML('"');

      expect(result).toBe('&quot;');
    });
  });

  describe('when given a "\'" character', () => {
    it('returns "&#039;"', () => {
      const result = escapeHTML("'");

      expect(result).toBe('&#039;');
    });
  });
});
