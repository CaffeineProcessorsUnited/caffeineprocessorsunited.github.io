define(["require", "exports", "./astar", "../sgl/util"], function (require, exports, astar_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Pathfinder = (function () {
        function Pathfinder(npc, gs, staticTarget) {
            if (staticTarget === void 0) { staticTarget = true; }
            this.npc = npc;
            this.gs = gs;
            this.staticTarget = staticTarget;
            this.forceUpdate();
        }
        Pathfinder.tile2pos = function (gameState, tile) {
            return new Phaser.Point(tile.x * gameState.map.tileWidth + gameState.map.tileWidth / 2, tile.y * gameState.map.tileHeight + gameState.map.tileHeight / 2);
        };
        Pathfinder.pos2tile = function (gameState, pos) {
            return new Phaser.Point(Math.floor(pos.x / gameState.map.tileWidth), Math.floor(pos.y / gameState.map.tileHeight));
        };
        Pathfinder.pathEquals = function (a, b) {
            if (a.length !== b.length) {
                return false;
            }
            for (var i = 0; i < a.length; i++) {
                if (!a[i].equals(b[i])) {
                    return false;
                }
            }
            return true;
        };
        Pathfinder.prototype.setCurrent = function (pos) {
            this.curPos = pos.clone();
            this.curTile = this.pos2tile(pos);
            this.dirty = true;
        };
        Pathfinder.prototype.setTarget = function (pos) {
            this.targetPos = pos.clone();
            this.targetTile = this.pos2tile(pos);
            this.dirty = true;
        };
        Pathfinder.prototype.tile2pos = function (tile) {
            return Pathfinder.tile2pos(this.gs, tile);
        };
        Pathfinder.prototype.pos2tile = function (pos) {
            return Pathfinder.pos2tile(this.gs, pos);
        };
        Pathfinder.prototype.forceUpdate = function () {
            if (this.interval) {
                window.clearTimeout(this.interval);
                window.clearInterval(this.interval);
            }
            if (this.staticTarget) {
                this.interval = setInterval(this.onUpdate.bind(this), 250);
            }
            else {
                this.interval = setInterval(this.onUpdate.bind(this), 250);
            }
        };
        Pathfinder.prototype.onUpdate = function () {
            var _this = this;
            if (!this.dirty) {
                return;
            }
            if (!this.curPos || !this.targetPos) {
                return;
            }
            this.astar = new astar_1.AStar(this.gs, this.curTile, this.targetTile, this.staticTarget ? 10000 : 500, this.npc.getCollider(), function (plannedTile, done) {
                if (util_1.nou(_this.plannedTile) || !Pathfinder.pathEquals(_this.plannedTile, plannedTile)) {
                    _this.plannedTile = plannedTile;
                    _this.plannedPos = _this.plannedTile.map(function (value) { return _this.tile2pos(value); });
                    _this.plannedPos.push(_this.targetPos);
                    _this.npc.newTargets(_this.plannedPos.slice(1), done);
                    _this.dirty = false;
                }
            });
            if (this.staticTarget) {
                window.clearInterval(this.interval);
            }
        };
        return Pathfinder;
    }());
    exports.Pathfinder = Pathfinder;
});
