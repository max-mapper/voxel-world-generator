var dims = [200, 200]
var gen = require('./worldgen')(dims)
var water = '#0584FF'

console.log(gen)

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