---
"@lacussoft/cnpj-val": major
---

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); validates both numeric and alphanumeric formats, with optional `type` (`'numeric'` | `'alphanumeric'`, default `'alphanumeric'`).
- 🏗️ **Class-based API** — `CnpjValidator` lets you set default options once and reuse them; `isValid(cnpjInput, options?)` accepts optional per-call overrides. The `cnpjVal()` helper remains for one-off usage.
- ✨ **`type` and `caseSensitive` options** — Control validation mode: `type` restricts to digits only or allows letters; `caseSensitive` (default `true`) determines whether lowercase letters are accepted for alphanumeric CNPJ.
- 🛡️ **Structured errors** — Typed exceptions (`CnpjValidatorInputTypeError`, `CnpjValidatorOptionsTypeError`, `CnpjValidatorOptionTypeInvalidException`) for invalid input type or options; invalid CNPJ data still returns `false` without throwing.
- 📥 **Flexible input** — Accepts `string` or `string[]` (formatted or raw); non-alphanumeric characters are stripped according to `type`.

### BREAKING CHANGES

- **Invalid input type now throws**: `cnpjVal(cnpjInput)` and `CnpjValidator#isValid(cnpjInput)` now throw `CnpjValidatorInputTypeError` when `cnpjInput` is not a string or array of strings (e.g. passing a number). In v2, such calls likely returned `false` or had unspecified behavior; they now fail fast with a typed error.
- **New optional second parameter**: `cnpjVal(cnpjInput, options?)` accepts an optional second argument. Existing one-argument calls remain valid; code that relied on a second argument being ignored or on `cnpjVal` having a single parameter in its type signature may need to be updated.
- **Class-based API and new exports**: The package now exports `CnpjValidator`, `CnpjValidatorOptions`, exception classes, and types alongside the default `cnpjVal`. If you depended on the package exposing only a single default function or on a specific export surface, update your imports or bundler config.
- **Default validation is alphanumeric and case-sensitive**: Without options, validation accepts 14-character alphanumeric CNPJ and is case-sensitive (lowercase letters in an otherwise valid alphanumeric CNPJ yield `false`). Use `type: 'numeric'` for numeric-only validation and `caseSensitive: false` to accept lowercase letters. Numeric-only CNPJ strings behave the same as in v2 when passed as a string.
- **Stricter validation rules**:
  - Base ID composed only by zeros (first 8 characters "00000000") is considered invalid and will cause validation to return `false`.
  - CNPJs which first 12 characters are composed by numbers and the same number ("111111111111", "222222222222", "333333333333", etc) are invalid. Note that this rule only applies to numbers, not letters. Alphanumeric CNPJs with repeated letters are acceptable according to the official government agencies.

### New features

- **Alphanumeric CNPJ validation**: Validates the new alphanumeric format; `type: 'numeric'` restricts to digits-only (legacy behavior).
- **`CnpjValidator` class**: Reusable validator with default options; `isValid(cnpjInput, options?)` supports per-call option overrides. Constructor accepts a plain options object or a `CnpjValidatorOptions` instance (used by reference when passed).
- **`CnpjValidatorOptions` class**: Options with getters/setters (`caseSensitive`, `type`), `set()` for bulk updates, and constructor merge (`defaultOptions?, ...overrides`). Read-only `all` getter returns a frozen snapshot. Static defaults: `DEFAULT_CASE_SENSITIVE`, `DEFAULT_TYPE`.
- **Exception hierarchy**: `CnpjValidatorTypeError` (base for type errors), `CnpjValidatorInputTypeError`, `CnpjValidatorOptionsTypeError`, `CnpjValidatorException` (base for option value exceptions), `CnpjValidatorOptionTypeInvalidException`. Invalid option values (e.g. `type: 'invalid'`) throw; invalid CNPJ data (wrong length, bad check digits, ineligible base/branch) still returns `false`.
- **Array input**: `CnpjInput` is `string | string[]`; array of strings is joined and validated like a single string.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Validation uses `@lacussoft/cnpj-dv` for check-digit verification; ineligible base/branch or repeated digits result in `false` (no throw).
- **Exports**: ESM entry exports `cnpjVal`, `CnpjValidator`, `CnpjValidatorOptions`, `CNPJ_LENGTH`, exception classes, and types; CJS/UMD default export is `cnpjVal` with the same members on its namespace.
