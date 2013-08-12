//Tiles
var TILE_GRASS = 0;
var TILE_GROUND = 1;
var TILE_WATER = 2;
var TILE_SAND = 3;
var TILE_ROCK = 4;

//Landscape
var LANDSCAPE_EMPTY = 0;
var LANDSCAPE_TREE_1 = 1;
var LANDSCAPE_TREE_2 = 2;

//Decoration
var DECORATION_EMPTY = 0;
var DECORATION_FLOWER_1 = 1;
var DECORATION_FLOWER_2 = 2;
var DECORATION_BUSH_1 = 3;

function getDecoration(id) {
    switch (id) {
        case DECORATION_FLOWER_1: return 'rock_1';
        case DECORATION_FLOWER_2: return 'rock_2';
        case DECORATION_BUSH_1: return 'bush';
        default: return '';
    }
}

function getLandscape(id) {
    switch (id) {
        case LANDSCAPE_TREE_1: return 'tree_1';
        case LANDSCAPE_TREE_2: return 'tree_2';
        default: return '';
    }
}

function getTile(id) {
    switch (id) {
        case TILE_GRASS: return 'grass';
        case TILE_GROUND: return 'ground';
        default: return '';
    }
}

function getColor(h, max) {
    var colors = new Array();
    colors.push(new Vector3(0, 100, 0));
    colors.push(new Vector3(0, 200, 0));
    colors.push(new Vector3(100, 150, 0));
    colors.push(new Vector3(100, 75, 0));
    colors.push(new Vector3(50, 25, 0));

    var d = [max / 50, (max / 20), (max / 5), max];

    for (var i = 0; i < colors.length; i++) {
        if (i == colors.length - 1)
            return colors[colors.length - 1];
        if (h <= d[i]) {
            var low = 0;
            if (i > 0)
                low = d[i - 1];
            var high = d[i];

            var dc = (h - low) / (high - low);

            var low_color = colors[i];
            var high_color = colors[i + 1];

            var c = new Vector3(low_color.x, low_color.y, low_color.z);
            c.x += ((high_color.x - low_color.x) * dc);
            c.y += ((high_color.y - low_color.y) * dc);
            c.z += ((high_color.z - low_color.z) * dc);

            return c;
        }
    }
}