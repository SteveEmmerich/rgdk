/**
 * Texture utilities for creating simple textures programmatically
 */

export class TextureUtils {
  /**
   * Create a solid colored rectangle texture
   */
  static createRect(width: number, height: number, color: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    return canvas;
  }

  /**
   * Create a circle texture
   */
  static createCircle(radius: number, color: string, filled: boolean = true): HTMLCanvasElement {
    const size = radius * 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    
    if (filled) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    
    return canvas;
  }

  /**
   * Create a gradient circle texture (useful for particles)
   */
  static createGradientCircle(radius: number, innerColor: string, outerColor: string = 'transparent'): HTMLCanvasElement {
    const size = radius * 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas;
  }

  /**
   * Create a text texture
   */
  static createText(text: string, fontSize: number = 24, color: string = 'white', fontFamily: string = 'Arial'): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    
    canvas.width = Math.ceil(metrics.width);
    canvas.height = fontSize * 1.5;
    
    // Redraw with proper size
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, canvas.height / 2);
    
    return canvas;
  }

  /**
   * Convert a color number (0xRRGGBB) to CSS color string
   */
  static colorToString(color: number): string {
    return '#' + color.toString(16).padStart(6, '0');
  }
}
