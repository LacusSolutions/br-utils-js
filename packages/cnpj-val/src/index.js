/* eslint-env node */
const cnpjVal = require('./cnpj-val').default;

module.exports = cnpjVal;

// Allow use of default import with ES module syntax
module.exports.default = cnpjVal;
