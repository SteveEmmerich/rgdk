export interface RendererConfig {
  width: number;
  height: number;
  backgroundColor?: number;
  antialias?: boolean;
  parent?: HTMLElement;
}

export interface SpriteConfig {
  texture?: any;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  anchor?: { x: number; y: number };
}

export interface ISprite {
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

export interface IRenderer {
  init(config: RendererConfig): void;
  createSprite(config: SpriteConfig): ISprite;
  render(): void;
  destroy(): void;
  getView(): HTMLCanvasElement;
  resize(width: number, height: number): void;
}
