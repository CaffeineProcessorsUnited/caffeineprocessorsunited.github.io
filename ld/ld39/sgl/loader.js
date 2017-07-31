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
    var Loader = (function () {
        function Loader() {
            this._bootStateClass = (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._preload = function () {
                        if (_this.loader.validScaling()) {
                            _this.loader.game.scale.scaleMode = _this.loader.scaling;
                        }
                    };
                    _this._create = function () {
                    };
                    return _this;
                }
                return class_1;
            }(sgl_1.State));
            this._width = 200;
            this._height = 300;
            this._renderer = Phaser.AUTO;
            this._scaling = Phaser.ScaleManager.NO_SCALE;
        }
        Object.defineProperty(Loader.prototype, "game", {
            get: function () {
                if (this._game !== undefined) {
                    return this._game;
                }
                if (!this.validParent()) {
                    throw new Error("Invalid id enterd! Make sure the id is set and the element exists.");
                }
                if (!this.validWidth()) {
                    throw new Error("Invalid width enterd! Make sure the width is greater than zero.");
                }
                if (!this.validHeight()) {
                    throw new Error("Invalid height enterd! Make sure the height is greater than zero.");
                }
                if (!this.validRenderer()) {
                    throw new Error("Invalid renderer seleted!");
                }
                console.log("Create new game instace");
                this._game = new Phaser.Game(this._width, this.height, this.renderer, this._parent);
                if (this._game === undefined) {
                    throw new Error("Something went terribly wrong! Couldn't initialize game instance.");
                }
                this._bootState = new this._bootStateClass(this);
                return this._game;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "parent", {
            set: function (parent) {
                this._parent = parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "width", {
            set: function (width) {
                this._width = width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "height", {
            set: function (height) {
                this._height = height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "renderer", {
            set: function (renderer) {
                this._renderer = renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "scaling", {
            set: function (scaling) {
                this._scaling = scaling;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "ready", {
            get: function () {
                return this._game !== undefined;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.requireReady = function () {
            if (!this.ready) {
                throw new Error("Game was not initialized when a function required it to be!");
            }
        };
        Loader.prototype.addStates = function (states) {
            var _this = this;
            Object.getOwnPropertyNames(states).forEach(function (key) {
                _this.addState(key, states[key]);
            });
        };
        Loader.prototype.addState = function (key, state) {
            if (!this.ready) {
                this.game;
            }
            if (key === "boot") {
                this._bootState.sub(state);
                state = this._bootState;
            }
            this.game.state.add(key, state, false);
        };
        Loader.prototype.start = function () {
            if ((typeof this.game.state.states.boot) === "undefined") {
                console.log("Adding boot state");
                this.game.state.add("boot", this._bootState, false);
            }
            this.game.state.start("boot");
        };
        Loader.prototype.resize = function () {
            var screen = window.document.getElementById("screen").getBoundingClientRect();
            var gamediv = window.document.getElementById("game");
            gamediv.style.position = "absolute";
            gamediv.style.left = screen.left + "px";
            gamediv.style.top = screen.top + "px";
            gamediv.style.width = screen.width + "px";
            gamediv.style.height = screen.height + "px";
            sgl_1.log(screen.width, screen.height);
            this.game.scale.setGameSize(screen.width, screen.height);
            this.game.state.getCurrentState().stateResize(screen.width, screen.height);
            var battery = window.document.getElementById("battery");
            var laptopfront = window.document.getElementById("batpos").getBoundingClientRect();
            battery.style.left = laptopfront.left + laptopfront.width * 0.1 + "px";
            battery.style.top = laptopfront.top + laptopfront.height * 0.25 + "px";
            battery.style.width = laptopfront.width * 0.8 + "px";
            battery.style.height = laptopfront.height * 0.8 + "px";
        };
        Loader.prototype.validParent = function () {
            return this._parent !== undefined && this._parent !== "" && document.getElementById(this._parent) !== undefined;
        };
        Loader.prototype.validWidth = function () {
            return this._width !== undefined;
        };
        Loader.prototype.validHeight = function () {
            return this._height !== undefined;
        };
        Loader.prototype.validRenderer = function () {
            return this._renderer !== undefined && (this._renderer === Phaser.AUTO ||
                this._renderer === Phaser.CANVAS ||
                this._renderer === Phaser.WEBGL);
        };
        Loader.prototype.validScaling = function () {
            return this._scaling !== undefined && (this._scaling === Phaser.ScaleManager.EXACT_FIT ||
                this._scaling === Phaser.ScaleManager.NO_SCALE ||
                this._scaling === Phaser.ScaleManager.RESIZE ||
                this._scaling === Phaser.ScaleManager.SHOW_ALL ||
                this._scaling === Phaser.ScaleManager.USER_SCALE);
        };
        return Loader;
    }());
    exports.Loader = Loader;
});
