---
"cnpj-utils": major
---

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); format, generate, and validate numeric or alphanumeric IDs via the unified instance or the underlying `cnpjFmt` / `cnpjGen` / `cnpjVal` helpers.
- 🏗️ **Class-based customization** — `CnpjUtils` class with optional default formatter, generator, and validator (options or instances); default export remains a pre-built instance for one-off use.
- ✨ **Flat format options** — Format options no longer use nested objects: `delimiters.dot` → `dotKey`, `delimiters.slash` → `slashKey`, `delimiters.dash` → `dashKey`, `hiddenRange.start`/`end` → `hiddenStart`/`hiddenEnd`. New `encode` option for URL-encoding.
- 📦 **Full re-exports** — All formatter, generator, and validator classes, options, errors, and types from `@lacussoft/cnpj-fmt`, `@lacussoft/cnpj-gen`, and `@lacussoft/cnpj-val` are re-exported; you can use `CnpjFormatter`, `CnpjGenerator`, `CnpjValidator` and their helpers directly from `cnpj-utils`.
- 🛡️ **Structured errors** — Format, generate, and isValid can throw the same typed exceptions as the underlying packages (input type, options type, invalid prefix/type, etc.).

### BREAKING CHANGES

- **Format options are now flat** (aligned with `@lacussoft/cnpj-fmt` v3). Nested option shapes are no longer supported:
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.slash` is now **`slashKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `onFail` callback signature may differ (e.g. receives `(value, exception)`); return value is still used as the result when input length ≠ 14.
- **Default generated CNPJ is alphanumeric**: `cnpjUtils.generate()` now returns a 14-character alphanumeric string (e.g. `AB123CDE000155`) instead of numeric-only. Use `generate({ type: 'numeric' })` for the previous numeric-only behavior.
- **Generator prefix rules**: Prefix is now 1–12 **alphanumeric** characters (sanitized/uppercased). Invalid prefix (e.g. base or branch all zeros, 12 repeated digits) throws `CnpjGeneratorOptionPrefixInvalidException`. New `type` option: `'numeric'` | `'alphabetic'` | `'alphanumeric'` (default).
- **isValid() throws on invalid input type**: Passing a non-string, non–array-of-strings (e.g. a number) to `cnpjUtils.isValid()` now throws `CnpjValidatorInputTypeError` instead of returning `false`. Validator now accepts an optional second argument `options?` (`caseSensitive`, `type`); default validation is alphanumeric and case-sensitive.
- **New exports and default shape**: The package now exports the `CnpjUtils` class and re-exports `cnpjFmt`, `cnpjGen`, `cnpjVal` and all their classes/options/errors. The default export is still a `CnpjUtils` instance, but that instance now carries those re-exports on its object (e.g. `cnpjUtils.CnpjFormatter`). Code that assumed a minimal default (only `format`, `generate`, `isValid`) or specific tree-shaking surface may need updates.

### New features

- **Alphanumeric CNPJ**: Format accepts 14-character alphanumeric input; generate can produce numeric, alphabetic, or alphanumeric; validate accepts both with optional `type` and `caseSensitive`.
- **`CnpjUtils` class**: Construct with optional `CnpjUtilsSettingsInput` (`formatter`, `generator`, `validator` as options objects or instances). Instance has `format()`, `generate()`, `isValid()` and getters/setters for `formatter`, `generator`, `validator`.
- **Direct use of underlying APIs**: Import and use `cnpjFmt`, `CnpjFormatter`, `cnpjGen`, `CnpjGenerator`, `cnpjVal`, `CnpjValidator`, options classes, and exception classes from `cnpj-utils` without depending on the three packages directly.
- **Format `encode` option**: When `true`, the formatted CNPJ is URL-encoded (e.g. for query params or paths).

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Documentation**: README updated to match current API (flat options, CnpjUtils class, re-exports, generator/validator options) and aligned structure with `cnpj-fmt`, `cnpj-gen`, and `cnpj-val`.
- **Wrapper consistency**: `cnpj-utils` behavior and options now fully reflect the v3 APIs of `@lacussoft/cnpj-fmt`, `@lacussoft/cnpj-gen`, and `@lacussoft/cnpj-val`.
