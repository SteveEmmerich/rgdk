import { IEntity } from './entity.interface';

/**
 * Interface for systems in the ECS architecture.
 * Systems contain logic that operates on entities with specific components.
 */
export interface ISystem {
  /**
   * Update method called each frame by the system manager
   * @param entities - Array of all entities in the world
   * @param deltaTime - Time elapsed since last frame in milliseconds
   */
  update(entities: IEntity[], deltaTime: number): void;
}
