
export type CnpjFormattingOptions = {
  delimiters?: {
    dot?: string;
    slash?: string;
    dash?: string;
  };
  hiddenRange?: {
    start?: number;
    end?: number;
  };
  onFail?: (value: string) => any;
  hiddenSymbol?: string;
  hidden?: boolean;
  escape?: boolean;
};

declare const cnpjFmt: (cnpjString: string, options?: CnpjFormattingOptions) => string;

export default cnpjFmt;
