'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var produce = require('immer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var produce__default = /*#__PURE__*/_interopDefaultLegacy(produce);

var FPS = 60;

var initialState = {
    frameStartTime: performance.now(),
    deltaTime: 0,
};
var clock = rxjs.interval(1000 / FPS, rxjs.animationFrameScheduler);
var updateTime = produce__default['default'](function (draft, previousTime) {
    draft.frameStartTime = performance.now();
    draft.deltaTime = draft.frameStartTime - previousTime.frameStartTime;
});
var clock$1 = clock.pipe(operators.scan(function (previous) { return updateTime(initialState, previous); }, initialState));
/*
  scan((previous) => {
        const time = performance.now();
        return previous.merge({
          time,
          delta: time - previous.get('time')
        });
      }, state)
    );

const increment = produce((draft: Draft<State>, inc: number) => {
    // `x` can be modified here
    draft.x += inc
})
frameStartTime: Number;
  readonly deltaTime: Number;
 */

var click$ = rxjs.fromEvent(document, 'click');
var keydown$ = rxjs.fromEvent(document, 'keydown');
var keyup$ = rxjs.fromEvent(document, 'keyup');
var keypressed$ = rxjs.fromEvent(document, 'keypressed');
var touch$ = rxjs.combineLatest([
    rxjs.fromEvent(document, 'touchstart'),
    rxjs.fromEvent(document, 'touchmove'),
    rxjs.fromEvent(document, 'touchcancel'),
    rxjs.fromEvent(document, 'touchend'),
]);

var AssetLoader = /** @class */ (function () {
    function AssetLoader() {
        this.cache = new Map();
    }
    /**
     * Load assets from a manifest
     * @param manifest - Object containing asset paths organized by type
     * @returns Observable that emits loading progress
     */
    AssetLoader.prototype.load = function (manifest) {
        var _this = this;
        return new rxjs.Observable(function (subscriber) {
            var assets = [];
            // Collect all assets to load
            if (manifest.images) {
                Object.entries(manifest.images).forEach(function (_a) {
                    var key = _a[0], url = _a[1];
                    assets.push({ key: key, url: url, type: 'image' });
                });
            }
            if (manifest.audio) {
                Object.entries(manifest.audio).forEach(function (_a) {
                    var key = _a[0], url = _a[1];
                    assets.push({ key: key, url: url, type: 'audio' });
                });
            }
            if (manifest.data) {
                Object.entries(manifest.data).forEach(function (_a) {
                    var key = _a[0], url = _a[1];
                    assets.push({ key: key, url: url, type: 'data' });
                });
            }
            var total = assets.length;
            var loaded = 0;
            if (total === 0) {
                subscriber.next({ loaded: 0, total: 0, percentage: 100 });
                subscriber.complete();
                return;
            }
            // Load each asset
            var loadPromises = assets.map(function (asset) {
                // Check cache first
                if (_this.cache.has(asset.key)) {
                    loaded++;
                    var progress = {
                        loaded: loaded,
                        total: total,
                        percentage: Math.round((loaded / total) * 100),
                        currentAsset: asset.key
                    };
                    subscriber.next(progress);
                    return Promise.resolve();
                }
                return _this.loadAsset(asset.key, asset.url, asset.type)
                    .then(function () {
                    loaded++;
                    var progress = {
                        loaded: loaded,
                        total: total,
                        percentage: Math.round((loaded / total) * 100),
                        currentAsset: asset.key
                    };
                    subscriber.next(progress);
                })
                    .catch(function (error) {
                    subscriber.error(new Error("Failed to load asset '" + asset.key + "' from '" + asset.url + "': " + error.message));
                });
            });
            Promise.all(loadPromises)
                .then(function () {
                subscriber.complete();
            })
                .catch(function (error) {
                subscriber.error(error);
            });
        });
    };
    /**
     * Get a loaded asset from the cache
     * @param key - The asset key
     * @returns The cached asset or null if not found
     */
    AssetLoader.prototype.get = function (key) {
        return this.cache.get(key) || null;
    };
    /**
     * Clear all cached assets
     */
    AssetLoader.prototype.clear = function () {
        this.cache.clear();
    };
    /**
     * Load a single asset
     */
    AssetLoader.prototype.loadAsset = function (key, url, type) {
        switch (type) {
            case 'image':
                return this.loadImage(key, url);
            case 'audio':
                return this.loadAudio(key, url);
            case 'data':
                return this.loadData(key, url);
            default:
                return Promise.reject(new Error("Unknown asset type: " + type));
        }
    };
    /**
     * Load an image asset
     */
    AssetLoader.prototype.loadImage = function (key, url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                _this.cache.set(key, img);
                resolve();
            };
            img.onerror = function () {
                reject(new Error("Failed to load image from " + url));
            };
            img.src = url;
        });
    };
    /**
     * Load an audio asset
     */
    AssetLoader.prototype.loadAudio = function (key, url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var audio = new Audio();
            audio.oncanplaythrough = function () {
                _this.cache.set(key, audio);
                resolve();
            };
            audio.onerror = function () {
                reject(new Error("Failed to load audio from " + url));
            };
            audio.src = url;
        });
    };
    /**
     * Load a data (JSON) asset
     */
    AssetLoader.prototype.loadData = function (key, url) {
        var _this = this;
        return fetch(url)
            .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + response.status + ": " + response.statusText);
            }
            return response.json();
        })
            .then(function (data) {
            _this.cache.set(key, data);
        });
    };
    return AssetLoader;
}());
// Export a singleton instance
var assetLoader = new AssetLoader();

/**
 * Canvas-based sprite implementation
 */
var CanvasSprite = /** @class */ (function () {
    function CanvasSprite(config) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.visible = true;
        this.alpha = 1;
        this.texture = null;
        this.width = 0;
        this.height = 0;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        if (config.texture) {
            this.texture = config.texture;
            this.width = config.width || this.texture.width || 0;
            this.height = config.height || this.texture.height || 0;
        }
        this.x = config.x || 0;
        this.y = config.y || 0;
        if (config.anchor) {
            this.anchorX = config.anchor.x;
            this.anchorY = config.anchor.y;
        }
    }
    CanvasSprite.prototype.render = function (ctx) {
        if (!this.visible || !this.texture)
            return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scaleX, this.scaleY);
        var drawX = -this.width * this.anchorX;
        var drawY = -this.height * this.anchorY;
        ctx.drawImage(this.texture, drawX, drawY, this.width, this.height);
        ctx.restore();
    };
    CanvasSprite.prototype.destroy = function () {
        this.texture = null;
    };
    return CanvasSprite;
}());
/**
 * Canvas-based renderer implementation
 */
var CanvasRenderer = /** @class */ (function () {
    function CanvasRenderer() {
        this.canvas = null;
        this.ctx = null;
        this.sprites = [];
        this.backgroundColor = '#000000';
    }
    /**
     * Initialize the renderer
     */
    CanvasRenderer.prototype.init = function (config) {
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
        }
        else {
            document.body.appendChild(this.canvas);
        }
    };
    /**
     * Create a sprite
     */
    CanvasRenderer.prototype.createSprite = function (config) {
        var sprite = new CanvasSprite(config);
        this.sprites.push(sprite);
        return sprite;
    };
    /**
     * Render all sprites
     */
    CanvasRenderer.prototype.render = function () {
        var _this = this;
        if (!this.ctx || !this.canvas)
            return;
        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Render all sprites
        this.sprites.forEach(function (sprite) { return sprite.render(_this.ctx); });
    };
    /**
     * Get the canvas element
     */
    CanvasRenderer.prototype.getView = function () {
        if (!this.canvas) {
            throw new Error('Renderer not initialized');
        }
        return this.canvas;
    };
    /**
     * Resize the canvas
     */
    CanvasRenderer.prototype.resize = function (width, height) {
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    };
    /**
     * Destroy the renderer
     */
    CanvasRenderer.prototype.destroy = function () {
        this.sprites.forEach(function (sprite) { return sprite.destroy(); });
        this.sprites = [];
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
    };
    /**
     * Convert a color number to hex string
     */
    CanvasRenderer.prototype.colorToHex = function (color) {
        return '#' + color.toString(16).padStart(6, '0');
    };
    return CanvasRenderer;
}());
// Export a singleton instance
var canvasRenderer = new CanvasRenderer();

exports.AssetLoader = AssetLoader;
exports.CanvasRenderer = CanvasRenderer;
exports.FPS = FPS;
exports.assetLoader = assetLoader;
exports.canvasRenderer = canvasRenderer;
exports.click$ = click$;
exports.clock$ = clock$1;
exports.keydown$ = keydown$;
exports.keypressed$ = keypressed$;
exports.keyup$ = keyup$;
exports.touch$ = touch$;
