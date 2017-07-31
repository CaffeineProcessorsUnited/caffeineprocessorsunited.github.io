define(["require", "exports", "../sgl/util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AStar = (function () {
        function AStar(gamestate, from, to, maxIter, collider, callback) {
            this.completedNodes = [];
            this.currentNodes = [];
            this.cameFrom = {};
            this.gScore = {};
            this.fScore = {};
            this.gamestate = gamestate;
            this.from = from;
            this.to = to;
            this.maxIter = maxIter;
            this.curIter = 0;
            this.collider = collider;
            this.callback = callback;
            this.currentNodes.push(from);
            this.gScore[from.toString()] = 0;
            this.fScore[from.toString()] = AStar.estimateDistance(from, to);
            this.RAF();
        }
        AStar.estimateDistance = function (from, to) {
            return from.distance(to);
        };
        AStar.inList = function (elem, list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var e = list_1[_i];
                if (elem.x === e.x && elem.y === e.y) {
                    return true;
                }
            }
            return false;
        };
        AStar.prototype.reconstructPath = function (cameFrom, current) {
            var path = [current];
            var prev = current;
            while (prev !== undefined && cameFrom[prev.toString()] !== undefined) {
                prev = cameFrom[prev.toString()];
                path.unshift(prev);
            }
            return path;
        };
        AStar.prototype.getFScore = function (a) {
            if (!this.fScore.hasOwnProperty(a.toString())) {
                return 9999999;
            }
            else {
                return this.fScore[a.toString()];
            }
        };
        AStar.prototype.calcPathStep = function () {
            var _this = this;
            var next = true;
            var current;
            var _loop_1 = function (_) {
                if (this_1.currentNodes.length === 0) {
                    next = false;
                    return "break";
                }
                var curMinNode = this_1.currentNodes[0];
                var curMinValue = 999999;
                this_1.currentNodes.forEach(function (node) {
                    var val = _this.getFScore(node);
                    if (val < curMinValue) {
                        curMinNode = node;
                        curMinValue = val;
                    }
                });
                current = curMinNode;
                if (current.equals(this_1.to) || this_1.curIter > this_1.maxIter) {
                    this_1.callback(this_1.reconstructPath(this_1.cameFrom, current), true);
                    return { value: void 0 };
                }
                else if (this_1.curIter % 500 === 0) {
                    this_1.callback(this_1.reconstructPath(this_1.cameFrom, current), false);
                }
                var idx = this_1.currentNodes.indexOf(curMinNode);
                this_1.currentNodes.splice(idx, 1);
                this_1.completedNodes.push(current);
                for (var _i = 0, _a = this_1.getNeighbors(current); _i < _a.length; _i++) {
                    var neighbor = _a[_i];
                    if (AStar.inList(neighbor, this_1.completedNodes)) {
                        continue;
                    }
                    if (!AStar.inList(neighbor, this_1.currentNodes)) {
                        this_1.currentNodes.push(neighbor);
                    }
                    var _gScore = this_1.gScore[current.toString()] + current.distance(neighbor);
                    if (_gScore > this_1.gScore[neighbor.toString()]) {
                        continue;
                    }
                    this_1.cameFrom[neighbor.toString()] = current;
                    this_1.gScore[neighbor.toString()] = _gScore;
                    this_1.fScore[neighbor.toString()] = _gScore + AStar.estimateDistance(neighbor, this_1.to);
                }
                this_1.curIter += 1;
            };
            var this_1 = this;
            for (var _i = 0, _a = util_1.range(0, 20); _i < _a.length; _i++) {
                var _ = _a[_i];
                var state_1 = _loop_1(_);
                if (typeof state_1 === "object")
                    return state_1.value;
                if (state_1 === "break")
                    break;
            }
            if (next) {
                this.RAF();
            }
            this.callback(this.reconstructPath(this.cameFrom, current));
        };
        AStar.prototype.RAF = function () {
            var _this = this;
            window.setTimeout(function () {
                _this.calcPathStep();
            }, 1);
        };
        AStar.prototype.getNeighbors = function (from) {
            var ret = [];
            for (var _i = 0, _a = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ]; _i < _a.length; _i++) {
                var delta = _a[_i];
                var collide = this.collider(from.x + delta[0], from.y + delta[1]);
                if (!collide) {
                    ret.push(new Phaser.Point(from.x + delta[0], from.y + delta[1]));
                }
            }
            return ret;
        };
        return AStar;
    }());
    exports.AStar = AStar;
});
