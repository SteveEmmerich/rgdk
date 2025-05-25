import { Component, TagComponent, Types } from 'ecsy';
import { PhysicsBody } from '../physics'; // Re-using our existing interface

// --- General Purpose Components ---

export class PositionComponent extends Component<PositionComponent> {
  x!: number;
  y!: number;
}
PositionComponent.schema = {
  x: { type: Types.Number, default: 0 },
  y: { type: Types.Number, default: 0 },
};

export class VelocityComponent extends Component<VelocityComponent> {
  vx!: number;
  vy!: number;
}
VelocityComponent.schema = {
  vx: { type: Types.Number, default: 0 },
  vy: { type: Types.Number, default: 0 },
};

// --- Rendering Related Components ---

export class RenderableComponent extends TagComponent {}

export class PixiSpriteComponent extends Component<PixiSpriteComponent> {
  texture!: string; // Path or ID to the texture
  anchorX!: number;
  anchorY!: number;
  // Other PIXI specific properties like tint, scale etc. can be added here
}
PixiSpriteComponent.schema = {
  texture: { type: Types.String, default: '' },
  anchorX: { type: Types.Number, default: 0.5 },
  anchorY: { type: Types.Number, default: 0.5 },
};

export class GraphicsObjectComponent extends Component<GraphicsObjectComponent> {
  type!: 'box' | 'circle'; // etc.
  width!: number;
  height!: number;
  color!: number; // e.g., 0xCCCCCC
}
GraphicsObjectComponent.schema = {
    type: { type: Types.String, default: 'box' },
    width: { type: Types.Number, default: 100 },
    height: { type: Types.Number, default: 100 },
    color: { type: Types.Number, default: 0xCCCCCC },
};


// --- Physics Related Components ---

export class PhysicsBodyComponent extends Component<PhysicsBodyComponent> {
  // Store the ID returned by our P2Physics.addBody method
  bodyId!: string | number | null;
  // We can also store initial options here if systems are responsible for body creation
  mass!: number;
  width!: number; // For shape calculation, assuming box for now
  height!: number; // For shape calculation
  isStatic!: boolean;
  // Other physics properties like friction, restitution, etc.
}
PhysicsBodyComponent.schema = {
  bodyId: { type: Types.Ref, default: null }, // Using Ref for potential object or just ID
  mass: { type: Types.Number, default: 1 },
  width: { type: Types.Number, default: 1 }, // In physics units (meters)
  height: { type: Types.Number, default: 1 }, // In physics units (meters)
  isStatic: { type: Types.Boolean, default: false },
};

// --- Tag Components for specific entity types ---
export class GroundComponent extends TagComponent {}
export class BunnyComponent extends TagComponent {} // Example if we want specific logic for bunnies
