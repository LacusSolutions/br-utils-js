![cpf-val for JavaScript](https://br-utils.vercel.app/img/cover_cpf-val.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-val)](https://npmjs.com/package/@lacussoft/cpf-val)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-val?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-val)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-val.svg)](https://npmjs.com/package/@lacussoft/cpf-val)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/README.pt.md)

A JavaScript/TypeScript utility to validate CPF (Brazilian Individual's Taxpayer ID) values.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Flexible input**: Accepts string or array of strings (formatted or raw)
- ✅ **Format agnostic**: Strips non-numeric characters before validation
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Minimal dependencies**: Only depends on internal package `@lacussoft/cpf-dv` for check digits verification
- ✅ **Error handling**: Specific type error for invalid input type

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-val

# using Bun
$ bun add @lacussoft/cpf-val
```

## Quick Start

```ts
// ES Modules
import cpfVal from '@lacussoft/cpf-val'

// Common JS
const cpfVal = require('@lacussoft/cpf-val')
```

Basic usage:

```ts
cpfVal('12345678909')                      // true
cpfVal('123.456.789-09')                   // true
cpfVal('12345678910')                      // false (invalid check digits)
cpfVal(['123', '456', '789', '09'])        // true (array of strings)
cpfVal(['1', '2', '3', '...', '0', '9'])   // true (array of strings)
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cpfVal` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-val@latest/dist/cpf-val.min.js"></script>
```

## Usage

### `cpfVal` (helper function)

Validates a CPF string or array of strings. Returns `true` if the input is a valid CPF (11 digits after sanitization, eligible base, and correct check digits), otherwise `false`. Invalid input (e.g. wrong length, ineligible base such as repeated digits) yields `false` without throwing. This is a convenience wrapper around `new CpfValidator().isValid(cpfInput)`.

- **`cpfInput`**: `CpfInput` — string or array of strings (formatted or raw; non-numeric characters are stripped).

**Throws:** `CpfValidatorInputTypeError` if input is not string or string[].

### `CpfValidator` (class)

For reusable validation logic, use the class:

```ts
import { CpfValidator } from '@lacussoft/cpf-val'

const validator = new CpfValidator()

validator.isValid('123.456.789-09')   // true
validator.isValid('12345678909')      // true
validator.isValid(['123', '456', '789', '10'])  // false
```

- **`constructor`**: `new CpfValidator()` — no options.
- **`isValid(cpfInput)`**: Returns `true` if the CPF is valid, `false` otherwise.

### Input formats

**String input:** plain digits or formatted CPF (e.g. `123.456.789-09`). Non-numeric characters are automatically stripped. Must be 11 digits after sanitization.

**Array of strings:** single-character or multi-character strings (joined before validation), e.g. `['1','2','3','4','5','6','7','8','9','0','9']`, `['123','456','789','09']`.

## API

### Exports

- **`cpfVal`** (default): `(cpfInput: CpfInput) => boolean`
- **`CpfValidator`**: Class to validate CPF (no options).
- **`CPF_LENGTH`**: `11` (constant).
- **Types**: `CpfInput` (`string | readonly string[]`).

### Errors & Exceptions

This package uses **TypeError** for invalid input type. Invalid CPF values (wrong length, ineligible base) return `false` and do not throw.

- **CpfValidatorTypeError** (_abstract_) — base for type errors
- **CpfValidatorInputTypeError** — input is not string or string[]
- **CpfValidatorException** (_abstract_) — base for non-type exceptions (currently unused by this package)

```ts
import cpfVal, {
  CpfValidatorInputTypeError,
  CpfValidatorTypeError,
} from '@lacussoft/cpf-val'

// Input type (e.g. number not allowed)
try {
  cpfVal(12345678909)
} catch (e) {
  if (e instanceof CpfValidatorInputTypeError) {
    console.log(e.message)  // CPF input must be of type string or string[]. Got integer number.
  }
}

// Any type error from the package
try {
  cpfVal(null)
} catch (e) {
  if (e instanceof CpfValidatorTypeError) {
    // handle
  }
}
```

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

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
