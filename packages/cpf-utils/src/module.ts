import cpfFmt from '@lacussoft/cpf-fmt';
import cpfGen from '@lacussoft/cpf-gen';
import cpfVal from '@lacussoft/cpf-val';

export const format = cpfFmt;

export const generate = cpfGen;

export const isValid = cpfVal;

export default { format, generate, isValid };
