import * as all from './index.esm';

const { default: _, cpfVal: baseCpfVal, ...rest } = all;

const cpfVal: typeof baseCpfVal = (...args) => baseCpfVal(...args);

export default Object.assign(cpfVal, rest);
