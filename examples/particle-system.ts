/**
 * Particle System Demo Example
 * 
 * This example demonstrates:
 * - Creating multiple sprites dynamically
 * - Particle physics simulation
 * - Using delta time for smooth animation
 * - Click to spawn particle bursts
 */

import { clock$, click$, CanvasRenderer, TextureUtils } from 'rgdk';

// Particle class
class Particle {
  constructor(sprite, vx, vy, life) {
    this.sprite = sprite;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
  }

  update(deltaSeconds) {
    // Apply velocity
    this.sprite.x += this.vx * deltaSeconds;
    this.sprite.y += this.vy * deltaSeconds;
    
    // Apply gravity
    this.vy += 500 * deltaSeconds;
    
    // Decrease life
    this.life -= deltaSeconds;
    
    // Fade out
    this.sprite.alpha = Math.max(0, this.life / this.maxLife);
    
    return this.life > 0;
  }
}

// Create and initialize the renderer
const renderer = new CanvasRenderer();
renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x0a0a0a,
});

const canvas = renderer.getView();
const ctx = canvas.getContext('2d')!;

const particleTexture = TextureUtils.createGradientCircle(10, '#ff8800');
const particles: Particle[] = [];

// Handle clicks to spawn particle bursts
click$.subscribe((event: Event) => {
  const clickEvent = event as MouseEvent;
  const rect = canvas.getBoundingClientRect();
  const x = clickEvent.clientX - rect.left;
  const y = clickEvent.clientY - rect.top;
  
  // Create a burst of particles
  const particleCount = 30;
  const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#ff00ff'];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 100 + Math.random() * 200;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 200; // Add upward velocity
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const texture = TextureUtils.createGradientCircle(8, color);
    
    const sprite = renderer.createSprite({
      texture: texture,
      x: x,
      y: y,
      anchor: { x: 0.5, y: 0.5 }
    });
    
    particles.push(new Particle(sprite, vx, vy, 2 + Math.random()));
  }
  
  console.log(`Particle burst at (${x}, ${y}) - Total particles: ${particles.length}`);
});

// Game loop
clock$.subscribe((frame) => {
  const deltaSeconds = frame.deltaTime / 1000;
  
  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const alive = particles[i].update(deltaSeconds);
    if (!alive) {
      particles[i].sprite.destroy();
      particles.splice(i, 1);
    }
  }
  
  // Render
  renderer.render();
  
  // Draw instructions
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Click to create particle bursts!', canvas.width / 2, 40);
  
  // Draw particle count
  ctx.font = '16px Arial';
  ctx.fillText(`Active particles: ${particles.length}`, canvas.width / 2, canvas.height - 20);
});

console.log('Particle system demo running! Click to create particle bursts.');
