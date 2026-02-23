![cnpj-fmt for JavaScript](https://br-utils.vercel.app/img/cover_cnpj-fmt.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cnpj-fmt)](https://npmjs.com/package/@lacussoft/cnpj-fmt)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cnpj-fmt?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cnpj-fmt)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cnpj-fmt.svg)](https://npmjs.com/package/@lacussoft/cnpj-fmt)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🚀 **Full support to the new alphanumeric CNPJ format.**

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/README.pt.md)

A JavaScript/TypeScript utility to format CNPJ (Brazilian Business Tax ID).

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Alphanumeric CNPJ**: Supports 14-character alphanumeric CNPJ (digits and letters, e.g. `RK0CMT3W000100`)
- ✅ **Flexible input**: accepts strings or array of strings
- ✅ **Format agnostic**: Strips non-alphanumeric characters and uppercases before formatting
- ✅ **Customizable**: Delimiters (dot, slash, dash), masking (range + replacement), HTML escape, URL encode
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Minimal dependencies**: No external dependencies, only on internal package `@lacussoft/utils`
- ✅ **Error handling**: Configurable `onFail` callback; optional use of specific exception classes

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cnpj-fmt

# using Bun
$ bun add @lacussoft/cnpj-fmt
```

## Quick Start

```ts
// ES Modules
import cnpjFmt from '@lacussoft/cnpj-fmt'

// Common JS
const cnpjFmt = require('@lacussoft/cnpj-fmt')
```

Basic usage:

```ts
const cnpj = '03603568000195'

cnpjFmt(cnpj)       // '03.603.568/0001-95'

cnpjFmt(cnpj, {     // '03.603.***/****-**'
  hidden: true
})

cnpjFmt(cnpj, {     // '03603568|0001_95'
  dotKey: '',
  slashKey: '|',
  dashKey: '_'
})
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cnpjFmt` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cnpj-fmt@latest/dist/cnpj-fmt.min.js"></script>
```

## Usage

### Formatting options

All options are optional:

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

Example with all options:

```ts
cnpjFmt(cnpj, {
  hidden: true,
  hiddenKey: '#',
  hiddenStart: 5,
  hiddenEnd: 11,
  dotKey: ' ',
  slashKey: '|',
  dashKey: '_-_',
  escape: true,
  encode: true,
  onFail(value, exception) {
    return String(value)
  },
})
```

### `cnpjFmt` (helper function)

Formats a CNPJ string. With no options, returns the standard format (e.g. `91.415.732/0007-93`). Invalid input **type** (not a string or array of strings) causes `CnpjFormatterInputTypeError` to be thrown. Invalid **length** (after stripping non-alphanumeric characters, the result is not 14 characters) is handled by the `onFail` callback instead of throwing. This is a more convenient way to use the library. However, under the hood, it instantiates a `CnpjFormatter` and immediately calls `format`.

- **`cnpjInput`** (string or array of strings): Raw or already formatted 14-alphanumeric-chars (after sanitization).
- **`options`** (optional): See [formatting options](#formatting-options).

### `CnpjFormatter` (class)

For reusable defaults, you can create your own formatter:

```ts
import { CnpjFormatter } from '@lacussoft/cnpj-fmt'

const formatter = new CnpjFormatter({ hidden: true, hiddenKey: '#' })

formatter.format('RK0CMT3W000100')                    // 'RK.0CM.###/####-##'
formatter.format('RK.0CM.T3W/0001-00')                // 'RK.0CM.###/####-##'
formatter.format(['RK', '0CM', 'T3W', '0001', '00'])  // 'RK.0CM.###/####-##'
formatter.format('RK0CMT3W000100', { hidden: false }) // override for this call: 'RK.0CM.T3W/0001-00'
```

- **`constructor`**: `new CnpjFormatter(options?)` — options are optional and can be a plain object or a `CnpjFormatterOptions` instance.
- **`format(input, options?)`**: `input` can be `string` or `string[]`; per-call `options` override instance defaults for that call only.

## API

### Exports

- **`cnpjFmt`** (default): `(cnpjInput: string | string[], options?: CnpjFormatterOptionsInput) => string`
- **`CnpjFormatter`**: Class to format CNPJ with optional default options; accepts `string | string[]` in `format()`.
- **`CnpjFormatterOptions`**: Class holding options (dotKey, slashKey, dashKey, hidden, hiddenKey, hiddenStart, hiddenEnd, escape, encode, onFail). Supports merge via constructor or `set()`.
- **`CNPJ_LENGTH`**: `14` (constant).
- **Types**: `CnpjInput`, `CnpjFormatterOptionsInput`, `CnpjFormatterOptionsType`, `OnFailCallback`, `Nullable<T>`.

### Exceptions

When using `CnpjFormatter`, invalid input type (non-string, non–array of strings) always throws. Invalid options throw when building options. Invalid length is passed to `onFail` by default. You may see:

- **CnpjFormatterTypeError** (base for type errors)
- **CnpjFormatterInputTypeError** — input is not string or string[]
- **CnpjFormatterInputLengthException** — sanitized input length is not 14
- **CnpjFormatterOptionsTypeError** — an option has the wrong type
- **CnpjFormatterOptionsHiddenRangeInvalidException** — hiddenStart/hiddenEnd out of 0..13
- **CnpjFormatterOptionsForbiddenKeyCharacterException** — a key option contains a disallowed character

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cnpj-fmt/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
