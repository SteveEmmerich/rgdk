import { Observable } from 'rxjs';

export interface AssetManifest {
  images?: Record<string, string>;
  audio?: Record<string, string>;
  data?: Record<string, string>;
}

export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset?: string;
}

export interface IAssetLoader {
  load(manifest: AssetManifest): Observable<LoadProgress>;
  get<T>(key: string): T | null;
  clear(): void;
}
