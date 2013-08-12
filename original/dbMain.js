var game = null;
var viewport_s = null;

function init() {
    var s = 300;

    //Create Game Engine
    gl = new GL();
    gl.graphics.init('canvas', {x: 200, y: 200});
    gl.controller.keyboard.setCallback();
    gl.controller.mouse.setCallback();
    gl.sound.init('sounds');

    game = new eGame(s);

    //Init Resources
    // rm = new rlResourceManager(gl.resources);
    // rm.loadResources();

    gl.setMainLoop(idle, 1); 
}

function idle() {
    if (!gl.resources.doneLoaded())
        return;

    //var tile = gl.controller.mouse.v;
    //var mouseButtons = gl.controller.mouse.getStates(true);

    //if ((mouseButtons[0]) || (mouseButtons[1])) {
    //    tile.x /= game.tile_size.x;
    //    tile.y /= game.tile_size.y;

    //    game.zoom(mouseButtons[0], tile);
    //}

    if (game.dirty)
        draw();   
}

function draw() {
    game.draw();
    //game.drawSphere();

    game.dirty = false;
}