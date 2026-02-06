![cnpj-dv for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-dv.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-dv)](https://npmjs.com/package/@lacussoft/cnpj-dv)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-dv?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-dv)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-dv.svg)](https://npmjs.com/package/@lacussoft/cnpj-dv)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the [new alphanumeric CNPJ](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf) format.**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-dv/README.pt.md)

A JavaScript/TypeScript utility to calculate check digits on CNPJ (Brazilian Business Tax ID).

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Alphanumeric CNPJ**: Full support for the new alphanumeric CNPJ format (introduced in 2026)
- ✅ **Flexible input**: Accepts strings or array of strings
- ✅ **Format agnostic**: Strips non-alphanumeric characters and uppercases before processing
- ✅ **Input validation**: Rejects invalid CNPJs (all-zero base/branch IDs, repeated digits)
- ✅ **Lazy evaluation**: Check digits are calculated only when accessed (via properties)
- ✅ **Caching**: Calculated values are cached for subsequent access
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Zero dependencies**: No external dependencies
- ✅ **Error handling**: Specific exceptions for type, length, and invalid CNPJ scenarios

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-dv

# using Bun
$ bun add @lacussoft/cnpj-dv
```

## Quick Start

```ts
// ES Modules
import CnpjCheckDigits from '@lacussoft/cnpj-dv'

// Common JS
const CnpjCheckDigits = require('@lacussoft/cnpj-dv')
```

Basic usage:

```ts
const checkDigits = new CnpjCheckDigits('914157320007')

checkDigits.first   // '9'
checkDigits.second  // '3'
checkDigits.both    // '93'
checkDigits.cnpj    // '91415732000793'
```

With alphanumeric CNPJ (new format):

```ts
const checkDigits = new CnpjCheckDigits('MGKGMJ9X0001')

checkDigits.first   // '6'
checkDigits.second  // '8'
checkDigits.both    // '68'
checkDigits.cnpj    // 'MGKGMJ9X000168'
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `CnpjCheckDigits` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-dv@latest/dist/cnpj-dv.min.js"></script>
```

## Usage

The main resource of this package is the class `CnpjCheckDigits`. Through the instance of it, you can access the key information of the CNPJ regarding check digits:

- **`constructor`**: `new CnpjCheckDigits(cnpjDigits: string | string[])` — 12–14 alphanumeric characters (formatting stripped, letters uppercased).
- **`first`**: First check digit (13th character). Lazy, cached.
- **`second`**: Second check digit (14th character). Lazy, cached.
- **`both`**: Both check digits concatenated.
- **`cnpj`**: Full 14-character CNPJ (base + check digits).

### Input formats

The `CnpjCheckDigits` class accepts multiple input formats:

**String input:** raw digits/letters, or formatted CNPJ (e.g. `91.415.732/0007-93`, `MG.KGM.J9X/0001-93`). Lowercase letters are uppercased.

**Array of strings:** single-character strings or multi-character strings (automatically flattened to individual characters), e.g. `['9','1','4',…]`, `['91','415','732','0007']`, `['MG','KGM','J9X','0001']`.

### Errors & Exceptions handling

This package uses **Error vs Exception** semantics: *errors* indicate incorrect API use (e.g. wrong type); *exceptions* indicate invalid or ineligible data (e.g. invalid CNPJ). You can catch specific types or use the base classes.

- **CnpjCheckDigitsTypeError** (_abstract_) — base for type errors
- **CnpjCheckDigitsInputTypeError** — input is not string or string[]
- **CnpjCheckDigitsException** (_abstract_) — base for data/flow exceptions
- **CnpjCheckDigitsInputLengthException** — sanitized length is not 12–14
- **CnpjCheckDigitsInputInvalidException** — base/branch ineligible (e.g. all zeros, repeated digits)

```ts
import CnpjCheckDigits, {
  CnpjCheckDigitsInputTypeError,
  CnpjCheckDigitsInputLengthException,
  CnpjCheckDigitsInputInvalidException,
  CnpjCheckDigitsException,
} from '@lacussoft/cnpj-dv'

// Input type (e.g. number not allowed)
try {
  new CnpjCheckDigits(123456780009)
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputTypeError) {
    console.log(e.message)  // CNPJ input must be of type string or string[]. Got number.
  }
}

// Length (must be 12–14 alphanumeric chars after sanitization)
try {
  new CnpjCheckDigits('12345678')
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputLengthException) {
    console.log(e.message)
  }
}

// Invalid (e.g. all-zero base/branch, repeated digits)
try {
  new CnpjCheckDigits('000000000001')
} catch (e) {
  if (e instanceof CnpjCheckDigitsInputInvalidException) {
    console.log(e.message)
  }
}

// Any exception from the package
try {
  // risky code
} catch (e) {
  if (e instanceof CnpjCheckDigitsException) {
    // handle
  }
}
```

### Other Available Resources

- **`CnpjCheckDigits`** (default): Class to compute CNPJ check digits; constructor accepts `string | string[]`.
- **`CNPJ_MIN_LENGTH`**: `12` (constant).
- **`CNPJ_MAX_LENGTH`**: `14` (constant).
- **Types**: `CnpjInput` (`string | string[]`).
- **Exceptions**: See below.

## Calculation algorithm

Check digits use the official Brazilian algorithm with alphanumeric support:

1. **First check digit (13th position):** characters 1–12, weights 2–5 from right to left; alphanumeric value = ASCII − 48; `remainder = sum(char × weight) % 11`; digit = `0` if remainder < 2, else `11 − remainder`.
2. **Second check digit (14th position):** characters 1–13, weights 2–6 from right to left; same formula.

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

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
