import * as all from './index.esm';

const { default: baseBrUtils, ...rest } = all;

const brUtils = Object.assign(baseBrUtils, rest);

export default brUtils;
