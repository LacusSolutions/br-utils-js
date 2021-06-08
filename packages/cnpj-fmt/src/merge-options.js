/* eslint-disable prefer-const */

const DEFAULT_DOT_SYMBOL = '.';
const DEFAULT_SLASH_SYMBOL = '/';
const DEFAULT_DASH_SYMBOL = '-';
const DEFAULT_HIDDEN_START = 5;
const DEFAULT_HIDDEN_END = 13;
const DEFAULT_HIDDEN_SYMBOL = '*';
const DEFAULT_HIDDEN_STATE = false;
const DEFAULT_ESCAPE_STATE = false;

/**
 * Merge custom options to the default ones.
 *
 * @param {CnpjFormattingOptions} options
 * @return {CnpjFormattingOptions}
 */
function mergeOptions(options = {}) {
  let {
    delimiters: {
      dot = DEFAULT_DOT_SYMBOL,
      slash = DEFAULT_SLASH_SYMBOL,
      dash = DEFAULT_DASH_SYMBOL,
    } = {},
    hiddenRange: {
      start = DEFAULT_HIDDEN_START,
      end = DEFAULT_HIDDEN_END,
    } = {},
    hiddenSymbol = DEFAULT_HIDDEN_SYMBOL,
    hidden = DEFAULT_HIDDEN_STATE,
    escape = DEFAULT_ESCAPE_STATE,
    onFail = (value) => value,
  } = options;

  if (hidden) {
    if (isNaN(start) || start < 0 || start > 13) {
      throw new TypeError('Option "hiddenRange.start" must be a number between 0 and 13.');
    }

    if (isNaN(end) || end < 0 || end > 13) {
      throw new TypeError('Option "hiddenRange.end" must be a number between 0 and 13.');
    }

    if (start > end) {
      const aux = start;
      start = end;
      end = aux;
    }
  }

  if (typeof onFail !== 'function') {
    throw new TypeError('The option "onFail" must be a callback function.');
  }

  return {
    delimiters: { dot, slash, dash },
    hiddenRange: { start, end },
    hiddenSymbol,
    hidden,
    escape,
    onFail,
  };
}

export default mergeOptions;
