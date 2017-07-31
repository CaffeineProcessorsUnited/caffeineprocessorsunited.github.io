define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ready(callback) {
        window.addEventListener("load", callback);
    }
    exports.ready = ready;
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(undefined, args);
    }
    exports.log = log;
    function error() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(undefined, args);
    }
    exports.error = error;
    function trace() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.trace.apply(undefined, args);
    }
    exports.trace = trace;
    function override(container, key) {
        var baseType = Object.getPrototypeOf(container);
        if (typeof baseType[key] !== "function") {
            throw new Error("Method " + key + " of " + container.constructor.name + " does not override any base class method");
        }
    }
    exports.override = override;
    function minmax(val, low, high) {
        return Math.min(Math.max(val, low), high);
    }
    exports.minmax = minmax;
    function nou(o) {
        return o === null || o === undefined;
    }
    exports.nou = nou;
    function range(from, to) {
        var r = [];
        while (from < to) {
            r.push(from++);
        }
        return r;
    }
    exports.range = range;
    function choose(objs) {
        return objs[Math.floor(objs.length * Math.random())];
    }
    exports.choose = choose;
    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    exports.random = random;
    function randomInt(min, max) {
        return Math.floor(random(min, max));
    }
    exports.randomInt = randomInt;
    function between(value, min, max) {
        return value >= min && value <= max;
    }
    exports.between = between;
    function direction(angle) {
        var deg = Phaser.Math.radToDeg(angle + Math.PI);
        if (deg >= 45 && deg <= 135) {
            return 0;
        }
        else if (deg >= 135 && deg <= 225) {
            return 1;
        }
        else if (deg >= 255 && deg <= 315) {
            return 2;
        }
        return 3;
    }
    exports.direction = direction;
});
