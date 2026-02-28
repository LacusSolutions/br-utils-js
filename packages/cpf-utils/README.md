![cpf-utils for JavaScript](https://br-utils.vercel.app/img/cover_cpf-utils.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/cpf-utils)](https://npmjs.com/package/cpf-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/min/cpf-utils?label=bundle%20size)](https://bundlephobia.com/package/cpf-utils)
[![Downloads Count](https://img.shields.io/npm/dm/cpf-utils.svg)](https://npmjs.com/package/cpf-utils)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/README.pt.md)

A JavaScript/TypeScript toolkit to format, generate, and validate CPF (Brazilian Individual's Taxpayer ID). It wraps [`cpf-fmt`](https://www.npmjs.com/package/@lacussoft/cpf-fmt), [`cpf-gen`](https://www.npmjs.com/package/@lacussoft/cpf-gen), and [`cpf-val`](https://www.npmjs.com/package/@lacussoft/cpf-val) in a single API.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Unified API**: One default instance with `format`, `generate`, and `isValid`; or use the underlying `cpfFmt`, `cpfGen`, and `cpfVal` helpers
- ✅ **Reusable instance**: `CpfUtils` class with optional default settings (formatter, generator, validator options or instances)
- ✅ **Full re-exports**: All formatter, generator, and validator classes, options, errors, and types from the three packages
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Error handling**: Same type errors and exceptions as the underlying packages

## Installation

```bash
# using NPM
$ npm install --save cpf-utils

# using Bun
$ bun add cpf-utils
```

## Quick Start

```ts
// ES Modules — default instance
import cpfUtils from 'cpf-utils'

// Or named exports (tree-shaking)
import { CpfUtils, cpfFmt, cpfGen, cpfVal } from 'cpf-utils'

// Common JS
const cpfUtils = require('cpf-utils')
```

Basic usage:

```ts
const cpf = '47844241055'

cpfUtils.format(cpf)     // '478.442.410-55'

cpfUtils.format(cpf, {   // '478.***.***-**'
  hidden: true
})

cpfUtils.format(cpf, {   // '478442410_55'
  dotKey: '',
  dashKey: '_'
})

cpfUtils.generate()                          // e.g. '47844241055'
cpfUtils.generate({ format: true })          // e.g. '478.442.410-55'
cpfUtils.generate({ prefix: '528250911' })   // e.g. '52825091138'
cpfUtils.generate({                          // e.g. '528.250.911-38'
  prefix: '528250911',
  format: true,
})

cpfUtils.isValid('12345678909')      // true
cpfUtils.isValid('123.456.789-09')   // true
cpfUtils.isValid('12345678910')      // false
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cpfUtils` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/cpf-utils@latest/dist/cpf-utils.min.js"></script>
```

## Usage

### Formatter options

When calling `format(cpfInput, options?)`, all options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | When `true`, mask digits in `hiddenStart`–`hiddenEnd` with `hiddenKey` |
| `hiddenKey` | string | `'*'` | Character(s) used to replace masked digits |
| `hiddenStart` | number | `3` | Start index (0–10, inclusive) of the range to hide |
| `hiddenEnd` | number | `10` | End index (0–10, inclusive) of the range to hide |
| `dotKey` | string | `'.'` | Dot delimiter (e.g. in `123.456.789`) |
| `dashKey` | string | `'-'` | Dash delimiter (e.g. before check digits `…-55`) |
| `escape` | boolean | `false` | When `true`, escape HTML special characters in the result |
| `encode` | boolean | `false` | When `true`, URL-encode the result (e.g. for query params) |
| `onFail` | (value, exception) => string | `() => ''` | Callback when sanitized input length ≠ 11; return value is used as result |

### Generator options

When calling `generate(options?)`, all options are optional:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | boolean | `false` | When `true`, return the generated CPF in standard format (`000.000.000-00`) |
| `prefix` | string | `''` | Partial start string (0–9 digits). Missing characters are generated and check digits computed. |

Prefix rules: the base (first 9 digits) cannot be all zeros; 9 repeated digits (e.g. `999999999`) are not allowed.

### `cpfUtils` (default instance)

The default export is a pre-built `CpfUtils` instance. Use it for quick one-off calls:

- **`format(cpfInput, options?)`**: Formats a CPF string or array of strings. Delegates to the internal formatter. Input must be 11 digits (after sanitization); otherwise `onFail` is used.
- **`generate(options?)`**: Generates a valid CPF. Delegates to the internal generator.
- **`isValid(cpfInput)`**: Returns `true` if the CPF is valid. Delegates to the internal validator.

### `CpfUtils` (class)

For custom default formatter, generator, or validator, create your own instance:

```ts
import { CpfUtils } from 'cpf-utils'

// Default settings (all optional)
const utils = new CpfUtils({
  formatter: { hidden: true, hiddenKey: '#' },
  generator: { format: true, prefix: '123' },
})

utils.format('47844241055')        // '478.###.###-##'
utils.generate()                  // e.g. '005.265.352-88'
utils.isValid('123.456.789-09')   // true

// Access or replace internal instances
utils.formatter  // CpfFormatter
utils.generator  // CpfGenerator
utils.validator  // CpfValidator
```

- **`constructor(defaultSettings?)`**: Optional `CpfUtilsSettingsInput` — `formatter`, `generator`, and `validator` can each be an options object or an instance of `CpfFormatter` / `CpfGenerator` / `CpfValidator`. Omitted keys use default instances.
- **`format(cpfInput, options?)`**: Same as the default instance; per-call options override the formatter's defaults for that call.
- **`generate(options?)`**: Same as the default instance; per-call options override the generator's defaults.
- **`isValid(cpfInput)`**: Same as the default instance.
- **`formatter`**, **`generator`**, **`validator`**: Getters (and setters) for the internal formatter, generator, and validator.

### Using the underlying helpers and classes

You can use the re-exported formatter, generator, and validator directly:

```ts
import {
  cpfFmt,
  CpfFormatter,
  cpfGen,
  CpfGenerator,
  cpfVal,
  CpfValidator,
} from 'cpf-utils'

cpfFmt('47844241055', { dashKey: '_' })   // '478.442.410_55'
cpfGen({ prefix: '123456' })              // e.g. '12345678901'
cpfVal('123.456.789-09')                  // true

const formatter = new CpfFormatter({ hidden: true })
formatter.format('47844241055')            // '478.***.***-**'
```

See [@lacussoft/cpf-fmt](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/README.md), [@lacussoft/cpf-gen](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-gen/README.md), and [@lacussoft/cpf-val](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-val/README.md) for full option and error details.

## API

### Exports

- **`cpfUtils`** (default): Pre-built `CpfUtils` instance with `format`, `generate`, `isValid` and, for CommonJS and UMD formats, also re-exports from the three wrapped packages.
- **`CpfUtils`**: Class to create a utils instance with optional default formatter, generator, and validator settings.
- **`CpfUtilsSettingsInput`**, **`CpfUtilsSettingsType`**: Types for the constructor settings.
- **Formatter**: `cpfFmt`, `CpfFormatter`, `CpfFormatterOptions`, `CPF_LENGTH`, and formatter types/errors (see cpf-fmt).
- **Generator**: `cpfGen`, `CpfGenerator`, `CpfGeneratorOptions`, `CPF_LENGTH`, `CPF_PREFIX_MAX_LENGTH`, and generator types/errors (see cpf-gen).
- **Validator**: `cpfVal`, `CpfValidator`, and validator types/errors (see cpf-val).

### Errors & Exceptions

Errors and exceptions are the same as in the underlying packages. Format calls can throw formatter type/length/options errors; generate can throw generator options/prefix exceptions; isValid can throw validator input type errors. See each package's README for the full list.

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
