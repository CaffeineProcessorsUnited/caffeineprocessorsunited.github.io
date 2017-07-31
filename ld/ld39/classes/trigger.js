define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Trigger = (function () {
        function Trigger(gs, data) {
            var _this = this;
            this.onKeyDown = {};
            this.onKeyUp = {};
            this.onKeyPress = {};
            this.gs = gs;
            this.x = data.x;
            this.y = data.y;
            if (data.enter !== undefined && data.enter.length > 0) {
                this.onEnter = this.createMethod(data.enter);
            }
            else {
                this.onEnter = undefined;
            }
            if (data.exit !== undefined && data.exit.length > 0) {
                this.onExit = this.createMethod(data.exit);
            }
            else {
                this.onExit = undefined;
            }
            if (data.each !== undefined && data.each.length > 0) {
                this.onEach = this.createMethod(data.each);
            }
            else {
                this.onEach = undefined;
            }
            if (data.keydown !== undefined && typeof data.keydown === "object") {
                Object.keys(data.keydown).forEach(function (key) {
                    _this.onKeyDown[key.toLowerCase()] = _this.createMethod(data.keydown[key]);
                });
            }
            if (data.keyup !== undefined && typeof data.keyup === "object") {
                Object.keys(data.keyup).forEach(function (key) {
                    _this.onKeyUp[key.toLowerCase()] = _this.createMethod(data.keyup[key]);
                });
            }
            if (data.keypress !== undefined && typeof data.keypress === "object") {
                Object.keys(data.keypress).forEach(function (key) {
                    _this.onKeyPress[key.toLowerCase()] = _this.createMethod(data.keypress[key]);
                });
            }
            this.active = false;
        }
        Trigger.prototype.createMethod = function (action) {
            var _this = this;
            var s = action.indexOf(":");
            if (s >= 0) {
                var a = action.substr(0, s);
                var d_1 = action.substr(s + 1);
                switch (a) {
                    case "story":
                    default:
                        return function () {
                            _this.gs.story(_this, d_1);
                        };
                    case "play":
                        return function () {
                            _this.gs.play(_this, d_1);
                        };
                    case "stop":
                        return function () {
                            _this.gs.stop(_this, d_1);
                        };
                }
            }
            return function () {
                _this.gs.story(_this, action);
            };
        };
        Trigger.prototype.exit = function () {
            this.active = false;
            return (this.onExit !== undefined) ? this.onExit() : false;
        };
        Trigger.prototype.enter = function () {
            this.active = true;
            return (this.onEnter !== undefined) ? this.onEnter() : false;
        };
        Trigger.prototype.each = function () {
            return (this.onEach !== undefined) ? this.onEach() : false;
        };
        Trigger.prototype.test = function (x, y) {
            return this.x === x && this.y === y;
        };
        Trigger.prototype.trigger = function (action, data) {
            switch (action) {
                case "enter":
                    if (this.test(data.x, data.y) && this.active !== true) {
                        return this.enter();
                    }
                    break;
                case "exit":
                    if (!this.test(data.x, data.y) && this.active === true) {
                        return this.exit();
                    }
                    break;
                case "each":
                    if (this.test(data.x, data.y) && this.active === true) {
                        return this.each();
                    }
                    break;
                case "keydown":
                    if (this.test(data.x, data.y) && this.onKeyDown.hasOwnProperty(data.keyCode)) {
                        return (this.onKeyDown[data.keyCode] !== undefined) ? this.onKeyDown[data.keyCode]() : false;
                    }
                    break;
                case "keyup":
                    if (this.test(data.x, data.y) && this.onKeyUp.hasOwnProperty(data.keyCode)) {
                        return (this.onKeyUp[data.keyCode] !== undefined) ? this.onKeyUp[data.keyCode]() : false;
                    }
                    break;
                case "keypress":
                    if (this.test(data.x, data.y) && this.onKeyPress.hasOwnProperty(data.keyCode)) {
                        return (this.onKeyPress[data.keyCode] !== undefined) ? this.onKeyPress[data.keyCode]() : false;
                    }
                    break;
                default:
                    throw new Error("Invalid trigger action!");
            }
            return false;
        };
        return Trigger;
    }());
    exports.Trigger = Trigger;
});
