# br-utils for JavaScript

[![NPM Latest Version](https://img.shields.io/npm/v/br-utils)](https://npmjs.com/package/br-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/min/br-utils?label=bundle%20size)](https://bundlephobia.com/package/br-utils)
[![Downloads Count](https://img.shields.io/npm/dm/br-utils.svg)](https://npmjs.com/package/br-utils)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Toolkit to handle the main operations with Brazilian-related data for JavaScript/TypeScript programming language:

- CPF (personal ID) ([demo](https://cpf-utils.vercel.app/))
- CNPJ (employer ID) ([demo](https://cnpj-utils.vercel.app/))

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save br-utils

# using Bun
$ bun add br-utils
```

## Import

```js
// Common JS syntax:
const brUtils = require('br-utils')

// ES Module syntax:
import brUtils from 'br-utils'
// or get the specific function with ES tree-shaking:
import { cpf as cpfUtils, cnpj as cnpjUtils } from 'br-utils'
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/br-utils@latest/dist/br-utils.min.js"></script>
```

## API

Check out the API details for each submodule of the package:

- [CNPJ utilities](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cnpj-utils#readme)
- [CPF utilities](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cpf-utils#readme)

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. But if you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](tps://github.com/LacusSolutions/br-utils-js/blob/main/packages/br-utils/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
