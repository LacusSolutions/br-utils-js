import * as all from './index.esm';

const { default: _, cpfVal: baseCnpjVal, ...rest } = all;

const cpfVal: typeof baseCnpjVal = (...args) => baseCnpjVal(...args);

export default Object.assign(cpfVal, rest);
