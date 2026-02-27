import * as all from './index.esm';

const { default: _, cpfGen: baseCnpjFmt, ...rest } = all;

const cpfGen: typeof baseCnpjFmt = (...args) => baseCnpjFmt(...args);

export default Object.assign(cpfGen, rest);
