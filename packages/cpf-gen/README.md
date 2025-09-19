# Lacus :: cpf-gen

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-gen)](https://npmjs.com/package/@lacussoft/cpf-gen)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-gen?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-gen)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-gen.svg)](https://npmjs.com/package/@lacussoft/cpf-gen)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Utility function to generate valid CPF (Brazilian personal ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-gen

# using Bun
$ bun add @lacussoft/cpf-gen
```

## Import

```js
// ES Modules
import cpfGen from '@lacussoft/cpf-gen'

// Common JS
const cpfGen = require('@lacussoft/cpf-gen')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-gen@latest/dist/cpf-gen.min.js"></script>
```

## Usage

```js
let cpf = cpfGen()      // returns '47844241055'

cpf = cpfGen({          // returns '005.265.352-88'
  format: true
})

cpf = cpfGen({          // returns '52825091138'
  prefix: '528250911'
})

cpf = cpfGen({          // returns '528.250.911-38'
  prefix: '528250911',
  format: true
})
```

### Generator options

```js
cpfGen({
  format: false, // indicates if output should be formatted
  prefix: ''     // if you have a CPF initials and want to complete it with valid digits.
})               //     The string provided must contain between 0 and 9 digits!
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

See [CHANGELOG](tps://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
