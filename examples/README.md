# RGDK Examples

This directory contains example code demonstrating how to use RGDK features.

## Examples

### basic-example.ts

Demonstrates the core features of RGDK:
- Setting up the game loop
- Handling mouse clicks
- Handling keyboard input
- Tracking key states
- Filtering specific key events
- Combining game loop with input handling

### hello-world.ts

A simple "Hello World" example (~50 lines):
- Creating a canvas renderer
- Drawing text on the canvas
- Basic setup with RGDK
- Demonstrates the minimal code needed to get started

### simple-clicker.ts

Click to spawn sprites example (~100 lines):
- Handling mouse click events
- Creating sprites dynamically
- Rendering sprites with the Canvas renderer
- Demonstrates interactive sprite creation

### movement-demo.ts

Keyboard-controlled movement example (~150 lines):
- WASD and arrow key movement
- Delta time for smooth, frame-rate independent movement
- Keeping sprites within bounds
- Reactive input state management
- Demonstrates game character control

### particle-system.ts

Particle system example (~200 lines):
- Click to spawn particle bursts
- Physics simulation with gravity
- Particle lifecycle management
- Alpha fading effects
- Demonstrates advanced sprite management and animation

## Running the Examples

Since RGDK is currently a library, these examples are meant to be integrated into your own projects. To use them:

1. Install RGDK in your project:
```bash
npm install rgdk
```

2. Copy the example code into your project

3. Import and run the example in your application

## Example Usage in Your Project

```typescript
import { clock$, click$, keydown$ } from 'rgdk';

// Your game code here
clock$.subscribe(frame => {
  // Update game state
  // Render game
});
```

## Future Examples

As RGDK develops, more examples will be added:
- Particle system demo
- Physics integration example (with P2.js)
- ECS pattern example
- Asset loading example
- Multi-sprite animation example
