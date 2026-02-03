---
"@lacussoft/cpf-fmt": major
---

### 🎉 v3 at a glance 🎊

- 🏗️ **Class-based API** — `CpfFormatter` lets you set default options once and reuse them; `format()` accepts string or array of strings.
- ✨ **Flat options** — Delimiters and masking use top-level options (`dotKey`, `dashKey`, `hiddenKey`, `hiddenStart`, `hiddenEnd`) plus `escape`, `encode`, and `onFail`.
- 🪶 **Zero dependencies** — No external packages; built-in HTML escaping and no deepmerge/num-only.
- 🛡️ **Structured errors** — Typed exceptions (`CpfFormatterInputTypeError`, `CpfFormatterInputLengthException`, options errors) for clearer error handling.

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cpfFmt()` helper, but the main programmable API is the `CpfFormatter` class. You can create an instance with default options and call `format()` without passing options every time.
- **Options are now flat** (no nested objects):
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `hiddenKey` and `escape` keep the same names.
  - **New:** `encode` (URL-encode output).
  - **onFail callback:** The signature has changed; it now receives `(value, error?)` and the return value is used as the formatted result.
- **Nullish options**: Setting an option to `null` or `undefined` now falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **`encode` option**: When `true`, the formatted CPF is URL-encoded (e.g. for query parameters or paths).
- **Exception hierarchy**: Dedicated error classes for type errors (`CpfFormatterTypeError`, `CpfFormatterInputTypeError`, `CpfFormatterOptionsTypeError`) and validation/range errors (`CpfFormatterException`, `CpfFormatterInputLengthException`, `CpfFormatterOptionsHiddenRangeInvalidException`, `CpfFormatterOptionsForbiddenKeyCharacterException`). Failures can still be handled via the `onFail` callback without throwing.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Zero dependencies**: Removed `html-escaper`, `deepmerge`, and `num-only`; in-house HTML escaping and option handling.
