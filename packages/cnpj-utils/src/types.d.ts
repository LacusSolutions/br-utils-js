import { default as cnpjFormattingFn } from '@lacussoft/cnpj-fmt';
import { default as cnpjGenerationFn } from '@lacussoft/cnpj-gen';
import { default as cnpjValidationFn } from '@lacussoft/cnpj-val';

declare const format: typeof cnpjFormattingFn;

declare const generate: typeof cnpjGenerationFn;

declare const isValid: typeof cnpjValidationFn;

export { CnpjFormattingOptions } from '@lacussoft/cnpj-fmt';

export { CnpjGeneratorOptions } from '@lacussoft/cnpj-gen';

export { format };
export { generate };
export { isValid };
export default { format, generate, isValid };
