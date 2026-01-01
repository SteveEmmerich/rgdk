import { Observable } from "rxjs";
declare const FPS = 60;
declare const click$: import("rxjs").Observable<Event>;
declare const keydown$: import("rxjs").Observable<Event>;
declare const keyup$: import("rxjs").Observable<Event>;
declare const keypressed$: import("rxjs").Observable<Event>;
declare const touch$: import("rxjs").Observable<[
    Event,
    Event,
    Event,
    Event
]>;
interface AssetManifest {
    images?: Record<string, string>;
    audio?: Record<string, string>;
    data?: Record<string, string>;
}
interface LoadProgress {
    loaded: number;
    total: number;
    percentage: number;
    currentAsset?: string;
}
interface IAssetLoader {
    load(manifest: AssetManifest): Observable<LoadProgress>;
    get<T>(key: string): T | null;
    clear(): void;
}
declare class AssetLoader implements IAssetLoader {
    private cache;
    /**
     * Load assets from a manifest
     * @param manifest - Object containing asset paths organized by type
     * @returns Observable that emits loading progress
     */
    load(manifest: AssetManifest): Observable<LoadProgress>;
    /**
     * Get a loaded asset from the cache
     * @param key - The asset key
     * @returns The cached asset or null if not found
     */
    get<T>(key: string): T | null;
    /**
     * Clear all cached assets
     */
    clear(): void;
    /**
     * Load a single asset
     */
    private loadAsset;
    /**
     * Load an image asset
     */
    private loadImage;
    /**
     * Load an audio asset
     */
    private loadAudio;
    /**
     * Load a data (JSON) asset
     */
    private loadData;
}
// Export a singleton instance
declare const assetLoader: AssetLoader;
interface RendererConfig {
    width: number;
    height: number;
    backgroundColor?: number;
    antialias?: boolean;
    parent?: HTMLElement;
}
interface SpriteConfig {
    texture?: any;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    anchor?: {
        x: number;
        y: number;
    };
}
interface ISprite {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    visible: boolean;
    alpha: number;
    destroy(): void;
    getNativeSprite?(): any;
}
interface IRenderer {
    init(config: RendererConfig): void;
    createSprite(config: SpriteConfig): ISprite;
    render(): void;
    destroy(): void;
    getView(): HTMLCanvasElement;
    resize(width: number, height: number): void;
}
/**
 * Canvas-based renderer implementation
 */
declare class CanvasRenderer implements IRenderer {
    private canvas;
    private ctx;
    private sprites;
    private backgroundColor;
    /**
     * Initialize the renderer
     */
    init(config: RendererConfig): void;
    /**
     * Create a sprite
     */
    createSprite(config: SpriteConfig): ISprite;
    /**
     * Render all sprites
     */
    render(): void;
    /**
     * Get the canvas element
     */
    getView(): HTMLCanvasElement;
    /**
     * Resize the canvas
     */
    resize(width: number, height: number): void;
    /**
     * Destroy the renderer
     */
    destroy(): void;
    /**
     * Convert a color number to hex string
     */
    private colorToHex;
}
// Export a singleton instance
declare const canvasRenderer: CanvasRenderer;
declare class SpriteManager {
    private sprites;
    /**
     * Add a sprite to the manager
     */
    add(sprite: ISprite): void;
    /**
     * Remove a sprite from the manager
     */
    remove(sprite: ISprite): void;
    /**
     * Remove and destroy a sprite
     */
    destroy(sprite: ISprite): void;
    /**
     * Apply a function to all sprites
     */
    forEach(fn: (sprite: ISprite) => void): void;
    /**
     * Filter sprites
     */
    filter(predicate: (sprite: ISprite) => boolean): ISprite[];
    /**
     * Destroy all sprites
     */
    destroyAll(): void;
    /**
     * Get the number of sprites
     */
    get count(): number;
    /**
     * Get all sprites as an array
     */
    getAll(): ISprite[];
}
/**
 * Texture utilities for creating simple textures programmatically
 */
declare class TextureUtils {
    /**
     * Create a solid colored rectangle texture
     */
    static createRect(width: number, height: number, color: string): HTMLCanvasElement;
    /**
     * Create a circle texture
     */
    static createCircle(radius: number, color: string, filled?: boolean): HTMLCanvasElement;
    /**
     * Create a gradient circle texture (useful for particles)
     */
    static createGradientCircle(radius: number, innerColor: string, outerColor?: string): HTMLCanvasElement;
    /**
     * Create a text texture
     */
    static createText(text: string, fontSize?: number, color?: string, fontFamily?: string): HTMLCanvasElement;
    /**
     * Convert a color number (0xRRGGBB) to CSS color string
     */
    static colorToString(color: number): string;
}
/**
 * Base interface for all components.
 * Components are pure data containers with no logic.
 */
interface IComponent {
}
/**
 * Type helper to identify component types
 * Used for type-safe component retrieval and queries
 */
type ComponentType<T extends IComponent> = new (...args: any[]) => T;
/**
 * Interface for entities in the ECS system.
 * An entity is a container for components with a unique identifier.
 */
interface IEntity {
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
/**
 * Entity implementation for the ECS system.
 * Entities are containers for components and are identified by a unique ID.
 */
declare class Entity implements IEntity {
    private components;
    readonly id: string;
    /**
     * Create a new entity with a unique ID
     * @param id - Unique identifier for this entity
     */
    constructor(id: string);
    /**
     * Add a component to this entity
     * Note: Adding a component of the same type multiple times will replace the previous component.
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
/**
 * EntityManager manages the lifecycle of entities in the ECS system.
 * Provides methods for creating, destroying, and querying entities.
 */
declare class EntityManager {
    private entities;
    private nextEntityId;
    private entitiesCache;
    private cacheInvalidated;
    /**
     * Create a new entity and add it to the manager
     * @returns The newly created entity
     */
    createEntity(): IEntity;
    /**
     * Destroy an entity and remove it from the manager
     * Note: Does not automatically clean up component resources (e.g., sprites).
     * Users should manually clean up resources before destroying entities.
     * @param entity - The entity to destroy (can be entity object or ID string)
     */
    destroyEntity(entity: IEntity | string): void;
    /**
     * Get an entity by its ID
     * @param id - The entity ID
     * @returns The entity or null if not found
     */
    getEntity(id: string): IEntity | null;
    /**
     * Get all entities managed by this manager
     * Note: This method caches the entity array for performance. The cache is
     * automatically invalidated when entities are added or removed.
     * @returns Array of all entities
     */
    getAllEntities(): IEntity[];
    /**
     * Query entities that have all specified components
     * @param componentTypes - Component types that entities must have
     * @returns Array of entities matching the query
     */
    query(...componentTypes: ComponentType<any>[]): IEntity[];
    /**
     * Get the total number of entities
     * @returns The entity count
     */
    get count(): number;
    /**
     * Destroy all entities
     */
    destroyAll(): void;
    /**
     * Generate a unique entity ID
     * @returns A unique string ID
     */
    private generateEntityId;
}
/**
 * Interface for systems in the ECS architecture.
 * Systems contain logic that operates on entities with specific components.
 */
interface ISystem {
    /**
     * Update method called each frame by the system manager
     * @param entities - Array of all entities in the world
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    update(entities: IEntity[], deltaTime: number): void;
}
/**
 * Abstract base class for systems.
 * Systems implement game logic that operates on entities with specific components.
 */
declare abstract class System implements ISystem {
    private enabled;
    protected requiredComponents: ComponentType<any>[];
    /**
     * Update method called each frame
     * Filters entities by required components before processing
     * @param entities - Array of all entities
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    update(entities: IEntity[], deltaTime: number): void;
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
    protected filterEntities(entities: IEntity[]): IEntity[];
    /**
     * Enable this system
     */
    enable(): void;
    /**
     * Disable this system (it will not be updated)
     */
    disable(): void;
    /**
     * Check if this system is enabled
     * @returns true if enabled, false otherwise
     */
    isEnabled(): boolean;
}
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
declare class SystemManager {
    private systems;
    /**
     * Register a system to be executed each frame
     * Systems are executed in the order they are registered
     * @param system - The system to register
     */
    registerSystem(system: ISystem): void;
    /**
     * Unregister a system
     * @param system - The system to unregister
     */
    unregisterSystem(system: ISystem): void;
    /**
     * Update all registered systems
     * @param entities - Array of all entities
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    update(entities: IEntity[], deltaTime: number): void;
    /**
     * Get all registered systems
     * @returns Array of systems
     */
    getSystems(): ISystem[];
    /**
     * Clear all registered systems
     */
    clear(): void;
}
export { FPS, default as FrameInterface, default as clock$, click$, keydown$, keyup$, keypressed$, touch$, AssetManifest, LoadProgress, IAssetLoader, AssetLoader, assetLoader, RendererConfig, SpriteConfig, ISprite, IRenderer, CanvasRenderer, canvasRenderer, SpriteManager, TextureUtils, IComponent, ComponentType, IEntity, Entity, EntityManager, ISystem, System, SystemManager };
//# sourceMappingURL=index.esm.d.ts.map