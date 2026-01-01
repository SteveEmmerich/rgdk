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

/**
 * Sprite Manager utility
 * Helps manage sprite lifecycle and batch operations
 */
var SpriteManager = /** @class */ (function () {
    function SpriteManager() {
        this.sprites = new Set();
    }
    /**
     * Add a sprite to the manager
     */
    SpriteManager.prototype.add = function (sprite) {
        this.sprites.add(sprite);
    };
    /**
     * Remove a sprite from the manager
     */
    SpriteManager.prototype.remove = function (sprite) {
        this.sprites.delete(sprite);
    };
    /**
     * Remove and destroy a sprite
     */
    SpriteManager.prototype.destroy = function (sprite) {
        this.sprites.delete(sprite);
        sprite.destroy();
    };
    /**
     * Apply a function to all sprites
     */
    SpriteManager.prototype.forEach = function (fn) {
        this.sprites.forEach(fn);
    };
    /**
     * Filter sprites
     */
    SpriteManager.prototype.filter = function (predicate) {
        var result = [];
        this.sprites.forEach(function (sprite) {
            if (predicate(sprite)) {
                result.push(sprite);
            }
        });
        return result;
    };
    /**
     * Destroy all sprites
     */
    SpriteManager.prototype.destroyAll = function () {
        this.sprites.forEach(function (sprite) { return sprite.destroy(); });
        this.sprites.clear();
    };
    Object.defineProperty(SpriteManager.prototype, "count", {
        /**
         * Get the number of sprites
         */
        get: function () {
            return this.sprites.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get all sprites as an array
     */
    SpriteManager.prototype.getAll = function () {
        return Array.from(this.sprites);
    };
    return SpriteManager;
}());

/**
 * Texture utilities for creating simple textures programmatically
 */
var TextureUtils = /** @class */ (function () {
    function TextureUtils() {
    }
    /**
     * Create a solid colored rectangle texture
     */
    TextureUtils.createRect = function (width, height, color) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        return canvas;
    };
    /**
     * Create a circle texture
     */
    TextureUtils.createCircle = function (radius, color, filled) {
        if (filled === void 0) { filled = true; }
        var size = radius * 2;
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        if (filled) {
            ctx.fillStyle = color;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        return canvas;
    };
    /**
     * Create a gradient circle texture (useful for particles)
     */
    TextureUtils.createGradientCircle = function (radius, innerColor, outerColor) {
        if (outerColor === void 0) { outerColor = 'transparent'; }
        var size = radius * 2;
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        gradient.addColorStop(0, innerColor);
        gradient.addColorStop(1, outerColor);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.fill();
        return canvas;
    };
    /**
     * Create a text texture
     */
    TextureUtils.createText = function (text, fontSize, color, fontFamily) {
        if (fontSize === void 0) { fontSize = 24; }
        if (color === void 0) { color = 'white'; }
        if (fontFamily === void 0) { fontFamily = 'Arial'; }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.font = fontSize + "px " + fontFamily;
        var metrics = ctx.measureText(text);
        canvas.width = Math.ceil(metrics.width);
        canvas.height = fontSize * 1.5;
        // Redraw with proper size
        ctx.font = fontSize + "px " + fontFamily;
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 0, canvas.height / 2);
        return canvas;
    };
    /**
     * Convert a color number (0xRRGGBB) to CSS color string
     */
    TextureUtils.colorToString = function (color) {
        return '#' + color.toString(16).padStart(6, '0');
    };
    return TextureUtils;
}());

/**
 * Entity implementation for the ECS system.
 * Entities are containers for components and are identified by a unique ID.
 */
var Entity = /** @class */ (function () {
    /**
     * Create a new entity with a unique ID
     * @param id - Unique identifier for this entity
     */
    function Entity(id) {
        this.components = new Map();
        this.id = id;
    }
    /**
     * Add a component to this entity
     * @param component - The component instance to add
     */
    Entity.prototype.addComponent = function (component) {
        var type = component.constructor;
        this.components.set(type, component);
    };
    /**
     * Get a component from this entity
     * @param type - The component class/type to retrieve
     * @returns The component instance or null if not found
     */
    Entity.prototype.getComponent = function (type) {
        return this.components.get(type) || null;
    };
    /**
     * Check if this entity has a specific component
     * @param type - The component class/type to check
     * @returns true if the entity has the component, false otherwise
     */
    Entity.prototype.hasComponent = function (type) {
        return this.components.has(type);
    };
    /**
     * Remove a component from this entity
     * @param type - The component class/type to remove
     */
    Entity.prototype.removeComponent = function (type) {
        this.components.delete(type);
    };
    /**
     * Get all components attached to this entity
     * @returns Array of all component instances
     */
    Entity.prototype.getAllComponents = function () {
        return Array.from(this.components.values());
    };
    return Entity;
}());

/**
 * EntityManager manages the lifecycle of entities in the ECS system.
 * Provides methods for creating, destroying, and querying entities.
 */
var EntityManager = /** @class */ (function () {
    function EntityManager() {
        this.entities = new Map();
        this.nextEntityId = 0;
    }
    /**
     * Create a new entity and add it to the manager
     * @returns The newly created entity
     */
    EntityManager.prototype.createEntity = function () {
        var id = this.generateEntityId();
        var entity = new Entity(id);
        this.entities.set(id, entity);
        return entity;
    };
    /**
     * Destroy an entity and remove it from the manager
     * @param entity - The entity to destroy (can be entity object or ID string)
     */
    EntityManager.prototype.destroyEntity = function (entity) {
        var id = typeof entity === 'string' ? entity : entity.id;
        this.entities.delete(id);
    };
    /**
     * Get an entity by its ID
     * @param id - The entity ID
     * @returns The entity or null if not found
     */
    EntityManager.prototype.getEntity = function (id) {
        return this.entities.get(id) || null;
    };
    /**
     * Get all entities managed by this manager
     * @returns Array of all entities
     */
    EntityManager.prototype.getAllEntities = function () {
        return Array.from(this.entities.values());
    };
    /**
     * Query entities that have all specified components
     * @param componentTypes - Component types that entities must have
     * @returns Array of entities matching the query
     */
    EntityManager.prototype.query = function () {
        var componentTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            componentTypes[_i] = arguments[_i];
        }
        return this.getAllEntities().filter(function (entity) {
            return componentTypes.every(function (type) { return entity.hasComponent(type); });
        });
    };
    Object.defineProperty(EntityManager.prototype, "count", {
        /**
         * Get the total number of entities
         * @returns The entity count
         */
        get: function () {
            return this.entities.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Destroy all entities
     */
    EntityManager.prototype.destroyAll = function () {
        this.entities.clear();
    };
    /**
     * Generate a unique entity ID
     * @returns A unique string ID
     */
    EntityManager.prototype.generateEntityId = function () {
        return "entity_" + this.nextEntityId++;
    };
    return EntityManager;
}());

/**
 * Abstract base class for systems.
 * Systems implement game logic that operates on entities with specific components.
 */
var System = /** @class */ (function () {
    function System() {
        this.enabled = true;
        this.requiredComponents = [];
    }
    /**
     * Update method called each frame
     * Filters entities by required components before processing
     * @param entities - Array of all entities
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    System.prototype.update = function (entities, deltaTime) {
        if (!this.enabled)
            return;
        var matchingEntities = this.filterEntities(entities);
        this.process(matchingEntities, deltaTime);
    };
    /**
     * Filter entities by required components
     * @param entities - All entities to filter
     * @returns Entities that have all required components
     */
    System.prototype.filterEntities = function (entities) {
        var _this = this;
        if (this.requiredComponents.length === 0) {
            return entities;
        }
        return entities.filter(function (entity) {
            return _this.requiredComponents.every(function (type) { return entity.hasComponent(type); });
        });
    };
    /**
     * Enable this system
     */
    System.prototype.enable = function () {
        this.enabled = true;
    };
    /**
     * Disable this system (it will not be updated)
     */
    System.prototype.disable = function () {
        this.enabled = false;
    };
    /**
     * Check if this system is enabled
     * @returns true if enabled, false otherwise
     */
    System.prototype.isEnabled = function () {
        return this.enabled;
    };
    return System;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 * SystemManager manages the execution of systems in the ECS architecture.
 * Systems are executed in the order they are registered.
 *
 * TODO: Future Enhancement - Multi-Phase Update Cycles
 * When integrating physics (P2.js - see REQUIREMENTS.md §2), consider adding:
 * - fixedUpdate(entities, fixedDeltaTime): For physics simulation with fixed timestep
 * - lateUpdate(entities, deltaTime): For camera, UI, and post-processing logic
 * This will ensure physics stability and proper update ordering without breaking existing code.
 */
var SystemManager = /** @class */ (function () {
    function SystemManager() {
        this.systems = [];
    }
    /**
     * Register a system to be executed each frame
     * Systems are executed in the order they are registered
     * @param system - The system to register
     */
    SystemManager.prototype.registerSystem = function (system) {
        this.systems.push(system);
    };
    /**
     * Unregister a system
     * @param system - The system to unregister
     */
    SystemManager.prototype.unregisterSystem = function (system) {
        var index = this.systems.indexOf(system);
        if (index !== -1) {
            this.systems.splice(index, 1);
        }
    };
    /**
     * Update all registered systems
     * @param entities - Array of all entities
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    SystemManager.prototype.update = function (entities, deltaTime) {
        this.systems.forEach(function (system) { return system.update(entities, deltaTime); });
    };
    /**
     * Get all registered systems
     * @returns Array of systems
     */
    SystemManager.prototype.getSystems = function () {
        return __spreadArrays(this.systems);
    };
    /**
     * Clear all registered systems
     */
    SystemManager.prototype.clear = function () {
        this.systems = [];
    };
    return SystemManager;
}());

exports.AssetLoader = AssetLoader;
exports.CanvasRenderer = CanvasRenderer;
exports.Entity = Entity;
exports.EntityManager = EntityManager;
exports.FPS = FPS;
exports.SpriteManager = SpriteManager;
exports.System = System;
exports.SystemManager = SystemManager;
exports.TextureUtils = TextureUtils;
exports.assetLoader = assetLoader;
exports.canvasRenderer = canvasRenderer;
exports.click$ = click$;
exports.clock$ = clock$1;
exports.keydown$ = keydown$;
exports.keypressed$ = keypressed$;
exports.keyup$ = keyup$;
exports.touch$ = touch$;
