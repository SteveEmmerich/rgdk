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
- [x] **Asset Management System** - Load and cache images, audio, and JSON data with observable progress tracking
- [x] **Canvas Renderer** - Built-in canvas-based rendering with sprite support
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

### Asset Management

- **`assetLoader`** - Singleton instance of AssetLoader
  - `load(manifest: AssetManifest): Observable<LoadProgress>` - Load assets and track progress
  - `get<T>(key: string): T | null` - Get a loaded asset from cache
  - `clear(): void` - Clear all cached assets

Example:
```typescript
import { assetLoader } from 'rgdk';

const manifest = {
  images: {
    'player': './assets/player.png',
    'enemy': './assets/enemy.png'
  },
  audio: {
    'bgm': './assets/music.mp3'
  },
  data: {
    'config': './assets/config.json'
  }
};

assetLoader.load(manifest).subscribe({
  next: (progress) => {
    console.log(`Loading: ${progress.percentage}%`);
  },
  complete: () => {
    const playerImage = assetLoader.get<HTMLImageElement>('player');
    console.log('All assets loaded!');
  }
});
```

### Canvas Renderer

- **`CanvasRenderer`** - Canvas-based renderer class
  - `init(config: RendererConfig): void` - Initialize the renderer
  - `createSprite(config: SpriteConfig): ISprite` - Create a sprite
  - `render(): void` - Render all sprites
  - `getView(): HTMLCanvasElement` - Get the canvas element
  - `resize(width: number, height: number): void` - Resize the canvas
  - `destroy(): void` - Clean up and destroy the renderer

- **`canvasRenderer`** - Singleton instance of CanvasRenderer

Example:
```typescript
import { canvasRenderer, clock$ } from 'rgdk';

// Initialize renderer
canvasRenderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb
});

// Create a sprite (after loading assets)
const sprite = canvasRenderer.createSprite({
  texture: playerImage,
  x: 100,
  y: 100,
  anchor: { x: 0.5, y: 0.5 }
});

// Update and render in game loop
clock$.subscribe(() => {
  sprite.rotation += 0.01;
  canvasRenderer.render();
});
```

## POC Requirements

To complete the proof of concept, the following requirements need to be addressed:

### 1. Core Rendering System
- [x] Create canvas-based rendering abstraction
- [x] Support sprite rendering and transformations
- [x] Integrate rendering with game loop
- [ ] Integrate PIXI.js as the rendering engine (optional)
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
- [x] Create asset loader for images, audio, and data files
- [x] Implement asset caching and preloading
- [x] Add progress tracking for asset loading
- [x] Support for images and audio files
- [x] Error handling for failed loads
- [ ] Support for sprite sheets and texture atlases

### 5. Example Games
- [x] Create a simple "Hello World" example
- [x] Build a simple clicker demo (mouse input + rendering)
- [x] Build a movement demo (keyboard input + rendering)
- [ ] Build a basic platformer demo
- [ ] Build a simple particle system demo
- [ ] Document example code with best practices

### 6. Documentation
- [x] Add API documentation for new modules
- [x] Update README with usage examples
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
