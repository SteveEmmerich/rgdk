import P2Physics from './p2-physics'; // Adjust path as necessary
import { BodyOptions, PhysicsBody } from './physics.interface'; // Import interfaces from here
import * as p2 from 'p2';

describe('P2Physics', () => {
  let physics: P2Physics;

  beforeEach(() => {
    physics = new P2Physics();
    physics.init(); // Initializes the world
  });

  afterEach(() => {
    physics.destroy();
  });

  test('should initialize a p2.World', () => {
    // Accessing a private member for testing purposes, not ideal but pragmatic here.
    // Alternatively, check for side effects of world initialization if possible.
    expect((physics as any).world).toBeInstanceOf(p2.World);
  });

  test('addBody should add a p2.Body to the world', () => {
    const options: BodyOptions = {
      mass: 1,
      position: [0, 0],
    };
    const customBody = physics.addBody(options);
    const p2Body = physics.getp2Body(customBody.id);

    expect(p2Body).toBeInstanceOf(p2.Body);
    expect(p2Body?.mass).toBe(options.mass);
    // Check position array elements individually for p2.js internal array types
    expect(p2Body?.position[0]).toBe(options.position[0]);
    expect(p2Body?.position[1]).toBe(options.position[1]);
    expect((physics as any).world.bodies).toContain(p2Body);
  });

  test('removeBody should remove a p2.Body from the world', () => {
    const options: BodyOptions = { mass: 1, position: [0, 0] };
    const customBody = physics.addBody(options);
    const p2Body = physics.getp2Body(customBody.id)!; // Assume it exists

    expect((physics as any).world.bodies).toContain(p2Body);
    physics.removeBody(customBody);
    expect((physics as any).world.bodies).not.toContain(p2Body);
    expect(physics.getp2Body(customBody.id)).toBeUndefined();
  });

  test('update should step the physics world', () => {
    const world = (physics as any).world as p2.World;
    jest.spyOn(world, 'step');
    
    const deltaTime = 1 / 60; // Example delta time
    physics.update(deltaTime * 1000); // P2Physics expects ms

    expect(world.step).toHaveBeenCalledWith(deltaTime);
  });
  
  test('a dynamic body under gravity should fall', () => {
    const initialPosition: [number, number] = [0, 10]; // Start 10 meters up
    const options: BodyOptions = {
      mass: 1,
      position: initialPosition,
    };
    const customBody = physics.addBody(options);
    const p2Body = physics.getp2Body(customBody.id)!;

    // Add a simple shape for collision if needed, though gravity acts on CoM
    const boxShape = new p2.Box({ width: 1, height: 1 });
    p2Body.addShape(boxShape);

    // Simulate some time passing
    const simulationTimeSeconds = 1;
    const steps = 60; // 60 FPS
    const deltaTimeMs = (simulationTimeSeconds / steps) * 1000;

    for (let i = 0; i < steps; i++) {
      physics.update(deltaTimeMs);
    }

    // Position should have changed, specifically Y should decrease due to gravity
    expect(p2Body.position[1]).toBeLessThan(initialPosition[1]);
    // And X should remain the same if no horizontal forces
    expect(p2Body.position[0]).toBeCloseTo(initialPosition[0]); 
  });

  test('destroy should clear the world', () => {
    const options: BodyOptions = { mass: 1, position: [0, 0] };
    physics.addBody(options);
    
    const world = (physics as any).world as p2.World;
    jest.spyOn(world, 'clear');

    physics.destroy();

    expect(world.clear).toHaveBeenCalled();
    expect((physics as any).bodies.size).toBe(0);
  });
});
