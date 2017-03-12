/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'
import { LinePainter } from 'src/editor/utils/line-painter'
import { Zoomer } from 'src/editor/utils/zoomer'
import RegionSelector from 'src/editor/utils/region-selector'
import { getBorder, getTileSize } from 'src/editor/utils/tiles'

export class CaveView {
  constructor({ x, y, tileSize, unscaledTileSize, border, scalingFactor, canvas, grid, updateCursor, zoomer, imageMap }) {
    this.grid = grid
    this.location = { x: 0, y: 0 }
    this.tileSize = tileSize
    this.unscaledTileSize = unscaledTileSize || tileSize
    this.border = border || { top: 0, left: 0 }
    this.width = x
    this.height = y
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.previousPaintedPoint = { x: -1, y: -1 }
    this.paintLineMode = false
    this.isMouseDown = false
    this.linePainter = new LinePainter(this.context)
    this.zoomer = zoomer || new Zoomer(this.canvas, this, updateCursor)
    this.scalingFactor = scalingFactor || 1
    this.MIN_SCALING_FACTOR = 1
    this.MAX_SCALING_FACTOR = this.setMaxScalingFactor()
    this.imageMap = imageMap
    this.previousColumnLineX = this.tileSize
    this.previousRowLineY = this.tileSize
    this.lastCursorType = 'SQUARE'
    this.regionSelector = new RegionSelector()
  }

  @autobind
  leftBorder() {
    return this.border.left
  }

  @autobind
  topBorder() {
    return this.border.top
  }

  draw = function ({ grid, canvas }) {
    const cave = grid || this.grid
    if (canvas) {
      this.canvas = canvas
      this.context = this.canvas.getContext('2d')
    }
    this.drawMeasuringGrid()
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.drawAtGridCoordinates(i, j, cave.getTileAtCoordinates(i, j))
      }
    }
  }

  @autobind
  drawMeasuringGrid() {
    const offset = this.tileSize
    this.linePainter.setColour('#FFFFFF', this)
    for (let i = 1; i < this.width; i++) {
      const x = i * this.tileSize + this.leftBorder()
      this.linePainter.plotVerticalLine(x, this.topBorder() + offset,
        this.topBorder() + this.height * this.tileSize - offset, this)
    }

    for (let i = 1; i < this.height; i++) {
      const y = i * this.tileSize + this.topBorder()
      this.linePainter.plotHorizontalLine(this.leftBorder() + offset,
        this.leftBorder() + this.width * this.tileSize - offset, y, this)
    }
  }

  @autobind
  drawAtGridCoordinates(x, y, tile) {
    const left = x * this.tileSize + this.leftBorder()
    const top = y * this.tileSize + this.topBorder()
    const size = this.tileSize
    if (tile.symbol === ' ') {
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
    const image = this.getImageFromFileName(fileName)
    this.context.drawImage(image, left + 1, top + 1, size - 1, size - 1)
  }

  getImageFromFileName = function (fileName) {
    return this.imageMap.filter(x => x.fileName === fileName)[0].image
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

  drawCursor = function (column, row, pixelX, pixelY, brushSize, cursorType) {
    switch (cursorType) {
      case 'ADDCOLUMN':
        this.drawNewColumnLine(pixelX)
        break
      case 'REMOVECOLUMN':
        this.drawRemoveColumnLine(pixelX)
        break
      case 'ADDROW':
        this.drawNewRowLine(pixelY)
        break
      case 'REMOVEROW':
        this.drawRemoveRowLine(pixelY)
        break
      case 'SELECTREGION':
        if (this.regionSelector.anchorPoint === null) {
          this.drawSquareOutline(column, row, '#FF0000', 1)
        } else {
          const { topLeft, bottomRight } = this.regionSelector
          this.drawRegion(topLeft, bottomRight)
        }
        break
      case 'SQUARE':
      default:
        this.drawSquareOutline(column, row, '#FF0000', brushSize)
    }
    this.lastCursorType = cursorType
  }

  erasePreviousCursor(column, row, squareSize, cursorType) {
    const { anchorPoint, previousTopLeft, previousBottomRight, topLeft, bottomRight } = this.regionSelector
    switch (cursorType) {
      case 'ADDCOLUMN':
        this.drawNewColumnLine(this.previousColumnLineX, '#FFFFFF')
        break
      case 'REMOVECOLUMN':
        this.drawRemoveColumnLine(this.previousColumnLineX, '#FFFFFF')
        break
      case 'ADDROW':
        this.drawNewRowLine(this.previousRowLineY, '#FFFFFF')
        break
      case 'REMOVEROW':
        this.drawRemoveRowLine(this.previousRowLineY, '#FFFFFF')
        break
      case 'SELECTREGION':
        if (anchorPoint === null) {
          this.drawSquareOutline(column, row, '#FFFFFF', 1)
        } else if (previousTopLeft !== null && previousBottomRight !== null) {
          this.drawRegion(previousTopLeft, previousBottomRight, '#FFFFFF')
        } else if (topLeft !== null && bottomRight !== null) {
          this.drawRegion(topLeft, bottomRight, '#FFFFFF')
        }
        break
      case 'SQUARE':
      default:
        this.drawSquareOutline(column, row, '#FFFFFF', squareSize)
    }
  }

  drawColumnAtCursor() {
    this.drawNewColumnLine(this.previousColumnLineX)
  }

  drawRemoveColumnAtCursor() {
    this.drawRemoveColumnLine(this.previousColumnLineX)
  }

  drawNewColumnLine(pixelX, colour) {
    const linePixelX = this.getColumnInsertionPixelX(pixelX)
    this.previousColumnLineX = pixelX
    this.linePainter.setColour(colour || '#50F442', this)
    if (linePixelX - this.leftBorder() >= this.tileSize && linePixelX - this.leftBorder() <= this.tileSize * (this.width - 1)) {
      this.linePainter.plotVerticalLine(linePixelX,
                                        this.topBorder() + this.tileSize,
                                        this.topBorder() + this.tileSize * (this.height - 1),
                                        this)
    }
  }

  drawRemoveColumnLine(pixelX, colour) {
    this.previousColumnLineX = pixelX
    const column = this.getGridX(pixelX)
    const unboundedLeft = (Math.min(Math.max(column, 1), this.width - 2)) * this.tileSize + this.leftBorder()
    const unboundedRight = unboundedLeft + this.tileSize
    const top = this.topBorder() + this.tileSize
    const left = Math.max(unboundedLeft, this.leftBorder() + this.tileSize)
    const bottom = this.topBorder() + this.tileSize * (this.height - 1)
    const right = Math.min(unboundedRight, this.leftBorder() + this.tileSize * (this.width - 1))

    this.linePainter.setColour(colour || '#FF0000', this)
    this.linePainter.plotVerticalLine(left, top, bottom, this)
    this.linePainter.plotHorizontalLine(left, right, bottom, this)
    this.linePainter.plotVerticalLine(right, bottom, top, this)
    this.linePainter.plotHorizontalLine(right, left, top, this)
  }

  drawRowAtCursor() {
    this.drawNewRowLine(this.previousRowLineY)
  }

  drawRemoveRowAtCursor() {
    this.drawRemoveRowLine(this.previousRowLineY)
  }

  drawNewRowLine(pixelY, colour) {
    const linePixelY = this.getRowInsertionPixelY(pixelY)
    this.previousRowLineY = pixelY
    this.linePainter.setColour(colour || '#50F442', this)
    if (linePixelY - this.topBorder() >= this.tileSize && linePixelY - this.topBorder() <= this.tileSize * (this.height - 1)) {
      this.linePainter.plotHorizontalLine(this.leftBorder() + this.tileSize,
                                          this.leftBorder() + this.tileSize * (this.width - 1),
                                          linePixelY,
                                          this)
    }
  }

  drawRemoveRowLine(pixelY, colour) {
    this.previousRowLineY = pixelY
    const row = this.getGridY(pixelY)
    const unboundedTop = (Math.min(Math.max(row, 1), this.height - 2) * this.tileSize + this.topBorder())
    const unboundedBottom = unboundedTop + this.tileSize
    const top = Math.max(unboundedTop, this.topBorder() + this.tileSize)
    const left = this.leftBorder() + this.tileSize
    const bottom = Math.min(unboundedBottom, this.topBorder() + this.tileSize * (this.height - 1))
    const right = this.leftBorder() + this.tileSize * (this.width - 1)

    this.linePainter.setColour(colour || '#FF0000', this)
    this.linePainter.plotVerticalLine(left, top, bottom, this)
    this.linePainter.plotHorizontalLine(left, right, bottom, this)
    this.linePainter.plotVerticalLine(right, bottom, top, this)
    this.linePainter.plotHorizontalLine(right, left, top, this)
  }

  drawRegion(topLeft, bottomRight, colour) {
    const width = bottomRight.x - topLeft.x + 1
    const height = bottomRight.y - topLeft.y + 1
    const unboundedTop = (Math.min(Math.max(topLeft.y, 1), this.height - 2)) * this.tileSize + this.topBorder()
    const unboundedLeft = (Math.min(Math.max(topLeft.x, 1), this.width - 2)) * this.tileSize + this.leftBorder()
    const unboundedBottom = unboundedTop + height * this.tileSize
    const unboundedRight = unboundedLeft + width * this.tileSize
    const top = Math.max(unboundedTop, this.topBorder() + this.tileSize)
    const left = Math.max(unboundedLeft, this.leftBorder() + this.tileSize)
    const bottom = Math.min(unboundedBottom, this.topBorder() + this.tileSize * (this.height - 1))
    const right = Math.min(unboundedRight, this.leftBorder() + this.tileSize * (this.width - 1))

    this.linePainter.setColour(colour || '#FF0000', this)
    this.linePainter.plotVerticalLine(left, top, bottom, this)
    this.linePainter.plotHorizontalLine(left, right, bottom, this)
    this.linePainter.plotVerticalLine(right, bottom, top, this)
    this.linePainter.plotHorizontalLine(right, left, top, this)
  }

  fillRegion(brush) {
    const { topLeft, bottomRight } = this.regionSelector
    for (let x = topLeft.x; x <= bottomRight.x; x++) {
      for (let y = topLeft.y; y <= bottomRight.y; y++) {
        this.drawAtGridCoordinates(x, y, brush)
      }
    }
    return this.grid.fillRegion(brush, topLeft, bottomRight)
  }

  getColumnInsertionPixelX(pixelX) {
    const transformedPixel = this.zoomer.transformPixelX(pixelX)
    const distanceToPreviousVerticalGridLineX = ((transformedPixel - this.leftBorder()) % this.tileSize)
    const previousVerticalGridLineX = transformedPixel - distanceToPreviousVerticalGridLineX
    let linePixelX
    if (distanceToPreviousVerticalGridLineX < 0.5 * this.tileSize) {
      linePixelX = previousVerticalGridLineX
    } else {
      linePixelX = previousVerticalGridLineX + this.tileSize
    }
    return linePixelX
  }

  getColumnInsertionX(pixelX) {
    const columnInsertionPixelX = this.getColumnInsertionPixelX(pixelX) - this.leftBorder()
    return Math.floor(columnInsertionPixelX / this.tileSize)
  }

  getRowInsertionPixelY(pixelY) {
    const transformedPixel = this.zoomer.transformPixelY(pixelY)
    const distanceToPreviousHorizontalGridLineY = ((transformedPixel - this.topBorder()) % this.tileSize)
    const previousHorizontalGridLineY = transformedPixel - distanceToPreviousHorizontalGridLineY
    let linePixelY
    if (distanceToPreviousHorizontalGridLineY < 0.5 * this.tileSize) {
      linePixelY = previousHorizontalGridLineY
    } else {
      linePixelY = previousHorizontalGridLineY + this.tileSize
    }
    return linePixelY
  }

  getRowInsertionY(pixelY) {
    const rowInsertionPixelY = this.getRowInsertionPixelY(pixelY) - this.topBorder()
    return Math.floor(rowInsertionPixelY / this.tileSize)
  }

  drawSquareOutline = function (column, row, colour, squareSize) {
    const unboundedTop = (Math.min(Math.max(row, 1), this.height - 2) - Math.floor(squareSize / 2)) * this.tileSize + this.topBorder()
    const unboundedLeft = (Math.min(Math.max(column, 1), this.width - 2) - Math.floor(squareSize / 2)) * this.tileSize + this.leftBorder()
    const unboundedBottom = unboundedTop + squareSize * this.tileSize
    const unboundedRight = unboundedLeft + squareSize * this.tileSize
    const top = Math.max(unboundedTop, this.topBorder() + this.tileSize)
    const left = Math.max(unboundedLeft, this.leftBorder() + this.tileSize)
    const bottom = Math.min(unboundedBottom, this.topBorder() + this.tileSize * (this.height - 1))
    const right = Math.min(unboundedRight, this.leftBorder() + this.tileSize * (this.width - 1))

    this.linePainter.setColour(colour || '#FFFFFF', this)
    this.linePainter.plotVerticalLine(left, top, bottom, this)
    this.linePainter.plotHorizontalLine(left, right, bottom, this)
    this.linePainter.plotVerticalLine(right, bottom, top, this)
    this.linePainter.plotHorizontalLine(right, left, top, this)
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

  clear = function () {
    this.context.clearRect(0,
                           0,
                           this.zoomer.transformPixelX(this.canvas.clientWidth),
                           this.zoomer.transformPixelY(this.canvas.clientHeight))
  }

  addColumn(x) {
    this.grid.addColumn(x)
    this.updateToGrid()
  }

  removeColumn(x) {
    if (this.width > 3) {
      this.grid.removeColumn(x)
      this.updateToGrid()
    }
  }

  addColumnAtCursor() {
    const columnInsertionX = this.getColumnInsertionX(this.previousColumnLineX)
    this.addColumn(columnInsertionX)
  }

  removeColumnAtCursor() {
    const columnRemovalX = this.getGridX(this.previousColumnLineX)
    this.removeColumn(columnRemovalX)
  }

  addRow(y) {
    this.grid.addRow(y)
    this.updateToGrid()
  }

  removeRow(y) {
    if (this.height > 3) {
      this.grid.removeRow(y)
      this.updateToGrid()
    }
  }

  addRowAtCursor() {
    const rowInsertionY = this.getRowInsertionY(this.previousRowLineY)
    this.addRow(rowInsertionY)
  }

  removeRowAtCursor() {
    const rowRemovalY = this.getGridY(this.previousRowLineY)
    this.removeRow(rowRemovalY)
  }

  moveAddColumnLeft() {
    this.drawNewColumnLine(this.previousColumnLineX, '#FFFFFF')
    this.previousColumnLineX -= this.tileSize
    this.drawNewColumnLine(this.previousColumnLineX)
  }

  moveAddColumnRight() {
    this.drawNewColumnLine(this.previousColumnLineX, '#FFFFFF')
    this.previousColumnLineX += this.tileSize
    this.drawNewColumnLine(this.previousColumnLineX)
  }

  moveAddRowUp() {
    this.drawNewRowLine(this.previousRowLineY, '#FFFFFF')
    this.previousRowLineY -= this.tileSize
    this.drawNewRowLine(this.previousRowLineY)
  }

  moveAddRowDown() {
    this.drawNewRowLine(this.previousRowLineY, '#FFFFFF')
    this.previousRowLineY += this.tileSize
    this.drawNewRowLine(this.previousRowLineY)
  }

  moveRemoveColumnLeft() {
    this.drawRemoveColumnLine(this.previousColumnLineX, '#FFFFFF')
    this.previousColumnLineX -= this.tileSize
    this.drawRemoveColumnLine(this.previousColumnLineX)
  }

  moveRemoveColumnRight() {
    this.drawRemoveColumnLine(this.previousColumnLineX, '#FFFFFF')
    this.previousColumnLineX += this.tileSize
    this.drawRemoveColumnLine(this.previousColumnLineX)
  }

  moveRemoveRowUp() {
    this.drawRemoveRowLine(this.previousRowLineY, '#FFFFFF')
    this.previousRowLineY -= this.tileSize
    this.drawRemoveRowLine(this.previousRowLineY)
  }

  moveRemoveRowDown() {
    this.drawRemoveRowLine(this.previousRowLineY, '#FFFFFF')
    this.previousRowLineY += this.tileSize
    this.drawRemoveRowLine(this.previousRowLineY)
  }

  updateToGrid() {
    this.width = this.grid.width
    this.height = this.grid.height
    this.unscaledTileSize = getTileSize(this.width, this.height, this.canvas.width, this.canvas.height)
    this.border = getBorder(this.width, this.height, this.canvas.width, this.canvas.height, this.unscaledTileSize)
    this.scaleTileSize()
    this.clear()
    this.draw({})
    if (this.lastCursorType === 'ADDCOLUMN') {
      this.drawNewColumnLine(this.previousColumnLineX)
    } else if (this.lastCursorType === 'REMOVECOLUMN') {
      this.drawRemoveColumnLine(this.previousColumnLineX)
    } else if (this.lastCursorType === 'ADDROW') {
      this.drawNewRowLine(this.previousRowLineY)
    } else if (this.lastCursorType === 'REMOVEROW') {
      this.drawRemoveRowLine(this.previousRowLineY)
    }
  }

  isLineWithinLimits(pixelX, pixelY, gridX, gridY) {
    if (this.grid.withinLimits(gridX, gridY)) {
      return true
    }
    const xOffset = (this.zoomer.transformPixelX(pixelX) - this.leftBorder()) % this.tileSize
    const yOffset = (this.zoomer.transformPixelY(pixelY) - this.topBorder()) % this.tileSize
    let adjustedGridX, adjustedGridY
    if (xOffset > 0.5 * this.tileSize) {
      adjustedGridX = gridX + 1
    } else {
      adjustedGridX = gridX - 1
    }
    if (yOffset > 0.5 * this.tileSize) {
      adjustedGridY = gridY + 1
    } else {
      adjustedGridY = gridY - 1
    }
    return this.grid.withinLimits(adjustedGridX, adjustedGridY)
  }

  setAnchorPoint(x, y) {
    this.regionSelector.setAnchorPoint(x, y)
  }

  setBoundPoint(x, y) {
    this.regionSelector.setBoundPoint(x, y)
  }

  resetRegionSelector() {
    this.regionSelector.reset()
  }
}
