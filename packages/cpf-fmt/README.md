![cpf-fmt for JavaScript](https://br-utils.vercel.app/img/cover_cpf-fmt.jpg)

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/cpf-fmt)](https://npmjs.com/package/@lacussoft/cpf-fmt)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/cpf-fmt?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/cpf-fmt)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/cpf-fmt.svg)](https://npmjs.com/package/@lacussoft/cpf-fmt)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

> 🌎 [Acessar documentação em português](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/README.pt.md)

A JavaScript/TypeScript utility to format CPF (Brazilian Individual's Taxpayer ID).

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Flexible input**: Accepts strings or array of strings
- ✅ **Format agnostic**: Strips non-numeric characters before formatting
- ✅ **Customizable**: Delimiters (dot, dash), masking (range + replacement), HTML escape, URL encode
- ✅ **TypeScript support**: Full type definitions and strict-mode compatible
- ✅ **Minimal dependencies**: No external dependencies, only on internal package `@lacussoft/utils`
- ✅ **Error handling**: Configurable `onFail` callback; optional use of specific exception classes

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/cpf-fmt

# using Bun
$ bun add @lacussoft/cpf-fmt
```

## Quick Start

```ts
// ES Modules
import cpfFmt from '@lacussoft/cpf-fmt'

// Common JS
const cpfFmt = require('@lacussoft/cpf-fmt')
```

Basic usage:

```ts
const cpf = '03603568195'

cpfFmt(cpf)       // '036.035.681-95'

cpfFmt(cpf, {     // '036.***.***-**'
  hidden: true
})

cpfFmt(cpf, {     // '036035681 dv 95'
  dotKey: '',
  dashKey: ' dv '
})
```

For legacy frontends, include the UMD build (e.g. minified) in a `<script>` tag; `cpfFmt` is exposed globally:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/cpf-fmt@latest/dist/cpf-fmt.min.js"></script>
```

## Usage

### Formatting options

All options are optional. Flat keys (no nested `delimiters` or `hiddenRange`):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hidden` | boolean | `false` | When `true`, mask digits in `hiddenStart`–`hiddenEnd` with `hiddenKey` |
| `hiddenKey` | string | `'*'` | Character(s) used to replace masked digits |
| `hiddenStart` | number | `3` | Start index (0–10, inclusive) of the range to hide |
| `hiddenEnd` | number | `10` | End index (0–10, inclusive) of the range to hide |
| `dotKey` | string | `'.'` | Dot delimiter (e.g. in `123.456.789`) |
| `dashKey` | string | `'-'` | Dash delimiter (e.g. before check digits `…-58`) |
| `escape` | boolean | `false` | When `true`, escape HTML special characters in the result |
| `encode` | boolean | `false` | When `true`, URL-encode the result (e.g. for query params) |
| `onFail` | (value, exception) => string | `() => ''` | Callback when sanitized input length ≠ 11; return value is used as result |

Example with all options:

```ts
cpfFmt(cpf, {
  hidden: true,
  hiddenKey: '#',
  hiddenStart: 3,
  hiddenEnd: 9,
  dotKey: ' ',
  dashKey: '_-_',
  escape: true,
  encode: true,
  onFail(value, exception) {
    return String(value)
  },
})
```

### `cpfFmt` (helper function)

Formats a CPF string. With no options, returns the standard format (e.g. `123.456.789-10`). Invalid input **type** (not a string or array of strings) causes `CpfFormatterInputTypeError` to be thrown. Invalid **length** (after stripping non-numeric characters, the result is not 11 digits) is handled by the `onFail` callback instead of throwing. This is a more convenient way to use the library. However, under the hood, it instantiates a `CpfFormatter` and immediately calls `format`.

- **`cpfInput`** (string or array of strings): Raw or already formatted 11-digits value (after sanitization).
- **`options`** (optional): See [formatting options](#formatting-options).

### `CpfFormatter` (class)

For reusable defaults, you can create your own formatter:

```ts
import { CpfFormatter } from '@lacussoft/cpf-fmt'

const formatter = new CpfFormatter({ hidden: true, hiddenKey: '#' })

formatter.format('12345678910')                      // '123.###.###-##'
formatter.format('123.456.789-10')                   // '123.###.###-##'
formatter.format(['123', '456', '789', '10'])        // '123.###.###-##'
formatter.format('12345678910', { hidden: false })   // override for this call: '123.456.789-10'
```

- **`constructor`**: `new CpfFormatter(options?)` — options are optional and can be a plain object or a `CpfFormatterOptions` instance.
- **`format(input, options?)`**: `input` can be `string` or `string[]`; per-call `options` override instance defaults for that call only.

## API

### Exports

- **`cpfFmt`** (default): `(cpfInput: string | string[], options?: CpfFormatterOptionsInput) => string`
- **`CpfFormatter`**: Class to format CPF with optional default options; accepts `string | string[]` in `format()`.
- **`CpfFormatterOptions`**: Class holding options (dotKey, dashKey, hidden, hiddenKey, hiddenStart, hiddenEnd, escape, encode, onFail). Supports merge via constructor or `set()`.
- **`CPF_LENGTH`**: `11` (constant).
- **Types**: `CpfInput`, `CpfFormatterOptionsInput`, `CpfFormatterOptionsType`, `OnFailCallback`.

### Exceptions

When using `CpfFormatter`, invalid input type (non-string, non–array of strings) always throws. Invalid options throw when building options. Invalid length is passed to `onFail` by default. You may see:

- **CpfFormatterTypeError** (base for type errors)
- **CpfFormatterInputTypeError** — input is not string or string[]
- **CpfFormatterInputLengthException** — sanitized input length is not 11
- **CpfFormatterOptionsTypeError** — an option has the wrong type
- **CpfFormatterOptionsHiddenRangeInvalidException** — hiddenStart/hiddenEnd out of 0..10
- **CpfFormatterOptionsForbiddenKeyCharacterException** — a key option contains a disallowed character

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/cpf-fmt/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
