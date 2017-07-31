define(["require", "exports", "./sgl/sgl", "./states/boot", "./states/menu", "./states/game", "./states/end"], function (require, exports, sgl_1, boot_1, menu_1, game_1, end_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    sgl_1.ready(function () {
        window.loader = new sgl_1.Loader();
        var loader = window.loader;
        loader.parent = "game";
        loader.renderer = Phaser.WEBGL;
        loader.scaling = Phaser.ScaleManager.EXACT_FIT;
        var a = new menu_1.MenuState(loader);
        loader.addStates({
            "end": new end_1.EndState(loader),
            "boot": new boot_1.BootState(loader),
            "menu": new menu_1.MenuState(loader),
            "game": new game_1.GameState(loader, {
                "in": 1000,
                "out": 1000,
            }),
        });
        loader.start();
    });
});
