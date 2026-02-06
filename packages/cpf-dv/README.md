![cpf-dv for JavaScript](https://br-utils.vercel.app/img/cover_cpf-dv.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-dv)](https://npmjs.com/package/@lacussoft/cpf-dv)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-dv?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-dv)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-dv.svg)](https://npmjs.com/package/@lacussoft/cpf-dv)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-dv/README.pt.md)

A JavaScript/TypeScript utility to calculate check digits on CPF (Brazilian Individual's Taxpayer ID).

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Flexible input**: Accepts strings or array of strings
- ✅ **Format agnostic**: Automatically strips non-numeric characters from string input
- ✅ **Auto-expansion**: Automatically expands multi-digit strings in arrays to individual digits
- ✅ **Lazy evaluation**: Check digits are calculated only when accessed (via properties)
- ✅ **Caching**: Calculated values are cached for subsequent access
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Zero dependencies**: No external dependencies required
- ✅ **Error handling**: Specific exceptions for type, length, and invalid CPF scenarios

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-dv

# using Bun
$ bun add @lacussoft/cpf-dv
```

## Quick Start

```ts
// ES Modules
import CpfCheckDigits from '@lacussoft/cpf-dv'

// Common JS
const CpfCheckDigits = require('@lacussoft/cpf-dv')
```

Basic usage:

```ts
const checkDigits = new CpfCheckDigits('054496519')

checkDigits.first   // '1'
checkDigits.second  // '0'
checkDigits.both    // '10'
checkDigits.cpf     // '05449651910'
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `CpfCheckDigits` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-dv@latest/dist/cpf-dv.min.js"></script>
```

## Usage

The main resource of this package is the class `CpfCheckDigits`. Through the instance of it, you can access the key information of the CPF regarding check digits:

- **`constructor`**: `new CpfCheckDigits(cpfDigits: string | string[])` — 9–11 digits (formatting stripped).
- **`first`**: First check digit (10th digit of the CPF). Lazy, cached.
- **`second`**: Second check digit (11th digit of the CPF). Lazy, cached.
- **`both`**: Both check digits concatenated as a string.
- **`cpf`**: The complete CPF as a string of 11 digits (9 base digits + 2 check digits).

### Input formats

The `CpfCheckDigits` class accepts multiple input formats:

**String input:** plain digits or formatted CPF (e.g. `054.496.519-10`). Non-numeric characters are automatically stripped. Use 9 digits (base only) or 11 digits (only first 9 are used).

**Array of strings:** single-character strings or multi-character strings (automatically flattened to individual digits), e.g. `['0','5','4','4','9','6','5','1','9']`, `['054496519']`, `['054','496','519']`.

### Errors & Exceptions handling

This package uses **Error vs Exception** semantics: *errors* indicate incorrect API use (e.g. wrong type); *exceptions* indicate invalid or ineligible data (e.g. invalid CPF). You can catch specific types or use the base classes.

- **CpfCheckDigitsTypeError** (_abstract_) — base for type errors
- **CpfCheckDigitsInputTypeError** — input is not string or string[]
- **CpfCheckDigitsException** (_abstract_) — base for data/flow exceptions
- **CpfCheckDigitsInputLengthException** — sanitized length is not 9–11
- **CpfCheckDigitsInputInvalidException** — input ineligible (e.g. repeated digits like 111.111.111)

```ts
import CpfCheckDigits, {
  CpfCheckDigitsInputTypeError,
  CpfCheckDigitsInputLengthException,
  CpfCheckDigitsInputInvalidException,
  CpfCheckDigitsException,
} from '@lacussoft/cpf-dv'

// Input type (e.g. number not allowed)
try {
  new CpfCheckDigits(12345678901)
} catch (e) {
  if (e instanceof CpfCheckDigitsInputTypeError) {
    console.log(e.message)  // CPF input must be of type string or string[]. Got number.
  }
}

// Length (must be 9–11 digits after sanitization)
try {
  new CpfCheckDigits('12345678')
} catch (e) {
  if (e instanceof CpfCheckDigitsInputLengthException) {
    console.log(e.message)
  }
}

// Invalid (e.g. repeated digits)
try {
  new CpfCheckDigits(['999', '999', '999'])
} catch (e) {
  if (e instanceof CpfCheckDigitsInputInvalidException) {
    console.log(e.message)
  }
}

// Any exception from the package
try {
  // risky code
} catch (e) {
  if (e instanceof CpfCheckDigitsException) {
    // handle
  }
}
```

### Other Available Resources

- **`CPF_MIN_LENGTH`**: `9` (constant).
- **`CPF_MAX_LENGTH`**: `11` (constant).
- **Types**: `CpfInput` (`string | string[]`).
- **Exceptions**: See above.

## Calculation algorithm

The package calculates CPF check digits using the official Brazilian algorithm:

1. **First check digit (10th position):** digits 1–9 of the CPF base; weights 10, 9, 8, 7, 6, 5, 4, 3, 2 (from left to right); `remainder = 11 - (sum(digit × weight) % 11)`; result is `0` if remainder > 9, otherwise `remainder`.
2. **Second check digit (11th position):** digits 1–9 + first check digit; weights 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 (from left to right); same formula.

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

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
