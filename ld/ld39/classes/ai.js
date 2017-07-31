define(["require", "exports", "../sgl/sgl", "./incrand", "./pathfinder", "../sgl/util"], function (require, exports, sgl_1, incrand_1, pathfinder_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AIState;
    (function (AIState) {
        AIState[AIState["IDLE"] = 0] = "IDLE";
        AIState[AIState["STROLL"] = 1] = "STROLL";
        AIState[AIState["TALKING"] = 2] = "TALKING";
        AIState[AIState["CHASING"] = 3] = "CHASING";
        AIState[AIState["SITTING"] = 4] = "SITTING";
        AIState[AIState["DRIVING"] = 5] = "DRIVING";
        AIState[AIState["PARKING"] = 6] = "PARKING";
    })(AIState = exports.AIState || (exports.AIState = {}));
    var AIType;
    (function (AIType) {
        AIType[AIType["DUMMY"] = 0] = "DUMMY";
        AIType[AIType["STANDING"] = 1] = "STANDING";
        AIType[AIType["GUARD"] = 2] = "GUARD";
        AIType[AIType["PROF"] = 3] = "PROF";
        AIType[AIType["EATING"] = 4] = "EATING";
        AIType[AIType["LEARNING"] = 5] = "LEARNING";
        AIType[AIType["WORKING"] = 6] = "WORKING";
        AIType[AIType["SLEEPING"] = 7] = "SLEEPING";
        AIType[AIType["VEHICLE"] = 8] = "VEHICLE";
    })(AIType = exports.AIType || (exports.AIType = {}));
    var AI = (function () {
        function AI(simulator, type) {
            this.spawned = false;
            this.findingPath = false;
            this.simulator = simulator;
            this.gameState = this.simulator.gameState;
            this.pathfinder = new pathfinder_1.Pathfinder(this, this.gameState);
            this.plannedPoints = [];
            this.currentPoint = 0;
            this.canBeRobbed = true;
            this.type = type;
            this.speed = 0;
            this.state = AIState.IDLE;
            var spriteKey = "";
            this.giveUp = new incrand_1.IncRand(0.02, 5, 20);
            this.speedUp = new incrand_1.IncRand(0.2, 10, 20);
            this.tileSize = this.gameState.map.tileWidth;
            this.device = util_1.random(5, 40);
            switch (type) {
                case AIType.DUMMY:
                    this.maxSpeed = 0;
                    this.reactionDelay = 0;
                    this.alert = 0;
                    this.armLength = 0;
                    this.maxWalkDistance = 0;
                    this.giveUp = new incrand_1.IncRand(0, 0, 0, true);
                    this.goHome = new incrand_1.IncRand(0, 0, 0, true);
                    this.alertRadSq = 0;
                    spriteKey = "dummy";
                    break;
                case AIType.STANDING:
                    this.maxSpeed = 1;
                    this.reactionDelay = 0.5;
                    this.state = AIState.STROLL;
                    this.alert = 20;
                    this.armLength = 30;
                    this.maxWalkDistance = 20;
                    this.giveUp = new incrand_1.IncRand(0.02, 8, 30);
                    this.goHome = new incrand_1.IncRand(0.02, 20, 300);
                    this.alertRadSq = 8;
                    spriteKey = "student" + util_1.random(0, 2);
                    break;
                case AIType.GUARD:
                    this.maxSpeed = 2;
                    this.reactionDelay = 0.2;
                    this.state = AIState.STROLL;
                    this.alert = 90;
                    this.armLength = 40;
                    this.maxWalkDistance = 30;
                    this.giveUp = new incrand_1.IncRand(0.01, 10, 50);
                    this.goHome = new incrand_1.IncRand(0, 0, 0, true);
                    this.alertRadSq = 25;
                    this.device = 0;
                    spriteKey = "guard";
                    break;
                case AIType.PROF:
                    this.maxSpeed = 0.7;
                    this.reactionDelay = 1.2;
                    this.state = AIState.STROLL;
                    this.alert = 50;
                    this.armLength = 25;
                    this.maxWalkDistance = 15;
                    this.giveUp = new incrand_1.IncRand(0.04, 6, 20);
                    this.goHome = new incrand_1.IncRand(0.01, 120, 600);
                    this.alertRadSq = 12;
                    spriteKey = "prof";
                    break;
                case AIType.EATING:
                    this.maxSpeed = 1;
                    this.reactionDelay = 1;
                    this.alert = 30;
                    this.armLength = 30;
                    this.maxWalkDistance = 8;
                    this.giveUp = new incrand_1.IncRand(0.04, 6, 10);
                    this.goHome = new incrand_1.IncRand(0.01, 100, 300);
                    this.alertRadSq = 6;
                    spriteKey = "student" + util_1.random(0, 2);
                    break;
                case AIType.LEARNING:
                    this.maxSpeed = 1;
                    this.reactionDelay = 0.5;
                    this.alert = 10;
                    this.armLength = 30;
                    this.maxWalkDistance = 17;
                    this.giveUp = new incrand_1.IncRand(0.03, 10, 20);
                    this.goHome = new incrand_1.IncRand(0.03, 100, 300);
                    this.alertRadSq = 5;
                    spriteKey = "student" + util_1.random(0, 2);
                    break;
                case AIType.WORKING:
                    this.maxSpeed = 1;
                    this.reactionDelay = 1;
                    this.alert = 70;
                    this.armLength = 30;
                    this.maxWalkDistance = 10;
                    this.giveUp = new incrand_1.IncRand(0.03, 10, 16);
                    this.goHome = new incrand_1.IncRand(0.02, 120, 300);
                    this.alertRadSq = 7;
                    spriteKey = "student" + util_1.random(0, 2);
                    break;
                case AIType.SLEEPING:
                    this.maxSpeed = 0.5;
                    this.reactionDelay = 2;
                    this.alert = 10;
                    this.armLength = 25;
                    this.maxWalkDistance = 5;
                    this.giveUp = new incrand_1.IncRand(0.05, 2, 10);
                    this.goHome = new incrand_1.IncRand(0.02, 100, 300);
                    this.alertRadSq = 2;
                    spriteKey = "student" + util_1.random(0, 2);
                    break;
                case AIType.VEHICLE:
                    this.maxSpeed = 4;
                    this.reactionDelay = 0;
                    this.alert = 0;
                    this.armLength = 10;
                    this.maxWalkDistance = 0;
                    this.giveUp = new incrand_1.IncRand(0, 0, 0);
                    this.goHome = new incrand_1.IncRand(0.06, 5, 6);
                    this.alertRadSq = 0;
                    spriteKey = "car" + util_1.random(0, 3);
                    break;
                default:
                    throw new Error("Unknown AIType. Fix your shit!");
            }
            this.newSound();
            this.maxSpeed *= this.tileSize;
            this.sprite = this.gameState.layerManager.layer("npc").add(this.gameState.game.add.sprite(0, 0, spriteKey));
            this.gameState.addAnimations(this.sprite, (this.type === AIType.VEHICLE));
            this.sprite.anchor.set(0.5);
            this.gameState.game.physics.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
            this.player = this.gameState.ref("player", "player");
        }
        Object.defineProperty(AI.prototype, "reservedTile", {
            get: function () {
                return this._reservedTile;
            },
            set: function (point) {
                this._reservedTile = point;
                if (!sgl_1.nou(point)) {
                    var pos = this.pathfinder.tile2pos(point);
                    this.reservedX = pos.x;
                    this.reservedY = pos.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AI.prototype, "speed", {
            get: function () {
                return this._speed;
            },
            set: function (speed) {
                this._speed = speed;
                this.speedInTiles = speed / this.tileSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AI.prototype, "spawnPoint", {
            get: function () {
                return this._spawnPoint;
            },
            set: function (point) {
                this._spawnPoint = point;
                this.startPoint = point;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AI.prototype, "startPoint", {
            get: function () {
                return this._startPoint;
            },
            set: function (point) {
                this._startPoint = point;
                var pos = this.pathfinder.tile2pos(this.startPoint).clone();
                this.sprite.x = pos.x;
                this.sprite.y = pos.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AI.prototype, "plannedPoints", {
            get: function () {
                return this._plannedPoints;
            },
            set: function (pos) {
                this._plannedPoints = pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AI.prototype, "position", {
            get: function () {
                return this.sprite.position;
            },
            enumerable: true,
            configurable: true
        });
        AI.prototype.update = function () {
            if (this.state === AIState.SITTING) {
                if (this.goHome.getRand()) {
                    sgl_1.log("STANDUP");
                    this.standUp();
                }
            }
            if (this.type === AIType.VEHICLE) {
            }
            else {
                this.gameState.game.physics.arcade.collide(this.sprite);
            }
            this.pathfinder.setCurrent(this.position);
            this.sound();
            if (this.findingPath) {
                return;
            }
            if (this.state === AIState.CHASING) {
                if (this.plannedPoints.length > this.maxWalkDistance) {
                    this.setStroll();
                }
                if (this.canReach()) {
                    sgl_1.log("CLUB");
                    this.giveUp.reset();
                    this.canBeRobbed = true;
                    if (this.type === AIType.VEHICLE) {
                        this.gameState.clubPlayer(40 + this.device);
                    }
                    else {
                        this.gameState.clubPlayer(10 + this.device);
                    }
                    this.setStroll();
                    return;
                }
                if (this.giveUp.getRand()) {
                    this.setStroll();
                }
                if (this.speedUp.getRand()) {
                    this.speed += 0.1 * (Math.random() * 2 - 1);
                }
            }
            else if (this.state === AIState.STROLL) {
                if (this.sprite.body.blocked.left ||
                    this.sprite.body.blocked.right ||
                    this.sprite.body.blocked.top ||
                    this.sprite.body.blocked.down) {
                    console.log("BLOCKED");
                    this.doStroll(0);
                    return;
                }
                if (this.nearTarget() || Math.random() < 0.001) {
                    this.setStroll();
                    return;
                }
            }
            else if (this.state === AIState.TALKING) {
                this.clearTimeout();
                this.speed = 0;
            }
            else {
                if (!sgl_1.nou(this.targetX) &&
                    !sgl_1.nou(this.targetY) &&
                    this.sprite.x !== this.targetX &&
                    this.sprite.y !== this.targetY) {
                    this.clearTimeout();
                    this.speed = 0;
                    if (!sgl_1.nou(this.plannedPoints) && this.plannedPoints.length > 0) {
                        if (this.type === AIType.VEHICLE) {
                            this.speed = this.maxSpeed;
                        }
                        else {
                            this.speed = this.maxSpeed;
                        }
                    }
                    else {
                        this.setStroll();
                    }
                }
                else if (!sgl_1.nou(this.reservedTile) && this.sprite.x !== this.reservedX &&
                    this.sprite.y !== this.reservedY) {
                    var newTarget = this.pathfinder.tile2pos(this.reservedTile);
                    this.speed = this.maxSpeed;
                    this.setTarget(newTarget.x, newTarget.y);
                }
                else if (sgl_1.nou(this.targetX) || sgl_1.nou(this.targetY)) {
                    this.speed = 0;
                    switch (this.type) {
                        case AIType.LEARNING:
                        case AIType.EATING:
                        case AIType.SLEEPING:
                        case AIType.WORKING:
                            if (this.state !== AIState.SITTING) {
                                this.sitDown(this.position.x, this.position.y);
                            }
                            break;
                        case AIType.VEHICLE:
                            if (this.state === AIState.PARKING) {
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if (this.nearCurrentPoint()) {
                this.currentPoint += 1;
                if (this.currentPoint >= this.plannedPoints.length) {
                    this.plannedPoints = [];
                    this.currentPoint = 0;
                    this.onPathComplete();
                }
            }
            this.move();
        };
        AI.prototype.nearCurrentPoint = function () {
            if (this.currentPoint >= this.plannedPoints.length) {
                return false;
            }
            var dx = this.plannedPoints[this.currentPoint].x - this.position.x;
            var dy = this.plannedPoints[this.currentPoint].y - this.position.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            return dist < this.speed * this.gameState.game.time.elapsedMS / 1000.;
        };
        AI.prototype.distanceToPlayer = function () {
            var dx = this.player.x - this.position.x;
            var dy = this.player.y - this.position.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        AI.prototype.move = function () {
            if (this.nearTarget()) {
                this.sprite.x = this.targetX;
                this.sprite.y = this.targetY;
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
            }
            else {
                var dx = void 0;
                var dy = void 0;
                if (this.plannedPoints && this.plannedPoints.length > 0 && this.currentPoint < this.plannedPoints.length) {
                    dx = this.plannedPoints[this.currentPoint].x - this.position.x;
                    dy = this.plannedPoints[this.currentPoint].y - this.position.y;
                }
                else {
                    dx = this.targetX - this.position.x;
                    dy = this.targetY - this.position.y;
                }
                if (isNaN(dx) || isNaN(dy)) {
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = 0;
                    return;
                }
                var dist = Math.sqrt(dx * dx + dy * dy);
                var vx = dx / dist * this.speed;
                var vy = dy / dist * this.speed;
                this.sprite.body.velocity.x = vx;
                this.sprite.body.velocity.y = vy;
                if (this.speed === 0) {
                    this.sprite.animations.stop();
                    this.sprite.animations.frame = 0;
                    return;
                }
                switch (util_1.direction(this.sprite.body.angle)) {
                    case 0:
                        this.sprite.animations.play("up");
                        break;
                    case 1:
                        this.sprite.animations.play("right");
                        break;
                    case 2:
                        this.sprite.animations.play("down");
                    case 3:
                        this.sprite.animations.play("left");
                        break;
                    default:
                        break;
                }
            }
        };
        AI.prototype.sound = function () {
            if (!sgl_1.nou(this.spriteSound)) {
                if (this.type === AIType.VEHICLE) {
                    if (this.speed > 0) {
                        if (!this.spriteSound.isPlaying) {
                            this.spriteSound.loop = true;
                            this.spriteSound.play();
                        }
                    }
                    else {
                        this.spriteSound.fadeOut(1000);
                    }
                }
                this.spriteSound.volume = Phaser.Math.clamp(1 - (this.distanceToPlayer() / (8 * this.tileSize)), 0, 1);
            }
        };
        AI.prototype.newSound = function () {
            sgl_1.log("new sound");
            if (!sgl_1.nou(this.spriteSound)) {
                this.spriteSound.stop();
                this.spriteSound.destroy();
            }
            switch (this.type) {
                case AIType.VEHICLE:
                    this.spriteSound = this.gameState.game.sound.add("car" + Math.floor(Math.random() * 4));
                    break;
                default:
                    sgl_1.log("This type has no sound!");
                    break;
            }
        };
        AI.prototype.pickPocket = function () {
            if (!this.canBeRobbed && this.type !== AIType.GUARD) {
                return;
            }
            var rand = Math.random() * 100;
            if (rand < this.alert) {
                var dx = this.position.x - this.gameState.currentTile.worldX;
                var dy = this.position.y - this.gameState.currentTile.worldY;
                if (dx * dx + dy * dy < this.alertRadSq * this.gameState.map.tileWidth * this.gameState.map.tileWidth) {
                    this.canBeRobbed = false;
                    if (this.type !== AIType.GUARD) {
                        this.gameState.pickUp(this.device);
                    }
                    this.setChasing();
                }
            }
        };
        AI.prototype.punch = function () {
            this.speed = 0;
            this.doChase(3);
        };
        AI.prototype.setStroll = function () {
            this.clearTimeout();
            this.state = AIState.IDLE;
            if (this.type !== AIType.VEHICLE) {
                this.doStroll(1);
            }
        };
        AI.prototype.setTalking = function () {
            this.clearTimeout();
            this.state = AIState.TALKING;
        };
        AI.prototype.setChasing = function () {
            this.speed = 0;
            this.state = AIState.CHASING;
            this.doChase(this.reactionDelay);
        };
        AI.prototype.nearTarget = function () {
            var dx = this.position.x - this.targetX;
            var dy = this.position.y - this.targetY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            return dist < this.speed * this.gameState.game.time.elapsedMS / 1000.;
        };
        AI.prototype.canReach = function () {
            var dx = this.position.x - this.targetX;
            var dy = this.position.y - this.targetY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            return dist < this.armLength;
        };
        AI.prototype.getTileId = function () {
            return 943;
        };
        AI.prototype.sitDown = function (x, y) {
            sgl_1.log("SITDOWN");
            if (this.type !== AIType.VEHICLE) {
                var tile = this.gameState.getTileAt(x, y, "Tables");
                if (sgl_1.nou(tile)) {
                    sgl_1.error("Can't sit down at " + x + ", " + y + " because it has no tile to replace");
                    return false;
                }
                this.sprite.x = tile.worldX + tile.centerX;
                this.sprite.y = tile.worldY + tile.centerY;
                this.replacedTile = tile.index;
                sgl_1.log("Replace tile id " + tile.index + " with " + this.getTileId() + " at " + tile.x + ", " + tile.y);
            }
            this.state = AIState.SITTING;
            return true;
        };
        AI.prototype.standUp = function () {
            if (this.type !== AIType.VEHICLE) {
                var tile = this.pathfinder.pos2tile(this.position);
                this.state = AIState.IDLE;
                this.canBeRobbed = false;
                sgl_1.log("Replace tile id " + this.getTileId() + " with " + this.replacedTile + " at " + tile.x + ", " + tile.y);
                this.gameState.map.replace(this.getTileId(), this.replacedTile, tile.x, tile.y, 1, 1, "Tables");
            }
            else {
                this.state = AIState.PARKING;
            }
            this.speed = this.maxSpeed;
            var pos = this.pathfinder.tile2pos(this.spawnPoint);
            sgl_1.log(this.spawnPoint, pos);
            this.setTarget(pos.x, pos.y);
        };
        AI.prototype.clearTimeout = function () {
            if (this.timeout !== undefined) {
                clearTimeout(this.timeout);
            }
        };
        AI.prototype.async = function (func, delta) {
            var _this = this;
            this.clearTimeout();
            this.timeout = window.setTimeout(function () {
                _this.timeout = undefined;
                func();
            }, delta);
        };
        AI.prototype.setTarget = function (x, y) {
            if (this.findingPath) {
                return false;
            }
            if (x < 0 || y < 0 || x > this.gameState.map.widthInPixels || y > this.gameState.map.heightInPixels) {
                return false;
            }
            var tile = this.pathfinder.pos2tile(new Phaser.Point(x, y));
            if (this.getCollider()(tile.x, tile.y)) {
                return false;
            }
            var dx = this.position.x - x;
            var dy = this.position.y - y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.tileSize) {
                this.plannedPoints = [new Phaser.Point(x, y)];
                this.currentPoint = 0;
                this.targetX = x;
                this.targetY = y;
            }
            else {
                this.pathfinder.setTarget(new Phaser.Point(x, y));
                this.pathfinder.forceUpdate();
                this.findingPath = true;
            }
            return true;
        };
        AI.prototype.onPlayerMove = function (pos) {
            if (this.state === AIState.CHASING) {
                this.setTarget(pos.x, pos.y);
                this.pathfinder.setTarget(pos);
            }
        };
        AI.prototype.newTargets = function (pos, done) {
            if (done === void 0) { done = false; }
            this.plannedPoints = pos;
            this.currentPoint = 0;
            if (done) {
                if (this.plannedPoints.length > 0) {
                    this.targetX = this.plannedPoints[this.plannedPoints.length - 1].x;
                    this.targetY = this.plannedPoints[this.plannedPoints.length - 1].y;
                }
                this.findingPath = false;
            }
        };
        AI.prototype.reserveTile = function (tile) {
            if (!sgl_1.nou(tile)) {
                this.reservedTile = tile;
                return tile;
            }
            switch (this.type) {
                case AIType.LEARNING:
                case AIType.EATING:
                case AIType.SLEEPING:
                case AIType.WORKING:
                    break;
                case AIType.VEHICLE:
                    if (this.state === AIState.PARKING) {
                        var tiles = this.gameState.getTilesForType(2158, "Road");
                        if (tiles.length > 0) {
                            var i = 0;
                            do {
                                this.reservedTile = tiles[i];
                            } while (i++ < tiles.length && this.gameState.simulator.isReserved(this.reservedTile));
                            if (i >= tiles.length) {
                                throw new Error("You can't spawn more cars than parking lots available! Fegget");
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            return this.reservedTile;
        };
        AI.prototype.onPathComplete = function () {
            if (!sgl_1.nou(this.onPathCompleteHandler)) {
                this.onPathCompleteHandler();
            }
        };
        AI.prototype.getCollider = function () {
            var _this = this;
            return function (x, y) {
                if (_this.type === AIType.VEHICLE) {
                    return !_this.gameState.hasCollision(x, y, "Road");
                }
                else {
                    return _this.gameState.hasCollision(x, y) &&
                        !_this.gameState.hasCollision(x, y, "Doors");
                }
            };
        };
        AI.prototype.forcePathUpdate = function () {
            this.pathfinder.forceUpdate();
        };
        AI.prototype.doChase = function (delay) {
            var _this = this;
            this.async(function () {
                _this.speed = _this.maxSpeed;
                _this.giveUp.reset();
                _this.speedUp.reset();
            }, delay * 1000);
        };
        AI.prototype.doStroll = function (delay) {
            var _this = this;
            this.async(function () {
                _this.state = AIState.STROLL;
                _this.speed = (0.5 + 0.1 * Math.random()) * _this.maxSpeed;
                while (!_this.setTarget(_this.position.x + Math.round(Math.random() * 10 - 5) * _this.tileSize / 2, _this.position.y + Math.round(Math.random() * 10 - 5) * _this.tileSize / 2)) {
                    console.log("Cannot find suitable location for stroll");
                }
            }, delay * 1000);
        };
        AI.directionN = [-Math.PI * 3 / 4, -Math.PI * 1 / 4];
        AI.directionE = [-Math.PI * 1 / 4, Math.PI * 1 / 4];
        AI.directionS = [Math.PI * 1 / 4, Math.PI * 3 / 4];
        AI.directionW = [Math.PI * 3 / 4, -Math.PI * 3 / 4];
        return AI;
    }());
    exports.AI = AI;
});
