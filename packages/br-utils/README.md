![br-utils for JavaScript](https://br-utils.vercel.app/img/cover_br-utils.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/br-utils)](https://npmjs.com/package/br-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/min/br-utils?label=bundle%20size)](https://bundlephobia.com/package/br-utils)
[![Downloads Count](https://img.shields.io/npm/dm/br-utils.svg)](https://npmjs.com/package/br-utils)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support for the [new alphanumeric CNPJ format](https://github.com/user-attachments/files/23937961/calculodvcnpjalfanaumerico.pdf).**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/br-utils/README.pt.md)

A JavaScript/TypeScript toolkit to handle the main operations with Brazilian-related data: CPF (personal ID) and CNPJ (employer ID). It exposes a unified API that wraps [`cpf-utils`](https://www.npmjs.com/package/cpf-utils) and [`cnpj-utils`](https://www.npmjs.com/package/cnpj-utils) in a single entry point.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Unified API**: One default instance with `cpf` and `cnpj` sub-modules; each sub-module offers `format`, `generate`, and `isValid`
- ✅ **Single entry point**: Install one package for both CPF ([demo](https://cpf-utils.vercel.app/)) and CNPJ ([demo](https://cnpj-utils.vercel.app/)) operations
- ✅ **Reusable instance**: `BrUtils` class with optional default settings for the CPF and CNPJ utils (options or instances)
- ✅ **Full re-exports**: All classes, options, errors, and types from `cpf-utils` and `cnpj-utils`
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Error handling**: Same errors and exceptions as the underlying packages

## Installation

```bash
# using NPM
$ npm install --save br-utils

# using Bun
$ bun add br-utils
```

## Quick Start

```ts
// ES Modules — default instance
import brUtils from 'br-utils'

// Or named exports (tree-shaking)
import { BrUtils, cpfUtils, cnpjUtils } from 'br-utils'

// Common JS
const brUtils = require('br-utils')
```

Basic usage:

```ts
// CPF (personal ID)
brUtils.cpf.format('47844241055')           // '478.442.410-55'
brUtils.cpf.generate({ format: true })      // e.g. '478.442.410-55'
brUtils.cpf.isValid('123.456.789-09')      // true

// CNPJ (employer ID)
brUtils.cnpj.format('03603568000195')      // '03.603.568/0001-95'
brUtils.cnpj.generate({ format: true })   // e.g. '03.603.568/0001-95'
brUtils.cnpj.isValid('98765432000198')    // true
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `brUtils` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/br-utils@latest/dist/br-utils.min.js"></script>
```

## Usage

### `brUtils` (default instance)

The default export is a pre-built `BrUtils` instance. Use it for quick one-off calls:

- **`cpf`**: Access the CPF utilities (`CpfUtils`). Use `brUtils.cpf.format()`, `brUtils.cpf.generate()`, `brUtils.cpf.isValid()` and the same options as in [cpf-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cpf-utils#readme).
- **`cnpj`**: Access the CNPJ utilities (`CnpjUtils`). Use `brUtils.cnpj.format()`, `brUtils.cnpj.generate()`, `brUtils.cnpj.isValid()` and the same options as in [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cnpj-utils#readme).

### `BrUtils` (class)

For custom default CPF or CNPJ utils, create your own instance:

```ts
import { BrUtils } from 'br-utils'

// Default settings (all optional)
const utils = new BrUtils({
  cpf: {
    formatter: { hidden: true, hiddenKey: '#' },
    generator: { format: true },
  },
  cnpj: {
    formatter: { hidden: true },
    generator: { type: 'numeric', format: true },
  },
})

utils.cpf.format('47844241055')        // '478.###.###-##'
utils.cpf.generate()                  // e.g. '005.265.352-88'
utils.cnpj.format('03603568000195')   // '03.603.***/****-**'
utils.cnpj.generate()                // e.g. '73.008.535/0005-06'

// Access or replace internal instances
utils.cpf   // CpfUtils
utils.cnpj  // CnpjUtils
```

- **`constructor(defaultSettings?)`**: Optional `BrUtilsSettingsInput` — `cpf` and `cnpj` can each be a `CpfUtils` / `CnpjUtils` instance or an options object (`CpfUtilsSettingsInput` / `CnpjUtilsSettingsInput`). Omitted keys use default instances.
- **`cpf`**: Getter/setter for the CPF utilities instance. Setter accepts `CpfUtils`, `CpfUtilsSettingsInput`, or `null`/`undefined` to reset to defaults.
- **`cnpj`**: Getter/setter for the CNPJ utilities instance. Setter accepts `CnpjUtils`, `CnpjUtilsSettingsInput`, or `null`/`undefined` to reset to defaults.

### Using the underlying helpers and re-exports

You can use the re-exported CPF and CNPJ helpers and classes directly:

```ts
import {
  cpfFmt,
  cpfGen,
  cpfVal,
  CpfUtils,
  cnpjFmt,
  cnpjGen,
  cnpjVal,
  CnpjUtils,
} from 'br-utils'

cpfFmt('47844241055', { dashKey: '_' })   // '478.442.410_55'
cpfGen({ prefix: '123456' })              // e.g. '12345678901'
cpfVal('123.456.789-09')                  // true

cnpjFmt('03603568000195', { slashKey: '|' })  // '03.603.568|0001-95'
cnpjGen({ type: 'numeric' })                  // e.g. '65453043000178'
cnpjVal('98.765.432/0001-98')                 // true
```

See [cpf-utils](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-utils/README.md) and [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-utils/README.md) for full option and error details.

## API

### Exports

- **`brUtils`** (default): Pre-built `BrUtils` instance with `cpf` and `cnpj`; for CommonJS and UMD, the object also carries all re-exports from `cpf-utils` and `cnpj-utils`.
- **`BrUtils`**: Class to create an instance with optional default CPF and CNPJ utils settings.
- **`BrUtilsSettingsInput`**, **`BrUtilsSettingsType`**: Types for the constructor settings.
- **CPF**: All exports from [cpf-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cpf-utils#readme) (e.g. `cpfUtils`, `CpfUtils`, `cpfFmt`, `cpfGen`, `cpfVal`, formatter/generator/validator classes, options, errors, types).
- **CNPJ**: All exports from [cnpj-utils](https://github.com/LacusSolutions/br-utils-js/tree/main/packages/cnpj-utils#readme) (e.g. `cnpjUtils`, `CnpjUtils`, `cnpjFmt`, `cnpjGen`, `cnpjVal`, formatter/generator/validator classes, options, errors, types).

### Errors & Exceptions

Errors and exceptions are the same as in `cpf-utils` and `cnpj-utils`. The `BrUtils` constructor and the `cpf`/`cnpj` setters can throw the same errors as the underlying package constructors. See each package’s README for the full list.

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/br-utils/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
