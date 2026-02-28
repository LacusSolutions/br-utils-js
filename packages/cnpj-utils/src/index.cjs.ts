import * as all from './index.esm';

const { default: baseCnpjUtils, ...rest } = all;

const cnpjUtils = Object.assign(baseCnpjUtils, rest);

export default cnpjUtils;
