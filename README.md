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
- [x] **Entity Component System (ECS)** - Lightweight, reactive ECS architecture for game object management
- [ ] **Render Engine Abstraction** - PIXI.js integration (planned)
- [ ] **Physics Engine Abstraction** - P2 integration (planned)

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

### Utilities

- **`SpriteManager`** - Utility class for managing sprite lifecycle
  - `add(sprite: ISprite): void` - Add a sprite to the manager
  - `remove(sprite: ISprite): void` - Remove a sprite
  - `destroy(sprite: ISprite): void` - Remove and destroy a sprite
  - `forEach(fn: (sprite: ISprite) => void): void` - Apply function to all sprites
  - `filter(predicate): ISprite[]` - Filter sprites
  - `destroyAll(): void` - Destroy all managed sprites
  - `count: number` - Get sprite count

- **`TextureUtils`** - Utility class for creating textures programmatically
  - `createRect(width, height, color): HTMLCanvasElement` - Create a solid rectangle
  - `createCircle(radius, color, filled?): HTMLCanvasElement` - Create a circle
  - `createGradientCircle(radius, innerColor, outerColor?): HTMLCanvasElement` - Create gradient circle
  - `createText(text, fontSize?, color?, fontFamily?): HTMLCanvasElement` - Create text texture
  - `colorToString(color: number): string` - Convert color number to CSS string

Example:
```typescript
import { TextureUtils, canvasRenderer } from 'rgdk';

// Create textures without external images
const circleTexture = TextureUtils.createCircle(25, '#ff0000');
const textTexture = TextureUtils.createText('Hello!', 32, '#ffffff');

const sprite = canvasRenderer.createSprite({
  texture: circleTexture,
  x: 100,
  y: 100
});
```

### Entity Component System (ECS)

RGDK includes a lightweight ECS architecture that integrates seamlessly with reactive programming patterns.

```typescript
import { EntityManager, SystemManager, System, IComponent, IEntity, clock$ } from 'rgdk';

// Define components (pure data)
class PositionComponent implements IComponent {
  constructor(public x: number, public y: number) {}
}

class VelocityComponent implements IComponent {
  constructor(public vx: number, public vy: number) {}
}

// Define systems (game logic)
class MovementSystem extends System {
  constructor() {
    super();
    // Specify required components
    this.requiredComponents = [PositionComponent, VelocityComponent];
  }

  protected process(entities: IEntity[], deltaTime: number): void {
    entities.forEach(entity => {
      const pos = entity.getComponent(PositionComponent);
      const vel = entity.getComponent(VelocityComponent);
      
      if (pos && vel) {
        // Frame-rate independent movement
        pos.x += vel.vx * (deltaTime / 1000);
        pos.y += vel.vy * (deltaTime / 1000);
      }
    });
  }
}

// Create managers
const entityManager = new EntityManager();
const systemManager = new SystemManager();

// Create entities
const entity = entityManager.createEntity();
entity.addComponent(new PositionComponent(0, 0));
entity.addComponent(new VelocityComponent(100, 50));

// Register systems
systemManager.registerSystem(new MovementSystem());

// Integrate with game loop
clock$.subscribe((frame) => {
  const entities = entityManager.getAllEntities();
  systemManager.update(entities, frame.deltaTime);
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
- [x] Design ECS architecture compatible with reactive patterns
- [x] Implement Entity manager
- [x] Implement Component registry
- [x] Implement System execution pipeline
- [x] Integrate ECS with game loop observable

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

RGDK aims to be a modern, competitive, and reactive-friendly game development kit. The following roadmap outlines essential features and design patterns that will make RGDK a powerful framework for reactive game development.

### Essential Features

#### Core Systems
- **Game Loop & Timing** ✅
  - [x] Central frame update system with `animationFrameScheduler`
  - [x] Delta time calculation for frame-rate independent behavior
  - [x] Configurable fixed/variable time step (60 FPS default)

- **Rendering**
  - [x] Canvas-based rendering with sprite support
  - [ ] WebGL rendering option
  - [ ] PIXI.js integration for advanced 2D rendering
  - [ ] Three.js/Babylon.js integration for 3D (future consideration)
  - [ ] Camera/viewport management
  - [ ] Scene graph management
  - [ ] Layer/z-index rendering

- **Input Handling** ✅
  - [x] Keyboard, mouse, and touch events as observable streams
  - [x] Gamepad support via observable streams
  - [ ] Input mapping and remapping system
  - [ ] Gesture recognition for touch devices

- **Asset Management** ✅
  - [x] Loading and caching for images, sounds, and data files
  - [x] Observable-based progress tracking
  - [x] Error handling for failed loads
  - [ ] Support for sprite sheets and texture atlases
  - [ ] Asset preloading and lazy loading strategies
  - [ ] Asset versioning and cache invalidation

#### Advanced Systems
- **Entity Component System (ECS)** ✅
  - [x] Lightweight ECS architecture compatible with reactive patterns
  - [x] Entity manager for creating/destroying entities
  - [x] Component registry with type-safe definitions
  - [x] System execution pipeline integrated with game loop
  - [x] Query system for entities with specific components
  - [ ] Observable component updates

- **Scene Management**
  - [ ] Scene switching and stacking system
  - [ ] Scene transitions and effects
  - [ ] State management between scenes
  - [ ] Observable scene lifecycle events

- **Physics & Animation**
  - [ ] Physics engine abstraction (P2.js, Matter.js)
  - [ ] Rigid body dynamics and collision detection
  - [ ] Physics debug rendering
  - [ ] Animation system with timeline/tweening
  - [ ] Sprite sheet animations
  - [ ] State-based animation transitions
  - [ ] Particle system support

- **Audio**
  - [ ] Audio loading and playback via Web Audio API
  - [ ] Sound mixing and volume control
  - [ ] Spatial audio support
  - [ ] Observable audio events (play, pause, end)

- **UI/HUD**
  - [ ] Reactive UI component system
  - [ ] Menus, dialogs, and overlays
  - [ ] Scoreboards and health bars
  - [ ] Event-driven UI updates via observables
  - [ ] UI state management

#### Developer Experience
- **Utilities & Tools**
  - [ ] Debugging tools (entity inspector, performance monitor)
  - [ ] Hot reload support for development
  - [ ] Event log and visualization
  - [ ] Testing framework for game logic
  - [ ] Replay and time-travel debugging

- **Developer Tooling**
  - [ ] CLI for project scaffolding
  - [ ] Starter templates and boilerplates
  - [ ] Build and deployment commands
  - [ ] Documentation generator
  - [ ] Code examples and tutorials

### Design Patterns & Architecture

RGDK embraces reactive programming and provides first-class support for the following design patterns:

#### Reactive Patterns
- **Observable Streams** ✅
  - [x] Game loop clock as observable
  - [x] Input events as observable streams
  - [x] Asset loading progress as observables
  - [ ] Game state changes as observables
  - [ ] Networking events as observables
  - [ ] Physics/collision events as observables

- **State Machines**
  - [ ] Game state machine (menu, playing, paused, game over)
  - [ ] Entity behavior state machines
  - [ ] UI flow state machines
  - [ ] Observable state transitions
  - [ ] Hierarchical state machines (HSM)

- **Event Bus/Signal System**
  - [ ] Publish/subscribe pattern for game events
  - [ ] Collision and trigger events
  - [ ] Achievement and scoring events
  - [ ] Cross-system communication via events
  - [ ] Type-safe event definitions

- **Command Pattern**
  - [ ] Decouple user actions from game logic
  - [ ] Commands as observable stream events
  - [ ] Command queue and execution
  - [ ] Undo/redo support via command history

#### Component & Entity Patterns
- **Selector/Query Pattern**
  - [ ] Query entities by component composition
  - [ ] Reactive entity queries that update automatically
  - [ ] Filtered entity collections
  - [ ] Component-based entity selection

- **Component-Based Architecture**
  - [ ] Entities composed from reusable components
  - [ ] Component lifecycle management
  - [ ] Component communication via messages
  - [ ] Data-driven entity definitions

- **Observer + ECS Integration**
  - [ ] ECS system updates triggered by observables
  - [ ] Component changes as observable streams
  - [ ] Reactive system dependencies
  - [ ] Automatic system execution ordering

#### Advanced Patterns
- **Replay/Recordable Streams**
  - [ ] Record game input streams
  - [ ] Replay recorded sessions
  - [ ] Time travel debugging
  - [ ] Deterministic replay system
  - [ ] Save state and rewind functionality

- **Scheduler/Timeline**
  - [ ] Orchestrate timed effects as RxJS streams
  - [ ] Animation timelines
  - [ ] Cutscene sequencing
  - [ ] Scheduled game events
  - [ ] Parallel and sequential effect composition

- **Strategy & Factory Patterns**
  - [ ] Pluggable behavior strategies
  - [ ] Factory methods for entity/component creation
  - [ ] Dependency injection for systems
  - [ ] Configuration-based entity instantiation

### Development Timeline

#### Phase 1: Foundation (Current - Q1 2024)
- ✅ Core game loop and timing
- ✅ Input system with observable streams
- ✅ Basic asset management
- ✅ Canvas renderer
- [ ] Complete rendering engine integration (PIXI.js)
- [ ] Basic physics support (P2.js)
- [ ] Initial example games

#### Phase 2: Core Features (Q2 2024)
- [ ] Entity Component System (ECS)
- [ ] Scene management system
- [ ] Animation and tweening system
- [ ] Audio system integration
- [ ] Advanced input mapping
- [ ] Comprehensive test coverage
- [ ] Expanded documentation and tutorials

#### Phase 3: Advanced Features (Q3 2024)
- [ ] State machine implementation
- [ ] Event bus and signal system
- [ ] Command pattern support
- [ ] UI/HUD component system
- [ ] Physics debug tools
- [ ] Performance profiling tools

#### Phase 4: Developer Experience (Q4 2024)
- [ ] CLI tool for project scaffolding
- [ ] Hot reload and debugging tools
- [ ] Replay/recording system
- [ ] Testing framework
- [ ] Plugin system for extensibility
- [ ] Advanced examples and tutorials

#### Phase 5: Platform & Ecosystem (2025)
- [ ] WebGL/WebGPU rendering support
- [ ] 3D rendering integration (Three.js/Babylon.js)
- [ ] Multi-platform support (desktop via Electron)
- [ ] Mobile optimizations
- [ ] Cloud save and multiplayer patterns
- [ ] Marketplace for components and templates

### Contributing to the Roadmap

We welcome community input on the roadmap! If you have suggestions for features or patterns that would benefit RGDK, please:
- Open an issue to discuss new features
- Submit PRs for roadmap items you'd like to implement
- Join discussions about architecture and design decisions

**Rationale:** These features and patterns will enable RGDK to fully leverage RxJS/reactive programming, making it modular, extensible, and attractive to developers seeking a modern approach to game development. They align with industry standards while showcasing RGDK's unique reactive strengths.
