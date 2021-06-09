
export type CnpjGeneratorOptions = {
  format?: boolean;
  prefix?: string;
};

declare const cnpjGen: (options?: CnpjGeneratorOptions) => string;

export default cnpjGen;
