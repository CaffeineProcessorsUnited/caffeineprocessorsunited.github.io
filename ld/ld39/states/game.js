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
define(["require", "exports", "../sgl/sgl", "../classes/trigger", "../classes/ai", "../sgl/util", "../classes/simulator", "../classes/pathfinder"], function (require, exports, sgl_1, trigger_1, ai_1, util_1, simulator_1, pathfinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LEVEL;
    (function (LEVEL) {
        LEVEL[LEVEL["PARKINGLOT"] = 0] = "PARKINGLOT";
        LEVEL[LEVEL["MENSA"] = 1] = "MENSA";
        LEVEL[LEVEL["LIBRARY"] = 2] = "LIBRARY";
        LEVEL[LEVEL["PCPOOL"] = 3] = "PCPOOL";
    })(LEVEL || (LEVEL = {}));
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.energyLossPerSecond = 0.5;
            _this.layers = {};
            _this.zoom = 1;
            _this.triggers = [];
            _this.unlockedLevel = [false, false, false];
            _this.walking = false;
            _this.sprinting = false;
            _this.hasKeys = false;
            _this._init = function (map) {
            };
            _this._preload = function () {
                _this.game.load.image("logo", "assets/logo.png");
                _this.game.load.image("dialog", "assets/dialog.png");
                _this.game.load.tilemap("tilemap", "assets/MapLib.json", null, Phaser.Tilemap.TILED_JSON);
                _this.game.load.image("tilesheet_city", "assets/tilesheet_city.png");
                _this.game.load.image("tilesheet_shooter", "assets/tilesheet_shooter.png");
                _this.game.load.image("tilesheet_indoor", "assets/tilesheet_indoor.png");
                _this.game.load.image("tilesheet_collision", "assets/tilesheet_collision.png");
                _this.game.load.image("tilesheet_custom", "assets/tilesheet_custom.png");
                _this.game.load.image("tilesheet_level", "assets/tilesheet_level.png");
                _this.game.load.image("tilesheet_road", "assets/tilesheet_road.png");
                _this.game.load.json("trigger", "assets/trigger.json");
                _this.game.load.audio("dark_mix", "assets/audio/dark_mix.ogg");
                util_1.range(0, 4).forEach(function (i) {
                    _this.loader.game.load.audio("car" + i, "assets/audio/car" + i + ".ogg");
                });
                util_1.range(0, 4).forEach(function (i) {
                    _this.loader.game.load.audio("snoring" + i, "assets/audio/snoring" + i + ".ogg");
                });
                util_1.range(0, 6).forEach(function (i) {
                    _this.loader.game.load.audio("walk" + i, "assets/audio/walk" + i + ".ogg");
                });
                util_1.range(0, 2).forEach(function (i) {
                    _this.loader.game.load.audio("run" + i, "assets/audio/run" + i + ".ogg");
                });
                util_1.range(0, 8).forEach(function (i) {
                    _this.loader.game.load.audio("piano" + i, "assets/audio/piano" + i + ".ogg");
                });
                util_1.range(0, 2).forEach(function (i) {
                    _this.loader.game.load.audio("club" + i, "assets/audio/club" + i + ".ogg");
                });
                _this.game.load.spritesheet("player", "assets/human/adventurer_tilesheet.png", 80, 110);
                _this.game.load.spritesheet("student0", "assets/human/female_tilesheet.png", 80, 110);
                _this.game.load.spritesheet("student1", "assets/human/player_tilesheet.png", 80, 110);
                _this.game.load.spritesheet("guard", "assets/human/soldier_tilesheet.png", 80, 110);
                _this.game.load.spritesheet("prof", "assets/human/zombie_tilesheet.png", 80, 110);
                util_1.range(0, 3).forEach(function (i) {
                    _this.loader.game.load.spritesheet("car" + i, "assets/car/car" + i + ".png", 144, 144);
                });
            };
            _this._create = function () {
                _this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                _this.game.physics.startSystem(Phaser.Physics.ARCADE);
                _this.setupTilemap();
                _this.loadTrigger(_this.game.cache.getJSON("trigger"));
                _this.setupInput();
                _this.cursors = _this.game.input.keyboard.createCursorKeys();
                _this.game.camera.follow(_this.ref("player", "player"), Phaser.Camera.FOLLOW_TOPDOWN);
                _this.currentTile = _this.map.getTileWorldXY(_this.ref("player", "player").position.x, _this.ref("player", "player").position.y);
                _this.lastTile = _this.currentTile;
                _this.simulator = new simulator_1.Simulator(_this);
                _this.simulator.spawn(ai_1.AIType.GUARD, ai_1.AIState.IDLE);
                _this.simulator.spawn(ai_1.AIType.SLEEPING, ai_1.AIState.IDLE, new Phaser.Point(12, 7));
                _this.simulator.spawn(ai_1.AIType.VEHICLE, ai_1.AIState.PARKING);
                setTimeout(function () {
                }, 5000);
                window.document.getElementById("led3").style.animationDuration = "4s";
                _this.game.forceSingleUpdate = true;
            };
            _this._update = function () {
                _this.currentTile = _this.getCurrentTile();
                _this.game.physics.arcade.collide(_this.ref("player", "player"), _this.layers["ground"]);
                if (!_this.sprinting) {
                    _this.game.physics.arcade.collide(_this.ref("player", "player"), _this.layers["collision"]);
                }
                _this.energyReserve -= _this.energyLossPerSecond * _this.game.time.elapsedMS / 1000.;
                var damping = 100;
                var max = 200;
                var rate = 80;
                if (_this.sprinting) {
                    max = 400;
                    rate = 100;
                }
                if (_this.ref("player", "player").body.velocity.x >= max) {
                    _this.ref("player", "player").body.velocity.x = max;
                }
                if (_this.ref("player", "player").body.velocity.y >= max) {
                    _this.ref("player", "player").body.velocity.y = max;
                }
                if (_this.ref("player", "player").body.velocity.x <= max * -1) {
                    _this.ref("player", "player").body.velocity.x = max * -1;
                }
                if (_this.ref("player", "player").body.velocity.y <= max * -1) {
                    _this.ref("player", "player").body.velocity.y = max * -1;
                }
                var walking = false;
                var animationPLayed = false;
                if (_this.cursors.up.isDown) {
                    _this.ref("player", "player").body.velocity.y -= rate;
                    _this.ref("player", "player").animations.play("up");
                    walking = true;
                    animationPLayed = true;
                }
                else if (_this.cursors.down.isDown) {
                    _this.ref("player", "player").body.velocity.y += rate;
                    _this.ref("player", "player").animations.play("down");
                    walking = true;
                    animationPLayed = true;
                }
                else {
                    if (_this.ref("player", "player").body.velocity.y >= damping) {
                        _this.ref("player", "player").body.velocity.y -= damping;
                    }
                    else if (_this.ref("player", "player").body.velocity.y <= damping * -1) {
                        _this.ref("player", "player").body.velocity.y += damping;
                    }
                    else {
                        _this.ref("player", "player").body.velocity.y = 0;
                    }
                }
                if (_this.cursors.left.isDown) {
                    _this.ref("player", "player").body.velocity.x -= rate;
                    if (!animationPLayed) {
                        _this.ref("player", "player").animations.play("left");
                    }
                    walking = true;
                }
                else if (_this.cursors.right.isDown) {
                    _this.ref("player", "player").body.velocity.x += rate;
                    if (!animationPLayed) {
                        _this.ref("player", "player").animations.play("right");
                    }
                    walking = true;
                }
                else {
                    if (_this.ref("player", "player").body.velocity.x >= damping) {
                        _this.ref("player", "player").body.velocity.x -= damping;
                    }
                    else if (_this.ref("player", "player").body.velocity.x <= damping * -1) {
                        _this.ref("player", "player").body.velocity.x += damping;
                    }
                    else {
                        _this.ref("player", "player").body.velocity.x = 0;
                    }
                }
                if (walking) {
                    if (!_this.walking) {
                        _this.walkSound(true);
                    }
                }
                else {
                    if (_this.walking) {
                        _this.walkSound(false);
                    }
                    _this.ref("player", "player").animations.stop();
                }
                _this.walking = walking;
                _this.trigger();
                _this.lastTile = _this.currentTile;
                _this.simulator.update();
                _this.game.debug.text("Energy remaining: " + _this.energyReserve, 30, 115);
                _this.game.debug.text("CurrentTile: x:" + _this.lastTile.x + ", y:" + _this.lastTile.y + ", layers:", 30, 135);
                var line = 155;
                _this.map.layers.forEach(function (_, lid) {
                    var tile = _this.map.getTile(_this.lastTile.x, _this.lastTile.y, lid);
                    if (tile != null) {
                        _this.game.debug.text("    id: " + tile.index + ", layer: " + tile.layer.name, 30, line);
                        line += 20;
                    }
                });
                var batled = window.document.getElementById("led2");
                if (_this.energyReserve <= 0) {
                    batled.style.fill = "#cccccc";
                    batled.style.animationDuration = "0s";
                    window.document.getElementById("led1").style.fill = "#cccccc";
                    window.document.getElementById("led3").style.fill = "#cccccc";
                    window.document.getElementById("led3").style.animationDuration = "0s";
                    window.document.getElementById("led4").style.fill = "#cccccc";
                    window.document.getElementById("led4").style.animationDuration = "0s";
                    _this.gameOver();
                }
                else if (_this.energyReserve < 10) {
                    batled.style.animationName = "blink-red";
                    batled.style.animationDuration = "1s";
                }
                else if (_this.energyReserve < 20) {
                    batled.style.fill = "orange";
                    batled.style.animationDuration = "0s";
                }
                else {
                    batled.style.fill = "lime";
                    batled.style.animationDuration = "0s";
                }
            };
            _this._render = function () {
            };
            _this._energyReserve = 30;
            return _this;
        }
        Object.defineProperty(GameState.prototype, "energyReserve", {
            get: function () {
                return this._energyReserve;
            },
            set: function (energyReserve) {
                this._energyReserve = energyReserve;
                this.updateBatteryIcon();
            },
            enumerable: true,
            configurable: true
        });
        GameState.prototype.setupTilemap = function () {
            var _this = this;
            this.map = this.game.add.tilemap("tilemap");
            this.map.addTilesetImage("Collision", "tilesheet_collision");
            this.map.addTilesetImage("Indoor", "tilesheet_indoor");
            this.map.addTilesetImage("City", "tilesheet_city");
            this.map.addTilesetImage("Shooter", "tilesheet_shooter");
            this.map.addTilesetImage("Custom", "tilesheet_custom");
            this.map.addTilesetImage("Level", "tilesheet_level");
            this.map.addTilesetImage("Road", "tilesheet_road");
            var _layers = [
                {
                    "name": "Collision",
                    "renderable": false,
                },
                {
                    "name": "Level",
                    "renderable": false,
                },
                {
                    "name": "Road",
                    "renderable": false,
                },
                {
                    "name": "Ground",
                    "renderable": false,
                },
                {
                    "name": "Glass",
                },
                {
                    "name": "Roadmarker",
                    "renderable": false,
                },
                {
                    "name": "Roadmarker2",
                },
                {
                    "name": "Environment",
                    "renderable": false,
                },
                {
                    "name": "Carpet",
                },
                {
                    "name": "Doors",
                },
                {
                    "name": "Tables",
                },
                {
                    "name": "Ontop",
                },
            ];
            _layers.forEach(function (layer) {
                var idx = layer.name.toLowerCase();
                var _layer = _this.map.createLayer(layer.name);
                if (_layer !== undefined) {
                    _this.layers[idx] = _layer;
                    _this.layers[idx].resizeWorld();
                    _this.layers[idx].renderable = layer.renderable || true;
                    _this.layers[idx].visible = layer.visible || true;
                    _this.layers[idx].autoCull = true;
                }
            });
            var managedLayers = [
                "npc",
                "player",
                "lights",
                "dialog",
            ];
            this.layerManager = new sgl_1.LayerManager(this.game);
            managedLayers.forEach(function (layer) {
                _this.layerManager.add(layer, new sgl_1.Layer(_this.game));
            });
            this.map.setCollision([15, 16, 17, 18, 33, 34, 35, 36, 51, 52, 53, 54, 55, 65, 57, 58, 73, 74, 75, 76], true, "Environment", false);
            this.map.setCollision([2045], true, "Collision", false);
            this.map.setCollisionBetween(2046, 2056, true, "Tables", false);
            this.layerManager.layer("player").addRef("player", this.game.add.sprite(0 * this.map.tileWidth + 32, 5 * this.map.tileHeight + 32, "player"));
            this.ref("player", "player").scale.set(0.5);
            this.ref("player", "player").anchor.set(0.5);
            this.addAnimations(this.ref("player", "player"));
            this.game.physics.enable(this.ref("player", "player"));
            this.ref("player", "player").body.collideWorldBounds = true;
            this.layerManager.layer("lights").addRef("logo", this.game.add.sprite(32, 32, "logo"));
            this.ref("lights", "logo").anchor.set(0.5);
            this.ref("lights", "logo").width = 64;
            this.ref("lights", "logo").height = 64;
            this.layerManager.layer("dialog").addRef("dialog", new sgl_1.Dialog(this, 100, 40, "dialog"));
            this.ref("dialog", "dialog").setVisible(false);
        };
        GameState.prototype.setupInput = function () {
            var _this = this;
            var actor = function (action, trigger, event) {
                trigger.trigger(action, {
                    x: _this.currentTile.x,
                    y: _this.currentTile.y,
                    keyCode: event.code.toLowerCase(),
                });
            };
            this.game.input.keyboard.onDownCallback = function (event) {
                window.document.getElementById("led4").style.animationDuration = "500ms";
                if (event.shiftKey) {
                    if (!_this.sprinting) {
                        _this.sprinting = true;
                        _this.updateWalkingSound();
                    }
                }
                _this.triggers.forEach(function (trigger) {
                    actor("keydown", trigger, event);
                });
            };
            this.game.input.keyboard.onUpCallback = function (event) {
                window.document.getElementById("led4").style.animationDuration = "0s";
                if (!event.shiftKey) {
                    if (_this.sprinting) {
                        _this.sprinting = false;
                        _this.updateWalkingSound();
                    }
                }
                _this.triggers.forEach(function (trigger) {
                    actor("keyup", trigger, event);
                });
            };
            this.game.input.keyboard.onPressCallback = function (input, event) {
                console.log("press");
                if (event.code.toLowerCase() === "space") {
                    _this.simulator.pickPocket();
                }
                _this.triggers.forEach(function (trigger) {
                    actor("keypress", trigger, event);
                });
            };
        };
        GameState.prototype.loadTrigger = function (json) {
            var _this = this;
            if (json !== null && typeof json.trigger === "object") {
                json.trigger.forEach(function (triggerData) {
                    if (triggerData.x !== undefined && triggerData.y !== undefined) {
                        _this.triggers.push(new trigger_1.Trigger(_this, triggerData));
                    }
                });
            }
            else {
                sgl_1.error("Couldn't load trigger data!");
            }
        };
        GameState.prototype.trigger = function () {
            var tile = this.currentTile;
            this.triggers.forEach(function (trigger) {
                trigger.trigger("exit", { x: tile.x, y: tile.y });
            });
            this.triggers.forEach(function (trigger) {
                trigger.trigger("enter", { x: tile.x, y: tile.y });
            });
            this.triggers.forEach(function (trigger) {
                trigger.trigger("each", { x: tile.x, y: tile.y });
            });
        };
        GameState.prototype.getCurrentTile = function () {
            return this.getTileAt(this.ref("player", "player").position.x, this.ref("player", "player").position.y, undefined, true);
        };
        GameState.prototype.getTileAt = function (x, y, layer, nonNull) {
            return this.map.getTileWorldXY(x, y, this.map.tileWidth, this.map.tileHeight, layer, nonNull);
        };
        GameState.prototype.ref = function (layer, key) {
            return this.layerManager.layer(layer).ref(key);
        };
        GameState.prototype.questStuff = function () {
            sgl_1.log("A quest?");
        };
        GameState.prototype.gameOver = function () {
            this.shutdown();
            this.changeState("end");
        };
        GameState.prototype.clubPlayer = function (amount) {
            this.energyReserve -= amount;
            this.game.camera.shake(0.01, 200);
            this.playSound("club", "club" + util_1.choose([0, 1]));
        };
        GameState.prototype.stateResize = function (width, height) {
            var _this = this;
            sgl_1.log("Resize 2");
            Object.getOwnPropertyNames(this.layers).forEach(function (name) {
                _this.layers[name].resize(screen.width, screen.height);
                _this.game.camera.unfollow();
                _this.game.camera.follow(_this.ref("player", "player"), Phaser.Camera.FOLLOW_TOPDOWN);
            });
        };
        GameState.prototype.updateBatteryIcon = function () {
            var i = Math.floor(this.energyReserve * 5 / 100);
            var css = "battery" + i;
            var dom = window.document.getElementById("battery");
            if (!!dom) {
                dom.className = css;
            }
        };
        GameState.prototype.hasCollision = function (x, y, layer) {
            if (layer === void 0) { layer = "Collision"; }
            if (x < 0 || y < 0 || x > this.map.width || y > this.map.height) {
                return true;
            }
            var coll = this.map.getTile(x, y, layer) !== null;
            return coll;
        };
        GameState.prototype.playSound = function (name, key, loop) {
            if (loop === void 0) { loop = false; }
            if (this.music !== undefined) {
                this.music.fadeOut(1);
            }
            this.music = this.game.add.audio(key);
            this.music.loop = loop;
            this.music.play();
        };
        GameState.prototype.stopSound = function (key, duration) {
            if (duration === void 0) { duration = 1000; }
            if (this.music !== undefined) {
                this.music.fadeOut(duration);
            }
        };
        GameState.prototype.replaceTile = function (x, y, tid, layer) {
            this.map.putTile(tid, x, y, layer);
        };
        GameState.prototype.openDoor = function (x, y, success, level) {
            if (this.unlockedLevel[level]) {
                this.replaceTile(x, y, success, "Doors");
                this.replaceTile(x, y, -1, "Collision");
            }
        };
        GameState.prototype.destroyWindow = function (x, y, success) {
            console.log("FUUUUUUU");
            this.replaceTile(x, y, success, "Environment");
        };
        GameState.prototype.unlockLevel = function (idx) {
            console.log("VVVVVVV", idx, this.unlockedLevel);
            if (!this.unlockedLevel[idx]) {
                this.spreadPlayers(idx);
            }
            this.unlockedLevel[idx] = true;
        };
        GameState.prototype.showDialogAbove = function (name, x, y, text) {
            this.ref("dialog", name).say(text);
            this.ref("dialog", name).aboveTileXY(x, y);
            this.ref("dialog", name).setVisible(true);
        };
        GameState.prototype.hideDialog = function (name) {
            this.ref("dialog", name).setVisible(false);
        };
        GameState.prototype.story = function (t, key) {
            switch (key) {
                case "hide-dialog":
                    this.hideDialog("dialog");
                    break;
                case "tutorial0-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Welcome to the game!");
                    break;
                case "tutorial1-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Papers on the floor can be very useful ;)");
                    this.unlockLevel(LEVEL.PARKINGLOT);
                    break;
                case "tutorial2-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "You might have noticed that your Battery is running low.\n But that guy over there looks like he has a full charge in his smartphone...\n Try pressing <space> next to him...");
                    this.unlockLevel(LEVEL.PARKINGLOT);
                    break;
                case "message-under-construction-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Under construction");
                    break;
                case "destroy-window-1":
                    this.destroyWindow(37, 14, 2136);
                    break;
                case "destroy-window-2":
                    this.destroyWindow(37, 16, 2148);
                    break;
                case "destroy-window-3":
                    this.destroyWindow(45, 19, 1375);
                    break;
                case "destroy-window-4":
                    this.destroyWindow(47, 19, 1340);
                    break;
                case "opendoor-mensa-upper":
                    this.openDoor(40, 19, 1280, LEVEL.MENSA);
                    this.openDoor(41, 19, 1279, LEVEL.MENSA);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-mensa-lower":
                    this.openDoor(51, 27, 1242, LEVEL.MENSA);
                    this.openDoor(51, 28, 1243, LEVEL.MENSA);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-mensa-inner":
                    this.openDoor(65, 9, 1242, LEVEL.MENSA);
                    this.openDoor(65, 10, 1243, LEVEL.MENSA);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-mensa-exit":
                    this.openDoor(79, 36, 1242, LEVEL.MENSA);
                    this.openDoor(79, 37, 1243, LEVEL.MENSA);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-library-upper":
                    this.openDoor(92, 39, 1280, LEVEL.LIBRARY);
                    this.openDoor(93, 39, 1279, LEVEL.LIBRARY);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-library-top":
                    this.openDoor(111, 11, 1280, LEVEL.LIBRARY);
                    this.openDoor(112, 11, 1279, LEVEL.LIBRARY);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "opendoor-library-lower":
                    this.openDoor(90, 41, 1242, LEVEL.LIBRARY);
                    this.openDoor(90, 42, 1243, LEVEL.LIBRARY);
                    this.showDialogAbove("dialog", t.x, t.y, "HODOR");
                    break;
                case "teleport":
                    this.ref("player", "player").position.x = 79 * this.map.tileWidth;
                    this.ref("player", "player").position.y = 37 * this.map.tileHeight;
                    break;
                case "message-leaves-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Leaves blowing in the wind");
                    break;
                case "message-mensa-banner-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Only today: 1L beer only 4.20€");
                    break;
                case "message-garden-enter":
                    if (!this.hasKeys) {
                        if (Math.random() < 0.1) {
                            this.hasKeys = true;
                            this.showDialogAbove("dialog", t.x, t.y, "I found some keys");
                        }
                        else {
                            this.showDialogAbove("dialog", t.x, t.y, "Just some greens growing here");
                        }
                    }
                    else {
                        this.showDialogAbove("dialog", t.x, t.y, "Just some greens growing here");
                    }
                    break;
                case "message-eismann-enter":
                    if (!this.hasKeys) {
                        this.showDialogAbove("dialog", t.x, t.y, "I lost my keys. Can you find them?");
                    }
                    else {
                        this.showDialogAbove("dialog", t.x, t.y, "Thank you for finding them! Enjoy your dinner.");
                        this.unlockLevel(LEVEL.MENSA);
                    }
                    break;
                case "message-eismann-library-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "How are exams going?");
                    break;
                case "message-toilet-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "It's so beautiful in here");
                    break;
                case "message-exam-enter":
                    this.showDialogAbove("dialog", t.x, t.y, "Fib(0)=1;Fib(1)=1;Fib(n)=Fib(n-1)+Fib(n-2)\n\nWhat does that mean?\nI should go and learn...");
                    this.unlockLevel(LEVEL.LIBRARY);
                    break;
                default:
                    sgl_1.error("Unhandled story action " + key + " at " + t.x + ", " + t.y);
            }
        };
        GameState.prototype.play = function (t, key) {
            switch (key) {
                case "piano-low":
                    this.playSound("piano", "piano" + util_1.choose([4, 5, 6, 7]), true);
                    break;
                case "piano-high":
                    this.playSound("piano", "piano" + util_1.choose([0, 1, 2, 3]), true);
                    break;
                default:
                    sgl_1.error("Unhandled story action " + key + " at " + t.x + ", " + t.y);
            }
        };
        GameState.prototype.stop = function (t, key) {
            switch (key) {
                case "piano-low":
                case "piano-high":
                    this.stopSound("piano");
                    break;
                default:
                    sgl_1.error("Unhandled story action " + key + " at " + t.x + ", " + t.y);
            }
        };
        GameState.prototype.getTilesForType = function (id, layer) {
            var layerID = this.map.getLayer(layer);
            var _layer = this.map.layers[layerID];
            var data = [];
            for (var _i = 0, _a = util_1.range(0, this.map.height); _i < _a.length; _i++) {
                var y = _a[_i];
                for (var _b = 0, _c = util_1.range(0, this.map.width); _b < _c.length; _b++) {
                    var x = _c[_b];
                    if (_layer.data[y][x].index === id) {
                        data.push(new Phaser.Point(x, y));
                    }
                }
            }
            return data;
        };
        GameState.prototype.getChairTiles = function (tiles) {
            var _this = this;
            return tiles.filter(function (pos) {
                var tile = _this.map.getTile(pos.x, pos.y, "Tables");
                if (tile == null) {
                    return false;
                }
                switch (tile.index) {
                    case 1630:
                    case 1631:
                    case 1632:
                    case 1655:
                    case 1681:
                    case 1684:
                    case 1707:
                    case 1708:
                    case 1710:
                    case 1717:
                    case 1718:
                    case 1735:
                    case 1763:
                    case 1764:
                    case 1766:
                        return true;
                    default:
                        return false;
                }
            });
        };
        GameState.prototype.getTilesForLevel = function (level) {
            switch (level) {
                case LEVEL.PARKINGLOT:
                    return this.getTilesForType(2158, "Level");
                case LEVEL.MENSA:
                    return this.getTilesForType(2159, "Level");
                case LEVEL.LIBRARY:
                    return this.getTilesForType(2160, "Level");
                case LEVEL.PCPOOL:
                    return this.getTilesForType(2161, "Level");
                default:
                    return [];
            }
        };
        GameState.prototype.spawnPlayer = function (tiles, types, state) {
            var tile = util_1.choose(tiles);
            var type = util_1.choose(types);
            var pos = pathfinder_1.Pathfinder.tile2pos(this, tile);
            if (type === ai_1.AIType.STANDING) {
                this.simulator.spawn(type, state, tile.clone(), tile.clone());
            }
            else {
                var npc = this.simulator.spawn(type, state, undefined, tile.clone());
                if (state === ai_1.AIState.SITTING) {
                    npc.sitDown(Math.floor(pos.x), Math.floor(pos.y));
                }
            }
        };
        GameState.prototype.spreadPlayers = function (level) {
            var _this = this;
            var points = this.getTilesForLevel(level);
            if (points.length > 0) {
                var type_1 = [
                    ai_1.AIType.EATING,
                ];
                util_1.range(0, 10).forEach(function (id) {
                    window.setTimeout(function () {
                        _this.spawnPlayer(points, [ai_1.AIType.STANDING], ai_1.AIState.IDLE);
                    }, id * 1000);
                });
                util_1.range(0, 20).forEach(function (id) {
                    window.setTimeout(function () {
                        _this.spawnPlayer(points, type_1, ai_1.AIState.IDLE);
                    }, id * 5000);
                });
                console.trace(level);
                if (level === LEVEL.PARKINGLOT) {
                }
                else if (level === LEVEL.MENSA ||
                    level === LEVEL.LIBRARY ||
                    level === LEVEL.PCPOOL) {
                    var chairs_1 = this.getChairTiles(points);
                    util_1.range(0, 20).forEach(function () { return _this.spawnPlayer(chairs_1, [ai_1.AIType.EATING], ai_1.AIState.SITTING); });
                }
            }
        };
        GameState.prototype.pickUp = function (device) {
            this.energyReserve += device;
        };
        GameState.prototype.updateWalkingSound = function () {
            var playing = false;
            if (!util_1.nou(this.walkingSound)) {
                playing = this.walkingSound.isPlaying;
                this.walkingSound.stop();
            }
            this.walkingSound = this.game.add.audio("" + (this.sprinting ? "run" : "walk") + util_1.choose(util_1.range(0, this.sprinting ? 2 : 6)));
            this.walkingSound.loop = true;
            if (playing) {
                this.walkingSound.play();
            }
        };
        GameState.prototype.walkSound = function (enable) {
            if (enable) {
                if (util_1.nou(this.walkingSound)) {
                    this.updateWalkingSound();
                }
                this.walkingSound.play();
            }
            else {
                if (!util_1.nou(this.walkingSound)) {
                    this.walkingSound.stop();
                }
            }
        };
        GameState.prototype.addAnimations = function (sprite, isCar) {
            if (isCar === void 0) { isCar = false; }
            if (isCar) {
                sprite.animations.add("left", [3]);
                sprite.animations.add("right", [1]);
                sprite.animations.add("up", [0]);
                sprite.animations.add("down", [2]);
            }
            else {
                sprite.animations.add("left", [24, 25, 26, 25], 10, true);
                sprite.animations.add("right", [0, 10, 9, 10], 10, true);
                sprite.animations.add("up", [22, 5, 22, 6], 10, true);
                sprite.animations.add("down", [0, 17], 8, true);
                sprite.scale.set(0.4);
            }
            sgl_1.log("ANIMATION", sprite.animations.isLoaded);
        };
        return GameState;
    }(sgl_1.State));
    exports.GameState = GameState;
});
