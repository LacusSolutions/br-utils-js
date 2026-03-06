import * as all from './index.esm';

const { default: _, cnpjVal: baseCnpjVal, ...rest } = all;

const cnpjVal: typeof baseCnpjVal = (...args) => baseCnpjVal(...args);

export default Object.assign(cnpjVal, rest);
