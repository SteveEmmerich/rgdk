# RGDK Copilot Instructions

## Repository Overview

RGDK (Reactive Game Dev Kit) is a reactive game development framework built on RxJS for creating browser-based games using reactive programming patterns. The framework leverages TypeScript and RxJS observables to provide a type-safe, maintainable game development experience.

**Current Version:** 0.0.2-2  
**License:** MIT  
**Primary Language:** TypeScript  
**Key Dependencies:** RxJS v6.5.2, Immer v3.2.0

## Architecture

### Core Concepts

1. **Reactive Programming**: The framework is built entirely on RxJS observables, providing reactive streams for:
   - Game loop (frame-based timing)
   - User input (keyboard, mouse, touch)
   - Future: rendering, physics, asset loading

2. **Immutability**: Uses Immer for immutable state updates in the game loop

3. **Type Safety**: Strict TypeScript is enabled throughout the codebase

### Project Structure

```
rgdk/
├── src/                    # Source code
│   ├── core/              # Core framework code
│   │   ├── clock.ts       # Game loop implementation
│   │   ├── input.ts       # Input handling
│   │   ├── frame.interface.ts  # Frame timing interface
│   │   └── index.ts       # Core exports
│   ├── constants.ts       # Framework constants (FPS, etc.)
│   └── index.ts           # Main entry point
├── examples/              # Example code
├── dist/                  # Compiled output (gitignored)
├── CONTRIBUTING.md        # Contribution guidelines
├── REQUIREMENTS.md        # POC requirements document
└── QUICKSTART.md          # Quick start guide
```

### Build System

- **Bundler**: Rollup with TypeScript plugin
- **Output Formats**: UMD, CommonJS, ES modules
- **Type Declarations**: Generated automatically with declaration maps

## Code Style & Conventions

### TypeScript Guidelines

- **Always use TypeScript** for all code
- **Strict type checking is enabled** - no implicit any
- **Avoid `any` type** whenever possible
- **Use interfaces for public APIs** and export types that consumers need
- **Add JSDoc comments** for all public APIs
- **Export types** that library consumers need to use

### Code Organization

- **Keep functions small and focused** - single responsibility
- **Use meaningful variable and function names**
- **Prefer immutable data structures** (use Immer when needed)
- **Leverage RxJS operators** for complex event handling and transformations

### Reactive Patterns

When working with observables:
- Always consider subscription cleanup to prevent memory leaks
- Use appropriate RxJS operators for transformations
- Keep game loop logic frame-rate independent using `deltaTime`
- Expose observables from modules, don't subscribe internally unless necessary

### File Naming

- Use lowercase with hyphens for multi-word file names (when applicable)
- Use `.ts` extension for TypeScript files
- Use `.interface.ts` suffix for interface-only files
- Use `index.ts` for module exports

## Development Workflow

### Building the Project

```bash
# Install dependencies
npm install

# Build once
npm run build

# Watch mode (rebuilds on file changes)
npm run dev

# Clean build artifacts
npm run clean
```

### Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make changes in `src/` directory
3. Build to verify: `npm run build`
4. Update documentation if adding/changing public APIs
5. Add examples for new features in `examples/` directory

### Commit Messages

Use clear, descriptive commit messages:
- Good: "Add sprite rotation support to renderer"
- Good: "Fix deltaTime calculation in game loop"
- Bad: "fix bug", "updates", "wip"

## Testing Practices

- Currently no test framework is configured (planned: Jest)
- Manual testing through examples is the current approach
- Build without errors is the minimum requirement
- Future: aim for >80% test coverage on core modules

## Key APIs

### Game Loop

```typescript
import { clock$, FrameInterface } from 'rgdk';

clock$.subscribe((frame: FrameInterface) => {
  // frame.frameStartTime: Current frame timestamp
  // frame.deltaTime: Time since last frame in ms
});
```

### Input Handling

```typescript
import { click$, keydown$, keyup$, keypressed$ } from 'rgdk';
import { touchstart$, touchmove$, touchend$, touchcancel$ } from 'rgdk';

// All input events are RxJS observables
click$.subscribe((event: MouseEvent) => { /* ... */ });
keydown$.subscribe((event: KeyboardEvent) => { /* ... */ });
```

## Current POC Status

### Completed ✅
- Core game loop with configurable FPS (default: 60)
- Observable-based input system (keyboard, mouse, touch)
- TypeScript support with strict type checking
- Build system with multiple output formats

### In Progress / Planned 📋
- **HIGH Priority**: PIXI.js rendering engine integration
- **HIGH Priority**: Physics engine integration (P2)
- **HIGH Priority**: Example games (Hello World, Clicker, Movement, Particle System)
- **HIGH Priority**: Complete API documentation
- **MEDIUM Priority**: Entity Component System (ECS) architecture
- **MEDIUM Priority**: Unit testing with Jest
- **LOW Priority**: Asset management system
- **LOW Priority**: CLI tool for project scaffolding

## Special Considerations

### Performance
- Frame-rate independence is critical - always use `deltaTime`
- Minimize subscriptions and use operators to compose logic
- Consider using `shareReplay()` for shared observables

### Dependencies
- **RxJS v6.5.2**: Core reactive library (peer dependency for consuming apps)
- **Immer v3.2.0**: Immutable state updates
- Avoid adding new dependencies unless absolutely necessary
- Prefer standard browser APIs when possible

### Breaking Changes
- Document all breaking changes clearly
- Update version following semver
- Provide migration guides for major version bumps

### Documentation Requirements
- Update README.md for any API changes
- Add examples to `examples/` directory for new features
- Update REQUIREMENTS.md if changing POC scope
- Keep CONTRIBUTING.md current with workflow changes

## PR Checklist

When reviewing or creating PRs:
- [ ] Code builds successfully (`npm run build`)
- [ ] Changes are documented (README, JSDoc comments)
- [ ] Examples added for new features
- [ ] No breaking changes (or clearly documented)
- [ ] Follows existing code style
- [ ] TypeScript strict mode passes
- [ ] References related issue (e.g., "Fixes #123")

## Common Patterns

### Creating New Observables

```typescript
import { fromEvent } from 'rxjs';

// Create observable from DOM events
const customEvent$ = fromEvent(document, 'customevent');
```

### Frame-Rate Independent Movement

```typescript
clock$.subscribe((frame: FrameInterface) => {
  // Use deltaTime for smooth, frame-rate independent behavior
  position.x += velocity.x * (frame.deltaTime / 1000);
});
```

### Combining Observables

```typescript
import { withLatestFrom } from 'rxjs/operators';

clock$.pipe(
  withLatestFrom(keydown$)
).subscribe(([frame, keyEvent]) => {
  // React to input synchronized with game loop
});
```

## Questions & Support

- Open an issue for questions or discussions
- Check existing issues and PRs to avoid duplicate work
- For large changes, open an issue first to discuss approach
- Tag issues appropriately: `bug`, `feature`, `question`, `documentation`
