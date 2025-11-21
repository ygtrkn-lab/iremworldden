type PannellumViewer = {
  destroy?: () => void;
  loadScene?: (id: string, pitch?: number, yaw?: number, hfov?: number) => void;
  setYaw?: (yaw: number) => void;
  setPitch?: (pitch: number) => void;
};

type PannellumViewerFactory = (
  container: HTMLElement | string,
  config?: Record<string, unknown>,
  options?: Record<string, unknown>
) => PannellumViewer;

type PannellumFactory = {
  viewer: PannellumViewerFactory;
};

declare module "pannellum" {
  export type { PannellumViewer };
  export const viewer: PannellumViewerFactory;
  const pannellum: PannellumFactory;
  export default pannellum;
}

declare module "pannellum/build/pannellum" {
  export type { PannellumViewer } from "pannellum";
  const pannellum: PannellumFactory & { pannellum?: PannellumFactory };
  export default pannellum;
  export { pannellum };
}

declare global {
  interface Window {
    pannellum?: PannellumFactory;
  }
}

export {};
