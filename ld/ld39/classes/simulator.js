define(["require", "exports", "./ai", "../sgl/util", "./pathfinder"], function (require, exports, ai_1, util_1, pathfinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Simulator = (function () {
        function Simulator(gameState) {
            this.entities = {};
            this.reservedTiles = {};
            this.gameState = gameState;
        }
        Simulator.prototype.spawn = function (type, state, spawn, reserved) {
            if (util_1.nou(this.entities[type.valueOf()])) {
                this.entities[type.valueOf()] = [];
            }
            var i = this.entities[type.valueOf()].push(new ai_1.AI(this, type)) - 1;
            this.entities[type.valueOf()][i].state = state;
            return this.respawn(this.entities[type.valueOf()][i], spawn, reserved);
        };
        Simulator.prototype.respawn = function (object, spawn, reserved) {
            var _this = this;
            var type = object.type;
            var state = object.state;
            switch (type) {
                case ai_1.AIType.LEARNING:
                case ai_1.AIType.EATING:
                case ai_1.AIType.SLEEPING:
                case ai_1.AIType.WORKING:
                case ai_1.AIType.VEHICLE:
                    var tile = object.reserveTile(reserved);
                    if (!util_1.nou(tile)) {
                        this.reservedTiles[tile.toString()] = object;
                    }
                    break;
                default:
                    break;
            }
            var path = this.getPath(type);
            if (!util_1.nou(spawn)) {
                path.spawn = spawn;
            }
            else if (!util_1.nou(object.spawnPoint)) {
                path.spawn = object.spawnPoint;
            }
            object.spawnPoint = path.spawn;
            switch (state) {
                case ai_1.AIState.DRIVING:
                    object.reservedTile = undefined;
                    object.startPoint = path.spawn;
                    object.newTargets(path.targets);
                    object.onPathCompleteHandler = function () {
                        _this.respawn(object);
                    };
                    break;
                default:
                    object.startPoint = path.spawn;
                    break;
            }
            object.newSound();
            return object;
        };
        Simulator.prototype.getPath = function (type) {
            var paths = [];
            if (type === ai_1.AIType.VEHICLE) {
                paths = [
                    {
                        "spawn": new Phaser.Point(75, 59),
                        "targets": [
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(75, 53)),
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(3, 53)),
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(3, 59)),
                        ],
                    },
                    {
                        "spawn": new Phaser.Point(8, 59),
                        "targets": [
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(8, 57)),
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(71, 57)),
                            pathfinder_1.Pathfinder.tile2pos(this.gameState, new Phaser.Point(71, 59)),
                        ],
                    },
                ];
            }
            else {
                paths = [
                    {
                        "spawn": new Phaser.Point(81, 59),
                    },
                    {
                        "spawn": new Phaser.Point(82, 59),
                    },
                    {
                        "spawn": new Phaser.Point(83, 59),
                    },
                ];
            }
            if (paths.length === 0) {
                throw new Error("No path implemented");
            }
            return paths[Math.floor(Math.random() * paths.length)];
        };
        Simulator.prototype.update = function () {
            var _this = this;
            Object.getOwnPropertyNames(this.entities).forEach(function (type) {
                _this.entities[type].forEach(function (entity) {
                    entity.onPlayerMove(_this.gameState.ref("player", "player").position);
                    entity.update();
                });
            });
        };
        Simulator.prototype.pickPocket = function () {
            var _this = this;
            Object.getOwnPropertyNames(this.entities).forEach(function (type) {
                _this.entities[type].forEach(function (entity) {
                    entity.pickPocket();
                });
            });
        };
        Simulator.prototype.isReserved = function (tile) {
            return this.reservedTiles.hasOwnProperty(tile.toString());
        };
        Simulator.prototype.forceUpdate = function () {
            var _this = this;
            Object.getOwnPropertyNames(this.entities).forEach(function (type) {
                _this.entities[type].forEach(function (entity) {
                    entity.forcePathUpdate();
                });
            });
        };
        return Simulator;
    }());
    exports.Simulator = Simulator;
});
