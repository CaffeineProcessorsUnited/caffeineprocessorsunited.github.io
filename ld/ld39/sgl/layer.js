var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./sgl"], function (require, exports, sgl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LayerManager = (function () {
        function LayerManager(game) {
            this.layers = {};
            this.game = game;
            this.root = this.game.add.group();
        }
        LayerManager.prototype.add = function (key, layer, override) {
            if (override === void 0) { override = false; }
            if (this.layers.hasOwnProperty(key) && !override) {
                sgl_1.error("Layer with key \"" + key + "\" already exists");
                return false;
            }
            layer.zindex = Object.getOwnPropertyNames(this.layers).length;
            layer.manager = this;
            this.layers[key] = layer;
            this.root.add(layer);
            this.sortChildren();
            return true;
        };
        LayerManager.prototype.isLayer = function (key) {
            return this.layers.hasOwnProperty(key);
        };
        LayerManager.prototype.layer = function (key) {
            if (!this.isLayer(key)) {
                throw new Error("Invalid layer accessed!");
            }
            return this.layers[key];
        };
        LayerManager.prototype.zindex = function (key, z) {
            this.layer(key).zindex = z;
            this.sortChildren();
        };
        LayerManager.prototype.sort = function (keys, ascending) {
            var _this = this;
            if (ascending === void 0) { ascending = true; }
            var i = ascending ? 0 : keys.length;
            var changed = false;
            keys.forEach(function (key) {
                if (_this.isLayer(key)) {
                    changed = true;
                    _this.layer(key).zindex = i;
                    i += ascending ? 1 : -1;
                }
            });
            if (changed) {
                this.sortChildren();
                sgl_1.log("Sort children");
            }
        };
        LayerManager.prototype.sortChildren = function () {
            this.root.customSort(function (a, b) {
                if (a.zindex < b.zindex) {
                    return -1;
                }
                if (a.zindex > b.zindex) {
                    return 1;
                }
                return 0;
            }, this);
        };
        return LayerManager;
    }());
    exports.LayerManager = LayerManager;
    var Layer = (function (_super) {
        __extends(Layer, _super);
        function Layer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.refs = {};
            return _this;
        }
        Layer.prototype.addRef = function (key, child, silent, index) {
            this.refs[key] = this.add(child, silent, index);
        };
        Layer.prototype.ref = function (key) {
            if (!this.refs.hasOwnProperty(key)) {
                throw new Error("Invalid reference accessed!");
            }
            return this.refs[key];
        };
        return Layer;
    }(Phaser.Group));
    exports.Layer = Layer;
});
