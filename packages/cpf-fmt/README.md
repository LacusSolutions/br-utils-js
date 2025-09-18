# Lacus :: cpf-fmt

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-fmt)](https://npmjs.com/package/@lacussoft/cpf-fmt)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-fmt?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-fmt)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-fmt.svg)](https://npmjs.com/package/@lacussoft/cpf-fmt)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Utility function to format CNPJ (Brazilian personal ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-fmt

# using Bun
$ bun add @lacussoft/cpf-fmt
```

## Import

```js
// ES Modules
import cpfFmt from '@lacussoft/cpf-fmt'

// Common JS
const cpfFmt = require('@lacussoft/cpf-fmt')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-fmt@latest/dist/cpf-fmt.min.js"></script>
```

## Usage

```js
const cpf = '47844241055'

cpfFmt(cpf)       // returns '478.442.410-55'

cpfFmt(cpf, {     // returns '478.***.***-**'
  hidden: true
})

cpfFmt(cpf, {     // returns '478442410_55'
  delimiters: {
    dot: '',
    dash: '_'
  }
})
```

### Formatting options

```js
cpfFmt(cpf, {
  delimiters: {
    dot: '.',       // string to replace the dot characters
    dash: '-',      // string to replace the dash character
  },
  escape: false,    // boolean to define if the result should be HTML escaped
  hidden: false,    // boolean to define if digits should be hidden
  hiddenKey: '*',   // string to replace hidden digits
  hiddenRange: {
    start: 3,       // starting index of the numeric sequence to be hidden (min 0)
    end: 10,        // ending index of the numeric sequence to be hidden (max 10)
  },
  onFail(value) {   // fallback function to be invoked in case a non-11-digits is passed
    return value
  }
})
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
