import { IEntity } from './entity.interface';
import { IComponent, ComponentType } from './component.interface';

/**
 * Entity implementation for the ECS system.
 * Entities are containers for components and are identified by a unique ID.
 */
export class Entity implements IEntity {
  private components: Map<ComponentType<any>, IComponent> = new Map();
  readonly id: string;

  /**
   * Create a new entity with a unique ID
   * @param id - Unique identifier for this entity
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Add a component to this entity
   * Note: Adding a component of the same type multiple times will replace the previous component.
   * @param component - The component instance to add
   */
  addComponent<T extends IComponent>(component: T): void {
    const type = component.constructor as ComponentType<T>;
    if (this.components.has(type)) {
      console.warn(`Entity ${this.id}: Replacing existing component of type ${type.name}`);
    }
    this.components.set(type, component);
  }

  /**
   * Get a component from this entity
   * @param type - The component class/type to retrieve
   * @returns The component instance or null if not found
   */
  getComponent<T extends IComponent>(type: ComponentType<T>): T | null {
    return (this.components.get(type) as T) || null;
  }

  /**
   * Check if this entity has a specific component
   * @param type - The component class/type to check
   * @returns true if the entity has the component, false otherwise
   */
  hasComponent(type: ComponentType<any>): boolean {
    return this.components.has(type);
  }

  /**
   * Remove a component from this entity
   * @param type - The component class/type to remove
   */
  removeComponent(type: ComponentType<any>): void {
    this.components.delete(type);
  }

  /**
   * Get all components attached to this entity
   * @returns Array of all component instances
   */
  getAllComponents(): IComponent[] {
    return Array.from(this.components.values());
  }
}
