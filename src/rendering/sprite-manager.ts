/**
 * Sprite Manager utility
 * Helps manage sprite lifecycle and batch operations
 */

import { ISprite } from './renderer.interface';

export class SpriteManager {
  private sprites: Set<ISprite> = new Set();

  /**
   * Add a sprite to the manager
   */
  add(sprite: ISprite): void {
    this.sprites.add(sprite);
  }

  /**
   * Remove a sprite from the manager
   */
  remove(sprite: ISprite): void {
    this.sprites.delete(sprite);
  }

  /**
   * Remove and destroy a sprite
   */
  destroy(sprite: ISprite): void {
    this.sprites.delete(sprite);
    sprite.destroy();
  }

  /**
   * Apply a function to all sprites
   */
  forEach(fn: (sprite: ISprite) => void): void {
    this.sprites.forEach(fn);
  }

  /**
   * Filter sprites
   */
  filter(predicate: (sprite: ISprite) => boolean): ISprite[] {
    const result: ISprite[] = [];
    this.sprites.forEach(sprite => {
      if (predicate(sprite)) {
        result.push(sprite);
      }
    });
    return result;
  }

  /**
   * Destroy all sprites
   */
  destroyAll(): void {
    this.sprites.forEach(sprite => sprite.destroy());
    this.sprites.clear();
  }

  /**
   * Get the number of sprites
   */
  get count(): number {
    return this.sprites.size;
  }

  /**
   * Get all sprites as an array
   */
  getAll(): ISprite[] {
    return Array.from(this.sprites);
  }
}
