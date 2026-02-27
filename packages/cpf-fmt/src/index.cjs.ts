import * as all from './index.esm';

const { default: _, cpfFmt: baseCnpjFmt, ...rest } = all;

const cpfFmt: typeof baseCnpjFmt = (...args) => baseCnpjFmt(...args);

export default Object.assign(cpfFmt, rest);
