var tempCanvas;

function eGame(s) {
    this.s = new Vector(s, s);
    this.tile_size = new Vector(gl.graphics.h / s, gl.graphics.h / s);
    // this.s = new Vector(gl.graphics.w / this.tile_size.x, s);
    this.s = new Vector(200, 200);
    this.map_object = (new dbWorld(this.s).build());

    this.bg = null;

    gl.graphics.dimensions = new Vector(gl.graphics.w / this.tile_size.x, gl.graphics.h / this.tile_size.y);

    this.dirty = true;

    this.bg = null;

    this.init = function () {

    }

    this.idle = function (passed) {

    }

    this.zoom = function (direction, tile) {
        var old_zoom = this.map_object.zoom;
        var new_zoom = (direction ? old_zoom * 2 : old_zoom / 2);

        tile.x = this.map_object.x + (tile.x / old_zoom) - ((gl.graphics.dimensions.x / new_zoom) / 2);
        tile.y = this.map_object.y + (tile.y / old_zoom) - ((gl.graphics.dimensions.y / new_zoom) / 2);
        console.log(tile, ~ ~tile.x, ~ ~tile.y, new_zoom, this.map_object.seeds, this.map_object.max)
        this.map_object = (new dbWorld(this.s).build(~ ~tile.x, ~ ~tile.y, new_zoom, this.map_object.seeds, this.map_object.max));

        this.dirty = true;
    }

    this.draw = function () {
        for (var i = 0; i < this.s.x; i++) {
            for (var j = 0; j < this.s.y; j++) {
                var tile = this.map_object.map[i][j];
                // var shade = this.map_object.shading[i][j];
                var color = ~~(this.map_object.colors[i][j] * 40);
                
                if (tile == TILE_WATER) {
                    gl.graphics.setColor('', 'fill', 5, 50 + ~~(color / 2.5), 100 + ~~(color * 0.8), 1);
                    gl.graphics.drawScaleRectangle(i, j, 1, 1, true);
                }
                else if (tile == TILE_GRASS) {
                    var color_v = getColor(this.map_object.weights[i][j], this.map_object.max);
                    // color_v.x *= shade;
                    // color_v.y *= shade;
                    // color_v.z *= shade;

                    gl.graphics.setColor('', 'fill', ~~color_v.x, ~~color_v.y, ~~color_v.z, 1);
                    gl.graphics.drawScaleRectangle(i, j, 1, 1, true);
                }
                else if (tile == TILE_SAND) {
                    gl.graphics.setColor('', 'fill', ~~(color * 5), ~ ~(color * 4), ~~(color * 3), 1);
                    gl.graphics.drawScaleRectangle(i, j, 1, 1, true);
                }
                else {
                    gl.graphics.setColor('', 'fill', ~ ~(color * 0.4), ~ ~(color * 0.2), ~ ~(color * 0.05), 1);
                    gl.graphics.drawScaleRectangle(i, j, 1, 1, true);
                }
            }
        }
    }

    this.drawSphere = function () {
        var radius = gl.graphics.h * 0.9;

        var m = new Vector(this.s.x / 2, this.s.y / 2);
        var max_d = Math.sqrt(Math.pow(m.x, 2));

        var max_r = m.y;

        for (var i = 0; i < this.s.x; i++) {
            for (var j = 0; j < this.s.y; j++) {
                var tile = this.map_object.map[i][j];
                // var shade = this.map_object.shading[i][j];
                var color = ~ ~(this.map_object.colors[i][j] * 40);

                var d = Math.sqrt(Math.pow(i - m.x, 2) + Math.pow(j - m.y, 2));
                if (d > max_r)
                    continue;
                var r = ((max_d - d) / max_d);

                var x = i - m.x;
                var y = j - m.y;

                x *= r;
                y *= r;

                x += m.x;
                y += m.y;

                if (tile == TILE_WATER) {
                    gl.graphics.setColor('', 'fill', 5, 50 + ~ ~(color / 2.5), 100 + ~ ~(color * 0.8), 1);
                    gl.graphics.drawScaleRectangle(x, y, r, r, true);
                }
                else if (tile == TILE_GRASS) {
                    var color_v = getColor(this.map_object.weights[i][j], this.map_object.max);
                    // color_v.x *= shade;
                    // color_v.y *= shade;
                    // color_v.z *= shade;

                    gl.graphics.setColor('', 'fill', ~ ~color_v.x, ~ ~color_v.y, ~ ~color_v.z, 1);
                    gl.graphics.drawScaleRectangle(x, y, r, r, true);
                }
                else if (tile == TILE_SAND) {
                    gl.graphics.setColor('', 'fill', ~ ~(color * 5), ~ ~(color * 4), ~ ~(color * 3), 1);
                    gl.graphics.drawScaleRectangle(x, y, r, r, true);
                }
                else {
                    gl.graphics.setColor('', 'fill', ~ ~(color * 0.4), ~ ~(color * 0.2), ~ ~(color * 0.05), 1);
                    gl.graphics.drawScaleRectangle(x, y, r, r, true);
                }
            }
        }
    }
}