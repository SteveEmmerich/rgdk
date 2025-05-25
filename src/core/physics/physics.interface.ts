export interface BodyOptions {
  mass: number;
  position: [number, number];
  velocity?: [number, number];
  angle?: number;
  angularVelocity?: number;
  fixedRotation?: boolean;
  // Other common properties can be added here
}

export interface PhysicsBody {
  id: string | number; // Or some unique identifier
  // Add methods to get/set position, velocity, apply force, etc. if needed
  // For now, keeping it simple as the engine will manage bodies internally.
}

export default interface PhysicsInterface {
  init(): void;
  update(deltaTime: number): void;
  addBody(options: BodyOptions): PhysicsBody;
  removeBody(body: PhysicsBody): void;
  destroy(): void;
  // Add methods for constraints, collision events, etc. as needed
}
