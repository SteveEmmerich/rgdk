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
  private entitiesCache: IEntity[] | null = null;
  private cacheInvalidated: boolean = true;

  /**
   * Create a new entity and add it to the manager
   * @returns The newly created entity
   */
  createEntity(): IEntity {
    const id = this.generateEntityId();
    const entity = new Entity(id);
    this.entities.set(id, entity);
    this.cacheInvalidated = true;
    return entity;
  }

  /**
   * Destroy an entity and remove it from the manager
   * Note: Does not automatically clean up component resources (e.g., sprites).
   * Users should manually clean up resources before destroying entities.
   * @param entity - The entity to destroy (can be entity object or ID string)
   */
  destroyEntity(entity: IEntity | string): void {
    const id = typeof entity === 'string' ? entity : entity.id;
    this.entities.delete(id);
    this.cacheInvalidated = true;
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
   * Note: This method caches the entity array for performance. The cache is
   * automatically invalidated when entities are added or removed.
   * @returns Array of all entities
   */
  getAllEntities(): IEntity[] {
    if (this.cacheInvalidated) {
      this.entitiesCache = Array.from(this.entities.values());
      this.cacheInvalidated = false;
    }
    return this.entitiesCache!;
  }

  /**
   * Query entities that have all specified components
   * @param componentTypes - Component types that entities must have
   * @returns Array of entities matching the query
   */
  query(...componentTypes: ComponentType<any>[]): IEntity[] {
    const result: IEntity[] = [];
    const entities = this.getAllEntities();
    
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      let matches = true;
      
      for (let j = 0; j < componentTypes.length; j++) {
        if (!entity.hasComponent(componentTypes[j])) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        result.push(entity);
      }
    }
    
    return result;
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
    this.cacheInvalidated = true;
  }

  /**
   * Generate a unique entity ID
   * @returns A unique string ID
   */
  private generateEntityId(): string {
    return `entity_${this.nextEntityId++}`;
  }
}
