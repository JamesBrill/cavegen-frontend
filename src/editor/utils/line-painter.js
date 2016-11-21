/* eslint-disable no-invalid-this */

export class LinePainter {
  constructor(context) {
    this.pixel = context.createImageData(1, 1)
    this.pixel.data[0] = 255
    this.pixel.data[1] = 255
    this.pixel.data[2] = 255
    this.pixel.data[3] = 255
  }

  setColour(colour, caveView) {
    caveView.context.fillStyle = colour
    const rgb = this.hexToRgb(colour)
    this.pixel.data[0] = rgb.r
    this.pixel.data[1] = rgb.g
    this.pixel.data[2] = rgb.b
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  plotVerticalLine(x, y0, y1, caveView) {
    const bigY = Math.max(y0, y1)
    const littleY = Math.min(y0, y1)
    caveView.context.fillRect(x, littleY, 1, bigY - littleY + 1)
  }

  plotHorizontalLine(x0, x1, y, caveView) {
    const bigX = Math.max(x0, x1)
    const littleX = Math.min(x0, x1)
    caveView.context.fillRect(littleX, y, bigX - littleX + 1, 1)
  }

  outOfBounds(x, y, caveView) {
    const xLimit = (caveView.width - 1) * caveView.tileSize + caveView.border.left
    const yLimit = (caveView.height - 1) * caveView.tileSize + caveView.border.top
    return (x < 0 || y < 0 || x > xLimit || y > yLimit)
  }

  setPixelWithNoAntiAliasing(x, y, caveView) {
    caveView.context.putImageData(this.pixel, x, y)
  }
}
