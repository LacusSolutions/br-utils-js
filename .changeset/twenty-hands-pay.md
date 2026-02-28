---
"cpf-utils": major
---

### 🎉 v3 at a glance 🎊

- 🏗️ **Class-based customization** — `CpfUtils` class with optional default formatter, generator, and validator (options or instances); default export remains a pre-built instance for one-off use.
- ✨ **Flat format options** — Format options no longer use nested objects: `delimiters.dot` → `dotKey`, `delimiters.dash` → `dashKey`, `hiddenRange.start`/`end` → `hiddenStart`/`hiddenEnd`. New `encode` option for URL-encoding.
- 📦 **Full re-exports** — All formatter, generator, and validator classes, options, errors, and types from `@lacussoft/cpf-fmt`, `@lacussoft/cpf-gen`, and `@lacussoft/cpf-val` are re-exported; you can use `CpfFormatter`, `CpfGenerator`, `CpfValidator` and the helpers `cpfFmt`, `cpfGen`, `cpfVal` directly from `cpf-utils`.
- 🛡️ **Structured errors** — Format, generate, and isValid can throw the same typed exceptions as the underlying packages (input type, options type, invalid prefix, etc.).

### BREAKING CHANGES

- **Named exports `format`, `generate`, `isValid` removed**: The package no longer exports standalone `format`, `generate`, and `isValid` functions. Use the default instance (`cpfUtils.format()`, `cpfUtils.generate()`, `cpfUtils.isValid()`) or import the helpers `cpfFmt`, `cpfGen`, `cpfVal` for one-off calls. Code that did `import { format, generate, isValid } from 'cpf-utils'` must switch to `import cpfUtils from 'cpf-utils'` and call `cpfUtils.format()` etc., or use `import { cpfFmt, cpfGen, cpfVal } from 'cpf-utils'`.
- **Format options are now flat** (aligned with `@lacussoft/cpf-fmt` v3). Nested option shapes are no longer supported:
  - `delimiters.dot` is now **`dotKey`**
  - `delimiters.dash` is now **`dashKey`**
  - `hiddenRange.start` is now **`hiddenStart`**
  - `hiddenRange.end` is now **`hiddenEnd`**
  - `onFail` callback signature may differ (e.g. receives `(value, exception)`); return value is still used as the result when input length ≠ 11.
- **isValid() throws on invalid input type**: Passing a non-string, non–array-of-strings (e.g. a number) to `cpfUtils.isValid()` now throws `CpfValidatorInputTypeError` instead of returning `false` or unspecified behavior. Valid CPF data (wrong length, ineligible base, bad check digits) still returns `false` without throwing.
- **Generator prefix validation**: Invalid prefixes (e.g. base all zeros, 9 repeated digits) now throw `CpfGeneratorOptionPrefixInvalidException`. Option type errors (e.g. non-string `prefix`) throw `CpfGeneratorOptionsTypeError`.
- **New exports and default shape**: The package now exports the `CpfUtils` class and re-exports `cpfFmt`, `cpfGen`, `cpfVal` and all their classes, options, errors, and types. Code that assumed only a minimal default (only `format`, `generate`, `isValid` methods) or a specific tree-shaking surface may need updates.

### New features

- **`CpfUtils` class**: Construct with optional `CpfUtilsSettingsInput` (`formatter`, `generator`, `validator` as options objects or instances of `CpfFormatter` / `CpfGenerator` / `CpfValidator`). Instance has `format()`, `generate()`, `isValid()` and getters/setters for `formatter`, `generator`, `validator`.
- **Direct use of underlying APIs**: Import and use `cpfFmt`, `CpfFormatter`, `cpfGen`, `CpfGenerator`, `cpfVal`, `CpfValidator`, options classes, and exception classes from `cpf-utils` without depending on the three packages directly.
- **Format `encode` option**: When `true`, the formatted CPF is URL-encoded (e.g. for query params or paths).

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md) for the `cpf-utils` package.
- **Documentation**: README updated to match current API (flat options, CpfUtils class, re-exports, default instance) and aligned structure with `cnpj-utils`, `cpf-fmt`, `cpf-gen`, and `cpf-val`.
- **Wrapper consistency**: `cpf-utils` behavior and options now fully reflect the v3 APIs of `@lacussoft/cpf-fmt`, `@lacussoft/cpf-gen`, and `@lacussoft/cpf-val`.
