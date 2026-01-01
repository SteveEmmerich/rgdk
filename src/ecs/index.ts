/**
 * Entity Component System (ECS) module for RGDK
 * 
 * The ECS architecture provides a data-oriented approach to game development
 * where entities are composed of components (data) and systems (logic).
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
