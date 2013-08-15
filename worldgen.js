var ndarray = require('ndarray')
var perlin = require('./perlin')

var TILE_GRASS = 0
var TILE_GROUND = 1
var TILE_WATER = 2
var TILE_SAND = 3
var TILE_ROCK = 4

module.exports = World

function World(size) {
  if (!(this instanceof World)) return new World(size)
  this.size = size
  return this.build(0, 0, 1, [814, 3089, 5616], 0)
}

World.prototype.build = function (x, y, zoom, seeds, max) {
  var s = this.size
  var len = s[0] * s[1]
  var map_object = {}
  
  var map = ndarray(new Float32Array(len), [s[0], s[1]])
  var terrain = ndarray(new Float32Array(len), [s[0], s[1]])
  var weights = ndarray(new Float32Array(len), [s[0], s[1]])
  var colors = ndarray(new Float32Array(len), [s[0], s[1]])
  
  if (seeds == null) {
    x = 0
    y = 0
    zoom = 1
    seeds = [randInt(0, 10000), randInt(0, 10000), randInt(0, 10000)]
    max = 0
  }

  var sea_level = 35
  var div_sea = 1 / Math.pow(sea_level, 6)

  for (var i = 0; i < s[0]; i++) {
    var ii = (i / zoom) + x
    for (var j = 0; j < s[1]; j++) {
      var jj = (j / zoom) + y

      var elevation = perlin(ii + seeds[0], jj + seeds[0], 200, 1)
      var roughness = perlin(ii + seeds[1], jj + seeds[1], 70, 1)
      var detail = perlin(ii + seeds[2], jj + seeds[2], 25, 1)
      var res = ~~(((elevation * roughness) * 32) + (detail * 8) - 8)

      terrain.set(i, j, res)
      
      if (res > sea_level) {
        if (res > sea_level + 4) {
          map.set(i, j, TILE_GRASS)
          var weight = ~~Math.pow(((res - sea_level) / 10) * 4, 2)
          if (weight > max) max = weight
          weights.set(i, j, weight)
        } else {
          map.set(i, j, TILE_SAND)
          weights.set(i, j, 0)
        }
        
      } else {
        map.set(i, j, TILE_WATER)
        weights.set(i, j, 0)
      }
    }
  }
  
  max += 4
  
  var colorMap = {}
  for(var i = 0; i < s[0]; ++i) {
    for(var j = 0; j < s[1]; ++j) {
      var color_v = getColor(weights.get(i, j), max)
      var rgb = color_v.map(function(v) { return ~~v })
      var hex = rgb2hex(rgb)
      colorMap['#' + hex] = true
      colors.set(i, j, parseInt('0x' + hex, 16))
    }
  }

  map_object.allColors = Object.keys(colorMap)
  map_object.map = map
  map_object.colors = colors
  map_object.weights = weights
  map_object.max = max
  map_object.terrain = terrain
  map_object.x = x
  map_object.y = y
  map_object.zoom = zoom
  map_object.seeds = seeds

  return map_object
}

function randFloat(min, max) {
  return (min + (Math.random() * (max - min)))
}

function randInt(min, max) {
  return parseInt(randFloat(min, max + 1))
}

function v2h(value) {
  value = parseInt(value).toString(16)
  return value.length < 2 ? value + "0" : value
}

function rgb2hex(arr) {
  return v2h(arr[0]) + v2h(arr[1]) + v2h(arr[2])
}

function getColor(h, max) {
  var colors = []
  colors.push([0, 100, 0])
  colors.push([0, 200, 0])
  colors.push([100, 150, 0])
  colors.push([100, 75, 0])
  colors.push([50, 25, 0])

  var d = [max / 50, (max / 20), (max / 5), max]

  for (var i = 0; i < colors.length; i++) {
    if (i == colors.length - 1)
      return colors[colors.length - 1]
    if (h <= d[i]) {
      var low = 0
      if (i > 0) low = d[i - 1]
      var high = d[i]

      var dc = (h - low) / (high - low)

      var low_color = colors[i]
      var high_color = colors[i + 1]

      var c = [low_color[0], low_color[1], low_color[2]]
      c[0] += ((high_color[0] - low_color[0]) * dc)
      c[1] += ((high_color[1] - low_color[1]) * dc)
      c[2] += ((high_color[2] - low_color[2]) * dc)

      return c
    }
  }
}