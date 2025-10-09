/**
 * Movement Demo Example
 * 
 * This example demonstrates:
 * - Keyboard input handling
 * - Moving sprites with WASD or arrow keys
 * - Delta time for smooth movement
 * - Reactive input state management
 */

import { clock$, keydown$, keyup$, CanvasRenderer } from 'rgdk';
import { scan } from 'rxjs/operators';

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1a1a2e,
});

const canvas = renderer.getView();
const ctx = canvas.getContext('2d')!;

// Create a simple player sprite texture
function createPlayerSprite(size: number): HTMLCanvasElement {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size;
  tempCanvas.height = size;
  const tempCtx = tempCanvas.getContext('2d')!;
  
  // Draw a simple triangle
  tempCtx.fillStyle = '#00ff88';
  tempCtx.beginPath();
  tempCtx.moveTo(size / 2, 0);
  tempCtx.lineTo(size, size);
  tempCtx.lineTo(0, size);
  tempCtx.closePath();
  tempCtx.fill();
  
  return tempCanvas;
}

const playerTexture = createPlayerSprite(40);

// Create player sprite
const player = renderer.createSprite({
  texture: playerTexture,
  x: 400,
  y: 300,
  anchor: { x: 0.5, y: 0.5 }
});

// Track key states
interface KeyState {
  [key: string]: boolean;
}

const keyState$ = keydown$.pipe(
  scan((state: KeyState, event: Event) => {
    const keyEvent = event as KeyboardEvent;
    return { ...state, [keyEvent.key]: true };
  }, {} as KeyState)
);

keyup$.subscribe((event: Event) => {
  const keyEvent = event as KeyboardEvent;
  delete (keyState$ as any).value?.[keyEvent.key];
});

// Movement configuration
const MOVE_SPEED = 300; // pixels per second

// Track current key states
let currentKeys: KeyState = {};

keydown$.subscribe((event: Event) => {
  const keyEvent = event as KeyboardEvent;
  currentKeys[keyEvent.key] = true;
});

keyup$.subscribe((event: Event) => {
  const keyEvent = event as KeyboardEvent;
  delete currentKeys[keyEvent.key];
});

// Game loop
clock$.subscribe((frame) => {
  const deltaSeconds = frame.deltaTime / 1000;
  
  // Update player position based on keys
  let dx = 0;
  let dy = 0;
  
  // WASD or Arrow keys
  if (currentKeys['w'] || currentKeys['ArrowUp']) dy -= 1;
  if (currentKeys['s'] || currentKeys['ArrowDown']) dy += 1;
  if (currentKeys['a'] || currentKeys['ArrowLeft']) dx -= 1;
  if (currentKeys['d'] || currentKeys['ArrowRight']) dx += 1;
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;
  }
  
  // Apply movement
  player.x += dx * MOVE_SPEED * deltaSeconds;
  player.y += dy * MOVE_SPEED * deltaSeconds;
  
  // Keep player in bounds
  player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
  player.y = Math.max(20, Math.min(canvas.height - 20, player.y));
  
  // Render
  renderer.render();
  
  // Draw instructions
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Use WASD or Arrow Keys to move', canvas.width / 2, 30);
  
  // Draw position info
  ctx.font = '16px Arial';
  ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, canvas.width / 2, canvas.height - 20);
});

console.log('Movement demo running! Use WASD or arrow keys to move the triangle.');
