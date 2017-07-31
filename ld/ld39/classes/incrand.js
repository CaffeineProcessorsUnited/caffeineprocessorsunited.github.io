define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IncRand = (function () {
        function IncRand(incPerSec, minDuration, maxDuration, stopped) {
            if (stopped === void 0) { stopped = false; }
            this.incPerSec = incPerSec;
            this.minDuration = minDuration;
            this.maxDuration = maxDuration;
            this.stopped = stopped;
            this.reset();
        }
        IncRand.prototype.reset = function (stopped) {
            if (stopped === void 0) { stopped = false; }
            this.start = Date.now();
            this.chance = 0;
            this.stopped = stopped;
        };
        IncRand.prototype.getRand = function () {
            if (this.stopped) {
                return false;
            }
            var now = Date.now();
            var delta = (now - this.start) / 1000;
            if (this.minDuration > delta) {
                return false;
            }
            else if (this.maxDuration < delta) {
                return true;
            }
            else {
                var deltaLast = (now - this.last) / 1000;
                this.last = now;
                this.chance = Math.min(this.chance + deltaLast * this.incPerSec, 1);
                return Math.random() < this.chance;
            }
        };
        return IncRand;
    }());
    exports.IncRand = IncRand;
});
