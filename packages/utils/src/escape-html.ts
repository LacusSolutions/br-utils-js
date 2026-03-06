/**
 * Escapes HTML special characters in a string. It basically replaces `&`, `<`,
 * `>`, `"`, and `'` with their corresponding HTML entities.
 *
 * @example
 *   escapeHTML('Tom & Jerry'); // 'Tom &amp; Jerry'
 *   escapeHTML('<script>alert("XSS")</script>'); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHTML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
