![cpf-dv for JavaScript](https://br-utils.vercel.app/img/cover_cpf-dv.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-dv)](https://npmjs.com/package/@lacussoft/cpf-dv)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-dv?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-dv)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-dv.svg)](https://npmjs.com/package/@lacussoft/cpf-dv)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

Utility class to calculate check digits on CPF (Brazilian individual taxpayer ID).

## Browser Support

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
|--- | --- | --- | --- | --- | --- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Multiple Input Formats**: Accepts strings or arrays of strings
- ✅ **Format Agnostic**: Automatically strips non-numeric characters from string input
- ✅ **Auto-Expansion**: Automatically expands multi-digit strings in arrays to individual digits
- ✅ **Lazy Evaluation**: Check digits are calculated only when accessed (via properties)
- ✅ **Caching**: Calculated values are cached for subsequent access
- ✅ **TypeScript Support**: Full TypeScript definitions included
- ✅ **Zero Dependencies**: No external dependencies required
- ✅ **Comprehensive Error Handling**: Specific exceptions for different error scenarios

## Calculation Algorithm

The package calculates CPF check digits using the official Brazilian algorithm:

1. **First Check Digit (10th position)**:
   - Uses digits 1-9 of the CPF base
   - Applies weights: 10, 9, 8, 7, 6, 5, 4, 3, 2 (from left to right)
   - Calculates: `remainder = 11 - (sum(digit × weight) % 11)`
   - Result: `0` if remainder > 9, otherwise `remainder`

2. **Second Check Digit (11th position)**:
   - Uses digits 1-9 + first check digit
   - Applies weights: 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 (from left to right)
   - Calculates: `remainder = 11 - (sum(digit × weight) % 11)`
   - Result: `0` if remainder > 9, otherwise `remainder`

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-dv

# using Bun
$ bun add @lacussoft/cpf-dv
```

## Import

```js
// ES Modules
import CpfCheckDigits from '@lacussoft/cpf-dv'

// Common JS
const CpfCheckDigits = require('@lacussoft/cpf-dv')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-dv@latest/dist/cpf-dv.min.js"></script>
```

## Usage

### Basic Usage

```js
// Calculate check digits from a 9-digit CPF base
const checkDigits = new CpfCheckDigits('054496519')

console.log(checkDigits.first)   // returns '1'
console.log(checkDigits.second)  // returns '0'
console.log(checkDigits.both)    // returns '10'
console.log(checkDigits.cpf)     // returns '05449651910'
```

### Input Formats

The `CpfCheckDigits` class accepts multiple input formats:

#### String Input

```js
// Plain string (non-numeric characters are automatically stripped)
const checkDigits = new CpfCheckDigits('054496519')
const checkDigits = new CpfCheckDigits('054.496.519-10')  // formatting is ignored
const checkDigits = new CpfCheckDigits('054496519')       // 9 digits
const checkDigits = new CpfCheckDigits('05449651910')     // 11 digits (only first 9 are used)
```

#### Array of Strings

```js
// Array of single-character strings
const checkDigits = new CpfCheckDigits(['0', '5', '4', '4', '9', '6', '5', '1', '9'])

// Array with multi-digit strings (automatically flattened)
const checkDigits = new CpfCheckDigits(['054496519'])       // flattens to individual digits
const checkDigits = new CpfCheckDigits(['054', '496', '519'])  // also flattens
```

## Error Handling

This project uses the the **Error/Exception differentiation** concept. Basically, _errors_ are incorrect use of the package, for example, not following the argument type of a function, and _exceptions_ are recoverable errors where the data or flow falls out of the rules for some reason, for example an invalid CPF is provided to the library, so the check digits cannot be calculated as expected.

Therefore the package throws detailed errors and exceptions for different situations:

### `CpfCheckDigitsInputTypeError`

Thrown when the input type is not supported (must be `string` or `string[]`).

```js
import CpfCheckDigits, { CpfCheckDigitsInputTypeError } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits(12345678901)  // numeric input is not allowed
} catch (error) {
  if (error instanceof CpfCheckDigitsInputTypeError) {
    console.log(error.message)  // CPF input must be of type string or string[]. Got number.
  }
}
```

### `CpfCheckDigitsInputLengthException`

Thrown when the input does not contain 9 to 11 digits.

```js
import CpfCheckDigits, { CpfCheckDigitsInputLengthException } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits('12345678')  // only 8 digits
} catch (error) {
  if (error instanceof CpfCheckDigitsInputLengthException) {
    console.log(error.message)  // CPF input "12345678" does not contain 9 to 11 digits. Got 8.
  }
}
```

### `CpfCheckDigitsInputInvalidException`

Thrown when the input is forbidden for some restriction, like repeated digits like `111.111.111`, `222.222.222`, `333.333.333` and so on.

```js
import CpfCheckDigits, { CpfCheckDigitsInputInvalidException } from '@lacussoft/cpf-dv'

try {
  new CpfCheckDigits(['999', '999', '999'])
} catch (error) {
  if (error instanceof CpfCheckDigitsInputInvalidException) {
    console.log(error.message)  // CPF input ["999","999","999"] is invalid. Repeated digits are not considered valid.
  }
}
```

### Catch any error from the package

All type errors extend from `CpfCheckDigitsTypeError` and all exceptions extend from `CpfCheckDigitsException`, so you can use these types to handle any error thrown by the module.

```js
import { CpfCheckDigits, CpfCheckDigitsException } from '@lacussoft/cpf-dv'

try {
  // some risky code
} catch (error) {
  if (error instanceof CpfCheckDigitsException) {
    // handle exceptions
  }
}
```

## API Reference

### CpfCheckDigits Class

#### Constructor

```ts
new CpfCheckDigits(cpfDigits: string | string[]): CpfCheckDigits
```

Creates a new `CpfCheckDigits` instance from the provided CPF base digits.

**Parameters:**
- `cpfDigits` (string | string[]): The CPF base digits (9-11 digits). Can be:
  - A string with 9-11 digits (formatting characters are ignored)
  - An array of strings (each string can be a single-digit or multi-digit number)

**Throws:**
- `CpfCheckDigitsInputTypeError`: If the input type is not supported
- `CpfCheckDigitsInputLengthException`: If the input does not contain 9-11 digits
- `CpfCheckDigitsInputInvalidException`: If the input is invalid (e.g., repeated digits)

**Returns:**
- `CpfCheckDigits`: A new instance ready to calculate check digits

#### Properties

##### `first: string`

The first check digit (10th digit of the CPF). Calculated lazily on first access.

##### `second: string`

The second check digit (11th digit of the CPF). Calculated lazily on first access.

##### `both: string`

Both check digits concatenated as a string.

##### `cpf: string`

The complete CPF as a string of 11 digits (9 base digits + 2 check digits).

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. But if you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-dv/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
