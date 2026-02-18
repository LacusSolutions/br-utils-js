![cnpj-gen for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-gen.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-gen)](https://npmjs.com/package/@lacussoft/cnpj-gen)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-gen?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-gen)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-gen.svg)](https://npmjs.com/package/@lacussoft/cnpj-gen)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the new alphanumeric CNPJ format.**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/README.pt.md)

A JavaScript/TypeScript utility to generate valid CNPJ (Brazilian Business Tax ID) values.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Alphanumeric CNPJ**: Generates 14-character CNPJ with optional numeric, alphabetic, or alphanumeric (default) character sets
- ✅ **Optional prefix**: Provide 1–12 alphanumeric characters to fix the start of the CNPJ (e.g. base ID) and generate the rest with valid check digits
- ✅ **Formatting**: Option to return the standard formatted string (`00.000.000/0000-00`)
- ✅ **Reusable generator**: `CnpjGenerator` class with default options and per-call overrides
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Zero dependencies**: No external dependencies. Uses only `@lacussoft/cnpj-dv` for check digits calculation.
- ✅ **Error handling**: Specific type errors and exceptions for invalid options

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-gen

# using Bun
$ bun add @lacussoft/cnpj-gen
```

## Quick Start

```ts
// ES Modules
import cnpjGen from '@lacussoft/cnpj-gen'

// Common JS
const cnpjGen = require('@lacussoft/cnpj-gen')
```

Basic usage:

```ts
cnpjGen()                    // e.g. 'AB123CDE000155' (14-char alphanumeric)

cnpjGen({ format: true })     // e.g. 'AB.123.CDE/0001-55'

cnpjGen({ prefix: '45623767' })           // e.g. '45623767000296'
cnpjGen({ prefix: '456237670002', format: true })  // e.g. '45.623.767/0002-96'

cnpjGen({ type: 'numeric' })  // e.g. '65453043000178' (digits only)
cnpjGen({ type: 'alphabetic' })  // e.g. 'ABCDEFGHIJKL80' (letters only, except check digits)
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cnpjGen` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-gen@latest/dist/cnpj-gen.min.js"></script>
```

## Usage

### Generator options

All options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | boolean | `false` | When `true`, return the generated CNPJ in standard format (`00.000.000/0000-00`) |
| `prefix` | string | `''` | Partial start string (1–12 alphanumeric chars). Only alphanumeric is kept and uppercased; missing characters are generated randomly and check digits are computed. |
| `type` | `'numeric'` \| `'alphabetic'` \| `'alphanumeric'` | `'alphanumeric'` | Character set for the randomly generated part (`prefix` is kept as-is after sanitization). **Check digits are always numeric.** |

Prefix rules: base ID (first 8 chars) and branch ID (chars 9–12) cannot be all zeros; 12 repeated digits (e.g. `777777777777`) are also not allowed.

### `cnpjGen` (helper function)

Generates a valid CNPJ string. With no options, returns a 14-character alphanumeric CNPJ. This is a convenience wrapper around `new CnpjGenerator(options).generate()`.

- **`options`** (optional): `CnpjGeneratorOptionsInput` — see [Generator options](#generator-options).

### `CnpjGenerator` (class)

For reusable defaults or per-call overrides, use the class:

```ts
import { CnpjGenerator } from '@lacussoft/cnpj-gen'

const generator = new CnpjGenerator({ type: 'numeric', format: true })

generator.generate()           // e.g. '73.008.535/0005-06'
generator.generate({ prefix: '12345678' })  // override for this call only
generator.options              // current default options (CnpjGeneratorOptions)
```

- **`constructor`**: `new CnpjGenerator(defaultOptions?)` — optional default options (plain object or `CnpjGeneratorOptions` instance).
- **`generate(options?)`**: Returns a valid CNPJ; per-call `options` override instance defaults for that call only.
- **`options`**: Getter returning the default options used when per-call options are not provided (same instance as used internally; mutating it affects future `generate` calls).

### `CnpjGeneratorOptions` (class)

Holds options (`format`, `prefix`, `type`) with validation and merge support:

```ts
import { CnpjGeneratorOptions } from '@lacussoft/cnpj-gen'

const options = new CnpjGeneratorOptions({
  prefix: 'AB123XYZ',
  type: 'numeric',
  format: true,
})
options.prefix   // 'AB123XYZ'
options.type     // 'numeric'
options.format   // true
options.set({ format: false })  // merge and return this
options.all      // frozen shallow copy of current options
```

- **`constructor`**: `new CnpjGeneratorOptions(defaultOptions?, ...overrides)` — options merged in order.
- **`format`**, **`prefix`**, **`type`**: Getters/setters; prefix is validated (length, base/branch ineligible, repeated digits).
- **`set(options)`**: Update multiple options at once; returns `this`.
- **`all`**: Read-only snapshot of current options.

## API

### Exports

- **`cnpjGen`** (default): `(options?: CnpjGeneratorOptionsInput) => string`
- **`CnpjGenerator`**: Class to generate CNPJ with optional default options and per-call overrides.
- **`CnpjGeneratorOptions`**: Class holding options (`format`, `prefix`, `type`) with validation and merge.
- **`CNPJ_LENGTH`**: `14` (constant).
- **`CNPJ_PREFIX_MAX_LENGTH`**: `12` (constant).
- **Types**: `CnpjType`, `CnpjGeneratorOptionsInput`, `CnpjGeneratorOptionsType`, `Nullable<T>`.

### Errors & Exceptions

This package uses **TypeError** for invalid option types and **Exception** for invalid option values (`prefix` or `type`). You can catch specific classes or the base types.

- **CnpjGeneratorTypeError** (_abstract_) — base for option type errors
- **CnpjGeneratorOptionsTypeError** — an option has the wrong type (e.g. `prefix` not a string)
- **CnpjGeneratorException** (_abstract_) — base for option value exceptions
- **CnpjGeneratorOptionPrefixInvalidException** — prefix invalid (e.g. all-zero base/branch, repeated digits, invalid length)
- **CnpjGeneratorOptionTypeInvalidException** — `type` is not one of `'numeric'`, `'alphabetic'`, `'alphanumeric'`

```ts
import cnpjGen, {
  CnpjGeneratorOptionsTypeError,
  CnpjGeneratorOptionPrefixInvalidException,
  CnpjGeneratorOptionTypeInvalidException,
  CnpjGeneratorException,
} from '@lacussoft/cnpj-gen'

// Option type (e.g. `prefix` must be string)
try {
  cnpjGen({ prefix: 123 })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionsTypeError) {
    console.log(e.message)  // CNPJ generator option "prefix" must be of type string. Got integer number.
  }
}

// Invalid prefix (e.g. all-zero base)
try {
  cnpjGen({ prefix: '000000000001' })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionPrefixInvalidException) {
    console.log(e.reason, e.actualInput)
  }
}

// Invalid type value
try {
  cnpjGen({ type: 'invalid' })
} catch (e) {
  if (e instanceof CnpjGeneratorOptionTypeInvalidException) {
    console.log(e.expectedValues, e.actualInput)
  }
}

// Any exception from the package
try {
  cnpjGen({ prefix: '000000000000' })
} catch (e) {
  if (e instanceof CnpjGeneratorException) {
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

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
