/* eslint-env node */
const cnpjGen = require('./cnpj-gen').default;

module.exports = cnpjGen;

// Allow use of default import with ES module syntax
module.exports.default = cnpjGen;
