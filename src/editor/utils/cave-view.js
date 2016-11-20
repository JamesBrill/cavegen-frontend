/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'
import { LinePainter } from 'src/editor/utils/line-painter'
import { Zoomer } from 'src/editor/utils/zoomer'
import { getImageFromFileName } from 'src/editor/utils/image-preloader'
import brushSize from '' // TODO: make appropriate import here
import { CAVE_DISPLAY_WIDTH, CAVE_DISPLAY_HEIGHT } from '' // TODO: make appropriate import here

export class CaveView {
  constructor(x, y, tileSize, border) {
    this.location = { x: 0, y: 0 }
    this.tileSize = tileSize
    this.unscaledTileSize = tileSize
    this.border = border || { top: 0, left: 0 }
    this.pixelWidth = CAVE_DISPLAY_WIDTH
    this.pixelHeight = CAVE_DISPLAY_HEIGHT
    this.width = x
    this.height = y
    this.canvas = document.getElementById('caveGridCanvas') // TODO: hook up to React component ref
    this.canvas.width = this.pixelWidth
    this.canvas.height = this.pixelHeight
    this.context = this.canvas.getContext('2d')
    this.previousPaintedPoint = { x: -1, y: -1 }
    this.paintLineMode = false
    this.isMouseDown = false
    this.linePainter = new LinePainter(this.context)
    this.zoomer = Zoomer.getZoomer(this.canvas)
    this.scalingFactor = 1
    this.MIN_SCALING_FACTOR = 1
    this.MAX_SCALING_FACTOR = this.setMaxScalingFactor()
  }

  @autobind
  leftBorder() {
    return Math.round(this.border.left * this.scalingFactor)
  }

  @autobind
  topBorder() {
    return Math.round(this.border.top * this.scalingFactor)
  }

  draw = function (gridModel) {
    this.drawMeasuringGrid()
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.drawAtGridCoordinates(i, j, gridModel.getTileAtCoordinates(i, j))
      }
    }
  }

  @autobind
  drawMeasuringGrid = function () {
    const offset = this.tileSize
    this.linePainter.setColour('#FFFFFF')
    for (let i = 1; i < this.width; i++) {
      const x = i * this.tileSize + this.leftBorder()
      this.linePainter.plotVerticalLine(x, this.topBorder() + offset,
        this.topBorder() + this.height * this.tileSize - offset)
    }

    for (let i = 1; i < this.height; i++) {
      const y = i * this.tileSize + this.topBorder()
      this.linePainter.plotHorizontalLine(this.leftBorder() + offset,
        this.leftBorder() + this.width * this.tileSize - offset, y)
    }
  }

  @autobind
  drawAtGridCoordinates = function (x, y, tile) {
    const left = x * this.tileSize + this.leftBorder()
    const top = y * this.tileSize + this.topBorder()
    const size = this.tileSize
    if (tile.symbol === 'x') {
      this.drawSquare(left, top, size, 'gray')
    } else if (tile.symbol === ' ') {
      this.drawSquare(left, top, size, 'black')
    } else {
      this.drawImage(left, top, size, tile.fileName)
    }
  }

  drawSquare = function (left, top, size, colour) {
    this.context.beginPath()
    this.context.rect(left + 1, top + 1, size - 1, size - 1)
    this.context.fillStyle = colour
    this.context.fill()
  }

  drawImage = function (left, top, size, fileName) {
    const image = getImageFromFileName(fileName)
    this.context.drawImage(image, left + 1, top + 1, size - 1, size - 1)
  }

  getGridX = function (pixelX) {
    const newPixelX = this.zoomer.transformPixelX(pixelX) - this.leftBorder()
    return ((newPixelX - (newPixelX % this.tileSize)) / this.tileSize)
  }

  getGridY = function (pixelY) {
    const newPixelY = this.zoomer.transformPixelY(pixelY) - this.topBorder()
    return ((newPixelY - (newPixelY % this.tileSize)) / this.tileSize)
  }

  applyTileChanges = function (tileChanges) {
    for (let i = 0; i < tileChanges.length; i++) {
      this.drawAtGridCoordinates(tileChanges[i].x, tileChanges[i].y, tileChanges[i].after)
    }
  }

  drawCursor = function (column, row) {
    this.drawSquareOutline(column, row, '#FF0000')
  }

  drawSquareOutline = function (column, row, colour, previousCursorSize) {
    const squareSize = previousCursorSize || brushSize
    const unboundedTop = (Math.min(Math.max(row, 1), this.height - 2) - Math.floor(squareSize / 2)) * this.tileSize + this.topBorder()
    const unboundedLeft = (Math.min(Math.max(column, 1), this.width - 2) - Math.floor(squareSize / 2)) * this.tileSize + this.leftBorder()
    const unboundedBottom = unboundedTop + squareSize * this.tileSize
    const unboundedRight = unboundedLeft + squareSize * this.tileSize
    const top = Math.max(unboundedTop, this.topBorder() + this.tileSize)
    const left = Math.max(unboundedLeft, this.leftBorder() + this.tileSize)
    const bottom = Math.min(unboundedBottom, this.topBorder() + this.tileSize * (this.height - 1))
    const right = Math.min(unboundedRight, this.leftBorder() + this.tileSize * (this.width - 1))

    this.linePainter.setColour(colour || '#FFFFFF')
    this.linePainter.plotVerticalLine(left, top, bottom)
    this.linePainter.plotHorizontalLine(left, right, bottom)
    this.linePainter.plotVerticalLine(right, bottom, top)
    this.linePainter.plotHorizontalLine(right, left, top)
  }

  paintPositions = function (paintedPositions) {
    for (let i = 0; i < paintedPositions.length; i++) {
      this.drawAtGridCoordinates(paintedPositions[i].x, paintedPositions[i].y, paintedPositions[i].brush)
    }
  }

  setMaxScalingFactor = function () {
    const largestDimension = Math.max(this.width, this.height)
    return 3 + (largestDimension / 10) * 1.5
  }

  multiplyScalingFactor = function (coefficient) {
    this.scalingFactor *= coefficient
    this.boundScalingFactor()
  }

  boundScalingFactor = function () {
    if (this.scalingFactor < this.MIN_SCALING_FACTOR) {
      this.scalingFactor = this.MIN_SCALING_FACTOR
    }
    if (this.scalingFactor > this.MAX_SCALING_FACTOR) {
      this.scalingFactor = this.MAX_SCALING_FACTOR
    }
  }

  scaleTileSize = function () {
    this.tileSize = Math.round(this.scalingFactor * this.unscaledTileSize)
  }
}
