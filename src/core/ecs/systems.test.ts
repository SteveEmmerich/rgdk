import { World, Entity } from 'ecsy';
import { PhysicsSystem, RenderSystem } from './systems';
import {
  PositionComponent,
  VelocityComponent,
  RenderableComponent,
  PixiSpriteComponent,
  PhysicsBodyComponent,
  GraphicsObjectComponent,
  GroundComponent,
} from './components';
import P2Physics from '../physics/p2-physics'; // Adjusted import - default import
import { BodyOptions, PhysicsBody as P2PhysicsBodyDef } from '../physics/physics.interface'; // Adjusted import - named interfaces
import PixiRenderer from '../renderer/pixi-renderer'; // Adjusted import - default import
import * as PIXI from 'pixi.js'; // For PIXI types
import * as P2 from 'p2'; // For P2 types, if needed for mocks

// Mock P2Physics
jest.mock('../physics/p2-physics');
// Mock PixiRenderer
jest.mock('../renderer/pixi-renderer');
// Mock PIXI.js itself as in pixi-renderer.test.ts
jest.mock('pixi.js', () => {
    const originalPixi = jest.requireActual('pixi.js');
    return {
        ...originalPixi,
        Application: jest.fn().mockImplementation(() => ({
            view: document.createElement('canvas'),
            stage: {
                addChild: jest.fn(),
                removeChild: jest.fn(),
                removeChildren: jest.fn(),
                children: [],
                destroy: jest.fn(),
            },
            screen: { width: 800, height: 600 },
            destroy: jest.fn(),
        })),
        Texture: { from: jest.fn().mockReturnValue({}) },
        Sprite: jest.fn().mockImplementation(() => ({
            anchor: { set: jest.fn() },
            destroy: jest.fn(),
            x: 0,
            y: 0,
            rotation: 0,
        })),
        Graphics: jest.fn().mockImplementation(() => ({
            beginFill: jest.fn().mockReturnThis(),
            drawRect: jest.fn().mockReturnThis(),
            endFill: jest.fn().mockReturnThis(),
            destroy: jest.fn(),
            x: 0,
            y: 0,
        })),
    };
});


const P2_METER_TO_PIXEL = 50;

describe('ECS Systems', () => {
  let world: World;
  let mockP2Physics: jest.Mocked<P2Physics>;
  let mockPixiRenderer: jest.Mocked<PixiRenderer>;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockP2Physics = new P2Physics() as jest.Mocked<P2Physics>;
    mockPixiRenderer = new PixiRenderer() as jest.Mocked<PixiRenderer>;
    
    // Mock screen dimensions needed by PhysicsSystem for coord conversion
    mockPixiRenderer.app = { screen: { width: 800, height: 600 } } as any;
    mockP2Physics.getp2Body = jest.fn();
    mockP2Physics.addBody = jest.fn().mockImplementation((options: BodyOptions) => {
        // Return a mock PhysicsBody with an ID
        return { id: `mock_body_${Math.random()}` };
    });


    world = new World()
      .registerComponent(PositionComponent)
      .registerComponent(VelocityComponent)
      .registerComponent(RenderableComponent)
      .registerComponent(PixiSpriteComponent)
      .registerComponent(PhysicsBodyComponent)
      .registerComponent(GraphicsObjectComponent)
      .registerComponent(GroundComponent)
      .registerSystem(PhysicsSystem, { physics: mockP2Physics, renderer: mockPixiRenderer })
      .registerSystem(RenderSystem, { renderer: mockPixiRenderer });
  });

  describe('PhysicsSystem', () => {
    test('should create a p2.Body for new entities with PhysicsBodyComponent', () => {
      const entity = world.createEntity()
        .addComponent(PositionComponent, { x: 100, y: 200 })
        .addComponent(PhysicsBodyComponent, { mass: 1, width: 1, height: 1 });
      
      world.execute(16, 0); // Run systems

      const pbc = entity.getComponent(PhysicsBodyComponent)!;
      expect(mockP2Physics.addBody).toHaveBeenCalledTimes(1);
      expect(pbc.bodyId).toBeDefined();
      
      // Check coordinate conversion (example)
      // pos.x = 100, pos.y = 200. Screen height = 600.
      // Expected P2 pos: x = 100/50 = 2, y = (600-200)/50 = 8
      const expectedP2Position: [number, number] = [
          100 / P2_METER_TO_PIXEL,
          (mockPixiRenderer.app!.screen.height - 200) / P2_METER_TO_PIXEL
      ];
      expect(mockP2Physics.addBody).toHaveBeenCalledWith(expect.objectContaining({
          position: expectedP2Position,
          mass: 1,
      }));
    });

    test('should update entity PositionComponent from p2.Body state', () => {
      const entity = world.createEntity()
        .addComponent(PositionComponent, { x: 0, y: 0 })
        .addComponent(PhysicsBodyComponent, { mass: 1, width: 1, height: 1 });
      
      world.execute(1, 0); // Initial run to create body
      const pbc = entity.getComponent(PhysicsBodyComponent)!;
      
      // Mock the physics body state update
      const mockP2BodyState = {
        position: [3, 7], // New position in P2 coordinates
        angle: 0.5,
      };
      (mockP2Physics.getp2Body as jest.Mock).mockReturnValue(mockP2BodyState);

      world.execute(16, 16); // Run systems again

      const pos = entity.getComponent(PositionComponent)!;
      // Expected render position: x = 3*50 = 150, y = 600 - (7*50) = 250
      expect(pos.x).toBe(mockP2BodyState.position[0] * P2_METER_TO_PIXEL);
      expect(pos.y).toBe(mockPixiRenderer.app!.screen.height - (mockP2BodyState.position[1] * P2_METER_TO_PIXEL));
      // expect(pos.angle).toBe(-mockP2BodyState.angle); // If you add AngleComponent
    });

    test('should call physics.update on execute', () => {
        world.execute(16,0);
        expect(mockP2Physics.update).toHaveBeenCalledWith(16);
    });
  });

  describe('RenderSystem', () => {
    let mockAppStage: { addChild: jest.Mock, removeChild: jest.Mock };

    beforeEach(() => {
        // Ensure we have a mocked stage for RenderSystem tests
        mockAppStage = {
            addChild: jest.fn(),
            removeChild: jest.fn(),
        };
        mockPixiRenderer.app = {
            stage: mockAppStage,
            screen: { width: 800, height: 600 }
        } as any;
    });
    
    test('should create a PIXI.Sprite for new sprite entities', () => {
      const entity = world.createEntity()
        .addComponent(PositionComponent, { x: 50, y: 60 })
        .addComponent(RenderableComponent)
        .addComponent(PixiSpriteComponent, { texture: 'dummy.png' });
      
      world.execute(16, 0); // Run systems

      expect(PIXI.Sprite).toHaveBeenCalledTimes(1);
      expect(mockPixiRenderer.app!.stage.addChild).toHaveBeenCalledTimes(1);
      const spriteInstance = (PIXI.Sprite as unknown as jest.Mock).mock.results[0].value;
      expect(spriteInstance.x).toBe(50);
      expect(spriteInstance.y).toBe(60);
    });

    test('should create a PIXI.Graphics for new graphics object entities', () => {
      world.createEntity()
        .addComponent(PositionComponent, { x: 10, y: 20 })
        .addComponent(RenderableComponent)
        .addComponent(GraphicsObjectComponent, { type: 'box', width: 30, height: 40, color: 0xff0000 });
      
      world.execute(16, 0);

      expect(PIXI.Graphics).toHaveBeenCalledTimes(1);
      expect(mockPixiRenderer.app!.stage.addChild).toHaveBeenCalledTimes(1);
      const graphicsInstance = (PIXI.Graphics as unknown as jest.Mock).mock.results[0].value;
      expect(graphicsInstance.x).toBe(10);
      expect(graphicsInstance.y).toBe(20);
      // Check if drawRect was called with correct dimensions (relative to its position)
      expect(graphicsInstance.drawRect).toHaveBeenCalledWith(0, 0, 30, 40);
      expect(graphicsInstance.beginFill).toHaveBeenCalledWith(0xff0000);
    });

    test('should update PIXI object position when PositionComponent changes', () => {
      const entity = world.createEntity()
        .addComponent(PositionComponent, { x: 0, y: 0 })
        .addComponent(RenderableComponent)
        .addComponent(PixiSpriteComponent, { texture: 'dummy.png' });
      
      world.execute(1, 0); // Initial creation
      const spriteInstance = (PIXI.Sprite as unknown as jest.Mock).mock.results[0].value;
      
      const pos = entity.getMutableComponent(PositionComponent)!;
      pos.x = 150;
      pos.y = 250;
      // Mark as changed if ecsy doesn't do it automatically for mutable get
      // entity.getComponent(PositionComponent, true); // true to indicate changed
      // For ecsy, direct modification of component data is tracked.

      world.execute(16, 16); // Run systems again
      
      expect(spriteInstance.x).toBe(150);
      expect(spriteInstance.y).toBe(250);
    });

    test('should remove PIXI object when entity is removed', () => {
      const entity = world.createEntity()
        .addComponent(PositionComponent)
        .addComponent(RenderableComponent)
        .addComponent(PixiSpriteComponent, { texture: 'dummy.png' });
      
      world.execute(1, 0); // Create and add sprite
      const spriteInstance = (PIXI.Sprite as unknown as jest.Mock).mock.results[0].value;
      
      entity.remove(); // Remove the entity
      world.execute(16, 16); // Run systems

      expect(mockPixiRenderer.app!.stage.removeChild).toHaveBeenCalledWith(spriteInstance);
      expect(spriteInstance.destroy).toHaveBeenCalled();
    });
  });
});
