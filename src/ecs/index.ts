/**
 * Entity Component System (ECS) module for RGDK
 * 
 * The ECS architecture provides a data-oriented approach to game development
 * where entities are composed of components (data) and systems (logic).
 * 
 * ## Performance vs Immutability
 * 
 * This ECS implementation uses **direct mutation** of component data for optimal performance.
 * This is a deliberate design decision as ECS systems are performance-critical and run every frame.
 * 
 * While RGDK uses Immer for immutable state updates in other areas, the ECS follows traditional
 * ECS patterns where components are mutated directly. This provides:
 * - Better performance (no object cloning overhead)
 * - Lower memory pressure (no intermediate objects)
 * - Standard ECS semantics expected by game developers
 * 
 * **When to consider immutability:**
 * - Complex component state that needs history tracking
 * - Networked/multiplayer scenarios requiring state snapshots
 * - Debugging scenarios where you need to replay state changes
 * 
 * For such cases, you can wrap your component updates with Immer's `produce()`:
 * ```typescript
 * import { produce } from 'immer';
 * 
 * // Instead of direct mutation:
 * // position.x += velocity.vx * deltaTime;
 * 
 * // Use Immer for immutable updates:
 * const newPosition = produce(position, draft => {
 *   draft.x += velocity.vx * deltaTime;
 * });
 * entity.addComponent(newPosition);
 * ```
 * 
 * @example
 * ```typescript
 * import { EntityManager, SystemManager, clock$ } from 'rgdk';
 * 
 * // Create managers
 * const entityManager = new EntityManager();
 * const systemManager = new SystemManager();
 * 
 * // Create an entity with components
 * const entity = entityManager.createEntity();
 * entity.addComponent(new PositionComponent(0, 0));
 * entity.addComponent(new VelocityComponent(10, 5));
 * 
 * // Register systems
 * systemManager.registerSystem(new MovementSystem());
 * 
 * // Integrate with game loop
 * clock$.subscribe((frame) => {
 *   systemManager.update(entityManager.getAllEntities(), frame.deltaTime);
 * });
 * ```
 */

export * from './component.interface';
export * from './entity.interface';
export * from './entity';
export * from './entity-manager';
export * from './system.interface';
export * from './system';
export * from './system-manager';
