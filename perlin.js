module.exports = randPerlin

function randPerlin(x, y, zoom, mult) {
    var total = 0.0;
    var n = 2;
    var p = 0.7;
    
    for (var i = 1; i <= n; i++) {
        var frequency = Math.pow(2, i);
        var amplitude = Math.pow(p, i);

        total += (randPerlinInterpolateNoise(x * (frequency / zoom), y * (frequency / zoom)) * amplitude);
    }

    return (total + 1) * mult;
}

function randPerlinNoise(x, y) {
    var n = Math.floor(x) + Math.floor(y) * 57;
    n = ((n << 13) ^ n);
    var nn = (n * (n * n * 60493 + 19990303) + 1376312589);
    nn = parseInt((nn.toString().substr(2, 18)));
    nn = (nn & 0x7fffffff);

    return 1.0 - (nn / 1073741824.0);
}

function randPerlinInterpolateNoise(x, y) {
    var floorX = Math.floor(x);
    var floorY = Math.floor(y);
    var s, t, u, v;

    s = randPerlinNoise(floorX, floorY);
    t = randPerlinNoise(floorX + 1, floorY);
    u = randPerlinNoise(floorX, floorY + 1);
    v = randPerlinNoise(floorX + 1, floorY + 1);

    var int1 = randPerlinInterpolate(s, t, x - floorX);
    var int2 = randPerlinInterpolate(u, v, x - floorX);

    return randPerlinInterpolate(int1, int2, y - floorY);
}

function randPerlinInterpolate(a, b, x) {
    var ft = x * 3.1415927;
    var f = (1.0 - Math.cos(ft)) * 0.5;

    return (a * (1.0 - f)) + (b * f);
}