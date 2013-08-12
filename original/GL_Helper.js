function getElement(id) {
    return document.getElementById(id);
}

function getRGBA(r, g, b, a) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function inBounds(x1, y1, x2, y2, w, h) {
    return ((x1 < x2) || (y1 < y2) || (x1 > x2 + w) || (y1 > y2 + h));
}

//Array Functions
function get2DArray(w, h, value) {
    var array = new Array();
    for (var i = 0; i < w; i++) {
        var row = new Array();
        for (var j = 0; j < h; j++) {
            row.push(value);
        }
        array.push(row);
    }

    return array;
}

function get2DColorArray(w, h, r, g, b) {
    var array = new Array();
    for (var i = 0; i < w; i++) {
        var row = new Array();
        for (var j = 0; j < h; j++) {
            row.push(new Vector3(r, g, b));
        }
        array.push(row);
    }

    return array;
}

function pushFront(array, item) {
    array.reverse();
    array.push(item);
    array.reverse();
}

function Vector(_x, _y) {
    this.x = _x;
    this.y = _y;
}

function Vector3(_x, _y, _z) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
}

function isVisible(v1, v2, data) {
    var angle = 0;

    if (v1.x + 0.5 == v2.x + 0.5) {
        if (v1.y + 0.5 > v2.y + 0.5)
            angle = 1.571;
        else
            angle = -1.571;
    }
    else
        angle = Math.atan((v1.y + 0.5 - v2.y - 0.5) / (v1.x + 0.5 - v2.x - 0.5));

    if (v2.x + 0.5 <= v1.x + 0.5)
        angle += 3.1415;

    var tx = v2.x + 0.5;
    var ty = v2.y + 0.5;

    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);

    while (true) {
        if ((tx < 0) || (ty < 0) || (tx >= this.w) || (ty >= this.h))
            return false;
        else if (!((Math.abs(v1.x + 0.5 - tx) >= 0.4) || (Math.abs(v1.y + 0.5 - ty) >= 0.4))) {
			//Distance
			var distance = Math.sqrt(Math.pow(v1.x + 0.5 - v2.x - 0.5, 2) + Math.pow(v1.y + 0.5 - v2.y - 0.5, 2));
			if (distance < 10)
				return true;
			else
				return false;
		}
        else if (data[Math.floor(tx)][Math.floor(ty)] == MAP_TILE_WALL) {
            return false;
        }

        tx -= (0.6 * cosAngle);
        ty -= (0.6 * sinAngle);
    }
}

function getArrayTrueIndex(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i])
            return i;
    }

    return -1;
}

function return_false(e) {
    return false;
}

function getTile(v) {
    var tile = new Vector(v.x, v.y);

    //Covert to tile
    tile.x /= game.tile_size.x;
    tile.y /= game.tile_size.y;

    //Floor
    tile.x = ~ ~tile.x;
    tile.y = ~ ~tile.y;

    return tile;
}

function onScreen(v) {
    var pv = game.player.v;
    var dx = (gl.graphics.canvas.width / 50) / 2;
    var dy = (gl.graphics.canvas.height / 50) / 2;
    return ((Math.abs(pv.x - v.x) <= dx) && (Math.abs(pv.y - v.y) <= dy));
}

function getViewportSize(w, h) {
    var viewportwidth;
    var viewportheight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

    else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
    }

    // older versions of IE

    else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }

    return new Vector(viewportwidth - 10, viewportheight - 25);
}

function points_on_sphere(amount) {
    var points = new Array();

    var inc = Math.PI * (3 - Math.sqrt(5))
    var off = 2 / amount;
    for (var i = 0; i < amount; i++) {
        var y = (i * off) - 1 + (off / 2);
        var r = Math.sqrt(1 - (y * y));
        var phi = i * inc;
        //if (y > 0)
            points.push(new Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r));
    }

    return points;
}