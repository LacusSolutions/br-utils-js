import mergeDeep from 'deepmerge';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface ActualCnpjFormattingOptions<OnErrFallback> {
  delimiters: {
    dash: string;
    dot: string;
    slash: string;
  };
  escape: boolean;
  hidden: boolean;
  hiddenKey: string;
  hiddenRange: {
    end: number;
    start: number;
  };
  onFail: (value: string, error: Error) => OnErrFallback;
}

export type CnpjFormattingOptions<OnErrFallback> = DeepPartial<
  ActualCnpjFormattingOptions<OnErrFallback>
>;

const defaultOptions: ActualCnpjFormattingOptions<string> = {
  delimiters: {
    dot: '.',
    slash: '/',
    dash: '-',
  },
  hiddenRange: {
    start: 5,
    end: 13,
  },
  onFail: (value) => value,
  hiddenKey: '*',
  hidden: false,
  escape: false,
};

/**
 * Merge custom options to the default ones.
 */
function mergeOptions<OnErrFallback>(
  customOptions: CnpjFormattingOptions<OnErrFallback> = {},
): ActualCnpjFormattingOptions<OnErrFallback> {
  const options = mergeDeep(
    defaultOptions,
    customOptions,
  ) as ActualCnpjFormattingOptions<OnErrFallback>;

  if (options.hidden) {
    if (
      isNaN(options.hiddenRange.start) ||
      options.hiddenRange.start < 0 ||
      options.hiddenRange.start > 13
    ) {
      throw new TypeError('Option "hiddenRange.start" must be a number between 0 and 13.');
    }

    if (
      isNaN(options.hiddenRange.end) ||
      options.hiddenRange.end < 0 ||
      options.hiddenRange.end > 13
    ) {
      throw new TypeError('Option "hiddenRange.end" must be a number between 0 and 13.');
    }

    if (options.hiddenRange.start > options.hiddenRange.end) {
      const aux = options.hiddenRange.start;
      options.hiddenRange.start = options.hiddenRange.end;
      options.hiddenRange.end = aux;
    }
  }

  if (typeof options.onFail !== 'function') {
    throw new TypeError('The option "onFail" must be a callback function.');
  }

  return options;
}

export default mergeOptions;
