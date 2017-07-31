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
    var MenuState = (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.ready = false;
            _this.booted = false;
            _this.keys = [];
            _this.margin = 20;
            _this.timePassed = 0;
            _this.wait = 5000;
            _this.debugCount = 0;
            _this.speed = { "0": 30, "1": 160, "2": 80 };
            _this.currentLine = 0;
            _this.currentActor = -1;
            _this.currentChar = 0;
            _this.currentText = "";
            _this.consoleText = [
                {
                    "0": _this.pre("~"),
                    "1": "cd ld39\n",
                },
                {
                    "0": _this.pre(),
                    "1": "ll\n",
                },
                {
                    "0": "total 42T\n" +
                        "drwx------   1 root    root 42T 1970 Jan 01 03:14 secrets\n" +
                        "-rw-r--r--   1 unicorn cpu  128 1970 Jan 01 13:37 README.md\n" +
                        "-rwxrwx---   1 unicorn cpu 117K 1970 Jan 01 04:20 ld39\n",
                    "1": "",
                },
                {
                    "0": _this.pre(),
                    "1": "./ld39\n",
                },
                {
                    "0": "Loading assets",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
                {
                    "0": "Charging batteries",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
                {
                    "0": "Applying energy saver",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
                {
                    "0": "Adjusting brightness",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
                {
                    "0": "Locking doors",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
                {
                    "0": "Spawning player",
                    "1": "",
                },
                _this.dot(),
                _this.dot(),
                _this.dot(),
                _this.ok(),
            ];
            _this._init = function () {
                var additionalParameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    additionalParameters[_i] = arguments[_i];
                }
            };
            _this._preload = function () {
                sgl_1.range(0, 8).forEach(function (i) {
                    _this.loader.game.load.audio("key" + i, "assets/audio/key" + i + ".ogg");
                });
                _this.loader.game.load.audio("drive", "assets/audio/drive.ogg");
            };
            _this._create = function () {
                _this.text = _this.loader.game.add.text(_this.margin, _this.margin, "", {
                    font: "16px monospace",
                    wordWrap: false,
                    wordWrapWidth: _this.loader.game.width - 2 * _this.margin,
                    fill: "#ffffff",
                    align: "left",
                    boundsAlignH: "left",
                    boundsAlignV: "top",
                });
                _this.text.lineSpacing = -4;
                sgl_1.range(0, 8).forEach(function (i) {
                    _this.keys.push(_this.game.add.audio("key" + i));
                    _this.keys[i].allowMultiple = true;
                });
                _this.drive = _this.game.add.audio("drive");
                _this.drive.play();
            };
            _this._update = function () {
                if (_this.ready) {
                    _this.drive.stop();
                    _this.changeState("game");
                }
                sgl_1.log(_this.debugCount, _this.currentText);
                _this.debugCount += _this.game.time.elapsedMS;
                if (!_this.booted && _this.timePassed >= _this.wait) {
                    _this.booted = true;
                    _this.timePassed = 0;
                }
                if (_this.booted && _this.currentActor >= 0 && _this.timePassed >= _this.speed[_this.currentActor]) {
                    _this.timePassed = 0;
                    if (_this.currentLine >= _this.consoleText.length) {
                        _this.ready = true;
                        return;
                    }
                    if (_this.currentChar < _this.consoleText[_this.currentLine][_this.currentActor].length) {
                        _this.currentText += _this.consoleText[_this.currentLine][_this.currentActor].charAt(_this.currentChar++);
                        _this.text.setText(_this.currentText);
                        if (_this.currentActor === 1) {
                            _this.keys[Math.floor(Math.random() * 8)].play();
                        }
                    }
                    else {
                        _this.currentChar = 0;
                        _this.currentActor = (_this.currentActor + 1) % 2;
                        if (_this.currentActor === 0) {
                            _this.currentLine++;
                            _this.currentActor = -1;
                        }
                    }
                }
                else if (_this.currentActor < 0 && _this.timePassed >= _this.speed[2]) {
                    _this.timePassed = 0;
                    _this.currentActor = 0;
                }
                _this.timePassed += _this.game.time.elapsedMS;
            };
            _this._render = function () {
                _this.game.debug.body(_this.text);
            };
            return _this;
        }
        MenuState.prototype.pre = function (path) {
            if (path === void 0) { path = "~/ld39"; }
            return "unicorn@cpu:" + path + " $ ";
        };
        MenuState.prototype.dot = function () {
            return {
                "0": ".",
                "1": "",
            };
        };
        MenuState.prototype.ok = function () {
            return {
                "0": "OK\n",
                "1": "",
            };
        };
        return MenuState;
    }(sgl_1.State));
    exports.MenuState = MenuState;
});
