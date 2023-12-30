import { js as Easystarjs } from 'easystarjs'

export default class PathfindingManager {
  constructor (map, tileset) {
    this.map = map
    this.tileset = tileset
    this.finder = new Easystarjs()
    this.setupGrid()
  }

  setupGrid () {
    const grid = []
    for (let y = 0; y < this.map.height; y++) {
      const col = []
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.map.getTileAt(x, y, false, 0) // TODO: 0 es el índice de la capa de colisión
        col.push(tile ? tile.index : 0) // TODO: 0 representa una baldosa transitable
      }
      grid.push(col)
    }
    this.finder.setGrid(grid)
    this.setAcceptableTiles()
  }

  setAcceptableTiles () {
    const properties = this.tileset.tileProperties
    const acceptableTiles = []

    for (let i = this.tileset.firstgid - 1; i < this.tileset.total; i++) {
      if (!Object.prototype.hasOwnProperty.call(properties, i)) {
        acceptableTiles.push(i + 1)
        continue
      }
      if (!properties[i].collide) {
        acceptableTiles.push(i + 1)
      }
    }

    this.finder.setAcceptableTiles(acceptableTiles)
  }

  calculatePath (fromX, fromY, toX, toY, callback) {
    this.finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        console.warn('Path not found.')
      } else {
        callback(path)
      }
    })
    this.finder.calculate()
  }
}
