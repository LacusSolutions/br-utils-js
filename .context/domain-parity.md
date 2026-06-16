---
id: domain-parity
title: CPF ↔ CNPJ domain parity
scope: packages/cpf-*/src/, packages/cnpj-*/src/
triggers:
  - porting a CPF feature to CNPJ (or vice versa)
  - reviewing a PR that touches cpf-* and cnpj-* symmetrically
  - checking whether a CNPJ counterpart exists for a CPF change
  - deciding whether a divergence is intentional
---

# domain-parity

Use this harness when a change touches CPF packages and you need to determine whether the symmetric CNPJ package requires the same change, or when reviewing whether two domains stay in sync. All paths are relative to the **js/** project root.

## Repository constraints

- **Always check the counterpart.** When you change a `cpf-*` package, verify that the `cnpj-*` counterpart exists and whether parity applies or divergence is intentional.
- Do **not** silently skip the counterpart — either apply the symmetric change or document why it doesn't apply.
- Intentional divergences are cataloged below; they are not bugs.

## Package pairing

| CPF package | CNPJ counterpart |
|-------------|------------------|
| `cpf-dv` | `cnpj-dv` |
| `cpf-fmt` | `cnpj-fmt` |
| `cpf-gen` | `cnpj-gen` |
| `cpf-val` | `cnpj-val` |
| `cpf-utils` | `cnpj-utils` |

`utils` and `br-utils` are shared/aggregate — no counterpart check needed.

## Intentional divergences (not bugs)

| Area | CPF | CNPJ |
|------|-----|------|
| **Input character set** | Digits only (0–9) | Alphanumeric (digits + uppercase A–Z) |
| **Identifier length** | 11 characters | 14 characters |
| **Validator options** | None beyond `onFail` | `type` (`'numeric'` \| `'alphanumeric'`) and `caseSensitive` |
| **Generator options** | `prefix` (numeric digits) | `prefix` + `type` (`'numeric'` \| `'alphabetic'` \| `'alphanumeric'`) |
| **DV algorithm** | Numeric modulo-11 on each digit | Weighted sum using char-code values |
| **Formatter mask pattern** | `###.###.###-##` | `##.###.###/####-##` |

These divergences are documented in the respective `options.ts` and `check-digits.ts` files. Do not "fix" them toward CPF behavior without explicit product intent.

## Parity workflow

When changing a `cpf-*` package:

1. Identify the CNPJ counterpart from the table above.
2. Check if the same issue or feature applies to the CNPJ package (same archetype, same `src/` structure per [`.context/package-arch.md`](package-arch.md)).
3. If parity applies → open or note a corresponding change for `cnpj-*`.
4. If divergence is intentional (table above) → no action needed; note it in your changeset body if user-visible.
5. If unsure → ask the developer.

## Symmetry checklist

When a feature or fix is applied to one domain, verify the following in the counterpart:

- [ ] Same change in the main class (`{domain}-{op}.ts`) if logic is symmetric
- [ ] Same change in the options class (`{domain}-{op}-options.ts`) if a new option is added
- [ ] Same new exception class in `exceptions.ts` if a new error case is introduced
- [ ] Same `@throws` annotation in JSDoc per [`.context/jsdoc.md`](jsdoc.md)
- [ ] Same test cases in `tests/` per [`.context/unit-tests.md`](unit-tests.md)
- [ ] Both packages included in the changeset if user-facing per [`.context/changelogs.md`](changelogs.md)
- [ ] Both READMEs updated per [`.context/readme-docs.md`](readme-docs.md) if options or defaults change

## Key files for comparison

| Concern | CPF | CNPJ |
|---------|-----|------|
| DV algorithm | `packages/cpf-dv/src/cpf-check-digits.ts` | `packages/cnpj-dv/src/cnpj-check-digits.ts` |
| Validator options | `packages/cpf-val/src/cpf-validator.ts` | `packages/cnpj-val/src/cnpj-validator-options.ts` |
| Generator options | `packages/cpf-gen/src/cpf-generator-options.ts` | `packages/cnpj-gen/src/cnpj-generator-options.ts` |
| Aggregator class | `packages/cpf-utils/src/cpf-utils.ts` | `packages/cnpj-utils/src/cnpj-utils.ts` |

## Package-level overrides

Before applying this harness, check whether the target package defines `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/`. If either exists and contradicts this file on the same topic, **follow the package-level instruction** (see [`.context/README.md`](README.md#instruction-precedence)).
