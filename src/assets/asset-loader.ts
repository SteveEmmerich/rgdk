import { Observable } from 'rxjs';
import { AssetManifest, LoadProgress, IAssetLoader } from './asset-loader.interface';

export class AssetLoader implements IAssetLoader {
  private cache: Map<string, any> = new Map();

  /**
   * Load assets from a manifest
   * @param manifest - Object containing asset paths organized by type
   * @returns Observable that emits loading progress
   */
  load(manifest: AssetManifest): Observable<LoadProgress> {
    return new Observable<LoadProgress>(subscriber => {
      const assets: Array<{ key: string; url: string; type: 'image' | 'audio' | 'data' }> = [];

      // Collect all assets to load
      if (manifest.images) {
        Object.entries(manifest.images).forEach(([key, url]) => {
          assets.push({ key, url, type: 'image' });
        });
      }
      if (manifest.audio) {
        Object.entries(manifest.audio).forEach(([key, url]) => {
          assets.push({ key, url, type: 'audio' });
        });
      }
      if (manifest.data) {
        Object.entries(manifest.data).forEach(([key, url]) => {
          assets.push({ key, url, type: 'data' });
        });
      }

      const total = assets.length;
      let loaded = 0;

      if (total === 0) {
        subscriber.next({ loaded: 0, total: 0, percentage: 100 });
        subscriber.complete();
        return;
      }

      // Load each asset
      const loadPromises = assets.map(asset => {
        // Check cache first
        if (this.cache.has(asset.key)) {
          loaded++;
          const progress: LoadProgress = {
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100),
            currentAsset: asset.key
          };
          subscriber.next(progress);
          return Promise.resolve();
        }

        return this.loadAsset(asset.key, asset.url, asset.type)
          .then(() => {
            loaded++;
            const progress: LoadProgress = {
              loaded,
              total,
              percentage: Math.round((loaded / total) * 100),
              currentAsset: asset.key
            };
            subscriber.next(progress);
          })
          .catch(error => {
            subscriber.error(new Error(`Failed to load asset '${asset.key}' from '${asset.url}': ${error.message}`));
          });
      });

      Promise.all(loadPromises)
        .then(() => {
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  }

  /**
   * Get a loaded asset from the cache
   * @param key - The asset key
   * @returns The cached asset or null if not found
   */
  get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  /**
   * Clear all cached assets
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Load a single asset
   */
  private loadAsset(key: string, url: string, type: 'image' | 'audio' | 'data'): Promise<void> {
    switch (type) {
      case 'image':
        return this.loadImage(key, url);
      case 'audio':
        return this.loadAudio(key, url);
      case 'data':
        return this.loadData(key, url);
      default:
        return Promise.reject(new Error(`Unknown asset type: ${type}`));
    }
  }

  /**
   * Load an image asset
   */
  private loadImage(key: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(key, img);
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image from ${url}`));
      };
      img.src = url;
    });
  }

  /**
   * Load an audio asset
   */
  private loadAudio(key: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.cache.set(key, audio);
        resolve();
      };
      audio.onerror = () => {
        reject(new Error(`Failed to load audio from ${url}`));
      };
      audio.src = url;
    });
  }

  /**
   * Load a data (JSON) asset
   */
  private loadData(key: string, url: string): Promise<void> {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        this.cache.set(key, data);
      });
  }
}

// Export a singleton instance
export const assetLoader = new AssetLoader();
