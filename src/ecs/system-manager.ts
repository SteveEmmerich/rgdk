import { ISystem } from './system.interface';
import { IEntity } from './entity.interface';

/**
 * SystemManager manages the execution of systems in the ECS architecture.
 * Systems are executed in the order they are registered.
 * 
 * TODO: Future Enhancement - Multi-Phase Update Cycles
 * When integrating physics (P2.js - see REQUIREMENTS.md §2), consider adding:
 * - fixedUpdate(entities, fixedDeltaTime): For physics simulation with fixed timestep
 * - lateUpdate(entities, deltaTime): For camera, UI, and post-processing logic
 * This will ensure physics stability and proper update ordering without breaking existing code.
 */
export class SystemManager {
  private systems: ISystem[] = [];

  /**
   * Register a system to be executed each frame
   * Systems are executed in the order they are registered
   * @param system - The system to register
   */
  registerSystem(system: ISystem): void {
    this.systems.push(system);
  }

  /**
   * Unregister a system
   * @param system - The system to unregister
   */
  unregisterSystem(system: ISystem): void {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      this.systems.splice(index, 1);
    }
  }

  /**
   * Update all registered systems
   * @param entities - Array of all entities
   * @param deltaTime - Time elapsed since last frame in milliseconds
   */
  update(entities: IEntity[], deltaTime: number): void {
    this.systems.forEach(system => system.update(entities, deltaTime));
  }

  /**
   * Get all registered systems
   * @returns Array of systems
   */
  getSystems(): ISystem[] {
    return [...this.systems];
  }

  /**
   * Clear all registered systems
   */
  clear(): void {
    this.systems = [];
  }
}
