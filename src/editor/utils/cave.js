/* eslint-disable no-invalid-this */

import { TileChange } from 'src/editor/utils/tile-change'
import { getTileFromSpikeFiller, getTileFromSpikeRemover } from 'src/editor/utils/spike-painter'
import { getFileNameFromSymbol, getTileFromSymbol } from 'src/editor/utils/tiles'

export class Cave {
  constructor({ width, height, caveString }) {
    if (caveString) {
      this.rebuildCaveFromCaveString(caveString)
    } else {
      this.rebuildCaveFromCoordinates(width, height)
    }
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
    const caveLines = caveString.split('\n').map(x => x.replace('\r', ''))
    caveLines.splice(0, 4)
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
        if (i === 0 || i === x - 1 || j === 0 || j === y - 1) {
          newGrid[i][j] = { fileName: 'terrain', symbol: 'x' }
        } else {
          newGrid[i][j] = { fileName: 'terrain', symbol: ' ' }
        }
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
      return getTileFromSpikeFiller(this, row, column)
    }

    return getTileFromSpikeRemover(this, row, column)
  }

  applyTileChanges(tileChanges) {
    for (let i = 0; i < tileChanges.length; i++) {
      const tile = getTileFromSymbol(tileChanges[i].after.symbol)
      this.setTileAtCoordinates(tileChanges[i].x, tileChanges[i].y, tile)
    }
  }

  addColumn(x) {
    const newColumn = []
    newColumn[0] = { fileName: 'terrain', symbol: 'x' }
    for (let i = 1; i < this.height - 1; i++) {
      newColumn[i] = { fileName: 'terrain', symbol: ' ' }
    }
    newColumn[this.height - 1] = { fileName: 'terrain', symbol: 'x' }
    this.grid = [
      ...this.grid.slice(0, x),
      newColumn,
      ...this.grid.slice(x)
    ]
    this.width++
  }

  removeColumn(x) {
    if (x > 0 && x < this.grid.length - 1) {
      this.grid = [
        ...this.grid.slice(0, x),
        ...this.grid.slice(x + 1, this.width)
      ]
      this.width--
    }
  }

  addRow(y) {
    const newRow = []
    newRow[0] = { fileName: 'terrain', symbol: 'x' }
    for (let i = 1; i < this.width - 1; i++) {
      newRow[i] = { fileName: 'terrain', symbol: ' ' }
    }
    newRow[this.width - 1] = { fileName: 'terrain', symbol: 'x' }
    for (let i = 0; i < this.width; i++) {
      this.grid[i] = [
        ...this.grid[i].slice(0, y),
        newRow[i],
        ...this.grid[i].slice(y)
      ]
    }
    this.height++
  }

  removeRow(y) {
    if (y > 0 && y < this.grid[0].length - 1) {
      for (let i = 0; i < this.width; i++) {
        this.grid[i] = [
          ...this.grid[i].slice(0, y),
          ...this.grid[i].slice(y + 1, this.height)
        ]
      }
      this.height--
    }
  }

  fillRegion(brush, topLeft, bottomRight) {
    const tileChanges = []
    for (let x = topLeft.x; x <= bottomRight.x; x++) {
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        const before = this.getTileAtCoordinates(x, y)
        const after = this.getAppropriateBrush(x, y, brush)
        if (before.symbol !== after.symbol) {
          const tileChange = new TileChange(x, y, before, after)
          tileChanges.push(tileChange)
        }
        this.grid[x][y] = brush
      }
    }
    return tileChanges
  }

  pasteRegion(region, x, y) {
    const tileChanges = []
    if (region !== null) {
      for (let i = 0; i < region.length; i++) {
        for (let j = 0; j < region[0].length; j++) {
          const before = this.getTileAtCoordinates(i + x, j + y)
          const after = this.getAppropriateBrush(i + x, j + y, region[i][j])
          if (before.symbol !== after.symbol) {
            const tileChange = new TileChange(x, y, before, after)
            tileChanges.push(tileChange)
          }
          this.grid[i + x][j + y] = region[i][j]
        }
      }
    }
    return tileChanges
  }
}
