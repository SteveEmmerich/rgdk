# RGDK Quick Start Guide

Get up and running with RGDK in minutes!

## Prerequisites

- Node.js 12.x or later
- npm or yarn
- Basic knowledge of TypeScript/JavaScript
- Familiarity with RxJS (helpful but not required)

## Installation

```bash
npm install rgdk
```

## Your First RGDK Game

Create a new file `game.ts`:

```typescript
import { clock$, FrameInterface } from 'rgdk';

// Simple game loop
clock$.subscribe((frame: FrameInterface) => {
  console.log(`FPS: ${1000 / frame.deltaTime}`);
  
  // Your game logic here
  update(frame.deltaTime);
  render();
});

function update(deltaTime: number) {
  // Update game state
}

function render() {
  // Render your game
}
```

## Adding Input

```typescript
import { clock$, keydown$, click$ } from 'rgdk';

// Track pressed keys
const pressedKeys = new Set<string>();

keydown$.subscribe(event => {
  pressedKeys.add(event.key);
});

// Handle clicks
click$.subscribe(event => {
  console.log('Clicked at:', event.clientX, event.clientY);
});

// Use input in game loop
clock$.subscribe(frame => {
  if (pressedKeys.has('ArrowLeft')) {
    // Move left
  }
  if (pressedKeys.has('ArrowRight')) {
    // Move right
  }
});
```

## Frame-Rate Independent Movement

Always use `deltaTime` for smooth, consistent movement:

```typescript
import { clock$ } from 'rgdk';

let playerX = 0;
const speed = 100; // pixels per second

clock$.subscribe(frame => {
  const deltaSeconds = frame.deltaTime / 1000;
  playerX += speed * deltaSeconds;
});
```

## Using the Canvas Renderer

RGDK includes a built-in Canvas renderer for 2D graphics:

```typescript
import { clock$, CanvasRenderer } from 'rgdk';

// Create and initialize renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb
});

// Create a sprite (requires a texture)
const sprite = renderer.createSprite({
  texture: myImage, // HTMLImageElement or HTMLCanvasElement
  x: 100,
  y: 100,
  anchor: { x: 0.5, y: 0.5 } // Center the sprite
});

// Update and render in game loop
clock$.subscribe(() => {
  sprite.rotation += 0.01; // Rotate the sprite
  renderer.render();
});
```

## Loading Assets

Load images, audio, and data files with progress tracking:

```typescript
import { assetLoader } from 'rgdk';

const manifest = {
  images: {
    'player': './assets/player.png',
    'enemy': './assets/enemy.png'
  },
  audio: {
    'bgm': './assets/music.mp3'
  }
};

assetLoader.load(manifest).subscribe({
  next: (progress) => {
    console.log(`Loading: ${progress.percentage}%`);
  },
  complete: () => {
    // All assets loaded, start the game
    const playerImg = assetLoader.get<HTMLImageElement>('player');
    startGame(playerImg);
  },
  error: (err) => {
    console.error('Failed to load assets:', err);
  }
});
```

## Next Steps

clock$.subscribe(frame => {
  const deltaSeconds = frame.deltaTime / 1000;
  
  // Move 100 pixels per second, regardless of frame rate
  playerX += speed * deltaSeconds;
});
```

## Next Steps

1. Check out the [examples](examples/) directory for more code samples
2. Read the [README](README.md) for full API documentation
3. Review [REQUIREMENTS.md](REQUIREMENTS.md) to see what's coming next
4. Join the community and contribute!

## Common Patterns

### Pause/Resume Game Loop

```typescript
import { clock$ } from 'rgdk';
import { Subscription } from 'rxjs';

let gameLoopSubscription: Subscription;

function start() {
  gameLoopSubscription = clock$.subscribe(frame => {
    // Game logic
  });
}

function pause() {
  gameLoopSubscription?.unsubscribe();
}

function resume() {
  start();
}
```

### Filtering Specific Keys

```typescript
import { keydown$ } from 'rgdk';
import { filter } from 'rxjs/operators';

// Only listen for spacebar
const spacePress$ = keydown$.pipe(
  filter(event => event.key === ' ')
);

spacePress$.subscribe(() => {
  console.log('Jump!');
});
```

### Combining Observables

```typescript
import { clock$, click$ } from 'rgdk';
import { withLatestFrom } from 'rxjs/operators';

// React to clicks in sync with game loop
clock$.pipe(
  withLatestFrom(click$)
).subscribe(([frame, clickEvent]) => {
  // Handle click during this frame
});
```

## Tips

- **Always unsubscribe** when you're done to prevent memory leaks
- **Use deltaTime** for frame-rate independent behavior
- **Leverage RxJS operators** for complex event handling
- **Keep state immutable** when possible (consider using Immer)

## Troubleshooting

### Game loop not starting
- Make sure you've subscribed to `clock$`
- Check browser console for errors

### Input not working
- Ensure document has focus
- Check event listeners are properly subscribed

### Performance issues
- Profile with browser dev tools
- Reduce number of subscriptions
- Use `unsubscribe()` to clean up

## Resources

- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Examples Directory](examples/)

Happy game development! 🎮
