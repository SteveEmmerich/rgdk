import { IEntity } from './entity.interface';
import { Entity } from './entity';
import { ComponentType } from './component.interface';

/**
 * EntityManager manages the lifecycle of entities in the ECS system.
 * Provides methods for creating, destroying, and querying entities.
 */
export class EntityManager {
  private entities: Map<string, IEntity> = new Map();
  private nextEntityId: number = 0;

  /**
   * Create a new entity and add it to the manager
   * @returns The newly created entity
   */
  createEntity(): IEntity {
    const id = this.generateEntityId();
    const entity = new Entity(id);
    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Destroy an entity and remove it from the manager
   * @param entity - The entity to destroy (can be entity object or ID string)
   */
  destroyEntity(entity: IEntity | string): void {
    const id = typeof entity === 'string' ? entity : entity.id;
    this.entities.delete(id);
  }

  /**
   * Get an entity by its ID
   * @param id - The entity ID
   * @returns The entity or null if not found
   */
  getEntity(id: string): IEntity | null {
    return this.entities.get(id) || null;
  }

  /**
   * Get all entities managed by this manager
   * @returns Array of all entities
   */
  getAllEntities(): IEntity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Query entities that have all specified components
   * @param componentTypes - Component types that entities must have
   * @returns Array of entities matching the query
   */
  query(...componentTypes: ComponentType<any>[]): IEntity[] {
    return this.getAllEntities().filter(entity =>
      componentTypes.every(type => entity.hasComponent(type))
    );
  }

  /**
   * Get the total number of entities
   * @returns The entity count
   */
  get count(): number {
    return this.entities.size;
  }

  /**
   * Destroy all entities
   */
  destroyAll(): void {
    this.entities.clear();
  }

  /**
   * Generate a unique entity ID
   * @returns A unique string ID
   */
  private generateEntityId(): string {
    return `entity_${this.nextEntityId++}`;
  }
}
