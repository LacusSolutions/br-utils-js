![cpf-gen for JavaScript](https://br-utils.vercel.app/img/cover_cpf-gen.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-gen)](https://npmjs.com/package/@lacussoft/cpf-gen)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-gen?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-gen)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-gen.svg)](https://npmjs.com/package/@lacussoft/cpf-gen)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/README.pt.md)

A JavaScript/TypeScript utility to generate valid CPF (Brazilian Individual's Taxpayer ID) values.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Optional prefix**: Provide 0–9 digits to fix the start of the CPF and generate the rest with valid check digits
- ✅ **Formatting**: Option to return the standard formatted string (`000.000.000-00`)
- ✅ **Reusable generator**: `CpfGenerator` class with default options and per-call overrides
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Minimal dependencies**: Only depends on internal package `@lacussoft/cpf-dv` for check digits calculation
- ✅ **Error handling**: Specific type errors and exceptions for invalid options

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-gen

# using Bun
$ bun add @lacussoft/cpf-gen
```

## Quick Start

```ts
// ES Modules
import cpfGen from '@lacussoft/cpf-gen'

// Common JS
const cpfGen = require('@lacussoft/cpf-gen')
```

Basic usage:

```ts
cpfGen()                    // e.g. '47844241055' (11-digit numeric)

cpfGen({ format: true })     // e.g. '005.265.352-88'

cpfGen({ prefix: '528250911' })           // e.g. '52825091138'
cpfGen({ prefix: '528250911', format: true })  // e.g. '528.250.911-38'
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cpfGen` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-gen@latest/dist/cpf-gen.min.js"></script>
```

## Usage

### Generator options

All options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | boolean | `false` | When `true`, return the generated CPF in standard format (`000.000.000-00`) |
| `prefix` | string | `''` | Partial start string (0–9 digits). Only digits are kept; missing characters are generated randomly and check digits are computed. |

Prefix rules: the base (first 9 digits) cannot be all zeros; 9 repeated digits (e.g. `999999999`) are not allowed.

### `cpfGen` (helper function)

Generates a valid CPF string. With no options, returns an 11-digit numeric CPF. This is a convenience wrapper around `new CpfGenerator(options).generate()`.

- **`options`** (optional): `CpfGeneratorOptionsInput` — see [Generator options](#generator-options).

### `CpfGenerator` (class)

For reusable defaults or per-call overrides, use the class:

```ts
import { CpfGenerator } from '@lacussoft/cpf-gen'

const generator = new CpfGenerator({ format: true })

generator.generate()           // e.g. '005.265.352-88'
generator.generate({ prefix: '123456' })  // override for this call only
generator.options              // current default options (CpfGeneratorOptions)
```

- **`constructor`**: `new CpfGenerator(defaultOptions?)` — optional default options (plain object or `CpfGeneratorOptions` instance).
- **`generate(options?)`**: Returns a valid CPF; per-call `options` override instance defaults for that call only.
- **`options`**: Getter returning the default options used when per-call options are not provided (same instance as used internally; mutating it affects future `generate` calls).

### `CpfGeneratorOptions` (class)

Holds options (`format`, `prefix`) with validation and merge support:

```ts
import { CpfGeneratorOptions } from '@lacussoft/cpf-gen'

const options = new CpfGeneratorOptions({
  prefix: '123456',
  format: true,
})
options.prefix   // '123456'
options.format   // true
options.set({ format: false })  // merge and return this
options.all      // frozen shallow copy of current options
```

- **`constructor`**: `new CpfGeneratorOptions(defaultOptions?, ...overrides)` — options merged in order.
- **`format`**, **`prefix`**: Getters/setters; prefix is validated (length, base ID ineligible, repeated digits).
- **`set(options)`**: Update multiple options at once; returns `this`.
- **`all`**: Read-only snapshot of current options.

## API

### Exports

- **`cpfGen`** (default): `(options?: CpfGeneratorOptionsInput) => string`
- **`CpfGenerator`**: Class to generate CPF with optional default options and per-call overrides.
- **`CpfGeneratorOptions`**: Class holding options (`format`, `prefix`) with validation and merge.
- **`CPF_LENGTH`**: `11` (constant).
- **`CPF_PREFIX_MAX_LENGTH`**: `9` (constant).
- **Types**: `CpfGeneratorOptionsInput`, `CpfGeneratorOptionsType`, `Nullable<T>`.

### Errors & Exceptions

This package uses **TypeError** for invalid option types and **Exception** for invalid option values (e.g. `prefix`). You can catch specific classes or the base types.

- **CpfGeneratorTypeError** (_abstract_) — base for option type errors
- **CpfGeneratorOptionsTypeError** — an option has the wrong type (e.g. `prefix` not a string)
- **CpfGeneratorException** (_abstract_) — base for option value exceptions
- **CpfGeneratorOptionPrefixInvalidException** — prefix invalid (e.g. zeroed base ID, repeated digits, invalid length)

```ts
import cpfGen, {
  CpfGeneratorOptionsTypeError,
  CpfGeneratorOptionPrefixInvalidException,
  CpfGeneratorException,
} from '@lacussoft/cpf-gen'

// Option type (e.g. `prefix` must be string)
try {
  cpfGen({ prefix: 123 })
} catch (e) {
  if (e instanceof CpfGeneratorOptionsTypeError) {
    console.log(e.message)  // CPF generator option "prefix" must be of type string. Got integer number.
  }
}

// Invalid prefix (e.g. zeroed base ID)
try {
  cpfGen({ prefix: '00000000' })
} catch (e) {
  if (e instanceof CpfGeneratorOptionPrefixInvalidException) {
    console.log(e.reason, e.actualInput)
  }
}

// Any exception from the package
try {
  cpfGen({ prefix: '999999999' })
} catch (e) {
  if (e instanceof CpfGeneratorException) {
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

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
