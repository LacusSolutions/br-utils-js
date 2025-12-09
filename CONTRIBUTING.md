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

- **Node.js** (v18 or higher)
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
bun run build          # Build all packages
bun run type-check     # Run TypeScript type checking for all packages
bun run lint           # Run ESLint with auto-fix for all packages
bun run test           # Run all tests
bun run test:ci        # Run tests in CI mode

# Package-specific commands
bun run build:cnpj     # Build all CNPJ packages
bun run build:cpf      # Build all CPF packages
bun run build:br       # Build BR utilities package
bun run test:cnpj      # Test all CNPJ packages
bun run test:cpf       # Test all CPF packages
bun run test:br        # Test BR utilities package

# Type checking by category
bun run type-check:fmt # Type check formatter packages
bun run type-check:gen # Type check generator packages
bun run type-check:val # Type check validator packages
bun run type-check:utils # Type check utility packages

# Linting by category
bun run lint:fmt       # Lint formatter packages
bun run lint:gen       # Lint generator packages
bun run lint:val       # Lint validator packages
bun run lint:utils     # Lint utility packages

# Release management
bun run changelog      # Generate changelog
bun run version        # Version packages
bun run release        # Publish packages
```

## Project Structure

```
br-utils-js/
├── packages/                    # Monorepo packages
│   ├── br-utils/               # Core BR utilities
│   │   ├── src/               # Source code
│   │   ├── test/              # Test files
│   │   ├── build/             # Built files (generated)
│   │   ├── dist/              # Distribution files (generated)
│   │   ├── package.json       # Package configuration
│   │   ├── rollup.config.mjs  # Rollup configuration
│   │   └── tsconfig.json      # TypeScript configuration
│   ├── cnpj-cd/               # CNPJ check digits package
│   │   ├── src/               # Source code
│   │   ├── test/              # Test files
│   │   ├── build/             # Built files (generated)
│   │   ├── dist/              # Distribution files (generated)
│   │   ├── package.json       # Package configuration
│   │   ├── rollup.config.mjs  # Rollup configuration
│   │   └── tsconfig.json      # TypeScript configuration
│   ├── cnpj-fmt/              # CNPJ formatter package
│   │   └── ...                # Similar structure
│   ├── cnpj-gen/              # CNPJ generator package
│   │   └── ...                # Similar structure
│   ├── cnpj-utils/            # CNPJ utilities package
│   │   └── ...                # Similar structure
│   ├── cnpj-val/              # CNPJ validator package
│   │   └── ...                # Similar structure
│   ├── cpf-cd/                # CPF check digits package
│   │   └── ...                # Similar structure
│   ├── cpf-fmt/               # CPF formatter package
│   │   └── ...                # Similar structure
│   ├── cpf-gen/               # CPF generator package
│   │   └── ...                # Similar structure
│   ├── cpf-utils/             # CPF utilities package
│   │   └── ...                # Similar structure
│   └── cpf-val/               # CPF validator package
│       └── ...                # Similar structure
├── node_modules/              # Dependencies (generated)
├── bun.lock                   # Bun lock file
├── bunfig.toml               # Bun configuration
├── eslint.config.mjs         # ESLint configuration
├── rollup.config.mjs         # Root rollup configuration
├── tsconfig.json             # Root TypeScript configuration
├── package.json              # Root package configuration
└── README.md                 # Project documentation
```

## Contributing Guidelines

### What We're Looking For

We welcome contributions in the following areas:

- **🐛 Bug Fixes**: Fix issues and improve stability
- **✨ New Features**: Add new field types, processors, or functionality
- **📚 Documentation**: Improve docs, examples, and guides
- **🧪 Tests**: Add test coverage for new or existing features
- **⚡ Performance**: Optimize validation performance
- **🔧 Tooling**: Improve build, linting, or development tools

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
bun run test:cnpj      # Test CNPJ packages
bun run test:cpf       # Test CPF packages
bun run test:br        # Test BR utilities
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add string field processor"
git commit -m "fix: resolve validation error in int processor"
git commit -m "docs: update README with new examples"
git commit -m "test: add tests for bail option"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Testing

### Test Structure

- Tests are located in the `test/` directory within each package
- Test files use the `.test.ts` extension
- Tests mirror the `src/` directory structure
- Use Bun's built-in test runner with TypeScript support

### Writing Tests

```typescript
import { describe, expect, it, beforeEach } from 'bun:test';
import { cnpjFormat } from '../src/index.js';

describe('CNPJ Formatter', () => {
  let input: string;

  beforeEach(() => {
    input = '12345678000195';
  });

  it('should format CNPJ with mask', () => {
    const result = cnpjFormat(input);
    expect(result).toBe('12.345.678/0001-95');
  });

  it('should handle invalid input', () => {
    expect(() => cnpjFormat('invalid')).toThrow();
  });
});
```

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

- **Classes**: PascalCase (`CnpjFormatter`)
- **Functions**: camelCase (`formatCnpj`)
- **Variables**: camelCase (`fieldName`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Files**: kebab-case for utilities (`cnpj-formatter.ts`)
- **Types/Interfaces**: PascalCase (`FormatOptions`)

### Package Naming

- Package names use `@lacussoft/` scope
- Format: `@lacussoft/{package-name}`
- Examples: `@lacussoft/cnpj-fmt`, `@lacussoft/cpf-val`

### Example Code Style

```typescript
import type { FormatOptions } from './types.js';

export interface CnpjFormatterOptions extends FormatOptions {
  readonly mask?: boolean;
}

export class CnpjFormatter {
  private readonly _options: CnpjFormatterOptions;

  public constructor(options: CnpjFormatterOptions = {}) {
    this._options = { mask: true, ...options };
  }

  public format(cnpj: string): string {
    // Implementation
    return this._applyMask(cnpj);
  }

  private _applyMask(cnpj: string): string {
    // Private implementation
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
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
- [ ] Package version is updated if needed

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
1. Create schema with...
2. Call validate with...
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- Node.js version: [e.g. 18.17.0]
- Bun version: [e.g. 1.0.0]
- OS: [e.g. macOS 13.0]
- Package version: [e.g. @lacussoft/cnpj-fmt@2.0.1]

**Code example**
```typescript
import { cnpjFormat } from '@lacussoft/cnpj-fmt';

// Minimal code that reproduces the issue
const result = cnpjFormat('12345678000195');
console.log(result);
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
