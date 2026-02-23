---
"@lacussoft/cnpj-fmt": major
---

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico) (digits and letters); input is sanitized and uppercased before formatting.
- 🏗️ **Class-based API** — `CnpjFormatter` lets you set default options once and reuse them; `format()` accepts string or array of strings.
- ✨ **Flat options** — Delimiters and masking use top-level options (`dotKey`, `slashKey`, `dashKey`, `hiddenKey`, `hiddenStart`, `hiddenEnd`) plus `escape`, `encode`, and `onFail`.
- 🛡️ **Structured errors** — Typed exceptions (`CnpjFormatterInputTypeError`, `CnpjFormatterInputLengthException`, options errors) for clearer error handling.

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cnpjFmt()` helper, but the main programmable API is the `CnpjFormatter` class. You can create an instance with default options and call `format()` without passing options every time.
- **Options are now flat** (no nested objects):
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.slash` is now **`slashKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `hiddenKey` and `escape` keep the same names.
  - **New:** `encode` (URL-encode output).
  - **onFail callback:** The signature has changed; it now receives `(value, error?)` and the return value is used as the formatted result.
- **Nullish options**: Setting an option to `null` or `undefined` now falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **Alphanumeric CNPJ**: Both numeric and alphanumeric 14-character CNPJs are supported; non-alphanumeric characters are stripped and the result is uppercased before formatting.
- **`encode` option**: When `true`, the formatted CNPJ is URL-encoded (e.g. for query parameters or paths).
- **Exception hierarchy**: Dedicated error classes for type errors (`CnpjFormatterTypeError`, `CnpjFormatterInputTypeError`, `CnpjFormatterOptionsTypeError`) and validation/range errors (`CnpjFormatterException`, `CnpjFormatterInputLengthException`, `CnpjFormatterOptionsHiddenRangeInvalidException`, `CnpjFormatterOptionsForbiddenKeyCharacterException`). Failures can still be handled via the `onFail` callback without throwing.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Minimal dependencies**: Removed `html-escaper`, `deepmerge`, and `num-only`; in-house HTML escaping and option handling. It only depends on internal package `@lacussoft/utils` now.
