---
"@lacussoft/cpf-gen": major
---

### 🎉 v3 at a glance 🎊

- 🏗️ **Class-based API** — `CpfGenerator` lets you set default options once and reuse them; `generate()` accepts optional per-call options. The `cpfGen()` helper remains for one-off usage.
- ✨ **Reusable options** — `CpfGeneratorOptions` with getters/setters, `set()` for bulk updates, and constructor merge; read-only `all` getter for a frozen snapshot.
- 🛡️ **Structured errors** — Typed exceptions (`CpfGeneratorOptionsTypeError`, `CpfGeneratorOptionPrefixInvalidException`) for invalid option types and prefix validation.
- 📐 **Stricter prefix validation** — Prefix rejects zeroed base (first 9 digits all zeros) and 9 repeated digits (e.g. `999999999`).

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cpfGen()` helper, but the main programmable API is the `CpfGenerator` class. You can create an instance with default options and call `generate()` without passing options every time. When a `CpfGeneratorOptions` instance is passed to the constructor, it is used by reference; mutating it affects future `generate()` calls.
- **Prefix validation**: Invalid prefixes now throw `CpfGeneratorOptionPrefixInvalidException` (e.g. base all zeros, or 9 repeated digits). Option type errors (e.g. non-string `prefix`) throw `CpfGeneratorOptionsTypeError`. Code that relied on the previous behavior or on generic errors may need to catch these exceptions.
- **Nullish options**: Setting an option to `null` or `undefined` when using `CpfGeneratorOptions` falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **`CpfGenerator` class**: Constructor accepts optional default options (plain object or `CpfGeneratorOptions`). `generate(options?)` returns a valid CPF; per-call options override instance defaults for that call only. `options` getter returns the default options instance (mutations affect future `generate()` calls).
- **`CpfGeneratorOptions` class**: Reusable options with getters/setters for `format` and `prefix`, and `set()` for bulk updates; supports constructor merge and overrides. Static defaults: `DEFAULT_FORMAT`, `DEFAULT_PREFIX`. Read-only `all` getter returns a frozen snapshot.
- **Exception hierarchy**: `CpfGeneratorTypeError` (base for option type errors), `CpfGeneratorOptionsTypeError`, `CpfGeneratorException` (base for rule errors), `CpfGeneratorOptionPrefixInvalidException`.
- **New exports**: Constants `CPF_LENGTH` (11) and `CPF_PREFIX_MAX_LENGTH` (9); types `CpfGeneratorOptionsInput`, `CpfGeneratorOptionsType`, `Nullable<T>`.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Generation uses `@lacussoft/cpf-dv` for check-digit calculation. Invalid sequences (e.g. after prefix) trigger retry until a valid CPF is produced.
- **Exports**: ESM entry exports `cpfGen`, `CpfGenerator`, `CpfGeneratorOptions`, constants (`CPF_LENGTH`, `CPF_PREFIX_MAX_LENGTH`), exception classes, and types; CJS/UMD default export is `cpfGen` with the same members on its namespace.
