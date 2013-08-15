var dims = [200, 200]
var gen = require('./worldgen')(dims)
var water = '#0584FF'

var materials = gen.allColors
materials.unshift(water)

window.game = require('voxel-hello-world')({
  materials: materials,
  generate: function(x, y, z) {
    if (y === 34) return 1
    return 0
  },
  chunkDistance: 4
})

game.controls.target().avatar.position.copy({x: 87, y: 59, z: 95})
game.paused = false

for (var i = 0; i < dims[0]; ++i) {
  for (var j = 0; j < dims[1]; ++j) {
    var colorDecimal = gen.colors.get(i, j) || 16711680
    var hex = '#' + pad(colorDecimal.toString(16), 6)
    var colorIdx = materials.indexOf(hex)
    game.setBlock([i, gen.terrain.get(i, j), j], colorIdx)
  }
}

function pad(n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

// int samplePeriod = 1 << octave;
// double sampleFrequency = 1.0f / samplePeriod;
// 
// for(int x  = 0; x <  width; x++){
//  int sample_x0 = (x / samplePeriod) * samplePeriod;
//  int sample_x1 = (sample_x0 + samplePeriod) % width;
//  double horizontal_blend = (x  - sample_x0) * sampleFrequency;
// 
//  for(int y = 0; y < height; y++){
// int sample_y0 = (y / samplePeriod) * samplePeriod;
// int sample_y1 = (sample_y0 + samplePeriod) % height;
// double vertical_blend = (y - sample_y0) * sampleFrequency;
// 
// double top = interpolate(baseNoise[sample_x0][sample_y0], baseNoise[sample_x1][sample_y0], horizontal_blend);
// 
// double bottom = interpolate(baseNoise[sample_x0][sample_y1], baseNoise[sample_x1][sample_y1], horizontal_blend);
// 
// smoothNoise[x][y] = interpolate(top, bottom, vertical_blend);
//  }
// }  
 