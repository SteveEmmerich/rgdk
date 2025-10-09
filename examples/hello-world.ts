/**
 * Hello World Example
 * 
 * This example demonstrates:
 * - Creating a canvas renderer
 * - Using TextureUtils to create text sprites
 * - Basic setup with RGDK
 */

import { clock$, CanvasRenderer, TextureUtils } from 'rgdk';

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});

// Create a text texture and sprite
const textTexture = TextureUtils.createText('Hello, RGDK!', 48, '#ffffff');
const textSprite = renderer.createSprite({
  texture: textTexture,
  x: 400,
  y: 300,
  anchor: { x: 0.5, y: 0.5 }
});

// Subscribe to game loop
clock$.subscribe(() => {
  // Add a subtle floating animation
  textSprite.y = 300 + Math.sin(Date.now() / 1000) * 10;
  
  // Render the scene
  renderer.render();
});

console.log('Hello World example running! Check the canvas.');

