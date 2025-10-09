/**
 * Simple Clicker Example
 * 
 * This example demonstrates:
 * - Handling mouse click events
 * - Creating sprites dynamically
 * - Asset loading and management
 * - Rendering sprites
 */

import { clock$, click$, CanvasRenderer, assetLoader, AssetManifest } from 'rgdk';
import { withLatestFrom } from 'rxjs/operators';

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
});

const canvas = renderer.getView();
const ctx = canvas.getContext('2d')!;

// Simple colored square as a sprite texture
function createColoredSquare(size: number, color: string): HTMLCanvasElement {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = size;
  tempCanvas.height = size;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.fillStyle = color;
  tempCtx.fillRect(0, 0, size, size);
  return tempCanvas;
}

// Create a simple sprite texture
const squareTexture = createColoredSquare(50, '#00ff00');

// Instructions
ctx.font = '20px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';

// Handle clicks to spawn sprites
click$.pipe(
  withLatestFrom(clock$)
).subscribe(([clickEvent, frame]) => {
  const mouseEvent = clickEvent as MouseEvent;
  const rect = canvas.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  
  // Create a sprite at click position
  const sprite = renderer.createSprite({
    texture: squareTexture,
    x: x,
    y: y,
    anchor: { x: 0.5, y: 0.5 }
  });
  
  // Add some rotation for visual interest
  sprite.rotation = Math.random() * Math.PI * 2;
  
  console.log(`Sprite created at (${x}, ${y})`);
});

// Game loop - render continuously
clock$.subscribe(() => {
  renderer.render();
  
  // Draw instructions
  ctx.fillText('Click anywhere to spawn sprites!', canvas.width / 2, 30);
});

console.log('Clicker example running! Click on the canvas to spawn sprites.');
