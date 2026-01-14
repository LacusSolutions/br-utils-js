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

- ✅ **Alphanumeric Support**: Full support for the new alphanumeric CNPJ format (introduced in 2026)
- ✅ **Multiple Input Formats**: Accepts strings or arrays of strings
- ✅ **Format Agnostic**: Automatically strips non-alphanumeric characters from string input
- ✅ **Auto-Expansion**: Automatically expands multi-character strings in arrays to individual characters
- ✅ **Lazy Evaluation**: Check digits are calculated only when accessed (via properties)
- ✅ **Caching**: Calculated values are cached for subsequent access
- ✅ **TypeScript Support**: Full TypeScript definitions included
- ✅ **Zero Dependencies**: No external dependencies required
- ✅ **Comprehensive Error Handling**: Specific exceptions for different error scenarios

## Calculation Algorithm

The package calculates CNPJ check digits using the official Brazilian algorithm, with full support for alphanumeric characters:

1. **First Check Digit (13th position)**:
   - Uses characters 1-12 of the CNPJ base
   - Applies weights from right to left: 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5
   - For alphanumeric characters, uses their ASCII code minus 48 (the ASCII code of '0')
   - Calculates: `remainder = sum(char_value × weight) % 11`
   - Result: `0` if remainder < 2, otherwise `11 - remainder`

2. **Second Check Digit (14th position)**:
   - Uses characters 1-12 + first check digit
   - Applies weights from right to left: 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6
   - Same calculation logic as above

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

```js
// Calculate check digits from a 12-character CNPJ base
const checkDigits = new CnpjCheckDigits('914157320007')

console.log(checkDigits.first)   // returns '9'
console.log(checkDigits.second)  // returns '3'
console.log(checkDigits.both)    // returns '93'
console.log(checkDigits.cnpj)    // returns '91415732000793'
```

```js
// Works with alphanumeric CNPJs (new format)
const checkDigits = new CnpjCheckDigits('MGKGMJ9X0001')

console.log(checkDigits.first)   // returns '6'
console.log(checkDigits.second)  // returns '8'
console.log(checkDigits.both)    // returns '68'
console.log(checkDigits.cnpj)    // returns 'MGKGMJ9X000168'
```

### Input Formats

The `CnpjCheckDigits` class accepts multiple input formats:

#### String Input

```js
// Only digits/characters
const checkDigits = new CnpjCheckDigits('914157320007')
const checkDigits = new CnpjCheckDigits('MGKGMJ9X000193')

// Formatted CNPJ
const checkDigits = new CnpjCheckDigits('91.415.732/0007-93')
const checkDigits = new CnpjCheckDigits('MG.KGM.J9X/0001-93')

// note that lowercase letters are transformed to uppercase
const checkDigits = new CnpjCheckDigits('mgkgmj9x0001')  // treated as 'MGKGMJ9X0001'
```

#### Array of Strings

```js
// Array of single-character strings
const checkDigits = new CnpjCheckDigits(['9', '1', '4', '1', '5', '7', '3', '2', '0', '0', '0', '7'])

// Array with multi-character strings (automatically flattened)
const checkDigits = new CnpjCheckDigits(['914157320007'])        // flattens to individual characters
const checkDigits = new CnpjCheckDigits(['91', '415', '732', '0007'])
const checkDigits = new CnpjCheckDigits(['MG', 'KGM', 'J9X', '0001'])
```

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

Thrown when the input does not contain 12 to 14 alphanumeric characters.

```js
import CnpjCheckDigits, { CnpjCheckDigitsInputLengthException } from '@lacussoft/cnpj-dv'

try {
  new CnpjCheckDigits('12345678')  // only 8 characters
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

```ts
new CnpjCheckDigits(cnpjDigits: string | string[]): CnpjCheckDigits
```

Creates a new `CnpjCheckDigits` instance from the provided CNPJ base characters.

**Parameters:**
- `cnpjDigits` (string | string[]): The CNPJ base characters (12-14 alphanumeric characters). Can be:
  - A string with 12-14 characters (formatting characters are ignored, letters are uppercased)
  - An array of strings (each string can be a single-character or multi-character value)

**Throws:**
- `CnpjCheckDigitsInputTypeError`: If the input type is not supported
- `CnpjCheckDigitsInputLengthException`: If the input does not contain 12-14 characters

**Returns:**
- `CnpjCheckDigits`: A new instance ready to calculate check digits

#### Properties

##### `first: string`

The first check digit (13th character of the CNPJ). Calculated lazily on first access.

##### `second: string`

The second check digit (14th character of the CNPJ). Calculated lazily on first access.

##### `both: string`

Both check digits concatenated as a string.

##### `cnpj: string`

The complete CNPJ as a string of 14 characters (12 base characters + 2 check digits).

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
