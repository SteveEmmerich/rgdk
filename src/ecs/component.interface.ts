/**
 * Base interface for all components.
 * Components are pure data containers with no logic.
 */
export interface IComponent {
  // Marker interface - components can have any data properties
}

/**
 * Type helper to identify component types
 * Used for type-safe component retrieval and queries
 */
export type ComponentType<T extends IComponent> = new (...args: any[]) => T;
