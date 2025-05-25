import { System, Entity } from 'ecsy';
import {
  PositionComponent,
  VelocityComponent,
  RenderableComponent,
  PixiSpriteComponent,
  PhysicsBodyComponent,
  GraphicsObjectComponent,
  GroundComponent,
  BunnyComponent,
} from './components';
import { P2Physics, BodyOptions, PhysicsBody } from '../physics';
import { PixiRenderer } from '../renderer';
import { Texture, Sprite, Graphics, DisplayObject } from 'pixi.js'; // Named imports
// import { DisplayObject } from 'pixi.js'; // Reverted explicit import
import * as p2 from 'p2'; // For p2 types and operations


const P2_METER_TO_PIXEL = 50; // Must be consistent with main.ts or centralized

export class PhysicsSystem extends System {
  // Define queries for entities this system operates on
  static queries = {
    // Entities that need physics body creation
    uninitializedBodies: {
      components: [PhysicsBodyComponent, PositionComponent],
      listen: { added: true } // Listen for newly added PhysicsBodyComponents
    },
    // Entities that have physics bodies and need their positions updated
    dynamicBodies: {
      components: [PhysicsBodyComponent, PositionComponent],
      // We might not need VelocityComponent if P2 directly updates positions
    },
  };

  // Dependencies injected via constructor or world.registerSystem options
  private physics!: P2Physics;
  private renderer!: PixiRenderer; // Needed for screen height for y-inversion

  // Initialize the system, typically called by world.registerSystem
  init(dependencies: { physics: P2Physics, renderer: PixiRenderer }) {
    this.physics = dependencies.physics;
    this.renderer = dependencies.renderer;
  }

  execute(delta: number, time: number): void {
    // Create physics bodies for newly added entities
    (this.queries.uninitializedBodies.added || []).forEach((entity: Entity) => {
      const pbc = entity.getMutableComponent(PhysicsBodyComponent)!;
      if (!pbc.bodyId) { // Check if bodyId is not already set
        const pos = entity.getComponent(PositionComponent)!;
        
        // Convert initial entity position (pixels) to P2 physics position (meters)
        const initialP2Position: [number, number] = [
            pos.x / P2_METER_TO_PIXEL,
            (this.renderer.app!.screen.height - pos.y) / P2_METER_TO_PIXEL // Invert Y and scale
        ];

        const bodyOptions: BodyOptions = {
          mass: pbc.mass,
          position: initialP2Position,
          // Assuming box shapes for now, dimensions from PhysicsBodyComponent
          // These dimensions should be in meters.
        };
        const physicsBody = this.physics.addBody(bodyOptions);
        
        // Add shape to the p2.Body (this was done in main.ts before)
        const p2BodyInstance = this.physics.getp2Body(physicsBody.id);
        if (p2BodyInstance) {
            const shape = new p2.Box({ width: pbc.width, height: pbc.height });
            p2BodyInstance.addShape(shape);
            if (pbc.isStatic) { // Make sure static bodies have 0 mass if not already set
                p2BodyInstance.type = p2.Body.STATIC;
                p2BodyInstance.mass = 0;
                p2BodyInstance.updateMassProperties();
            }
        }
        
        pbc.bodyId = physicsBody.id;
      }
    });

    // Update the physics world
    this.physics.update(delta);

    // Update entity positions from physics simulation
    this.queries.dynamicBodies.results.forEach((entity: Entity) => {
      const pbc = entity.getComponent(PhysicsBodyComponent)!;
      const pos = entity.getMutableComponent(PositionComponent)!;

      if (pbc.bodyId) {
        const p2Body = this.physics.getp2Body(pbc.bodyId);
        if (p2Body) {
          pos.x = p2Body.position[0] * P2_METER_TO_PIXEL;
          pos.y = this.renderer.app!.screen.height - (p2Body.position[1] * P2_METER_TO_PIXEL); // Invert Y
          // If you add an AngleComponent:
          // const angleComp = entity.getMutableComponent(AngleComponent);
          // if (angleComp) angleComp.angle = -p2Body.angle;
        }
      }
    });
  }
}

export class RenderSystem extends System {
  static queries = {
    renderables: {
      components: [PositionComponent, RenderableComponent],
      // Listen for changes to components that might affect rendering
      listen: {
        added: true,
        removed: true,
        changed: [PixiSpriteComponent, GraphicsObjectComponent] 
      }
    },
  };

  private renderer!: PixiRenderer;
  // Map to store PIXI display objects associated with entities
  private entitySpriteMap: Map<string | number, PIXI.DisplayObject> = new Map(); // Reverted to PIXI.DisplayObject

  init(dependencies: { renderer: PixiRenderer }) {
    this.renderer = dependencies.renderer;
    // Clear the stage if this system is re-initialized (optional)
    this.renderer.app!.stage.removeChildren(); 
  }

  execute(delta: number, time: number): void {
    const app = this.renderer.app!;

    // Handle added entities
    (this.queries.renderables.added || []).forEach((entity: Entity) => {
      this.createSpriteForEntity(entity);
    });

    // Handle removed entities
    (this.queries.renderables.removed || []).forEach((entity: Entity) => {
      this.removeSpriteForEntity(entity);
    });
    
    // Handle changed entities (e.g. texture change)
    // ecsy's changed query fires for the entity if any of its components in the query changed.
    // Or if a component listed in `listen.changed` changed.
    (this.queries.renderables.changed || []).forEach((entity: Entity) => {
        // If sprite component changed, we might need to update texture or other properties
        // For simplicity, we can remove and recreate, or implement more specific updates.
        this.removeSpriteForEntity(entity);
        this.createSpriteForEntity(entity);
    });


    // Update positions/rotations of existing sprites
    this.queries.renderables.results.forEach((entity: Entity) => {
      const displayObject = this.entitySpriteMap.get(entity.id);
      if (displayObject) {
        const pos = entity.getComponent(PositionComponent)!;
        displayObject.x = pos.x;
        displayObject.y = pos.y;

        // Assuming rotation is handled by physics and updated in PositionComponent or an AngleComponent
        // if (entity.hasComponent(AngleComponent)) {
        //   displayObject.rotation = entity.getComponent(AngleComponent)!.angle;
        // }
        
        // If it's a ground entity, ensure it's drawn correctly (e.g. width)
        if (entity.hasComponent(GroundComponent) && entity.hasComponent(GraphicsObjectComponent)) {
            const gfxComp = entity.getComponent(GraphicsObjectComponent)!;
            if (displayObject instanceof PIXI.Graphics) {
                // Potentially re-draw if properties changed, though current setup is static post-creation
                // For a ground box, its x,y from PositionComponent should be top-left.
                // The PixiRenderer's original ground rendering put it at the bottom.
                // The PhysicsSystem now calculates physics body positions correctly.
                // PositionComponent for ground should reflect its desired render position.
            }
        }
      } else {
        // This case might happen if an entity was added but not caught by .added query (race condition, or manual add)
        // Or if it was missed in the 'changed' logic above.
        this.createSpriteForEntity(entity);
      }
    });
  }

  private createSpriteForEntity(entity: Entity) {
    if (this.entitySpriteMap.has(entity.id)) return; // Already exists

    const pos = entity.getComponent(PositionComponent)!;
    let displayObject: DisplayObject | null = null; // Reverted to PIXI.DisplayObject

    if (entity.hasComponent(PixiSpriteComponent)) {
      const spriteComp = entity.getComponent(PixiSpriteComponent)!;
      const texture = Texture.from(spriteComp.texture); // Use named import
      const sprite = new Sprite(texture); // Use named import
      sprite.anchor.set(spriteComp.anchorX, spriteComp.anchorY);
      displayObject = sprite;
    } else if (entity.hasComponent(GraphicsObjectComponent)) {
      const gfxComp = entity.getComponent(GraphicsObjectComponent)!;
      const graphics = new Graphics(); // Use named import
      graphics.beginFill(gfxComp.color);
      if (gfxComp.type === 'box') {
        // For a box, position (x,y) is usually top-left.
        graphics.drawRect(0, 0, gfxComp.width, gfxComp.height);
      }
      // Add other shapes like circle if needed
      graphics.endFill();
      displayObject = graphics;
    }

    if (displayObject) {
      displayObject.x = pos.x;
      displayObject.y = pos.y;
      this.renderer.app!.stage.addChild(displayObject);
      this.entitySpriteMap.set(entity.id, displayObject);
    }
  }

  private removeSpriteForEntity(entity: Entity) {
    const displayObject = this.entitySpriteMap.get(entity.id);
    if (displayObject) {
      this.renderer.app!.stage.removeChild(displayObject);
      displayObject.destroy(); // Destroy PIXI object to free GPU resources
      this.entitySpriteMap.delete(entity.id);
    }
  }
}
