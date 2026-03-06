# @lacussoft/utils

## 1.0.0

### Major Changes

- a152328: Reusable JavaScript/TypeScript utilities for LacusSolutions' packages. This major release establishes the public API:
  - **`describeType(value)`** — Returns human-readable type strings for error messages (primitives, `NaN`, `Infinity`, arrays like `number[]` or `(number | string)[]`, empty arrays, and plain objects).
  - **`escapeHTML(value)`** — Escapes `&`, `<`, `>`, `"`, `'` with HTML entities for safe output and XSS mitigation.
  - **`generateRandomSequence(size, type)`** — Generates random sequences of given length; `type` is `'numeric'` (0–9), `'alphabetic'` (A–Z), or `'alphanumeric'` (0–9, A–Z). Exported type: `SequenceType`.

  Named exports and a default object export; ESM, CommonJS, and UMD builds; zero dependencies; full TypeScript declarations. For installation, usage, and API details, see the [package README](../../packages/utils/README.md).
