# RGDK (Reactive Game Dev Kit)

A reactive game development framework built on RxJS for creating browser-based games using reactive programming patterns.

## Current Version: 0.0.2-2

**Note:** Version 1.0.1 is deprecated. Please use the latest version.

## Installation

```bash
npm install rgdk@latest
```

## Features

- [x] **TypeScript Support** - Full TypeScript definitions and type safety
- [x] **RxJS Observable Streams for Game Loop** - Frame-based game loop using RxJS observables with configurable FPS
- [x] **Observable Streams for User Input** - Reactive event handling for keyboard, mouse, and touch inputs
- [ ] **Render Engine Abstraction** - PIXI.js integration (planned)
- [ ] **Physics Engine Abstraction** - P2 integration (planned)
- [ ] **Entity Component System (ECS)** - Game object management system (under consideration)

## Usage

### Basic Game Loop

```typescript
import { clock$, FrameInterface } from 'rgdk';

// Subscribe to the game loop
clock$.subscribe((frame: FrameInterface) => {
  console.log('Frame time:', frame.frameStartTime);
  console.log('Delta time:', frame.deltaTime);
  
  // Your game logic here
  update(frame.deltaTime);
  render();
});
```

### Input Handling

```typescript
import { click$, keydown$, keyup$ } from 'rgdk';

// Handle click events
click$.subscribe((event: MouseEvent) => {
  console.log('Clicked at:', event.clientX, event.clientY);
});

// Handle keyboard events
keydown$.subscribe((event: KeyboardEvent) => {
  console.log('Key pressed:', event.key);
});

keyup$.subscribe((event: KeyboardEvent) => {
  console.log('Key released:', event.key);
});
```

### Combining Game Loop with Input

```typescript
import { clock$, keydown$ } from 'rgdk';
import { withLatestFrom } from 'rxjs/operators';

// Process input in sync with game loop
clock$.pipe(
  withLatestFrom(keydown$)
).subscribe(([frame, keyEvent]) => {
  // Handle game state updates based on both frame timing and input
});
```

## API Reference

### Clock

- **`clock$`** - Observable stream that emits frame data at 60 FPS
  - Returns: `Observable<FrameInterface>`
  - Properties:
    - `frameStartTime: number` - Timestamp when the frame started
    - `deltaTime: number` - Time elapsed since the last frame

### Input Streams

- **`click$`** - Observable stream of click events
- **`keydown$`** - Observable stream of keydown events
- **`keyup$`** - Observable stream of keyup events
- **`keypressed$`** - Observable stream of keypressed events
- **`touch$`** - Combined observable of touch events (touchstart, touchmove, touchcancel, touchend)

### Constants

- **`FPS`** - Frame rate constant (default: 60)

## POC Requirements

To complete the proof of concept, the following requirements need to be addressed:

### 1. Core Rendering System
- [ ] Integrate PIXI.js as the rendering engine
- [ ] Create abstraction layer for rendering operations
- [ ] Support sprite rendering, animations, and transformations
- [ ] Implement camera/viewport management
- [ ] Add scene graph management

### 2. Physics Integration
- [ ] Integrate P2 physics engine
- [ ] Create abstraction layer for physics operations
- [ ] Support rigid body dynamics
- [ ] Implement collision detection and response
- [ ] Add physics debug rendering

### 3. Entity Component System (ECS)
- [ ] Design ECS architecture compatible with reactive patterns
- [ ] Implement Entity manager
- [ ] Implement Component registry
- [ ] Implement System execution pipeline
- [ ] Integrate ECS with game loop observable

### 4. Asset Management
- [ ] Create asset loader for images, audio, and data files
- [ ] Implement asset caching and preloading
- [ ] Add progress tracking for asset loading
- [ ] Support for sprite sheets and texture atlases

### 5. Example Games
- [ ] Create a simple "Hello World" example
- [ ] Build a basic platformer demo
- [ ] Build a simple particle system demo
- [ ] Document example code with best practices

### 6. Documentation
- [ ] Complete API documentation
- [ ] Add architecture guide
- [ ] Create tutorials for common game patterns
- [ ] Add performance optimization guide

### 7. Testing & Quality
- [ ] Add unit tests for core modules
- [ ] Add integration tests
- [ ] Set up continuous integration
- [ ] Performance benchmarking

### 8. Developer Experience
- [ ] Add development mode with hot reload
- [ ] Create CLI tool for project scaffolding
- [ ] Add debugging utilities
- [ ] Provide TypeScript templates

## Architecture

RGDK is built on reactive programming principles using RxJS:

1. **Game Loop**: Uses `animationFrameScheduler` and `interval` to create a consistent frame-based update cycle
2. **Input System**: DOM events are converted to observable streams for reactive input handling
3. **Immutable State Updates**: Uses Immer for safe, immutable state mutations
4. **Type Safety**: Full TypeScript support throughout the framework

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev
```

### Project Structure

```
rgdk/
├── src/
│   ├── core/
│   │   ├── clock.ts         # Game loop implementation
│   │   ├── input.ts         # Input event streams
│   │   ├── frame.interface.ts
│   │   └── index.ts
│   ├── constants.ts         # Framework constants
│   └── index.ts             # Main entry point
├── dist/                    # Compiled output
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [Edit on StackBlitz ⚡️](https://stackblitz.com/edit/rgdk)
- [npm package](https://www.npmjs.com/package/rgdk)

## Roadmap

### Short Term (Current POC)
- Complete rendering engine integration
- Add basic physics support
- Create initial example games

### Medium Term
- Implement ECS architecture
- Add comprehensive test coverage
- Improve documentation and tutorials

### Long Term
- WebGL/WebGPU rendering support
- Advanced physics features
- Multi-platform support (desktop via Electron)
- Plugin system for extensibility
