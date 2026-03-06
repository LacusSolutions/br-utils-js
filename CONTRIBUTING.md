# Contributing to `br-utils`

Thank you for your interest in contributing to this initiative! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
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
6. **Test your changes** thoroughly
7. **Submit a pull request**

## Development Setup

### Prerequisites

- **Node.js** (v20.17 or higher)
- **Bun** (v1.0 or higher) - for testing, building, and package management
- **Git** - for version control

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/br-utils-js.git
cd br-utils-js

# Install dependencies
bun install

# Verify setup
bun run test
bun run build
bun run type-check
```

### Available Scripts

```bash
# Development
bun run build        # Build all packages
bun run type-check   # Run TypeScript type checking for all packages
bun run lint         # Run ESLint with auto-fix for all packages
bun run test         # Run all tests
bun run test:ci      # Run tests in CI mode

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
bun run version     # Bump versions from changesets
bun run release     # Publish packages to npm
```

**Note:** `bun run type-check` runs a full build first, then type-checks all packages (same as CI).

## Project Structure

```text
br-utils-js/
├── packages/                    # Monorepo packages (npm workspaces)
│   ├── utils/                  # @lacussoft/utils — shared helpers
│   │   ├── src/
│   │   ├── tests/              # Test files (.spec.ts)
│   │   ├── dist/               # Built output (generated)
│   │   ├── package.json
│   │   ├── rollup.config.mjs
│   │   └── tsconfig.json
│   ├── br-utils/               # br-utils — unified CPF + CNPJ API
│   │   ├── src/
│   │   ├── tests/
│   │   ├── dist/
│   │   ├── demo/               # Optional demo (e.g. br-utils has UMD)
│   │   ├── package.json
│   │   ├── rollup.config.mjs
│   │   └── tsconfig.json
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
├── build/                      # Shared build tooling (e.g. rollup helpers)
├── .github/workflows/          # CI (type-check, lint, test, publish-mock)
├── node_modules/
├── bun.lock
├── bunfig.toml
├── commitlint.config.mjs       # Commit scopes from workspace package names
├── eslint.config.mjs
├── package.json                # Root scripts and devDependencies
└── README.md
```

Each package has its own `rollup.config.mjs`; there is no root Rollup config. Tests live in `tests/` and use the `.spec.ts` extension.

### Package API overview

- **`@lacussoft/utils`**: Shared helpers (e.g. type guards, string utilities). Used by other packages.
- **`@lacussoft/*-dv`**, **`@lacussoft/*-fmt`**, **`@lacussoft/*-gen`**, **`@lacussoft/*-val`**: Single-responsibility packages (digit calculation, format, generate, validate). Each exposes a class and usually a helper (e.g. `cpfFmt`, `CpfFormatter`).
- **`cpf-utils`** / **`cnpj-utils`**: Wrap the four CPF/CNPJ packages; expose `CpfUtils`/`CnpjUtils` with `format`, `generate`, `isValid` and re-export all underlying exports.
- **`br-utils`**: Single entry point; exposes `BrUtils` with `cpf` and `cnpj` sub-modules (each a `CpfUtils`/`CnpjUtils`-like API) and re-exports from both stacks.

## Contributing Guidelines

### What We're Looking For

We welcome contributions in the following areas:

- **🐛 Bug Fixes**: Fix issues in formatting, validation, generation, or digit calculation
- **✨ New Features**: New options or behavior aligned with CPF/CNPJ rules (e.g. formatting, validation)
- **📚 Documentation**: Improve READMEs, JSDoc, and examples (including demo pages)
- **🧪 Tests**: Add or extend tests for the public API and edge cases
- **⚡ Performance**: Optimize hot paths in formatters or validators
- **🔧 Tooling**: Improve build, lint, or CI (Rollup, ESLint, Changesets)

### What We're NOT Looking For

- Breaking changes to the public API without discussion
- Changes that reduce test coverage
- Code that doesn't follow our style guidelines
- Features that don't align with the project's goals

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
bun run test:ci

# Run tests with coverage
bun run test

# Type check all packages
bun run type-check

# Lint all packages
bun run lint

# Build all packages
bun run build

# Test specific package categories
bun run test:cnpj       # Test CNPJ packages
bun run test:cpf        # Test CPF packages
bun run test:br-utils   # Test br-utils
bun run test:utils      # Test @lacussoft/utils
```

### 4. Commit Your Changes

Use conventional commits. Scopes are derived from workspace package names (e.g. `cpf-fmt`, `br-utils`). Prefer the interactive commit helper:

```bash
bun run commit
```

Or commit manually with type and optional scope:

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

### Test Structure

- Tests are located in the `tests/` directory within each package
- Test files use the `.spec.ts` extension (e.g. `cpf-fmt.spec.ts`, `exceptions.spec.ts`)
- Tests mirror the `src/` structure where appropriate
- Use Bun's built-in test runner (`bun test`) with TypeScript support

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

Packages expose a **class-based API** (e.g. `CpfFormatter`, `CpfValidator`) and optional **helper functions** (e.g. `cpfFmt`, `cpfVal`). The unified packages `cpf-utils` and `cnpj-utils` expose `CpfUtils` / `CnpjUtils` with `format`, `generate`, and `isValid`; `br-utils` exposes `BrUtils` with `cpf` and `cnpj` sub-modules. Prefer testing the public API (helpers and class methods) used by consumers.

### Test Requirements

- **Coverage**: Maintain 100% line coverage
- **Edge Cases**: Test boundary conditions and error cases
- **Performance**: Consider performance implications
- **Documentation**: Tests should be self-documenting

## Code Style

### TypeScript Guidelines

- Use **strict TypeScript** settings
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for public methods
- Avoid **`any`** types; use `unknown` or specific types
- Use **generic types** for reusability
- Use **const assertions** where appropriate
- Prefer **type imports** for type-only imports

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons** consistently
- Use **single quotes** for strings
- Use **trailing commas** in objects and arrays
- Use **arrow functions** for short functions
- Use **prettier** for consistent formatting

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

### Example Code Style

```typescript
import type { CpfFormatterOptionsInput, CpfInput } from './types';

export class CpfFormatter {
  private readonly _options: CpfFormatterOptionsInput;

  public constructor(options: CpfFormatterOptionsInput = {}) {
    this._options = { ...options };
  }

  public format(cpfInput: CpfInput): string {
    return this._applyMask(String(cpfInput));
  }

  private _applyMask(digits: string): string {
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}

export function cpfFmt(cpfInput: CpfInput, options?: CpfFormatterOptionsInput): string {
  return new CpfFormatter(options).format(cpfInput);
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] All tests pass (`bun run test`)
- [ ] TypeScript compiles without errors (`bun run type-check`)
- [ ] ESLint passes (`bun run lint`)
- [ ] Build succeeds (`bun run build`)
- [ ] Documentation is updated
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
- [ ] Tests pass
- [ ] New tests added
- [ ] Coverage maintained

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI will run tests, linting, and type checking
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Minimal steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node.js version, OS, etc.
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
- **Documentation**: Check the README and inline code comments

## Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor statistics

## License

By contributing to `br-utils`, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to `br-utils`! 🎉
