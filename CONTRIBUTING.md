# Contributing to RGDK

Thank you for your interest in contributing to RGDK! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rgdk.git
   cd rgdk
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Building the Project

```bash
# Build once
npm run build

# Watch mode (rebuilds on file changes)
npm run dev
```

### Project Structure

```
rgdk/
├── src/                    # Source code
│   ├── core/              # Core framework code
│   │   ├── clock.ts       # Game loop implementation
│   │   ├── input.ts       # Input handling
│   │   └── index.ts       # Core exports
│   ├── constants.ts       # Framework constants
│   └── index.ts           # Main entry point
├── examples/              # Example code
├── dist/                  # Compiled output (gitignored)
└── REQUIREMENTS.md        # POC requirements document
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### TypeScript Guidelines

- Enable strict type checking
- Avoid `any` type when possible
- Use interfaces for public APIs
- Export types that consumers need

## Making Changes

### Before You Start

1. Check existing issues and PRs to avoid duplicate work
2. For large changes, open an issue first to discuss
3. Make sure you understand the reactive programming patterns used in RGDK

### Development Process

1. Make your changes in your feature branch
2. Test your changes:
   ```bash
   npm run build
   ```
3. Ensure code builds without errors
4. Update documentation if needed
5. Add examples if adding new features

### Commit Messages

Use clear, descriptive commit messages:

```
Good:
- "Add sprite rotation support to renderer"
- "Fix deltaTime calculation in game loop"
- "Update README with new API examples"

Bad:
- "fix bug"
- "updates"
- "wip"
```

## Pull Requests

### Preparing Your PR

1. **Rebase** on the latest main branch:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push** your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request** on GitHub

### PR Guidelines

- Provide a clear description of changes
- Reference related issues (e.g., "Fixes #123")
- Include examples or screenshots if relevant
- Keep PRs focused on a single feature/fix
- Update documentation for API changes

### PR Checklist

- [ ] Code builds successfully
- [ ] Changes are documented
- [ ] Examples added (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] Follows existing code style

## Areas for Contribution

### High Priority

See [REQUIREMENTS.md](REQUIREMENTS.md) for detailed requirements:

1. **Rendering System**
   - PIXI.js integration
   - Sprite management
   - Camera/viewport system

2. **Asset Management**
   - Asset loading system
   - Caching mechanism
   - Progress tracking

3. **Examples**
   - Simple game examples
   - Tutorial content
   - API usage demonstrations

### Medium Priority

4. **Physics Integration**
   - P2.js integration
   - Collision handling
   - Physics debugging tools

5. **ECS System**
   - Entity management
   - Component system
   - System execution

6. **Testing**
   - Unit tests
   - Integration tests
   - Performance benchmarks

### Documentation

- API documentation improvements
- Tutorial creation
- Best practices guide
- Migration guides

## Questions?

- Open an issue for questions
- Tag with "question" label
- Be specific about what you're trying to do

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## License

By contributing to RGDK, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make RGDK better for everyone. We appreciate your time and effort! 🎮
