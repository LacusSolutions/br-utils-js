import * as main from './cnpj-check-digits';
import * as exceptions from './exceptions';
import * as types from './types';

class CnpjCheckDigits extends main.CnpjCheckDigits {}

export default Object.assign(CnpjCheckDigits, {
  ...main,
  ...exceptions,
  ...types,
});
