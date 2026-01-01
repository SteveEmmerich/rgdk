# RGDK Agent Instructions

This directory contains instructions for GitHub Copilot agents working on the RGDK (Reactive Game Dev Kit) project.

## Project Overview

RGDK is a reactive game development framework built on RxJS for creating browser-based games using reactive programming patterns. The project emphasizes TypeScript support, observable streams for game loops and user input, and a modular architecture.

## Build System

- **Build Tool**: tsup v8.x (powered by esbuild)
- **TypeScript**: v5.x
- **Module System**: Generates CJS, ESM, and IIFE (browser) formats
- **Build Command**: `npm run build`
- **Dev Mode**: `npm run dev` (watch mode)
- **Configuration**: `tsup.config.ts`

## Code Standards

### TypeScript
- Use strict type checking
- Target ES5 for maximum compatibility
- All public APIs must have TypeScript definitions
- Avoid `any` type when possible
- Use interfaces for public APIs

### Dependencies
- **Core**: RxJS ^7.8.0, Immer ^10.1.0
- **Dev**: TypeScript ^5.0.0, tsup ^8.5.0, @swc/core ^1.10.0, Jest ^29.7.0
- Always check for security vulnerabilities before adding dependencies
- Use peer dependencies for rendering (PIXI.js) and physics (P2) engines

### Import Patterns
- Use named imports for Immer: `import { produce, Draft } from 'immer'`
- Use RxJS operators from 'rxjs/operators'
- Follow ES module import syntax

## Architecture Patterns

### Reactive Programming
- Game loop based on RxJS observables
- Event streams for user input (keyboard, mouse, touch)
- Use `scan` operator for state management
- Leverage Immer for immutable state updates

### Project Structure
```
rgdk/
├── src/
│   ├── core/           # Core framework code
│   │   ├── clock.ts    # Game loop implementation
│   │   ├── input.ts    # Input event streams
│   │   └── index.ts    # Core exports
│   ├── constants.ts    # Framework constants
│   └── index.ts        # Main entry point
├── dist/               # Compiled output (gitignored)
├── examples/           # Example games (excluded from build)
└── REQUIREMENTS.md     # POC requirements
```

## Development Guidelines

### Making Changes
1. Always run build after changes: `npm run build`
2. Test changes with examples when applicable
3. Update documentation for API changes
4. Keep changes minimal and focused
5. Don't commit build artifacts (dist/ is in .gitignore)

### Adding Features
- Follow the requirements in REQUIREMENTS.md
- Prioritize HIGH priority items
- Maintain backward compatibility when possible
- Add examples demonstrating new features
- Update README.md with feature status

### Common Tasks

#### Updating Dependencies
1. Check REQUIREMENTS.md for version guidelines
2. Update package.json
3. Run `npm install`
4. Test build: `npm run build`
5. Update REQUIREMENTS.md with new versions

#### Adding New Core Features
1. Add implementation in `src/core/`
2. Export from `src/core/index.ts`
3. Re-export from `src/index.ts` if public API
4. Add TypeScript interfaces
5. Build and verify type definitions are generated
6. Add example in `examples/`

#### Fixing Build Issues
- Check tsconfig.json settings
- Verify tsup.config.ts configuration
- Ensure examples are excluded from TypeScript compilation
- Check import statements match library export patterns
- For ES5 target, @swc/core is required

## Performance Targets

- Maintain 60 FPS with 1000+ game objects
- Game loop overhead < 1ms per frame
- Core library: < 50KB gzipped
- Memory usage < 100MB for typical game

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Considerations

See REQUIREMENTS.md for detailed roadmap including:
- Rendering system (PIXI.js integration)
- Physics integration (P2.js)
- Entity Component System (ECS)
- Asset management
- Comprehensive testing
- Enhanced documentation
