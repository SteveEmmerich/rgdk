/**
 * Simple Clicker Example
 * 
 * This example demonstrates:
 * - Handling mouse click events
 * - Creating sprites dynamically
 * - Using TextureUtils for creating textures
 * - Rendering sprites
 */

import { clock$, click$, CanvasRenderer, TextureUtils } from 'rgdk';

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
});

const canvas = renderer.getView();
const ctx = canvas.getContext('2d')!;

// Create sprite textures with different colors using TextureUtils
const colors = ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
let colorIndex = 0;

// Instructions
ctx.font = '20px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';

// Handle clicks to spawn sprites
click$.subscribe((clickEvent: Event) => {
  const mouseEvent = clickEvent as MouseEvent;
  const rect = canvas.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  
  // Create a sprite at click position using TextureUtils
  const color = colors[colorIndex % colors.length];
  colorIndex++;
  const squareTexture = TextureUtils.createRect(50, 50, color);
  
  const sprite = renderer.createSprite({
    texture: squareTexture,
    x: x,
    y: y,
    anchor: { x: 0.5, y: 0.5 }
  });
  
  // Add some rotation for visual interest
  sprite.rotation = Math.random() * Math.PI * 2;
  
  console.log(`Sprite created at (${x}, ${y}) with color ${color}`);
});

// Game loop - render continuously
clock$.subscribe(() => {
  renderer.render();
  
  // Draw instructions
  ctx.fillText('Click anywhere to spawn sprites!', canvas.width / 2, 30);
});

console.log('Clicker example running! Click on the canvas to spawn sprites.');

