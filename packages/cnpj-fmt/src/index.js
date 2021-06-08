/* eslint-env node */
const cnpjFmt = require('./cnpj-fmt').default;

module.exports = cnpjFmt;

// Allow use of default import with ES module syntax
module.exports.default = cnpjFmt;
