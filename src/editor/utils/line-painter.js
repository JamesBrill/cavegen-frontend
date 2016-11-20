/* eslint-disable no-invalid-this */

import caveView from '' // TODO: make appropriate import here

export class LinePainter {
  constructor(context) {
    this.pixel = context.createImageData(1, 1)
    this.pixel.data[0] = 255
    this.pixel.data[1] = 255
    this.pixel.data[2] = 255
    this.pixel.data[3] = 255
  }

  setColour = function (colour) {
    caveView.context.fillStyle = colour
    const rgb = this.hexToRgb(colour)
    this.pixel.data[0] = rgb.r
    this.pixel.data[1] = rgb.g
    this.pixel.data[2] = rgb.b
  }

  hexToRgb = function (hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  plotVerticalLine = function (x, y0, y1) {
    const bigY = Math.max(y0, y1)
    const littleY = Math.min(y0, y1)
    caveView.context.fillRect(x, littleY, 1, bigY - littleY + 1)
  }

  plotHorizontalLine = function (x0, x1, y) {
    const bigX = Math.max(x0, x1)
    const littleX = Math.min(x0, x1)
    caveView.context.fillRect(littleX, y, bigX - littleX + 1, 1)
  }

  plotLine = function (x0, y0, x1, y1) {
    caveView.context.beginPath() // Could boost performance by separating this call
    caveView.context.moveTo(x0, y0)
    caveView.context.lineTo(x1, y1)
    caveView.context.stroke()
  }

  plotLineWithNoAntiAliasing = function (x0, y0, x1, y1) {
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1
    const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1
    let err = dx + dy, e2
    let _x0 = x0
    let _y0 = y0

    while ((_x0 !== x1 || _y0 !== y1) && !this.outOfBounds(_x0, _y0)) {
      this.setPixelWithNoAntiAliasing(_x0, _y0)
      if ((_x0 === x1 && _y0 === y1) || this.outOfBounds(_x0, _y0)) {
        break
      }
      e2 = 2 * err
      if (e2 >= dy) {
        err += dy
        _x0 += sx
      }
      if (e2 <= dx) {
        err += dx
        _y0 += sy
      }
    }
  }

  outOfBounds = function (x, y) {
    const xLimit = (caveView.width - 1) * caveView.tileSize + caveView.border.left
    const yLimit = (caveView.height - 1) * caveView.tileSize + caveView.border.top
    return (x < 0 || y < 0 || x > xLimit || y > yLimit)
  }

  setPixelWithNoAntiAliasing = function (x, y) {
    caveView.context.putImageData(this.pixel, x, y)
  }
}
