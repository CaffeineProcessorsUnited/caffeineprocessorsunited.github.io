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
define(["require", "exports", "../sgl/sgl"], function (require, exports, sgl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BootState = (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._init = function () {
                var additionalParameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    additionalParameters[_i] = arguments[_i];
                }
                sgl_1.log("BOOT: init");
                window.addEventListener("resize", function () {
                    _this.loader.resize();
                });
                _this.loader.resize();
                window.document.getElementById("led1").style.fill = "MediumTurquoise";
                window.document.getElementById("led2").style.fill = "lime";
                window.document.getElementById("led3").style.animationDuration = "1s";
                window.document.getElementById("battery").className = "battery4";
            };
            _this._preload = function () {
                sgl_1.log("BOOT: preload");
            };
            _this._create = function () {
                sgl_1.log("BOOT: create");
                _this.changeState("menu");
            };
            _this._update = function () {
                sgl_1.log("BOOT: update");
            };
            _this._render = function () {
                sgl_1.log("BOOT: render");
            };
            return _this;
        }
        return BootState;
    }(sgl_1.State));
    exports.BootState = BootState;
});
