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
- Simple particle system
- Basic platformer character controller
- Sprite animation example
- Physics integration example
- ECS pattern example
