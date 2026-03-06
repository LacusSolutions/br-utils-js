import * as all from './index.esm';

const { default: _, cpfGen: baseCpfGen, ...rest } = all;

const cpfGen: typeof baseCpfGen = (...args) => baseCpfGen(...args);

export default Object.assign(cpfGen, rest);
