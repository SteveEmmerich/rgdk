/**
 * ECS Demo - Complete example showing Entity Component System usage
 * 
 * This example demonstrates:
 * - Creating entities with components
 * - Implementing systems with game logic
 * - Integrating ECS with the game loop
 * - Frame-rate independent movement
 * 
 * Note: This example imports from '../src/index' for development purposes.
 * When using RGDK as a published package, import from 'rgdk' instead.
 */

import {
  EntityManager,
  SystemManager,
  System,
  IComponent,
  IEntity,
  clock$,
  canvasRenderer,
  TextureUtils,
  ISprite
} from '../src/index';

// ===== COMPONENTS =====
// Components are pure data containers

class PositionComponent implements IComponent {
  constructor(public x: number, public y: number) {}
}

class VelocityComponent implements IComponent {
  constructor(public vx: number, public vy: number) {}
}

class RenderComponent implements IComponent {
  constructor(public sprite: ISprite) {}
}

class BoundsComponent implements IComponent {
  constructor(public width: number, public height: number) {}
}

// ===== SYSTEMS =====
// Systems contain game logic that operates on entities with specific components

/**
 * MovementSystem updates entity positions based on their velocities
 */
class MovementSystem extends System {
  constructor() {
    super();
    // Define which components this system requires
    this.requiredComponents = [PositionComponent, VelocityComponent];
  }

  protected process(entities: IEntity[], deltaTime: number): void {
    entities.forEach(entity => {
      const pos = entity.getComponent(PositionComponent);
      const vel = entity.getComponent(VelocityComponent);

      if (pos && vel) {
        // Frame-rate independent movement using deltaTime
        pos.x += vel.vx * (deltaTime / 1000);
        pos.y += vel.vy * (deltaTime / 1000);
      }
    });
  }
}

/**
 * BoundsSystem keeps entities within screen boundaries
 */
class BoundsSystem extends System {
  constructor(private screenWidth: number, private screenHeight: number) {
    super();
    this.requiredComponents = [PositionComponent, VelocityComponent, BoundsComponent];
  }

  protected process(entities: IEntity[], deltaTime: number): void {
    entities.forEach(entity => {
      const pos = entity.getComponent(PositionComponent);
      const vel = entity.getComponent(VelocityComponent);
      const bounds = entity.getComponent(BoundsComponent);

      if (pos && vel && bounds) {
        // Bounce off left/right edges
        if (pos.x - bounds.width / 2 <= 0 || pos.x + bounds.width / 2 >= this.screenWidth) {
          vel.vx *= -1;
          // Keep within bounds
          pos.x = Math.max(bounds.width / 2, Math.min(this.screenWidth - bounds.width / 2, pos.x));
        }

        // Bounce off top/bottom edges
        if (pos.y - bounds.height / 2 <= 0 || pos.y + bounds.height / 2 >= this.screenHeight) {
          vel.vy *= -1;
          // Keep within bounds
          pos.y = Math.max(bounds.height / 2, Math.min(this.screenHeight - bounds.height / 2, pos.y));
        }
      }
    });
  }
}

/**
 * RenderSystem synchronizes sprite positions with entity positions
 */
class RenderSystem extends System {
  constructor() {
    super();
    this.requiredComponents = [PositionComponent, RenderComponent];
  }

  protected process(entities: IEntity[], deltaTime: number): void {
    entities.forEach(entity => {
      const pos = entity.getComponent(PositionComponent);
      const render = entity.getComponent(RenderComponent);

      if (pos && render) {
        // Update sprite position to match entity position
        render.sprite.x = pos.x;
        render.sprite.y = pos.y;
      }
    });
  }
}

// ===== MAIN GAME SETUP =====

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const ENTITY_COUNT = 50;

// Initialize renderer
canvasRenderer.init({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0x2c3e50
});

// Create ECS managers
const entityManager = new EntityManager();
const systemManager = new SystemManager();

// Register systems (they will be executed in this order)
systemManager.registerSystem(new MovementSystem());
systemManager.registerSystem(new BoundsSystem(SCREEN_WIDTH, SCREEN_HEIGHT));
systemManager.registerSystem(new RenderSystem());

// Create entities with random properties
console.log(`Creating ${ENTITY_COUNT} entities...`);
for (let i = 0; i < ENTITY_COUNT; i++) {
  const entity = entityManager.createEntity();

  // Random position
  const x = Math.random() * SCREEN_WIDTH;
  const y = Math.random() * SCREEN_HEIGHT;

  // Random velocity
  const speed = 50 + Math.random() * 100;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  // Random color and size
  const hue = Math.floor(Math.random() * 360);
  const radius = 10 + Math.random() * 20;
  const color = `hsl(${hue}, 70%, 60%)`;

  // Create sprite
  const texture = TextureUtils.createCircle(radius, color, true);
  const sprite = canvasRenderer.createSprite({
    texture,
    x,
    y,
    anchor: { x: 0.5, y: 0.5 }
  });

  // Add components to entity
  entity.addComponent(new PositionComponent(x, y));
  entity.addComponent(new VelocityComponent(vx, vy));
  entity.addComponent(new RenderComponent(sprite));
  entity.addComponent(new BoundsComponent(radius * 2, radius * 2));
}

console.log(`Created ${entityManager.count} entities`);

// Add UI text (sprites are automatically managed by renderer)
const titleTexture = TextureUtils.createText('RGDK ECS Demo', 32, '#ecf0f1');
canvasRenderer.createSprite({
  texture: titleTexture,
  x: SCREEN_WIDTH / 2,
  y: 30,
  anchor: { x: 0.5, y: 0.5 }
});

const infoTexture = TextureUtils.createText(`${ENTITY_COUNT} bouncing entities`, 16, '#95a5a6');
canvasRenderer.createSprite({
  texture: infoTexture,
  x: SCREEN_WIDTH / 2,
  y: 60,
  anchor: { x: 0.5, y: 0.5 }
});

// Game loop: integrate ECS with the reactive clock
let frameCount = 0;
clock$.subscribe((frame) => {
  frameCount++;

  // Update all systems with all entities
  const entities = entityManager.getAllEntities();
  systemManager.update(entities, frame.deltaTime);

  // Render
  canvasRenderer.render();

  // Log stats every 60 frames
  if (frameCount % 60 === 0) {
    console.log(`Frame ${frameCount}: ${entityManager.count} entities, ${frame.deltaTime.toFixed(2)}ms delta`);
  }
});

console.log('ECS Demo running! Watch the entities bounce around the screen.');
