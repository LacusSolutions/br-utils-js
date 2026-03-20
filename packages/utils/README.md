# Lacus Solutions' Utils

[![NPM Latest Version](https://img.shields.io/npm/v/@lacussoft/utils)](https://npmjs.com/package/@lacussoft/utils)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@lacussoft/utils?label=bundle%20size)](https://bundlephobia.com/package/@lacussoft/utils)
[![Downloads Count](https://img.shields.io/npm/dm/@lacussoft/utils.svg)](https://npmjs.com/package/@lacussoft/utils)
[![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/br-utils-js/ci.yml?label=ci/cd)](https://github.com/LacusSolutions/br-utils-js/actions)
[![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js)
[![Project License](https://img.shields.io/github/license/LacusSolutions/br-utils-js)](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE)

A JavaScript/TypeScript reusable utilities library for Lacus Solutions' packages.

## Platform Support

| ![Node.js](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg) | ![Bun](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg) | ![Deno](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg) | ![Chrome](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Firefox](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg) | ![Safari](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg) | ![Opera](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opera/opera-original.svg) | ![IE](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ie10/ie10-original.svg) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v16+ ✔ | v1.0+ ✔ | ⚠️ untested | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Features

- ✅ **Type description**: Human-readable type strings for error messages (primitives, arrays, `NaN`, `Infinity`)
- ✅ **HTML escaping**: Escape `&`, `<`, `>`, `"`, `'` for safe output and XSS mitigation
- ✅ **Random sequences**: Generate numeric, alphabetic, or alphanumeric sequences of any length
- ✅ **Zero dependencies**: No external dependencies

## Installation

```bash
# using NPM
$ npm install --save @lacussoft/utils

# using Bun
$ bun add @lacussoft/utils
```

## Quick Start

```ts
// ES Modules — named exports
import { describeType, escapeHTML, generateRandomSequence } from '@lacussoft/utils'

// Or import everything within a single variable
import * as lacusUtils from '@lacussoft/utils'
lacusUtils.describeType(42)        // 'integer number'
lacusUtils.escapeHTML('<br>')      // '&lt;br&gt;'
lacusUtils.generateRandomSequence(10, 'numeric')  // e.g. '9956000611'
```

```ts
// CommonJS
const { describeType, escapeHTML, generateRandomSequence } = require('@lacussoft/utils')
// or
const lacusUtils = require('@lacussoft/utils')
```

Basic usage:

```ts
describeType(null)           // 'null'
describeType(undefined)      // 'undefined'
describeType('hello')        // 'string'
describeType(42)              // 'integer number'
describeType(3.14)            // 'float number'
describeType(NaN)             // 'NaN'
describeType([1, 2, 3])      // 'number[]'
describeType([1, 'a', 2])    // '(number | string)[]'

escapeHTML('Tom & Jerry')    // 'Tom &amp; Jerry'
escapeHTML('<script>alert("XSS")</script>')
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'

generateRandomSequence(10, 'numeric')       // e.g. '9956000611'
generateRandomSequence(6, 'alphabetic')    // e.g. 'AXQMZB'
generateRandomSequence(8, 'alphanumeric')  // e.g. '8ZFB2K09'
```

For legacy frontends, include the UMD build in a `<script>` tag; utilities are exposed on the global `lacusUtils`:

```html
<script src="https://cdn.jsdelivr.net/npm/@lacussoft/utils@latest/dist/utils.min.js"></script>
<script>
  lacusUtils.describeType(42)                    // 'integer number'
  lacusUtils.escapeHTML('<script>...</script>')  // escaped string
  lacusUtils.generateRandomSequence(10, 'numeric')
</script>
```

## API

All functions are implemented in [`src/`](src/) and covered by tests in [`tests/`](tests/).

### `describeType(value: unknown): string`

Describes the type of a value for error messages.

| Input | Result |
|--------|--------|
| `null` | `'null'` |
| `undefined` | `'undefined'` |
| string | `'string'` |
| boolean | `'boolean'` |
| integer number | `'integer number'` |
| float number | `'float number'` |
| `NaN` | `'NaN'` |
| `Infinity` / `-Infinity` | `'Infinity'` |
| bigint, symbol, function | `'bigint'`, `'symbol'`, `'function'` |
| non-array object (Date, RegExp, etc.) | `'object'` |
| `[]` | `'Array (empty)'` |
| `[1, 2, 3]` | `'number[]'` |
| `[1, 'a', 2]` | `'(number \| string)[]'` |

See [`src/describe-type.ts`](src/describe-type.ts) and [`tests/describe-type.spec.ts`](tests/describe-type.spec.ts).

### `escapeHTML(value: string): string`

Escapes HTML special characters: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`, `'` → `&#039;`. Useful for safe insertion into HTML and mitigating XSS.

See [`src/escape-html.ts`](src/escape-html.ts) and [`tests/escape-html.spec.ts`](tests/escape-html.spec.ts).

### `generateRandomSequence(size: number, type: SequenceType): string`

Generates a random character sequence of the given length and type.

- **`size`**: Length of the sequence (e.g. `10`).
- **`type`**: One of:
  - **`'numeric'`**: digits `0-9`
  - **`'alphabetic'`**: uppercase letters `A-Z`
  - **`'alphanumeric'`**: digits and uppercase letters `0-9A-Z`

See [`src/generate-random-sequence.ts`](src/generate-random-sequence.ts), [`src/types.ts`](src/types.ts), and [`tests/generate-random-sequence.spec.ts`](tests/generate-random-sequence.spec.ts).

### Exports summary

| Export | Type | Description |
|--------|------|-------------|
| `describeType` | `(value: unknown) => string` | Type description for error messages |
| `escapeHTML` | `(value: string) => string` | HTML entity escaping |
| `generateRandomSequence` | `(size: number, type: SequenceType) => string` | Random sequence generation |
| `SequenceType` | `'alphabetic' \| 'alphanumeric' \| 'numeric'` | Type for sequence kind |

Default export: frozen object `{ describeType, escapeHTML, generateRandomSequence }`.

## TypeScript Support

- Written in TypeScript
- Declarations in `dist/index.d.ts`
- Compatible with `strict: true`

## Contribution & Support

We welcome contributions! Please see our [Contributing Guidelines](https://github.com/LacusSolutions/br-utils-js/blob/main/CONTRIBUTING.md) for details. If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🤝 Contributing to the codebase
- 💡 [Suggesting new features](https://github.com/LacusSolutions/br-utils-js/issues)
- 🐛 [Reporting bugs](https://github.com/LacusSolutions/br-utils-js/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LacusSolutions/br-utils-js/blob/main/LICENSE) file for details.

## Changelog

See [CHANGELOG](https://github.com/LacusSolutions/br-utils-js/blob/main/packages/utils/CHANGELOG.md) for a list of changes and version history.

---

Made with ❤️ by [Lacus Solutions](https://github.com/LacusSolutions)
