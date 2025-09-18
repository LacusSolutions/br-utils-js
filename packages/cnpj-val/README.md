# Lacus :: cnpj-val

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-val)](https://npmjs.com/package/@lacussoft/cnpj-val)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-val?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-val)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-val.svg)](https://npmjs.com/package/@lacussoft/cnpj-val)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Utility function to validate CNPJ (Brazilian employer ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-val

# using Bun
$ bun add @lacussoft/cnpj-val
```

## Import

```js
// ES Modules
import cnpjVal from '@lacussoft/cnpj-val'

// Common JS
const cnpjVal = require('@lacussoft/cnpj-val')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-val@latest/dist/cnpj-val.min.js"></script>
```

### Usage:

```js
cnpjVal('98765432000198')      // returns 'true'

cnpjVal('98.765.432/0001-98')  // returns 'true'

cnpjVal('98765432000199')      // returns 'false'
                     ^^
```

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details. But if you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](tps://github.com/LacusSolutions/br-utils-js/blob/main/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
