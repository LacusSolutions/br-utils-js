![cnpj-val for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-val.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-val)](https://npmjs.com/package/@lacussoft/cnpj-val)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-val?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-val)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-val.svg)](https://npmjs.com/package/@lacussoft/cnpj-val)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the new alphanumeric CNPJ format.**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/README.pt.md)

A JavaScript/TypeScript utility to validate CNPJ (Brazilian Business Tax ID) values.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Alphanumeric CNPJ**: Validates 14-character CNPJ in numeric or alphanumeric format
- ✅ **Flexible input**: Accepts string or array of strings (formatted or raw)
- ✅ **Format agnostic**: Strips non-alphanumeric characters and optionally uppercases before validation
- ✅ **Optional case sensitivity**: When `caseSensitive` is `false`, lowercase letters are accepted for alphanumeric CNPJ
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Minimal dependencies**: Only depends on internal package `@lacussoft/cnpj-dv` for check digits verification
- ✅ **Error handling**: Specific type errors and exceptions for invalid options or input type

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-val

# using Bun
$ bun add @lacussoft/cnpj-val
```

## Quick Start

```ts
// ES Modules
import cnpjVal from '@lacussoft/cnpj-val'

// Common JS
const cnpjVal = require('@lacussoft/cnpj-val')
```

Basic usage:

```ts
cnpjVal('98765432000198')      // true
cnpjVal('98.765.432/0001-98')  // true
cnpjVal('98765432000199')      // false (invalid check digits)

cnpjVal('1QB5UKALPYFP59')           // true (alphanumeric)
cnpjVal('1QB5UKALpyfp59')           // false (default is case-sensitive)
cnpjVal('1QB5UKALpyfp59', { caseSensitive: false })  // true

cnpjVal('96206256120884')            // true (numeric)
cnpjVal('96206256120884', { type: 'numeric' })  // true
cnpjVal('1QB5UKALPYFP59', { type: 'numeric' })  // false (letters not allowed when type is numeric)
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cnpjVal` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-val@latest/dist/cnpj-val.min.js"></script>
```

## Usage

### Validator options

All options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `caseSensitive` | boolean | `true` | When `false`, lowercase letters are accepted for alphanumeric CNPJ (input is uppercased before validation). |
| `type` | `'numeric'` \| `'alphanumeric'` | `'alphanumeric'` | `'numeric'`: only digits (0–9) after sanitization; `'alphanumeric'`: digits and letters (0–9, A–Z). |

### `cnpjVal` (helper function)

Validates a CNPJ string or array of strings. Returns `true` if the input is a valid CNPJ (correct length, eligible base/branch, and check digits), otherwise `false`. Invalid input (e.g. wrong length, ineligible base/branch, repeated digits) yields `false` without throwing. This is a convenience wrapper around `new CnpjValidator(options).isValid(cnpjInput)`.

- **`cnpjInput`**: `CnpjInput` — string or array of strings (formatted or raw; non-alphanumeric stripped according to `type`).
- **`options`** (optional): `CnpjValidatorOptionsInput` — see [Validator options](#validator-options).

**Throws:** `CnpjValidatorInputTypeError` if input is not string or string[]; `CnpjValidatorOptionsTypeError` or `CnpjValidatorOptionTypeInvalidException` if options are invalid.

### `CnpjValidator` (class)

For reusable default options or per-call overrides, use the class:

```ts
import { CnpjValidator } from '@lacussoft/cnpj-val'

const validator = new CnpjValidator({ type: 'numeric', caseSensitive: false })

validator.isValid('98.765.432/0001-98')       // true
validator.isValid('1QB5UKALpyfp59', { caseSensitive: true })  // override for this call: false
validator.options                              // current default options (CnpjValidatorOptions)
```

- **`constructor`**: `new CnpjValidator(defaultOptions?)` — optional default options (plain object or `CnpjValidatorOptions` instance).
- **`isValid(cnpjInput, options?)`**: Returns `true` if the CNPJ is valid; per-call `options` override instance defaults for that call only.
- **`options`**: Getter returning the default options used when per-call options are not provided (same instance as used internally; mutating it affects future `isValid` calls).

### `CnpjValidatorOptions` (class)

Holds options (`caseSensitive`, `type`) with validation and merge support:

```ts
import { CnpjValidatorOptions } from '@lacussoft/cnpj-val'

const options = new CnpjValidatorOptions({
  caseSensitive: false,
  type: 'numeric',
})
options.caseSensitive   // false
options.type           // 'numeric'
options.set({ type: 'alphanumeric' })  // merge and return this
options.all            // frozen shallow copy of current options
```

- **`constructor`**: `new CnpjValidatorOptions(defaultOptions?, ...overrides)` — options merged in order.
- **`caseSensitive`**, **`type`**: Getters/setters; `type` is validated (`'alphanumeric'` or `'numeric'`).
- **`set(options)`**: Update multiple options at once; returns `this`.
- **`all`**: Read-only snapshot of current options.

## API

### Exports

- **`cnpjVal`** (default): `(cnpjInput: CnpjInput, options?: CnpjValidatorOptionsInput) => boolean`
- **`CnpjValidator`**: Class to validate CNPJ with optional default options and per-call overrides.
- **`CnpjValidatorOptions`**: Class holding options (`caseSensitive`, `type`) with validation and merge.
- **`CNPJ_LENGTH`**: `14` (constant).
- **Types**: `CnpjType`, `CnpjInput`, `CnpjValidatorOptionsInput`, `CnpjValidatorOptionsType`, `Nullable<T>`.

### Errors & Exceptions

This package uses **TypeError** for invalid option/input types and **Exception** for invalid option values. You can catch specific classes or the base types.

- **CnpjValidatorTypeError** (_abstract_) — base for type errors
- **CnpjValidatorInputTypeError** — input is not string or string[]
- **CnpjValidatorOptionsTypeError** — an option has the wrong type (e.g. `type` not a string)
- **CnpjValidatorException** (_abstract_) — base for option value exceptions
- **CnpjValidatorOptionTypeInvalidException** — `type` is not one of `'alphanumeric'`, `'numeric'`

```ts
import cnpjVal, {
  CnpjValidatorInputTypeError,
  CnpjValidatorOptionsTypeError,
  CnpjValidatorOptionTypeInvalidException,
  CnpjValidatorException,
} from '@lacussoft/cnpj-val'

// Input type (e.g. number not allowed)
try {
  cnpjVal(12345678000198)
} catch (e) {
  if (e instanceof CnpjValidatorInputTypeError) {
    console.log(e.message)  // CNPJ input must be of type string or string[]. Got number.
  }
}

// Option type (e.g. `type` must be string)
try {
  cnpjVal('98765432000198', { type: 123 })
} catch (e) {
  if (e instanceof CnpjValidatorOptionsTypeError) {
    console.log(e.message)  // CNPJ validator option "type" must be of type string. Got integer number.
  }
}

// Invalid type value
try {
  cnpjVal('98765432000198', { type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjValidatorOptionTypeInvalidException) {
    console.log(e.expectedValues, e.actualInput)
  }
}

// Any exception from the package
try {
  cnpjVal('98765432000198', { type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjValidatorException) {
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

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
