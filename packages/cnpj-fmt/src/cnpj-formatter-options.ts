import { CnpjFormatterHiddenRangeError } from './exceptions';

export const CNPJ_LENGTH = 14;

export type OnFailCallback<T = string> = (value: string, error?: Error) => T;

/**
 * Default callback for invalid CNPJ input.
 */
function defaultOnFail(value: string): string {
  return value;
}

/**
 * Class to manage and store the options for the CNPJ formatter.
 */
export class CnpjFormatterOptions<OnErrFallback = string> {
  hidden: boolean;
  hiddenKey: string;
  hiddenStart: number;
  hiddenEnd: number;
  dotKey: string;
  slashKey: string;
  dashKey: string;
  escape: boolean;
  onFail: OnFailCallback<OnErrFallback>;

  constructor(
    hidden?: boolean | null,
    hiddenKey?: string | null,
    hiddenStart?: number | null,
    hiddenEnd?: number | null,
    dotKey?: string | null,
    slashKey?: string | null,
    dashKey?: string | null,
    escape?: boolean | null,
    onFail?: OnFailCallback<OnErrFallback> | null,
  ) {
    this.hidden = hidden ?? false;
    this.hiddenKey = hiddenKey ?? '*';
    this.hiddenStart = hiddenStart ?? 5;
    this.hiddenEnd = hiddenEnd ?? 13;
    this.dotKey = dotKey ?? '.';
    this.slashKey = slashKey ?? '/';
    this.dashKey = dashKey ?? '-';
    this.escape = escape ?? false;
    this.onFail = (onFail ?? defaultOnFail) as OnFailCallback<OnErrFallback>;

    this.setHiddenRange(this.hiddenStart, this.hiddenEnd);

    if (typeof this.onFail !== 'function') {
      throw new TypeError(
        `"onFail" argument must be a callable, ${typeof this.onFail} given`,
      );
    }
  }

  /**
   * Creates a new CnpjFormatterOptions instance with the given options merged with the current instance.
   */
  merge<MergeOnErrFallback = OnErrFallback>(
    hidden?: boolean | null,
    hiddenKey?: string | null,
    hiddenStart?: number | null,
    hiddenEnd?: number | null,
    dotKey?: string | null,
    slashKey?: string | null,
    dashKey?: string | null,
    escape?: boolean | null,
    onFail?: OnFailCallback<MergeOnErrFallback> | null,
  ): CnpjFormatterOptions<MergeOnErrFallback> {
    const newOptions = new CnpjFormatterOptions<MergeOnErrFallback>(
      hidden ?? this.hidden,
      hiddenKey ?? this.hiddenKey,
      hiddenStart ?? this.hiddenStart,
      hiddenEnd ?? this.hiddenEnd,
      dotKey ?? this.dotKey,
      slashKey ?? this.slashKey,
      dashKey ?? this.dashKey,
      escape ?? this.escape,
      (onFail ?? this.onFail) as OnFailCallback<MergeOnErrFallback>,
    );

    return newOptions;
  }

  /**
   * Sets the range of hidden digits for the CNPJ formatter.
   */
  setHiddenRange(start: number, end: number): void {
    const minVal = 0;
    const maxVal = CNPJ_LENGTH - 1;

    if (start < minVal || start > maxVal) {
      throw new CnpjFormatterHiddenRangeError('hiddenStart', start, minVal, maxVal);
    }

    if (end < minVal || end > maxVal) {
      throw new CnpjFormatterHiddenRangeError('hiddenEnd', end, minVal, maxVal);
    }

    if (start > end) {
      [start, end] = [end, start];
    }

    this.hiddenStart = start;
    this.hiddenEnd = end;
  }
}
