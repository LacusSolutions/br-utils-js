import mergeDeep from 'deepmerge';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface ActualCpfFormattingOptions<OnErrFallback> {
  delimiters: {
    dash: string;
    dot: string;
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

export type CpfFormattingOptions<OnErrFallback> = DeepPartial<
  ActualCpfFormattingOptions<OnErrFallback>
>;

const defaultOptions: ActualCpfFormattingOptions<string> = {
  delimiters: {
    dot: '.',
    dash: '-',
  },
  hiddenRange: {
    start: 3,
    end: 10,
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
  customOptions: CpfFormattingOptions<OnErrFallback> = {},
): ActualCpfFormattingOptions<OnErrFallback> {
  const options = mergeDeep(
    defaultOptions,
    customOptions,
  ) as ActualCpfFormattingOptions<OnErrFallback>;

  if (options.hidden) {
    if (
      isNaN(options.hiddenRange.start) ||
      options.hiddenRange.start < 0 ||
      options.hiddenRange.start > 10
    ) {
      throw new TypeError('Option "hiddenRange.start" must be a number between 0 and 10.');
    }

    if (
      isNaN(options.hiddenRange.end) ||
      options.hiddenRange.end < 0 ||
      options.hiddenRange.end > 10
    ) {
      throw new TypeError('Option "hiddenRange.end" must be a number between 0 and 10.');
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
