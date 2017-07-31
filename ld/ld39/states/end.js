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
    var EndState = (function (_super) {
        __extends(EndState, _super);
        function EndState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._init = function () {
                var additionalParameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    additionalParameters[_i] = arguments[_i];
                }
                sgl_1.log("END: init");
            };
            _this._preload = function () {
                sgl_1.log("END: preload");
            };
            _this._create = function () {
                sgl_1.log("END: create");
            };
            _this._update = function () {
                sgl_1.log("END: update");
            };
            _this._render = function () {
                sgl_1.log("END: render");
            };
            return _this;
        }
        return EndState;
    }(sgl_1.State));
    exports.EndState = EndState;
});
