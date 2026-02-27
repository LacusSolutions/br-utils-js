import * as all from './index.esm';

const { default: _, ...rest } = all;

class CpfCheckDigits extends rest.CpfCheckDigits {}

export default Object.assign(CpfCheckDigits, rest);
