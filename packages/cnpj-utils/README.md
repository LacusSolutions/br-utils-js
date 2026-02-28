![cnpj-utils for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-utils.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/cnpj-utils)](https://npmjs.com/package/cnpj-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/min/cnpj-utils?label=bundle%20size)](https://bundlephobia.com/package/cnpj-utils)
[![Downloads Count](https://img.shields.io/npm/dm/cnpj-utils.svg)](https://npmjs.com/package/cnpj-utils)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the new alphanumeric CNPJ format.**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/README.pt.md)

A JavaScript/TypeScript toolkit to format, generate, and validate CNPJ (Brazilian Business Tax ID). It wraps [`cnpj-fmt`](https://www.npmjs.com/package/@lacussoft/cnpj-fmt), [`cnpj-gen`](https://www.npmjs.com/package/@lacussoft/cnpj-gen), and [`cnpj-val`](https://www.npmjs.com/package/@lacussoft/cnpj-val) in a single API.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Unified API**: One default instance with `format`, `generate`, and `isValid`; or use the underlying `cnpjFmt`, `cnpjGen`, and `cnpjVal` helpers
- ✅ **Alphanumeric CNPJ**: Format, generate, and validate 14-character numeric or alphanumeric CNPJ
- ✅ **Reusable instance**: `CnpjUtils` class with optional default settings (formatter, generator, validator options or instances)
- ✅ **Full re-exports**: All formatter, generator, and validator classes, options, errors, and types from the three packages
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Error handling**: Same type errors and exceptions as the underlying packages

## Installation

```bash
# using NPM
$ npm install --save cnpj-utils

# using Bun
$ bun add cnpj-utils
```

## Quick Start

```ts
// ES Modules — default instance
import cnpjUtils from 'cnpj-utils'

// Or named exports (tree-shaking)
import { CnpjUtils, cnpjFmt, cnpjGen, cnpjVal } from 'cnpj-utils'

// Common JS
const cnpjUtils = require('cnpj-utils')
```

Basic usage:

```ts
const cnpj = '03603568000195'

cnpjUtils.format(cnpj)     // '03.603.568/0001-95'

cnpjUtils.format(cnpj, {   // '03.603.***/****-**'
  hidden: true
})

cnpjUtils.format(cnpj, {   // '03603568|0001_95'
  dotKey: '',
  slashKey: '|',
  dashKey: '_'
})

cnpjUtils.generate()                         // e.g. 'AB123CDE000155' (14-char alphanumeric)
cnpjUtils.generate({ format: true })         // e.g. 'AB.123.CDE/0001-55'
cnpjUtils.generate({ prefix: '45623767' })   // e.g. '45623767000296'
cnpjUtils.generate({ type: 'numeric' })      // e.g. '65453043000178' (digits only)

cnpjUtils.isValid('98765432000198')       // true
cnpjUtils.isValid('98.765.432/0001-98')   // true
cnpjUtils.isValid('1QB5UKALPYFP59')       // true (alphanumeric)
cnpjUtils.isValid('98765432000199')       // false
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cnpjUtils` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/cnpj-utils@latest/dist/cnpj-utils.min.js"></script>
```

## Usage

### Formatter options

When calling `format(cnpjInput, options?)`, all options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | When `true`, mask characters in `hiddenStart`–`hiddenEnd` with `hiddenKey` |
| `hiddenKey` | string | `'*'` | Character(s) used to replace masked digits |
| `hiddenStart` | number | `5` | Start index (0–13, inclusive) of the range to hide |
| `hiddenEnd` | number | `13` | End index (0–13, inclusive) of the range to hide |
| `dotKey` | string | `'.'` | Dot delimiter (e.g. in `12.345.678`) |
| `slashKey` | string | `'/'` | Slash delimiter (e.g. before branch `…/0001-90`) |
| `dashKey` | string | `'-'` | Dash delimiter (e.g. before check digits `…-90`) |
| `escape` | boolean | `false` | When `true`, escape HTML special characters in the result |
| `encode` | boolean | `false` | When `true`, URL-encode the result (e.g. for query params) |
| `onFail` | (value, exception) => string | `() => ''` | Callback when sanitized input length ≠ 14; return value is used as result |

### Generator options

When calling `generate(options?)`, all options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | boolean | `false` | When `true`, return the generated CNPJ in standard format (`00.000.000/0000-00`) |
| `prefix` | string | `''` | Partial start string (1–12 alphanumeric chars). Missing characters are generated and check digits computed. |
| `type` | `'numeric'` \| `'alphabetic'` \| `'alphanumeric'` | `'alphanumeric'` | Character set for the randomly generated part. **Check digits are always numeric.** |

### Validator options

When calling `isValid(cnpjInput, options?)`, all options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `caseSensitive` | boolean | `true` | When `false`, lowercase letters are accepted for alphanumeric CNPJ (input is uppercased before validation). |
| `type` | `'numeric'` \| `'alphanumeric'` | `'alphanumeric'` | `'numeric'`: only digits (0–9); `'alphanumeric'`: digits and letters (0–9, A–Z). |

### `cnpjUtils` (default instance)

The default export is a pre-built `CnpjUtils` instance. Use it for quick one-off calls:

- **`format(cnpjInput, options?)`**: Formats a CNPJ string or array of strings. Delegates to the internal formatter. Input must be 14 alphanumeric characters (after sanitization); otherwise `onFail` is used.
- **`generate(options?)`**: Generates a valid CNPJ. Delegates to the internal generator.
- **`isValid(cnpjInput, options?)`**: Returns `true` if the CNPJ is valid. Delegates to the internal validator.

### `CnpjUtils` (class)

For custom default formatter, generator, or validator, create your own instance:

```ts
import { CnpjUtils } from 'cnpj-utils'

// Default settings (all optional)
const utils = new CnpjUtils({
  formatter: { hidden: true, hiddenKey: '#' },
  generator: { type: 'numeric', format: true },
  validator: { type: 'numeric', caseSensitive: false },
})

utils.format('RK0CMT3W000100')        // 'RK.0CM.###/####-##'
utils.generate()                      // e.g. '73.008.535/0005-06'
utils.isValid('98.765.432/0001-98')   // true

// Access or replace internal instances
utils.formatter  // CnpjFormatter
utils.generator  // CnpjGenerator
utils.validator  // CnpjValidator
```

- **`constructor(defaultSettings?)`**: Optional `CnpjUtilsSettingsInput` — `formatter`, `generator`, and `validator` can each be an options object or an instance of `CnpjFormatter` / `CnpjGenerator` / `CnpjValidator`. Omitted keys use default instances.
- **`format(cnpjInput, options?)`**: Same as the default instance; per-call options override the formatter’s defaults for that call.
- **`generate(options?)`**: Same as the default instance; per-call options override the generator’s defaults.
- **`isValid(cnpjInput, options?)`**: Same as the default instance; per-call options override the validator’s defaults.
- **`formatter`**, **`generator`**, **`validator`**: Getters (and setters) for the internal formatter, generator, and validator.

### Using the underlying helpers and classes

You can use the re-exported formatter, generator, and validator directly:

```ts
import {
  cnpjFmt,
  CnpjFormatter,
  cnpjGen,
  CnpjGenerator,
  cnpjVal,
  CnpjValidator,
} from 'cnpj-utils'

cnpjFmt('01ABC234000X56', { slashKey: '|' })   // '01.ABC.234|000X-56'
cnpjGen({ type: 'numeric' })                    // e.g. '65453043000178'
cnpjVal('9JN7MGLJZXIO50')                       // true

const formatter = new CnpjFormatter({ hidden: true })
formatter.format('AB123XYZ000123')               // 'AB.123.***/****-**'
```

See [@lacussoft/cnpj-fmt](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/README.md), [@lacussoft/cnpj-gen](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-gen/README.md), and [@lacussoft/cnpj-val](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-val/README.md) for full option and error details.

## API

### Exports

- **`cnpjUtils`** (default): Pre-built `CnpjUtils` instance with `format`, `generate`, `isValid` and, for CommonJS and UMD formats, also re-exports from the three wrapped packages.
- **`CnpjUtils`**: Class to create a utils instance with optional default formatter, generator, and validator settings.
- **`CnpjUtilsSettingsInput`**, **`CnpjUtilsSettingsType`**: Types for the constructor settings.
- **Formatter**: `cnpjFmt`, `CnpjFormatter`, `CnpjFormatterOptions`, `CNPJ_LENGTH`, and formatter types/errors (see cnpj-fmt).
- **Generator**: `cnpjGen`, `CnpjGenerator`, `CnpjGeneratorOptions`, `CNPJ_LENGTH`, `CNPJ_PREFIX_MAX_LENGTH`, and generator types/errors (see cnpj-gen).
- **Validator**: `cnpjVal`, `CnpjValidator`, `CnpjValidatorOptions`, and validator types/errors (see cnpj-val).

### Errors & Exceptions

Errors and exceptions are the same as in the underlying packages. Format calls can throw formatter type/length/options errors; generate can throw generator options/prefix/type exceptions; isValid can throw validator input/options type errors and option type invalid exception. See each package’s README for the full list.

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
