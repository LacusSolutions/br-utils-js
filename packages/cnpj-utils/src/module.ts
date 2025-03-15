import cnpjFmt from '@lacussoft/cnpj-fmt';
import cnpjGen from '@lacussoft/cnpj-gen';
import cnpjVal from '@lacussoft/cnpj-val';

export const format = cnpjFmt;

export const generate = cnpjGen;

export const isValid = cnpjVal;

export default { format, generate, isValid };
