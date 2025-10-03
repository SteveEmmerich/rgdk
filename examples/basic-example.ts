/**
 * Basic RGDK Example
 * 
 * This example demonstrates how to use the core features of RGDK:
 * - Game loop with frame timing
 * - Input handling with reactive streams
 * - Combining multiple observables
 */

import { clock$, FrameInterface, click$, keydown$, keyup$ } from 'rgdk';
import { filter, map } from 'rxjs/operators';

// Example 1: Basic game loop
console.log('Starting basic game loop example...');

const gameLoopSubscription = clock$.subscribe((frame: FrameInterface) => {
  // This runs every frame (60 FPS by default)
  // Use frame.deltaTime to make your game frame-rate independent
  
  // Example: Move a sprite based on delta time
  const speed = 100; // pixels per second
  const distance = speed * (frame.deltaTime / 1000); // Convert ms to seconds
  
  // Uncomment to see frame data
  // console.log(`Frame: ${frame.frameStartTime.toFixed(2)}ms, Delta: ${frame.deltaTime.toFixed(2)}ms`);
});

// Example 2: Handle mouse clicks
const clickSubscription = click$.subscribe((event: MouseEvent) => {
  console.log(`Clicked at position: (${event.clientX}, ${event.clientY})`);
});

// Example 3: Handle keyboard input
const keydownSubscription = keydown$.subscribe((event: KeyboardEvent) => {
  console.log(`Key pressed: ${event.key}`);
  
  // Example: Handle specific keys
  if (event.key === 'Escape') {
    console.log('Escape pressed - pausing game...');
  }
});

// Example 4: Track key state
const keyStates = new Map<string, boolean>();

keydown$.subscribe((event: KeyboardEvent) => {
  keyStates.set(event.key, true);
});

keyup$.subscribe((event: KeyboardEvent) => {
  keyStates.set(event.key, false);
});

// Example 5: Filter specific keys
const spaceBarPress$ = keydown$.pipe(
  filter((event: KeyboardEvent) => event.key === ' ')
);

spaceBarPress$.subscribe(() => {
  console.log('Space bar pressed - jumping!');
});

// Example 6: Combine game loop with input state
const gameLoop$ = clock$.subscribe((frame: FrameInterface) => {
  // Check keyboard state in the game loop
  const moveSpeed = 200; // pixels per second
  const deltaSeconds = frame.deltaTime / 1000;
  
  let dx = 0;
  let dy = 0;
  
  if (keyStates.get('ArrowLeft') || keyStates.get('a')) {
    dx -= moveSpeed * deltaSeconds;
  }
  if (keyStates.get('ArrowRight') || keyStates.get('d')) {
    dx += moveSpeed * deltaSeconds;
  }
  if (keyStates.get('ArrowUp') || keyStates.get('w')) {
    dy -= moveSpeed * deltaSeconds;
  }
  if (keyStates.get('ArrowDown') || keyStates.get('s')) {
    dy += moveSpeed * deltaSeconds;
  }
  
  // Apply movement to game objects
  if (dx !== 0 || dy !== 0) {
    // Uncomment to see movement values
    // console.log(`Movement: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`);
  }
});

// Cleanup example (unsubscribe when done)
// gameLoopSubscription.unsubscribe();
// clickSubscription.unsubscribe();
// keydownSubscription.unsubscribe();
// gameLoop$.unsubscribe();

console.log('Example running. Press keys or click to see events.');
console.log('Use arrow keys or WASD to move.');
console.log('Press Space to jump.');
