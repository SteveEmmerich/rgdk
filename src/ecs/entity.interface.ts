import { IComponent, ComponentType } from './component.interface';

/**
 * Interface for entities in the ECS system.
 * An entity is a container for components with a unique identifier.
 */
export interface IEntity {
  /**
   * Unique identifier for this entity
   */
  readonly id: string;

  /**
   * Add a component to this entity
   * @param component - The component instance to add
   */
  addComponent<T extends IComponent>(component: T): void;

  /**
   * Get a component from this entity
   * @param type - The component class/type to retrieve
   * @returns The component instance or null if not found
   */
  getComponent<T extends IComponent>(type: ComponentType<T>): T | null;

  /**
   * Check if this entity has a specific component
   * @param type - The component class/type to check
   * @returns true if the entity has the component, false otherwise
   */
  hasComponent(type: ComponentType<any>): boolean;

  /**
   * Remove a component from this entity
   * @param type - The component class/type to remove
   */
  removeComponent(type: ComponentType<any>): void;

  /**
   * Get all components attached to this entity
   * @returns Array of all component instances
   */
  getAllComponents(): IComponent[];
}
