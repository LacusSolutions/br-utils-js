![cpf-val for JavaScript](https://br-utils.vercel.app/img/cover_cpf-val.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-val)](https://npmjs.com/package/@lacussoft/cpf-val)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-val?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-val)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-val.svg)](https://npmjs.com/package/@lacussoft/cpf-val)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Utility function to validate CPF (Brazilian personal ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-val

# using Bun
$ bun add @lacussoft/cpf-val
```

## Import

```js
// ES Modules
import cpfVal from '@lacussoft/cpf-val'

// Common JS
const cpfVal = require('@lacussoft/cpf-val')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-val@latest/dist/cpf-val.min.js"></script>
```

### Usage:

```js
cpfVal('12345678909')     // returns 'true'

cpfVal('123.456.789-09')  // returns 'true'

cpfVal('12345678910')     // returns 'false'
                 ^^
```

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. But if you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
