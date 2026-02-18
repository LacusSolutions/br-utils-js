---
"@lacussoft/cnpj-gen": major
---

### 🎉 v3 at a glance 🎊

- 🆕 **Alphanumeric CNPJ** — Full support for the new [14-character alphanumeric CNPJ](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2023/julho/cnpj-alfa-numerico); default output is alphanumeric (`0-9A-Z`), with optional `numeric` or `alphabetic` via the `type` option.
- 🏗️ **Class-based API** — `CnpjGenerator` lets you set default options once and reuse them; `generate()` accepts optional per-call options. The `cnpjGen()` helper remains for one-off usage.
- ✨ **`type` option** — Control character set: `numeric`, `alphabetic`, or `alphanumeric` (default). Prefix is sanitized (alphanumeric only, uppercased); only the randomly generated part follows `type`.
- 🛡️ **Structured errors** — Typed exceptions (`CnpjGeneratorOptionsTypeError`, `CnpjGeneratorOptionPrefixInvalidException`, `CnpjGeneratorOptionTypeInvalidException`) for options and prefix validation.
- 📐 **Stricter prefix validation** — Prefix rejects invalid base ID (first 8 chars all zeros), invalid branch ID (positions 9–12 all zeros), and 12 repeated digits.

### BREAKING CHANGES

- **Object-oriented API**: The package still exports the `cnpjGen()` helper, but the main programmable API is the `CnpjGenerator` class. You can create an instance with default options and call `generate()` without passing options every time. When a `CnpjGeneratorOptions` instance is passed to the constructor, it is used by reference; mutating it affects future `generate()` calls.
- **Default output is alphanumeric**: Without options, generated CNPJs are now 14-character alphanumeric (e.g. `AB123CDE000155`) instead of numeric-only. Use `type: 'numeric'` to keep numeric-only behavior.
- **New `type` option**: Options now include `type` (`'numeric'` | `'alphabetic'` | `'alphanumeric'`, default `'alphanumeric'`). Invalid values throw `CnpjGeneratorOptionTypeInvalidException`.
- **Prefix validation**: Invalid prefixes now throw `CnpjGeneratorOptionPrefixInvalidException` (e.g. base ID or branch ID all zeros, or 12 repeated digits). Option type errors throw `CnpjGeneratorOptionsTypeError`.
- **Nullish options**: Setting an option to `null` or `undefined` when using `CnpjGeneratorOptions` falls back to the existing value (constructor or default) instead of causing runtime issues.

### New features

- **Alphanumeric CNPJ**: Generated CNPJs can be numeric, alphabetic, or alphanumeric; prefix is always sanitized to alphanumeric and uppercased.
- **`CnpjGeneratorOptions` class**: Reusable options with getters/setters and `set()` for bulk updates; supports constructor merge and overrides. Static defaults: `DEFAULT_FORMAT`, `DEFAULT_PREFIX`, `DEFAULT_TYPE`. Read-only `all` getter returns a frozen snapshot.
- **Exception hierarchy**: `CnpjGeneratorTypeError` (base for option type errors), `CnpjGeneratorOptionsTypeError`, `CnpjGeneratorException` (base for rule errors), `CnpjGeneratorOptionPrefixInvalidException`, `CnpjGeneratorOptionTypeInvalidException`.

### Improvements

- **New PT-BR documentation**: New [README in Brazilian Portuguese](./README.pt.md).
- **Check digits**: Generation uses `@lacussoft/cnpj-dv` for correct check-digit calculation. Invalid sequences (e.g. after prefix) trigger retry until a valid CNPJ is produced.
- **Exports**: ESM entry exports `cnpjGen`, `CnpjGenerator`, `CnpjGeneratorOptions`, constants (`CNPJ_LENGTH`, `CNPJ_PREFIX_MAX_LENGTH`), exception classes, and types; CJS/UMD default export is `cnpjGen` with the same members on its namespace.
