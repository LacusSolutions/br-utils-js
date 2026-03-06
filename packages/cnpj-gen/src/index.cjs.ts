import * as all from './index.esm';

const { default: _, cnpjGen: baseCnpjGen, ...rest } = all;

const cnpjGen: typeof baseCnpjGen = (...args) => baseCnpjGen(...args);

export default Object.assign(cnpjGen, rest);
