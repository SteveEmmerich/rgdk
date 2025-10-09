import { RendererConfig, SpriteConfig, ISprite, IRenderer } from './renderer.interface';

/**
 * Canvas-based sprite implementation
 */
class CanvasSprite implements ISprite {
  public x: number = 0;
  public y: number = 0;
  public rotation: number = 0;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public visible: boolean = true;
  public alpha: number = 1;

  private texture: HTMLImageElement | HTMLCanvasElement | null = null;
  private width: number = 0;
  private height: number = 0;
  private anchorX: number = 0.5;
  private anchorY: number = 0.5;

  constructor(config: SpriteConfig) {
    if (config.texture) {
      this.texture = config.texture;
      this.width = config.width || (this.texture as any).width || 0;
      this.height = config.height || (this.texture as any).height || 0;
    }
    this.x = config.x || 0;
    this.y = config.y || 0;
    if (config.anchor) {
      this.anchorX = config.anchor.x;
      this.anchorY = config.anchor.y;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || !this.texture) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    const drawX = -this.width * this.anchorX;
    const drawY = -this.height * this.anchorY;

    ctx.drawImage(this.texture, drawX, drawY, this.width, this.height);
    ctx.restore();
  }

  destroy(): void {
    this.texture = null;
  }
}

/**
 * Canvas-based renderer implementation
 */
export class CanvasRenderer implements IRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private sprites: CanvasSprite[] = [];
  private backgroundColor: string = '#000000';

  /**
   * Initialize the renderer
   */
  init(config: RendererConfig): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get 2D context');
    }

    if (config.backgroundColor !== undefined) {
      this.backgroundColor = this.colorToHex(config.backgroundColor);
    }

    if (config.parent) {
      config.parent.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
  }

  /**
   * Create a sprite
   */
  createSprite(config: SpriteConfig): ISprite {
    const sprite = new CanvasSprite(config);
    this.sprites.push(sprite);
    return sprite;
  }

  /**
   * Render all sprites
   */
  render(): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render all sprites
    this.sprites.forEach(sprite => sprite.render(this.ctx!));
  }

  /**
   * Get the canvas element
   */
  getView(): HTMLCanvasElement {
    if (!this.canvas) {
      throw new Error('Renderer not initialized');
    }
    return this.canvas;
  }

  /**
   * Resize the canvas
   */
  resize(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /**
   * Destroy the renderer
   */
  destroy(): void {
    this.sprites.forEach(sprite => sprite.destroy());
    this.sprites = [];
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Convert a color number to hex string
   */
  private colorToHex(color: number): string {
    return '#' + color.toString(16).padStart(6, '0');
  }
}

// Export a singleton instance
export const canvasRenderer = new CanvasRenderer();
