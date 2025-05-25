export default interface RenderInterface {
  init(container: HTMLElement): void;
  render(entities: any[]): void;
  destroy(): void;
}
