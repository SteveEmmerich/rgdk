/**
 * Hello World Example
 * 
 * This example demonstrates:
 * - Creating a canvas renderer
 * - Drawing text on the canvas
 * - Basic setup with RGDK
 */

import { clock$, CanvasRenderer } from 'rgdk';

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});

// Get canvas context for drawing text
const canvas = renderer.getView();
const ctx = canvas.getContext('2d')!;

// Set up text properties
ctx.font = '48px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Subscribe to game loop
clock$.subscribe(() => {
  // Render the scene
  renderer.render();
  
  // Draw "Hello, RGDK!" text
  ctx.fillText('Hello, RGDK!', canvas.width / 2, canvas.height / 2);
});

console.log('Hello World example running! Check the canvas.');
