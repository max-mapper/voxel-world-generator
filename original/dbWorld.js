function dbWorld(s) {
    this.s = new Vector(s.x, s.y);
    this.build = function (x, y, zoom, seeds, max) {
        var map_object = new Object();
        var map = new get2DArray(this.s.x, this.s.y);
        var weights = new get2DArray(this.s.x, this.s.y);
        var colors = new get2DArray(this.s.x, this.s.y);

        if (seeds == null) {
            x = 0;
            y = 0;
            zoom = 1;
            seeds = [randInt(0, 10000), randInt(0, 10000), randInt(0, 10000)];
            max = 0;
        }

        var sea_level = 35;
        var div_sea = 1 / Math.pow(sea_level, 6);

        for (var i = 0; i < this.s.x; i++) {
            var ii = (i / zoom) + x;
            for (var j = 0; j < this.s.y; j++) {
                var jj = (j / zoom) + y;

                var elevation = randPerlin(ii + seeds[0], jj + seeds[0], 200, 1);
                var roughness = randPerlin(ii + seeds[1], jj + seeds[1], 70, 1);
                var detail = randPerlin(ii + seeds[2], jj + seeds[2], 25, 1);

                var res = (((elevation * roughness) * 32) + (detail * 8) - 8);

                if (res > sea_level) {
                    if (res > sea_level + 4) {
                        map[i][j] = TILE_GRASS;
                        colors[i][j] = 5;
                        weights[i][j] = (res - sea_level) / 10;
                        weights[i][j] = Math.pow(weights[i][j] * 4, 2);

                        if (weights[i][j] > max)
                            max = weights[i][j];
                    }
                    else {
                        map[i][j] = TILE_SAND;
                        colors[i][j] = roughness;
                        weights[i][j] = 0;
                    }
                }
                else {
                    map[i][j] = TILE_WATER;
                    colors[i][j] = 15 * (Math.pow(res, 6) * div_sea);
                    weights[i][j] = 0;
                }
              voxelgame.setBlock([i, res, j], map[i][j] + 1)
            }
        }

        max += 4;

        //var before_date = new Date();
        //var before = (before_date.getHours() * 60 * 60 * 1000) + (before_date.getMinutes() * 60 * 1000) + (before_date.getSeconds() * 1000) + before_date.getMilliseconds();
        // var shading = this.raytrace(map, weights, max);
        //var after_date = new Date();
        //var after = (after_date.getHours() * 60 * 60 * 1000) + (after_date.getMinutes() * 60 * 1000) + (after_date.getSeconds() * 1000) + after_date.getMilliseconds();

        //alert(after - before);

        //Build Rivers
        /*var source = new Object();
        source.v = new Vector(0, s.y - 1);
        source.tv = new Vector(0, s.y - 1);

        var target = new Object();
        target.v = new Vector(s.x - 1, 0);

        var ai = new GL_AI(s.x, s.y);
        ai.setWalkability(weights);

        var loop = 25;

        for (var i = 0; i < loop; i++) {
        target.v.x = randInt(0, s.x - 1);
        target.v.y = randInt(0, s.y - 1);
        ai.setTarget(target);

        source.v.x = s.x / 2;
        source.v.y = s.y / 2;

        var path = ai.setPath(source, true);

        for (var j = 0; j < path.length; j++) {
        var id = path[j].id;
        var v = ai.getCoordinatesFromID(id);
        map[v.x][v.y] = TILE_WATER;
        }

        this.recurseWater(map, weights, target.v.x, target.v.y, 1, weights[target.v.x][target.v.y]);
        }
        */
        map_object.map = map;
        map_object.colors = colors;
        // map_object.shading = shading;
        map_object.weights = weights;
        map_object.max = max;
        map_object.x = x;
        map_object.y = y;
        map_object.zoom = zoom;
        map_object.seeds = seeds;

        return map_object;
    }

    //How many rays escape (detailed lighting)
    this.raytrace = function (map, heights, high) {
        shading = get2DArray(this.s.x, this.s.y);

        var point_count = 64;
        var points = points_on_sphere(point_count);
        var div_pc = point_count / 2;

        var h = 0;
        var count = 1;
        var speed = 1;
        var distance = 50;

        var p = null;

        var t = new Vector(0, 0);

        var tx = 0;
        var ty = 0;

        for (var i = 0; i < this.s.x; i++) {
            for (var j = 0; j < this.s.y; j++) {
                var tile = map[i][j];
                if (tile == TILE_GRASS) {
                    h = heights[i][j];
                    count = 1;

                    for (var a = 0; a < point_count; a++) {
                        p = points[a];
                        t.x = i;
                        t.y = j;
                        th = h;

                        for (var d = 0; d < distance; d++) {
                            t.x -= p.x;
                            t.y -= p.z;
                            th += p.y;

                            if ((t.x < 0) || (t.x >= this.s.x - 1) || (t.y < 0) || (t.y >= this.s.y - 1) || (th >= high))
                                break;

                            tx = ~ ~t.x;
                            ty = ~ ~t.y;

                            if ((tx != i) && (ty == j))
                                continue;

                            if (heights[tx][ty] >= th) {
                                count++;
                                break;
                            }
                        }
                    }

                    shading[i][j] = (1 / count) * div_pc;
                }
            }
        }

        return shading;
    }

    this.recurseWater = function (map, heights, x, y, power, originalHeight) {
        if (heights[x][y] < originalHeight + power) {
            map[x][y] = TILE_GROUND;

            //Left, Right, Up, Down
            if ((x > 0) && (map[x - 1][y] != TILE_GROUND))
                this.recurseWater(map, heights, x - 1, y, power, heights[x][y]);
            if ((x < this.s.x - 1) && (map[x + 1][y] != TILE_GROUND))
                this.recurseWater(map, heights, x + 1, y, power, heights[x][y]);
            if ((y > 0) && (map[x][y - 1] != TILE_GROUND))
                this.recurseWater(map, heights, x, y - 1, power, heights[x][y]);
            if ((y < this.s.y - 1) && (map[x][y + 1] != TILE_GROUND))
                this.recurseWater(map, heights, x, y + 1, power, heights[x][y]);
        }
    }
}
