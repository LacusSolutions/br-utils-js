![cnpj-dv for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-dv.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-dv)](https://npmjs.com/package/@lacussoft/cnpj-dv)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-dv?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-dv)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-dv.svg)](https://npmjs.com/package/@lacussoft/cnpj-dv)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the new alphanumeric CNPJ format.**

> 🌎 [Acessar documentação em português](./README.pt.md)

Utility class to calculate check digits on CNPJ (Brazilian legal entity ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

TODO: describe

## Calculation Algorithm

TODO: describe

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-dv

# using Bun
$ bun add @lacussoft/cnpj-dv
```

## Import

```js
// ES Modules
import CnpjCheckDigits from '@lacussoft/cnpj-dv'

// Common JS
const CnpjCheckDigits = require('@lacussoft/cnpj-dv')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-dv@latest/dist/cnpj-dv.min.js"></script>
```

## Usage

### Basic Usage

TODO: describe

### Input Formats

The `CnpjCheckDigits` class accepts multiple input formats:

#### String Input

TODO: describe

#### Array of Strings

TODO: describe

## Error Handling

This project uses the **Error/Exception differentiation** concept. Basically, _errors_ are incorrect use of the package, for example, not following the argument type of a function, and _exceptions_ are recoverable errors where the data or flow falls out of the rules for some reason, for example an invalid CNPJ is provided to the library, so the check digits cannot be calculated as expected.

Therefore the package throws detailed errors and exceptions for different situations:

### `CnpjCheckDigitsInputTypeError`

Thrown when the input type is not supported (must be `string` or `string[]`).

```js
import CnpjCheckDigits, { CnpjCheckDigitsInputTypeError } from '@lacussoft/cnpj-dv'

try {
  new CnpjCheckDigits(123456780009)  // numeric input is not allowed
} catch (error) {
  if (error instanceof CnpjCheckDigitsInputTypeError) {
    console.log(error.message)  // CNPJ input must be of type string or string[]. Got number.
  }
}
```

### `CnpjCheckDigitsInputLengthException`

Thrown when the input does not contain 12 to 14 digits.

```js
import CnpjCheckDigits, { CnpjCheckDigitsInputLengthException } from '@lacussoft/cnpj-dv'

try {
  new CnpjCheckDigits('12345678')  // only 8 digits
} catch (error) {
  if (error instanceof CnpjCheckDigitsInputLengthException) {
    console.log(error.message)  // CNPJ input "12345678" does not contain 12 to 14 digits. Got 8.
  }
}
```

### Catch any error from the package

All type errors extend from `CnpjCheckDigitsTypeError` and all exceptions extend from `CnpjCheckDigitsException`, so you can use these types to handle any error thrown by the module.

```js
import { CnpjCheckDigits, CnpjCheckDigitsException } from '@lacussoft/cnpj-dv'

try {
  // some risky code
} catch (error) {
  if (error instanceof CnpjCheckDigitsException) {
    // handle exceptions
  }
}
```

## API Reference

### CnpjCheckDigits Class

#### Constructor

TODO: describe

#### Properties

##### `first: string`

The first check digit (13th digit of the CNPJ). Calculated lazily on first access.

##### `second: string`

The second check digit (14th digit of the CNPJ). Calculated lazily on first access.

##### `both: string`

Both check digits concatenated as a string.

##### `cnpj: string`

The complete CNPJ as a string of 14 digits (12 base digits + 2 check digits).

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. But if you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-dv/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
