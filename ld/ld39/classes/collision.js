define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Trigger = (function () {
        function Trigger(x, y, action) {
            this.x = x;
            this.y = y;
            this.action = action;
        }
        Trigger.prototype.trigger = function () {
            eval(this.action);
        };
        Trigger.prototype.test = function (x, y) {
            if (this.x == x && this.y == y) {
                this.trigger();
            }
        };
        return Trigger;
    }());
    exports.Trigger = Trigger;
});
