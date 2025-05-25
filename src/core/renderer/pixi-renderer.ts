import { Application, DisplayObject, Texture, Sprite, Graphics } from 'pixi.js';
// import { DisplayObject } from 'pixi.js'; // Reverted explicit import
import RenderInterface from './render.interface';
// import { P2Physics } from '../physics'; // Commented out as it's not directly used for type info here

export default class PixiRenderer implements RenderInterface {
  public app: Application | null = null; // Made public for main.ts to access screen dimensions
  private stageObjects: Map<string | number, DisplayObject> = new Map(); // Reverted to PIXI.DisplayObject

  init(container: HTMLElement): void {
    this.app = new Application({
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    container.appendChild(this.app.view as unknown as Node);
  }

  render(entities: any[]): void {
    if (!this.app) {
      return;
    }

    // Remove all children from the stage for this simple example
    // In a real app, you'd want to update, add, or remove objects selectively.
    while(this.app.stage.children[0]) {
      this.app.stage.removeChild(this.app.stage.children[0]);
    }
    // Note: Clearing stageObjects map might be too aggressive if PIXI.DisplayObjects are expensive to recreate.
    // For this example, it's fine. A more optimized approach would update existing objects.
    this.stageObjects.clear(); 

    entities.forEach(entity => {
      let displayObject = this.stageObjects.get(entity.id);

      if (entity.type === 'sprite' && entity.texture) {
        // Create sprite if it doesn't exist
        if (!displayObject) {
          const texture = Texture.from(entity.texture);
          displayObject = new Sprite(texture);
          (displayObject as Sprite).anchor.set(0.5);
          this.app!.stage.addChild(displayObject);
          this.stageObjects.set(entity.id, displayObject);
        }
        
        // Apply physics state if available
        if (entity.physicsState) {
          displayObject.x = entity.physicsState.x;
          displayObject.y = entity.physicsState.y;
          displayObject.rotation = entity.physicsState.rotation;
        } else { // Fallback or non-physics positioning
            displayObject.x = this.app!.screen.width / 2; // Default position if no physics
            displayObject.y = this.app!.screen.height / 2;
        }

      } else if (entity.type === 'graphics' && entity.shape === 'box') {
        // Create graphics object if it doesn't exist
        if (!displayObject) {
          displayObject = new Graphics();
          // The ground's drawing relative to its own origin (0,0)
          (displayObject as Graphics).beginFill(0xCCCCCC);
          (displayObject as Graphics).drawRect(0, 0, entity.width, entity.height); // x, y are 0, 0 because position is set below
          (displayObject as Graphics).endFill();
          this.app!.stage.addChild(displayObject);
          this.stageObjects.set(entity.id, displayObject);
        }

        // Apply physics state or default positioning
        if (entity.physicsState) {
          // Graphics objects in PIXI have their origin at top-left by default.
          // If p2.Box shape is centered, and PIXI Graphics is not, adjustments might be needed
          // depending on how entity.width/height correspond to the physics shape.
          // For a ground box, usually position refers to the center in physics.
          // PIXI.Graphics position refers to its top-left corner.
          // So, to center the graphic based on physics center:
          // displayObject.x = entity.physicsState.x - entity.width / 2;
          // displayObject.y = entity.physicsState.y - entity.height / 2;
          // However, the current main.ts calculates ground physics position for its *center*.
          // And the renderer for ground sets its y position based on screen height.
          // Let's stick to the main.ts logic for ground positioning for now.
           displayObject.x = 0; // Ground spans full width
           displayObject.y = this.app!.screen.height - entity.height; // Position at bottom
        } else if (entity.id === 'ground') { // Fallback for ground
            displayObject.x = 0;
            displayObject.y = this.app!.screen.height - entity.height;
        }
        // Rotation for graphics objects also needs careful handling of pivot point if needed.
        // displayObject.rotation = entity.physicsState?.rotation || 0;
        // displayObject.pivot.set(entity.width / 2, entity.height / 2); // If rotation is around center
      }
    });
  }

  destroy(): void {
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true }); // Removed basePath
      this.app = null;
    }
  }
}
