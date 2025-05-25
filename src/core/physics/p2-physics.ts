import * as p2 from 'p2';
import PhysicsInterface, { BodyOptions, PhysicsBody } from './physics.interface';

// Helper to generate unique IDs for bodies
let nextBodyId = 0;

export default class P2Physics implements PhysicsInterface {
  private world: p2.World;
  private bodies: Map<string | number, p2.Body> = new Map();

  constructor() {
    this.world = new p2.World({
      gravity: [0, -9.82], // Standard gravity
    });
  }

  init(): void {
    // P2 world is already initialized in the constructor.
    // Additional setup can go here if needed.
  }

  update(deltaTime: number): void {
    // Make sure deltaTime is in seconds, as p2.World.step expects.
    // The clock currently provides deltaTime in milliseconds.
    this.world.step(deltaTime / 1000);
  }

  addBody(options: BodyOptions): PhysicsBody {
    const body = new p2.Body({
      mass: options.mass,
      position: options.position,
      velocity: options.velocity,
      angle: options.angle,
      angularVelocity: options.angularVelocity,
      fixedRotation: options.fixedRotation,
    });

    // A simple unique ID for the body
    const id = `body_${nextBodyId++}`;
    body.id = nextBodyId-1; // p2.Body has an id property, but we use our own map key

    this.world.addBody(body);
    this.bodies.set(id, body);

    return { id }; // Return our simplified PhysicsBody
  }

  removeBody(physicsBody: PhysicsBody): void {
    const body = this.bodies.get(physicsBody.id);
    if (body) {
      this.world.removeBody(body);
      this.bodies.delete(physicsBody.id);
    }
  }

  getBody(id: string | number): p2.Body | undefined {
    return this.bodies.get(id);
  }

  getp2Body(id: string | number): p2.Body | undefined { // Renamed to avoid conflict with a potential future getBody on PhysicsInterface
    return this.bodies.get(id);
  }

  destroy(): void {
    this.world.clear();
    this.bodies.clear();
  }
}
