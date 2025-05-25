import { World } from 'ecsy';
import { clock$, PixiRenderer, P2Physics } from './core';
import {
  PositionComponent,
  RenderableComponent,
  PixiSpriteComponent,
  PhysicsBodyComponent,
  GraphicsObjectComponent,
  GroundComponent,
  BunnyComponent,
  PhysicsSystem,
  RenderSystem,
} from './core/ecs'; // Assuming systems are also exported from core/ecs

const P2_METER_TO_PIXEL = 50; // Centralize or pass this to systems if they need it directly

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) {
    console.error('No game-container found in DOM.');
    return;
  }

  // 1. Initialize Renderer and Physics
  const pixiRenderer = new PixiRenderer();
  pixiRenderer.init(gameContainer);

  const p2Physics = new P2Physics();
  p2Physics.init(); // p2 world is created in constructor, init is for other setup

  // 2. Create ECS World
  const world = new World();

  // 3. Register Components
  world
    .registerComponent(PositionComponent)
    .registerComponent(RenderableComponent)
    .registerComponent(PixiSpriteComponent)
    .registerComponent(PhysicsBodyComponent)
    .registerComponent(GraphicsObjectComponent)
    .registerComponent(GroundComponent)
    .registerComponent(BunnyComponent);

  // 4. Register Systems and provide dependencies
  world
    .registerSystem(PhysicsSystem, { physics: p2Physics, renderer: pixiRenderer })
    .registerSystem(RenderSystem, { renderer: pixiRenderer });

  // 5. Create Entities
  // Ground Entity
  const screenWidth = pixiRenderer.app!.screen.width;
  const screenHeight = pixiRenderer.app!.screen.height;
  const groundHeightPixels = 100;

  world.createEntity('Ground')
    .addComponent(RenderableComponent)
    .addComponent(GroundComponent)
    .addComponent(PositionComponent, { x: 0, y: screenHeight - groundHeightPixels }) // Position for rendering (top-left)
    .addComponent(GraphicsObjectComponent, {
      type: 'box',
      width: screenWidth,
      height: groundHeightPixels,
      color: 0xCCCCCC,
    })
    .addComponent(PhysicsBodyComponent, {
      mass: 0, // Static
      isStatic: true,
      // Physics position is center of mass, rendering is top-left.
      // The PhysicsSystem will calculate the p2 body's position based on this PositionComponent.
      // Let the system handle the conversion.
      // For a static ground box, its physics position y would be (groundHeightPixels/2) / P2_METER_TO_PIXEL if origin is bottom.
      // Our P2Physics and PhysicsSystem handle y-inversion.
      // Initial PositionComponent y is screenHeight - groundHeightPixels.
      // The PhysicsSystem calculates initial P2 position using:
      // initialP2Position: [ pos.x / P2_METER_TO_PIXEL, (this.renderer.app!.screen.height - pos.y) / P2_METER_TO_PIXEL ]
      // For ground: x = 0, y = screenHeight - groundHeightPixels
      // p2_pos_x = 0 / 50 = 0
      // p2_pos_y = (screenHeight - (screenHeight - groundHeightPixels)) / 50 = groundHeightPixels / 50. This is the top edge in P2 coords.
      // The p2.Box is centered at its position. So this is correct if pbc.height is groundHeightPixels/P2_METER_TO_PIXEL
      width: screenWidth / P2_METER_TO_PIXEL, // Full screen width in meters
      height: groundHeightPixels / P2_METER_TO_PIXEL, // Ground height in meters
    });

  // Bunny Entity (Dynamic)
  world.createEntity('Bunny')
    .addComponent(RenderableComponent)
    .addComponent(BunnyComponent)
    .addComponent(PositionComponent, { x: screenWidth / 2, y: screenHeight / 2 - 100}) // Initial render position
    .addComponent(PixiSpriteComponent, { texture: 'https://pixijs.io/examples/examples/assets/bunny.png' })
    .addComponent(PhysicsBodyComponent, {
      mass: 1,
      isStatic: false,
      // Assuming the bunny is roughly 26x37 pixels from the image. Convert to meters.
      // These are for the physics shape.
      width: 26 / P2_METER_TO_PIXEL, 
      height: 37 / P2_METER_TO_PIXEL, 
    });


  // 6. Game Loop
  let lastTime = performance.now();
  const gameLoopSubscription = clock$.subscribe((frame) => { // frame from clock$ might be unused if delta is recalculated
    const currentTime = performance.now();
    const delta = currentTime - lastTime; // Calculate delta time in milliseconds
    lastTime = currentTime;

    // Execute all systems
    world.execute(delta, currentTime); // ECSY expects delta in milliseconds
  });

  // 7. Cleanup
  window.addEventListener('beforeunload', () => {
    gameLoopSubscription.unsubscribe();
    world.stop(); // Stop the ECS world
    p2Physics.destroy();
    pixiRenderer.destroy();
  });
});
