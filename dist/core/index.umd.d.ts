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
export { FPS, default as FrameInterface, default as clock$, click$, keydown$, keyup$, keypressed$, touch$, AssetManifest, LoadProgress, IAssetLoader, AssetLoader, assetLoader, RendererConfig, SpriteConfig, ISprite, IRenderer, CanvasRenderer, canvasRenderer, SpriteManager, TextureUtils };
//# sourceMappingURL=index.umd.d.ts.map