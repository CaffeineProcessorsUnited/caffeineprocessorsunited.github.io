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
define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = (function (_super) {
        __extends(State, _super);
        function State(loader, fadeDuration) {
            var _this = _super.call(this) || this;
            _this._init = function () {
                var additionalParameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    additionalParameters[_i] = arguments[_i];
                }
            };
            _this._preload = function () {
            };
            _this._create = function () {
            };
            _this._update = function () {
            };
            _this._render = function () {
            };
            _this._resize = function (width, height) {
            };
            _this._substates = new Array();
            _this.loader = loader;
            _this.fadeDuration = fadeDuration || {
                "in": 0,
                "out": 0,
            };
            _this.running = false;
            return _this;
        }
        Object.defineProperty(State.prototype, "fadeDuration", {
            get: function () {
                return this._fadeDuration;
            },
            set: function (fadeDuration) {
                this._fadeDuration = fadeDuration;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.init = function () {
            var additionalParameters = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                additionalParameters[_i] = arguments[_i];
            }
            this._init.apply(this, additionalParameters);
            this._substates.forEach(function (state) {
                state.init.apply(state, additionalParameters);
            });
        };
        State.prototype.preload = function () {
            this._preload();
            this._substates.forEach(function (state) {
                state.preload();
            });
        };
        State.prototype.create = function () {
            var _this = this;
            this.fadeIn(function () {
                util_1.log("faded in");
                _this.running = true;
            });
            this._create();
            this._substates.forEach(function (state) {
                state.create();
            });
        };
        State.prototype.update = function () {
            if (!this.running) {
                util_1.log("not running");
                return;
            }
            this._update();
            this._substates.forEach(function (state) {
                state.update();
            });
        };
        State.prototype.render = function () {
            this._render();
            this._substates.forEach(function (state) {
                state.render();
            });
        };
        State.prototype.stateResize = function (width, height) {
            this._resize(width, height);
            this._substates.forEach(function (state) {
                state.stateResize(width, height);
            });
        };
        State.prototype.sub = function (substate) {
            this._substates.push(substate);
        };
        State.prototype.fadeIn = function (callback) {
            var _this = this;
            if (!!this.fadeDuration.in && this.fadeDuration.in > 0) {
                this.loader.game.camera.onFadeComplete.addOnce(function () {
                    _this.loader.game.camera.resetFX();
                    _this.loader.game.camera.onFlashComplete.addOnce(function () {
                        _this.loader.game.camera.resetFX();
                        callback();
                    }, _this);
                    _this.loader.game.camera.flash(0x000000, _this.fadeDuration.in);
                }, this);
                this.loader.game.camera.fade(0x000000, 1);
            }
            else {
                callback();
            }
        };
        State.prototype.fadeOut = function (callback) {
            var _this = this;
            if (!!this.fadeDuration.out && this.fadeDuration.out > 0) {
                this.loader.game.camera.resetFX();
                this.loader.game.camera.onFadeComplete.addOnce(function () {
                    _this.loader.game.camera.resetFX();
                    callback();
                }, this);
                this.loader.game.camera.fade(0x000000, this.fadeDuration.out);
            }
            else {
                util_1.log("fadeOut");
                callback();
            }
        };
        State.prototype.changeState = function (name) {
            var _this = this;
            var additionalParameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                additionalParameters[_i - 1] = arguments[_i];
            }
            this.fadeOut(function () {
                var args = [
                    name,
                    true,
                    false,
                ];
                if (!!additionalParameters) {
                    additionalParameters.forEach(function (param) {
                        args.push(param);
                    });
                }
                _this.loader.game.state.start.apply(_this.loader.game.state, args);
            });
        };
        return State;
    }(Phaser.State));
    exports.State = State;
});
