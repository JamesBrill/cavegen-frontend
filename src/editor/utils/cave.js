/* eslint-disable no-invalid-this */

import { TileChange } from 'src/editor/utils/tile-change'
import { getFileNameFromSymbol, getTileFromSymbol } from 'src/editor/utils/tiles'

export class Cave {
  constructor(width, height) {
    this.rebuildCaveFromCoordinates(width, height)
  }

  rebuildCaveFromCoordinates(x, y) {
    this.grid = this.createGrid(x, y)
    this.width = x
    this.height = y
  }

  rebuildCaveFromGrid(_grid) {
    this.grid = _grid.map(a => a.slice())
    this.width = _grid.length
    this.height = _grid[0].length
  }

  rebuildCaveFromCaveString(caveString) {
    const caveLines = caveString.split('\n')
    caveLines.splice(0, 4)
    caveLines.pop() // Remove empty line at the end
    this.width = caveLines[0].length
    this.height = caveLines.length // Assumes lines all equal length
    this.grid = Array(this.width).fill().map(() => Array(this.height))
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const symbol = caveLines[j].charAt(i)
        const fileName = getFileNameFromSymbol(symbol)
        this.grid[i][j] = { fileName, symbol }
      }
    }
  }

  createGrid(x, y) {
    const newGrid = Array(x).fill().map(() => Array(y))
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        newGrid[i][j] = { fileName: 'terrain', symbol: 'x' }
      }
    }
    return newGrid
  }

  getTileAtCoordinates(x, y) {
    return this.grid[x][y]
  }

  setTileAtCoordinates(x, y, tile) {
    this.grid[x][y] = tile
  }

  getSymbolFromPosition(position) {
    return this.getTileAtCoordinates(position.x, position.y).symbol
  }

  getGridClone() {
    return this.grid.map(a => a.slice())
  }

  applyBrushAtPosition(brush, position) {
    if (this.grid[position.x][position.y].symbol !== brush.symbol) {
      this.grid[position.x][position.y] = brush
      return true
    }
    return false
  }

  withinLimits(x, y) {
    return x > 0 && y > 0 && x < this.grid.length - 1 && y < this.grid[0].length - 1
  }

  getCoordinatesWithinRectangularCursor(_brushSize, column, row) {
    const coordinatesWithinRectangularCursor = []
    let rowLimit = row + Math.floor(_brushSize / 2) + 1
    let columnLimit = column + Math.floor(_brushSize / 2) + 1
    if (_brushSize % 2 === 0) {
      rowLimit--
      columnLimit--
    }
    for (let i = row - Math.floor(_brushSize / 2); i < rowLimit; i++) {
      for (let j = column - Math.floor(_brushSize / 2); j < columnLimit; j++) {
        if (this.withinLimits(j, i)) {
          coordinatesWithinRectangularCursor.push({ x: Math.round(j), y: Math.round(i) })
        }
      }
    }

    return coordinatesWithinRectangularCursor
  }

  getTileChangesFromBrush(x, y, brush, grid, brushSize) {
    const tileChanges = []
    const paintedPositions = grid.getCoordinatesWithinRectangularCursor(brushSize, x, y)
    for (let i = 0; i < paintedPositions.length; i++) {
      const paintedPositionX = paintedPositions[i].x
      const paintedPositionY = paintedPositions[i].y
      const before = this.getTileAtCoordinates(paintedPositionX, paintedPositionY)
      const after = this.getAppropriateBrush(paintedPositionX, paintedPositionY, brush)
      if (before.symbol !== after.symbol) {
        const tileChange = new TileChange(paintedPositionX, paintedPositionY, before, after)
        tileChanges.push(tileChange)
      }
    }
    return tileChanges
  }

  getAppropriateBrush(column, row, brush) {
    if (brush.symbol !== 'f' && brush.symbol !== 'r') {
      return brush
    }

    if (brush.symbol === 'f') {
      return this.spikePainter.getTileFromSpikeFiller(this, row, column)
    }

    return this.spikePainter.getTileFromSpikeRemover(this, row, column)
  }

  applyTileChanges(tileChanges) {
    for (let i = 0; i < tileChanges.length; i++) {
      const tile = getTileFromSymbol(tileChanges[i].after.symbol)
      this.setTileAtCoordinates(tileChanges[i].x, tileChanges[i].y, tile)
    }
  }
}
