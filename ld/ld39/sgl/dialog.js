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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dialog = (function (_super) {
        __extends(Dialog, _super);
        function Dialog(gameState, width, height, key) {
            var _this = _super.call(this, gameState.game, 0, 0, key) || this;
            _this.marginH = 5;
            _this.marginV = 5;
            _this.cameraMarginH = 10;
            _this.cameraMarginV = 10;
            _this.inBoundCheck = false;
            _this.gameState = gameState;
            _this.width = width;
            _this.height = height;
            _this.anchor.set(0.5);
            _this.textWidth = _this.width - _this.marginH * 2;
            _this.textHeight = _this.height - _this.marginV * 2;
            var style = {
                font: "16px Helvetica",
                fill: "#FAFAFA",
                wordWrap: false,
                align: "center",
                boundsAlignH: "center",
                boundsAlignV: "middle",
            };
            _this.text = _this.game.add.text(_this.marginH, _this.marginV, "Dummy content", style);
            _this.text.anchor.set(0.5);
            return _this;
        }
        Dialog.prototype.updatePosition = function () {
            this.width = this.text.width + this.marginH * 2;
            this.height = this.text.height + this.marginV * 2;
            this.text.position.x = this.x;
            this.text.position.y = this.y;
            this.keepInBounds();
        };
        Dialog.prototype.keepInBounds = function () {
            if (this.inBoundCheck) {
                return;
            }
            this.inBoundCheck = true;
            var update = false;
            var me = new Phaser.Rectangle(this.xCorner - this.cameraMarginH, this.yCorner - this.cameraMarginV, this.width + 2 * this.cameraMarginH, this.height + 2 * this.cameraMarginV);
            if (!this.game.camera.view.containsRect(me)) {
                if (me.x < this.game.camera.view.x) {
                    me.x = this.game.camera.view.x + this.cameraMarginH;
                    update = true;
                }
                else if (me.right > this.game.camera.view.right) {
                    me.x = this.game.camera.view.right - me.width + this.cameraMarginH;
                    update = true;
                }
                if (me.y < this.game.camera.view.y) {
                    me.y = this.game.camera.view.y + this.cameraMarginV;
                    update = true;
                }
                else if (me.bottom > this.game.camera.view.bottom) {
                    me.y = this.game.camera.view.bottom - me.height + this.cameraMarginV;
                    update = true;
                }
                if (update) {
                    this.x = me.x + this.width / 2;
                    this.y = me.y + this.height / 2;
                }
            }
            this.inBoundCheck = false;
        };
        Dialog.prototype.say = function (text) {
            this.text.setText(text, false);
            this.updatePosition();
        };
        Object.defineProperty(Dialog.prototype, "x", {
            get: function () {
                return this.position.x;
            },
            set: function (x) {
                this.position.x = x;
                this.text.position.x = this.marginH + x;
                this.updatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "xCorner", {
            get: function () {
                return this.position.x - this.width / 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "y", {
            get: function () {
                return this.position.y;
            },
            set: function (y) {
                this.position.y = y;
                this.text.position.y = this.marginV + y;
                this.updatePosition();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dialog.prototype, "yCorner", {
            get: function () {
                return this.position.y - this.height / 2;
            },
            enumerable: true,
            configurable: true
        });
        Dialog.prototype.setPosition = function (x, y) {
            this.inBoundCheck = true;
            this.x = x;
            this.y = y;
            this.inBoundCheck = false;
            this.updatePosition();
        };
        Dialog.prototype.setVisible = function (visible) {
            this.text.visible = visible;
            this.visible = visible;
        };
        Dialog.prototype.getVisible = function () {
            return this.visible;
        };
        Dialog.prototype.above = function (x, y, height) {
            height = height || this.gameState.map.tileHeight;
            this.setPosition(x, y - height);
        };
        Dialog.prototype.aboveTile = function (tile) {
            return this.above(tile.worldX + tile.centerX, tile.worldY + tile.centerY, tile.height);
        };
        Dialog.prototype.aboveTileXY = function (x, y) {
            return this.aboveTile(this.gameState.map.getTile(x, y));
        };
        return Dialog;
    }(Phaser.Sprite));
    exports.Dialog = Dialog;
});
