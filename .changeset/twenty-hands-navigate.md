---
"@lacussoft/cpf-val": major
---

### 🎉 v3 at a glance 🎊

- **Class-based API** — `CpfValidator` for reusable validation; `isValid(cpfInput)` returns `true`/`false`. The `cpfVal(cpfInput)` helper remains for one-off usage.
- **Flexible input** — Accepts `string` or `readonly string[]` (formatted or raw); non-numeric characters are stripped before validation.
- **Structured errors** — Invalid input type throws `CpfValidatorInputTypeError`; invalid CPF data (wrong length, ineligible base, bad check digits) still returns `false` without throwing.
- **Explicit exports** — Package exports `cpfVal`, `CpfValidator`, `CPF_LENGTH`, exception classes, and types; uses `@lacussoft/cpf-dv` for check-digit verification.

### BREAKING CHANGES

- **Invalid input type now throws**: `cpfVal(cpfInput)` and `CpfValidator#isValid(cpfInput)` throw `CpfValidatorInputTypeError` when `cpfInput` is not a string or array of strings (e.g. `cpfVal(123)`, `cpfVal(null)`). In v2, such calls had unspecified behavior; they now fail fast with a typed error.
- **New exports**: The package now exports `CpfValidator`, `CPF_LENGTH`, `CpfValidatorTypeError`, `CpfValidatorInputTypeError`, `CpfValidatorException`, and `CpfInput`. Code that assumed only a default export or a specific bundle surface may need to be updated.

### New features

- **`CpfValidator` class**: `new CpfValidator()` with `isValid(cpfInput)`; no options (CPF is numeric-only).
- **Array input**: `CpfInput` is `string | readonly string[]`; array of strings is joined and validated like a single string.
- **Exception hierarchy**: `CpfValidatorTypeError` (base), `CpfValidatorInputTypeError` (invalid input type), `CpfValidatorException` (base for future use). Invalid CPF values still return `false`.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Validation delegates to `@lacussoft/cpf-dv`; ineligible base (e.g. repeated digits) or wrong length yields `false` (no throw).
- **Platform support**: README documents Node, Bun, Deno, and browsers with a unified Platform Support table.
