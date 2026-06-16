# Contributing to `br-utils`

Thank you for your interest in contributing to this initiative! This document provides guidelines and information for contributors.

For task-specific, in-depth conventions (tests, changesets, public API changes, READMEs, build config, and more), see [`.context/`](.context/README.md) and [`AGENTS.md`](AGENTS.md). Those files are the source of truth for detailed workflows; this guide summarizes what every contributor should know.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Public API Changes](#public-api-changes)
- [Changesets and Changelogs](#changesets-and-changelogs)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

Before contributing, please:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see [Development Setup](#development-setup))
4. **Create a feature branch** for your changes
5. **Make your changes** following our guidelines
6. **Test your changes** thoroughly (see [Development Workflow](#development-workflow))
7. **Submit a pull request**

## Development Setup

### Prerequisites

- **Node.js** (v20.17 or higher)
- **Bun** (v1.0 or higher) — for testing, building, and package management
- **Git** — for version control

The project is managed by **Bun**. Prefer Bun over Node for scripts and over package managers like `npm`, `pnpm`, and `yarn`.

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/br-utils-js.git
cd br-utils-js

# Install dependencies
bun install

# Verify setup (mirrors CI)
bun run build && bun run type-check && bun run lint:ci && bun run test:ci
```

### Available Scripts

```bash
# Development
bun run build        # Build all packages
bun run type-check   # Run TypeScript type checking for all packages
bun run lint         # Run ESLint with auto-fix for all packages
bun run lint:ci      # Run ESLint without auto-fix (same as CI)
bun run test         # Run all tests with coverage
bun run test:ci      # Run tests in CI mode (no coverage)

# Package-specific commands
bun run build:cnpj       # Build all CNPJ packages
bun run build:cpf        # Build all CPF packages
bun run build:br-utils   # Build br-utils package
bun run build:utils      # Build @lacussoft/utils
bun run test:cnpj        # Test all CNPJ packages
bun run test:cpf         # Test all CPF packages
bun run test:br-utils    # Test br-utils package
bun run test:utils       # Test @lacussoft/utils

# Type checking by category
bun run type-check:fmt     # Type check formatter packages
bun run type-check:gen     # Type check generator packages
bun run type-check:val     # Type check validator packages
bun run type-check:utils   # Type check utility packages

# Linting by category
bun run lint:fmt     # Lint formatter packages
bun run lint:gen     # Lint generator packages
bun run lint:val     # Lint validator packages
bun run lint:utils   # Lint utility packages

# Release management (Changesets)
bun run commit      # Interactive commit with scope prompts
bun run changelog   # Create a changeset (describe release)
bun run version     # Bump versions from changesets (maintainers)
bun run release     # Publish packages to npm (maintainers)
```

**Notes:**

- `bun run type-check` runs a full build first, then type-checks all packages (same as CI).
- CI runs `lint:ci` (no auto-fix) and `test:ci`. Use those commands before opening a PR.
- For a single package: `bun run build:<pkg> && bun run type-check:<pkg> && bun run lint:<pkg> && bun run test:<pkg>`.

### Pre-commit hooks

**Husky** and **lint-staged** run on commit. Staged `*.{js,cjs,mjs,ts,mts}` files are linted with `eslint --fix`. Commit messages are validated by **commitlint** (conventional commits with workspace scopes).

## Project Structure

```text
br-utils-js/
├── .context/                   # Task-specific contributor/agent harnesses
├── .changeset/                 # Changeset entries for releases
├── .github/workflows/          # CI (type-check, lint, test, publish-mock)
├── .husky/                     # Git hooks (pre-commit, commit-msg)
├── build/                      # Shared build tooling (tsconfig, rollup helpers)
│   ├── rollup/
│   └── tsconfig.json
├── packages/                   # Monorepo packages (npm workspaces)
│   ├── utils/                  # @lacussoft/utils — shared helpers
│   ├── br-utils/               # br-utils — unified CPF + CNPJ API
│   ├── cnpj-dv/                # @lacussoft/cnpj-dv
│   ├── cnpj-fmt/               # @lacussoft/cnpj-fmt
│   ├── cnpj-gen/               # @lacussoft/cnpj-gen
│   ├── cnpj-val/               # @lacussoft/cnpj-val
│   ├── cnpj-utils/             # cnpj-utils (unscoped)
│   ├── cpf-dv/                 # @lacussoft/cpf-dv
│   ├── cpf-fmt/                # @lacussoft/cpf-fmt
│   ├── cpf-gen/                # @lacussoft/cpf-gen
│   ├── cpf-val/                # @lacussoft/cpf-val
│   └── cpf-utils/              # cpf-utils (unscoped)
├── AGENTS.md                   # Agent and contributor baseline rules
├── bun.lock
├── bunfig.toml
├── commitlint.config.mjs       # Commit scopes from workspace package names
├── eslint.config.mjs           # Root ESLint flat config (eslint-config-any)
├── package.json                # Root scripts and devDependencies
└── README.md
```

Each package follows a consistent layout:

- **Source** lives under `src/`; **built artifacts** go to `dist/`.
- Each package has its own `rollup.config.mjs` (using shared `makeRollupConfig` from `build/rollup/`).
- Tests live in `tests/` and use the `.spec.ts` extension.
- Do **not** add package-level ESLint, Prettier, or other dev-tool config files — use root configs.

A package may define its own `packages/<pkg>/AGENTS.md` or `packages/<pkg>/agents/` for package-specific rules that override root guidance.

### Package dependency direction

Packages must follow this dependency flow (reverse edges are forbidden):

```text
utils  →  {cpf,cnpj}-dv
     →  {cpf,cnpj}-{fmt,gen,val}
     →  {cpf,cnpj}-utils
     →  br-utils
```

Internal workspace dependencies use `workspace:*` in the consumer's `package.json`. Ask maintainers before adding any **new** npm dependency.

### Package API overview

- **`@lacussoft/utils`**: Shared helpers (e.g. type guards, string utilities). Used by other packages.
- **`@lacussoft/*-dv`**, **`@lacussoft/*-fmt`**, **`@lacussoft/*-gen`**, **`@lacussoft/*-val`**: Single-responsibility packages (digit calculation, format, generate, validate). Each exposes a class and usually a helper (e.g. `cpfFmt`, `CpfFormatter`).
- **`cpf-utils`** / **`cnpj-utils`**: Wrap the four CPF/CNPJ packages; expose `CpfUtils`/`CnpjUtils` with `format`, `generate`, `isValid` and re-export all underlying exports. Include static demo pages under `demo/`.
- **`br-utils`**: Single entry point; exposes `BrUtils` with `cpf` and `cnpj` sub-modules (each a `CpfUtils`/`CnpjUtils`-like API) and re-exports from both stacks.

### CPF ↔ CNPJ parity

When changing a `cpf-*` package, check whether the symmetric `cnpj-*` counterpart needs the same change (and vice versa). Some divergences are intentional — for example, CNPJ supports alphanumeric input while CPF is digits-only. See [`.context/domain-parity.md`](.context/domain-parity.md) for the full pairing table and documented divergences.

## Contributing Guidelines

### What We're Looking For

We welcome contributions in the following areas:

- **Bug fixes**: Fix issues in formatting, validation, generation, or digit calculation
- **New features**: New options or behavior aligned with CPF/CNPJ rules
- **Documentation**: Improve READMEs, JSDoc, and examples (including demo pages)
- **Tests**: Add or extend tests for the public API and edge cases
- **Performance**: Optimize hot paths in formatters or validators
- **Tooling**: Improve build, lint, or CI (Rollup, ESLint, Changesets)

### What We're NOT Looking For

- Breaking changes to the public API without discussion
- Changes that reduce test coverage
- Code that doesn't follow our style guidelines
- Features that don't align with the project's goals
- Package-level dev-tool config files (ESLint, Prettier, etc.)

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable code following existing package patterns
- Add tests for new functionality
- Update JSDoc on changed symbols
- Update documentation (README, demo pages) when behavior or options change
- For detailed implementation guidance, see [`.context/package-arch.md`](.context/package-arch.md)

### 3. Test Your Changes

```bash
# Full CI-equivalent validation (recommended before PR)
bun run build && bun run type-check && bun run lint:ci && bun run test:ci

# Or run individually
bun run test:ci      # All packages, CI mode
bun run test         # All packages with coverage
bun run type-check
bun run lint         # Auto-fix locally
bun run build

# Single package
bun run build:cpf-fmt && bun run type-check:cpf-fmt && bun run lint:cpf-fmt && bun run test:cpf-fmt
```

### 4. Commit Your Changes

Use conventional commits. Scopes are derived from workspace package names (e.g. `cpf-fmt`, `br-utils`) and enforced by `@commitlint/config-workspace-scopes`. If a commit touches only one package directory, use that package name as the scope.

Prefer the interactive commit helper:

```bash
bun run commit
```

Or commit manually:

```bash
git commit -m "feat(cpf-fmt): add dashKey option"
git commit -m "fix(cpf-val): resolve input type edge case"
git commit -m "docs(br-utils): update README examples"
git commit -m "test(cpf-gen): add tests for prefix option"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Testing

See [`.context/unit-tests.md`](.context/unit-tests.md) for the full testing harness (file roles, Better Specs style, error patterns, and checklists).

### Test Structure

- Tests are located in the `tests/` directory within each package (never under `src/`)
- Test files use the `.spec.ts` extension (e.g. `cpf-fmt.spec.ts`, `exceptions.spec.ts`)
- Tests mirror the `src/` structure where appropriate
- Use Bun's built-in test runner (`bun:test`) — do not add Jest, Vitest, or other frameworks
- Unit tests import from `../src/<file>`; distribution tests in `output.spec.ts` assert built `dist/` artifacts

### Test file roles

| File pattern | Purpose |
|--------------|---------|
| `<module>.spec.ts` | Primary class or function — constructor, methods, edge cases |
| `<pkg-short-name>.spec.ts` | Convenience helper (e.g. `cpfFmt`) — often uses `spyOn` for delegation |
| `<resource>-options.spec.ts` | Options class — defaults, validation, invalid inputs |
| `exceptions.spec.ts` | Error classes — inheritance, properties, messages |
| `output.spec.ts` | Built artifacts — UMD globals, CJS/ESM exports, declaration files |

Update `output.spec.ts` whenever the **public export surface** changes.

### Writing Tests

```typescript
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { cpfFmt } from '../src/cpf-fmt';
import { CpfFormatter } from '../src/cpf-formatter';

describe('cpfFmt', () => {
  it('formats CPF with default mask', () => {
    expect(cpfFmt('12345678910')).toBe('123.456.789-10');
  });

  it('throws on invalid input when configured', () => {
    expect(() => cpfFmt('invalid')).toThrow();
  });
});
```

Packages expose a **class-based API** (e.g. `CpfFormatter`, `CpfValidator`) and optional **helper functions** (e.g. `cpfFmt`, `cpfVal`). Prefer testing the public API used by consumers.

### Test Requirements

- **Coverage**: Maintain high line coverage; run `bun run test` locally to generate LCOV reports under `tests/__coverage__/`
- **Edge cases**: Test boundary conditions and error cases
- **Changesets**: Test-only changes do not require a changeset

## Code Style

### TypeScript Guidelines

- Use **strict TypeScript** settings (shared config in `build/tsconfig.json`)
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for public methods
- Avoid **`any`** types; use `unknown` or specific types
- Use **generic types** for reusability
- Use **const assertions** where appropriate
- Prefer **type imports** for type-only imports

### Linting and Formatting

Linting and formatting are handled by **ESLint** (flat config with `eslint-config-any`) at the repository root. Packages run `eslint src/ tests/ rollup.config.mjs`. Do not add package-level ESLint or Prettier config files.

```bash
bun run lint       # Auto-fix locally
bun run lint:ci    # Check only (CI)
```

### Naming Conventions

- **Classes**: PascalCase (`CpfFormatter`, `CpfUtils`)
- **Functions**: camelCase; helpers often end with Fmt/Gen/Val/Dv (`cpfFmt`, `cpfVal`)
- **Variables**: camelCase (`input`, `options`)
- **Constants**: UPPER_SNAKE_CASE when applicable
- **Files**: kebab-case (`cpf-formatter.ts`, `cpf-fmt.ts`)
- **Types/Interfaces**: PascalCase (`CpfFormatterOptionsInput`, `CpfInput`)

### Package Naming

- **Scoped** (single-purpose): `@lacussoft/utils`, `@lacussoft/cpf-fmt`, `@lacussoft/cpf-dv`, `@lacussoft/cpf-gen`, `@lacussoft/cpf-val`, and the same for `cnpj-*`.
- **Unscoped** (unified APIs): `cpf-utils`, `cnpj-utils`, `br-utils`.
- Commit/PR scopes use the package directory name (e.g. `cpf-fmt`, `br-utils`).

### JSDoc

All public symbols need JSDoc — classes, methods, options, errors, and constants. See [`.context/jsdoc.md`](.context/jsdoc.md) for conventions (`@throws`, `@typedef` imports, tone).

## Public API Changes

When a change affects anything npm consumers would observe (exports, signatures, options, defaults, thrown errors, or `package.json` exports map), work through the coordinated checklist in [`.context/public-api.md`](.context/public-api.md):

1. Source changes (`src/`) — [package-arch](.context/package-arch.md)
2. JSDoc on changed symbols — [jsdoc](.context/jsdoc.md)
3. Behavior unit tests — [unit-tests](.context/unit-tests.md)
4. Distribution tests (`output.spec.ts`) — [unit-tests](.context/unit-tests.md)
5. README update — [readme-docs](.context/readme-docs.md)
6. Changeset entry — [changelogs](.context/changelogs.md)
7. Workspace dependency update (if needed) — [dependencies](.context/dependencies.md)
8. Domain parity check (if `cpf-*` / `cnpj-*`) — [domain-parity](.context/domain-parity.md)

Discuss breaking changes with maintainers before implementing.

## Changesets and Changelogs

User-facing changes require a **changeset** — a short markdown file in `.changeset/` that describes the change and SemVer bump level.

```bash
bun run changelog
```

**Important:**

- Do **not** edit `packages/*/CHANGELOG.md` manually — Changesets updates them during release.
- Do **not** edit `package.json` `"version"` fields.
- Test-only, CI, and dev-tooling changes do **not** need a changeset.

See [`.context/changelogs.md`](.context/changelogs.md) for bump levels (patch/minor/major), user-facing vs dev-only classification, and format rules.

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] All tests pass (`bun run test:ci`)
- [ ] TypeScript compiles without errors (`bun run type-check`)
- [ ] ESLint passes (`bun run lint:ci`)
- [ ] Build succeeds (`bun run build`)
- [ ] JSDoc updated on changed public symbols
- [ ] Documentation updated (README, demo pages if applicable)
- [ ] `output.spec.ts` updated if export surface changed
- [ ] CPF/CNPJ parity checked when touching domain packages
- [ ] Commit messages follow conventional format
- [ ] Changeset added for user-facing changes (`bun run changelog`)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] `bun run build && bun run type-check && bun run lint:ci && bun run test:ci` passes
- [ ] New tests added
- [ ] Coverage maintained

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks**: CI runs build, type-check, `lint:ci`, and `test:ci` on every push
2. **Code review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Minimal steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node.js version, Bun version, OS, package version
- **Code Example**: Minimal code that demonstrates the issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Install the package and call the API with...
2. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- Node.js version: [e.g. 20.x]
- Bun version: [e.g. 1.0.x]
- OS: [e.g. macOS 13.0]
- Package version: [e.g. @lacussoft/cpf-fmt@2.0.2 or cpf-utils@2.0.2]

**Code example**
```typescript
import { cpfFmt } from '@lacussoft/cpf-fmt';

const result = cpfFmt('12345678910');

console.log(result); // expected vs actual
```

**Additional context**
Any other context about the problem.
```

## Feature Requests

### Suggesting Features

When suggesting features, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other ways to solve the problem
- **Additional Context**: Any other relevant information

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check package READMEs, [`.context/`](.context/README.md), and inline JSDoc

## Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes (via Changesets)
- **GitHub**: Contributor statistics

## License

By contributing to `br-utils`, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `br-utils`!
