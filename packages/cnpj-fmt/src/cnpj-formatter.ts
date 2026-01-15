import { escape as escapeHTML } from 'html-escaper';

import { CnpjFormatterOptions, CNPJ_LENGTH, OnFailCallback } from './cnpj-formatter-options';
import { CnpjFormatterInvalidLengthError } from './exceptions';

/**
 * Class to format a CNPJ string according to the given options.
 */
export class CnpjFormatter<OnErrFallback = string> {
  private _options: CnpjFormatterOptions<OnErrFallback>;

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
    this._options = new CnpjFormatterOptions<OnErrFallback>(
      hidden,
      hiddenKey,
      hiddenStart,
      hiddenEnd,
      dotKey,
      slashKey,
      dashKey,
      escape,
      onFail,
    );
  }

  /**
   * Executes the CNPJ string formatting, overriding any given options with the ones set on the formatter instance.
   */
  format<FormatOnErrFallback = OnErrFallback>(
    cnpjString: string,
    hidden?: boolean | null,
    hiddenKey?: string | null,
    hiddenStart?: number | null,
    hiddenEnd?: number | null,
    dotKey?: string | null,
    slashKey?: string | null,
    dashKey?: string | null,
    escape?: boolean | null,
    onFail?: OnFailCallback<FormatOnErrFallback> | null,
  ): string | FormatOnErrFallback {
    const actualOptions = this._options.merge<FormatOnErrFallback>(
      hidden,
      hiddenKey,
      hiddenStart,
      hiddenEnd,
      dotKey,
      slashKey,
      dashKey,
      escape,
      onFail,
    );

    let cnpjNumbersString = cnpjString.replace(/\D/g, '');

    if (cnpjNumbersString.length !== CNPJ_LENGTH) {
      const onFailCallback = actualOptions.onFail;

      try {
        const error = new CnpjFormatterInvalidLengthError(
          cnpjString,
          CNPJ_LENGTH,
          cnpjNumbersString.length,
        );
        return onFailCallback(cnpjString, error);
      } catch {
        return onFailCallback(cnpjString);
      }
    }

    if (actualOptions.hidden) {
      const { hiddenStart: start, hiddenEnd: end, hiddenKey: key } = actualOptions;

      const prefix = cnpjNumbersString.slice(0, start);
      const hiddenPartLength = end - start + 1;
      const masked = key.repeat(hiddenPartLength);
      const suffix = cnpjNumbersString.slice(end + 1);
      cnpjNumbersString = prefix + masked + suffix;
    }

    const prettyCnpj =
      cnpjNumbersString.slice(0, 2) +
      actualOptions.dotKey +
      cnpjNumbersString.slice(2, 5) +
      actualOptions.dotKey +
      cnpjNumbersString.slice(5, 8) +
      actualOptions.slashKey +
      cnpjNumbersString.slice(8, 12) +
      actualOptions.dashKey +
      cnpjNumbersString.slice(12, 14);

    if (actualOptions.escape) {
      return escapeHTML(prettyCnpj);
    }

    return prettyCnpj;
  }

  /**
   * Direct access to the options manager for the CNPJ formatter.
   */
  get options(): CnpjFormatterOptions<OnErrFallback> {
    return this._options;
  }
}
