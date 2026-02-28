import * as all from './index.esm';

const { default: baseCpfUtils, ...rest } = all;

const cpfUtils = Object.assign(baseCpfUtils, rest);

export default cpfUtils;
