import * as all from './index.esm';

const { default: _, cpfFmt: baseCpfFmt, ...rest } = all;

const cpfFmt: typeof baseCpfFmt = (...args) => baseCpfFmt(...args);

export default Object.assign(cpfFmt, rest);
