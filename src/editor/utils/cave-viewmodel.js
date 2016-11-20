/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'
import { ChangeController } from 'src/editor/utils/change-controller'
import { Cave } from 'src/editor/utils/cave'
import { getBorder, getTileSize, mergeTileChanges } from 'src/editor/utils/tiles'
import { positionsBetweenPoints } from 'src/editor/utils/cave-network'
import { CaveView } from 'src/editor/utils/cave-view'
import currentBrush from '' // TODO: make appropriate import here
import lastUsedBrushSize from '' // TODO: make appropriate import here
import brushSize from '' // TODO: make appropriate import here

export class CaveViewModel {
  constructor(grid, updateGrid, caveView, updateCaveView) {
    this.grid = grid
    this.updateGrid = updateGrid
    this.caveView = caveView
    this.updateCaveView = updateCaveView
    this.caveName = '_'
    this.caveWidth = 40
    this.caveHeight = 40
    this.terrainType = '1'
    this.waterType = 'clear'
    this.changeController = new ChangeController()
    this.previousCursorPosition = { x: 1, y: 1 }
    this.previousCursorSize = -1
    this.currentCursorSize = -1
  }

  @autobind
  validatedCaveName = function () {
    const text = this.caveName()
    if (text === '') {
      return '_'
    }
    const regex = /[^a-zA-Z0-9_]/g
    let validName = text.replace(regex, '')
    if (validName.length > 20) {
      validName = validName.substring(0, 20)
    }
    if (validName.Length < 1) {
      validName = '_'
    }
    return validName
  }

  updateDimensions = function (cave) {
    const width = this.caveWidth()
    const height = this.caveHeight()
    const border = getBorder(width, height)
    const tileSize = getTileSize(width, height)

    this.grid = cave || new Cave(width, height)
    this.updateGrid(this.grid)
    this.caveView = new CaveView(width, height, tileSize, border)
    this.updateCaveView(this.caveView)
    this.caveView.draw(this.grid)
  }

  validateDimensions = function () {
    let validationReport = ''

    if (isNaN(this.caveWidth())) {
      this.caveWidth(40)
      validationReport += 'Width must be an integer.\n'
    }
    if (isNaN(this.caveHeight())) {
      this.caveHeight(40)
      validationReport += 'Height must be an integer.\n'
    }

    this.caveWidth(Math.round(this.caveWidth()))
    this.caveHeight(Math.round(this.caveHeight()))

    if (this.caveWidth() < 5) {
      this.caveWidth(5)
      validationReport += 'Width too small. Must be at least 5.\n'
    }
    if (this.caveHeight() < 5) {
      this.caveHeight(5)
      validationReport += 'Height too small. Must be at least 5.\n'
    }

    const area = this.caveWidth() * this.caveHeight()
    if (area > 8000) {
      this.caveWidth(89)
      this.caveHeight(89)
      validationReport += 'Area too large. Must be no more than 8000.\n'
    }
    if (area < 256) {
      this.caveWidth(16)
      this.caveHeight(16)
      validationReport += 'Area too small. Must be no less than 256.\n'
    }

    if (validationReport !== '') {
      alert(validationReport)
      return false
    }
    return true
  }

  continuePaintingAtMousePosition = function (pixelX, pixelY) {
    const gridX = this.caveView.getGridX(pixelX)
    const gridY = this.caveView.getGridY(pixelY)

    if (gridX === this.previousCursorPosition.x && gridY === this.previousCursorPosition.y) {
      return
    }

    if (!this.grid.withinLimits(gridX, gridY)) {
      const x = (gridX < 0) ? 0 : ((gridX > this.width - 1) ? this.width - 1 : gridX)
      const y = (gridY < 0) ? 0 : ((gridY > this.height - 1) ? this.height - 1 : gridY)
      this.caveView.previousPaintedPoint = { x, y }
    }

    if (this.caveView.isMouseDown) {
      this.caveView.paintLineMode = true
    }

    if (this.caveView.isMouseDown && this.grid.withinLimits(gridX, gridY)) {
      this.applyBrushAtPosition(gridX, gridY, currentBrush)
    }

    if (this.grid.withinLimits(gridX, gridY)) {
      this.updateCursor(gridX, gridY)
    }
  }

  startPaintingAtMousePosition = function (pixelX, pixelY) {
    this.caveView.isMouseDown = true
    const gridX = this.caveView.getGridX(pixelX)
    const gridY = this.caveView.getGridY(pixelY)
    if (this.grid.withinLimits(gridX, gridY)) {
      this.applyBrushAtPosition(gridX, gridY, currentBrush)
      this.caveView.paintLineMode = true
    }

    if (brushSize !== lastUsedBrushSize) {
      lastUsedBrushSize = brushSize
      // _gaq.push(['_trackEvent', 'Painting', 'Use New Brush Size', this.caveName(), brushSize])
    }
  }

  applyBrushAtPosition = function (x, y, brush) {
    const tileChanges = this.getTileChanges(x, y, brush)
    this.grid.applyTileChanges(tileChanges)
    this.caveView.applyTileChanges(tileChanges)
    this.changeController.addTileChanges(tileChanges)
  }

  getTileChanges = function (column, row, brush) {
    const currentPoint = { x: column, y: row }
    let tileChanges = []

    if (this.caveView.paintLineMode) {
      const lineStart = this.caveView.previousPaintedPoint
      const lineEnd = currentPoint
      let positions = positionsBetweenPoints(lineStart, lineEnd)
      positions = positions.slice(1)
      for (let i = 0; i < positions.length; i++) {
        const newTileChanges = this.grid.getTileChangesFromBrush(positions[i].x, positions[i].y, brush, this.grid, brushSize)
        tileChanges = mergeTileChanges(tileChanges, newTileChanges)
      }
    } else {
      const newTileChanges = this.grid.getTileChangesFromBrush(column, row, brush, this.grid, brushSize)
      tileChanges = mergeTileChanges(tileChanges, newTileChanges)
    }
    this.caveView.previousPaintedPoint = currentPoint
    return tileChanges
  }

  finishPainting = function () {
    if (this.caveView.isMouseDown) {
      this.changeController.addPaintedLineChange()
    }
    this.caveView.isMouseDown = false
    this.caveView.paintLineMode = false
  }

  updateCursor = function (x, y) {
    if (this.previousCursorSize !== brushSize) {
      this.caveView.drawSquareOutline(this.previousCursorPosition.x, this.previousCursorPosition.y,
                    '#FFFFFF', this.previousCursorSize, brushSize)
      this.previousCursorSize = brushSize
    }
    this.caveView.drawSquareOutline(this.previousCursorPosition.x, this.previousCursorPosition.y, brushSize)
    this.caveView.drawCursor(x, y, brushSize)
    this.previousCursorPosition = { x, y }
    this.currentCursorSize = brushSize
  }

  getCaveString = function () {
    let caveString = `${this.validatedCaveName()}\nterrain ${this.terrainType()}\nbackground 1\nwater ${this.waterType()}\n`

    for (let i = 0; i < this.caveHeight(); i++) {
      for (let j = 0; j < this.caveWidth(); j++) {
        caveString += this.grid.getTileAtCoordinates(j, i).symbol
      }
      caveString += '\n'
    }
    return caveString
  }

  getUploadableCaveString = function () {
    const caveString = this.getCaveString()
    return this.addMissingDoorAndStartingPosition(caveString)
  }

  addMissingDoorAndStartingPosition = function (caveString) {
    let additionalCharacters = ''
    if (caveString.indexOf('#') === -1) {
      additionalCharacters += '#'
    }
    if (caveString.indexOf('D') === -1) {
      additionalCharacters += 'D'
    }
    return `${caveString}${additionalCharacters}`
  }

  generateCave = function () {
    if (this.validateDimensions()) {
      this.changeController.addGenerateCaveChange(this.grid, this)
      this.updateDimensions()
      // _gaq.push(['_trackEvent', 'Generation', 'Generate Cave', 'Width', this.caveWidth()])
      // _gaq.push(['_trackEvent', 'Generation', 'Generate Cave', 'Height', this.caveHeight()])
    }
  }

  loadCave = function (caveName, caveString) {
    this.grid.rebuildCaveFromCaveString(caveString)
    this.caveName(caveName)
    this.caveWidth(this.grid.width)
    this.caveHeight(this.grid.height)
    this.updateDimensions(this.grid)
    this.changeController = new ChangeController()
  }

  undo = function (updateCaveView) {
    this.changeController.applyUndo(this.grid, this.caveView, updateCaveView)
  }

  redo = function (updateCaveView) {
    this.changeController.applyRedo(this.grid, this.caveView, updateCaveView)
  }
}
