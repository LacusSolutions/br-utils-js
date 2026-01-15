import { CnpjFormatter } from './cnpj-formatter';
import type { OnFailCallback } from './cnpj-formatter-options';

export interface CnpjFormatOptions<OnErrFallback = string> {
  hidden?: boolean | null;
  hiddenKey?: string | null;
  hiddenStart?: number | null;
  hiddenEnd?: number | null;
  dotKey?: string | null;
  slashKey?: string | null;
  dashKey?: string | null;
  escape?: boolean | null;
  onFail?: OnFailCallback<OnErrFallback> | null;
}

/**
 * Formats a CNPJ string according to the given options.
 * Default options returns the traditional CNPJ format (`91.415.732/0007-93`).
 */
function cnpjFmt<OnErrFallback = string>(
  cnpjString: string,
  options?: CnpjFormatOptions<OnErrFallback>,
): string | OnErrFallback {
  const formatter = new CnpjFormatter<OnErrFallback>(
    options?.hidden,
    options?.hiddenKey,
    options?.hiddenStart,
    options?.hiddenEnd,
    options?.dotKey,
    options?.slashKey,
    options?.dashKey,
    options?.escape,
    options?.onFail,
  );

  return formatter.format(cnpjString);
}

export default cnpjFmt;
