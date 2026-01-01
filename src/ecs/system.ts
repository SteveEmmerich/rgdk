import { ISystem } from './system.interface';
import { IEntity } from './entity.interface';
import { ComponentType } from './component.interface';

/**
 * Abstract base class for systems.
 * Systems implement game logic that operates on entities with specific components.
 */
export abstract class System implements ISystem {
  private enabled: boolean = true;
  protected requiredComponents: ComponentType<any>[] = [];

  /**
   * Update method called each frame
   * Filters entities by required components before processing
   * @param entities - Array of all entities
   * @param deltaTime - Time elapsed since last frame in milliseconds
   */
  update(entities: IEntity[], deltaTime: number): void {
    if (!this.enabled) return;

    const matchingEntities = this.filterEntities(entities);
    this.process(matchingEntities, deltaTime);
  }

  /**
   * Process entities that match the required components
   * Override this method in derived classes to implement system logic
   * @param entities - Filtered entities with required components
   * @param deltaTime - Time elapsed since last frame in milliseconds
   */
  protected abstract process(entities: IEntity[], deltaTime: number): void;

  /**
   * Filter entities by required components
   * @param entities - All entities to filter
   * @returns Entities that have all required components
   */
  protected filterEntities(entities: IEntity[]): IEntity[] {
    if (this.requiredComponents.length === 0) {
      return entities;
    }
    return entities.filter(entity =>
      this.requiredComponents.every(type => entity.hasComponent(type))
    );
  }

  /**
   * Enable this system
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable this system (it will not be updated)
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Check if this system is enabled
   * @returns true if enabled, false otherwise
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}
