import * as all from './index.esm';

const { default: _, cnpjFmt: baseCnpjFmt, ...rest } = all;

const cnpjFmt: typeof baseCnpjFmt = (...args) => baseCnpjFmt(...args);

export default Object.assign(cnpjFmt, rest);
