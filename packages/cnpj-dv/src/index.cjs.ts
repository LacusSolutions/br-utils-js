import * as all from './index.esm';

const { default: _, ...rest } = all;

class CnpjCheckDigits extends rest.CnpjCheckDigits {}

export default Object.assign(CnpjCheckDigits, rest);
