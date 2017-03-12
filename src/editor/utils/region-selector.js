export default class RegionSelector {
  constructor() {
    this.reset()
  }

  setAnchorPoint(x, y) {
    this.anchorPoint = { x, y }
    if (this.topLeft !== null || this.bottomRight !== null) {
      this.previousTopLeft = this.topLeft
      this.previousBottomRight = this.bottomRight
    }
    this.topLeft = { x, y }
    this.bottomRight = { x, y }
  }

  setBoundPoint(x, y) {
    if (this.anchorPoint === null) {
      this.setAnchorPoint(x, y)
    } else {
      const minX = Math.min(x, this.anchorPoint.x)
      const minY = Math.min(y, this.anchorPoint.y)
      const maxX = Math.max(x, this.anchorPoint.x)
      const maxY = Math.max(y, this.anchorPoint.y)
      this.previousTopLeft = this.topLeft
      this.previousBottomRight = this.bottomRight
      this.topLeft = { x: minX, y: minY }
      this.bottomRight = { x: maxX, y: maxY }
    }
  }

  copyRegion(grid) {
    const regionWidth = this.bottomRight.x - this.topLeft.x + 1
    const regionHeight = this.bottomRight.y - this.topLeft.y + 1
    if (regionWidth * regionHeight > 0) {
      this.copiedRegion = Array(regionWidth).fill().map(() => Array(regionHeight))
      for (let i = 0; i < regionWidth; i++) {
        for (let j = 0; j < regionHeight; j++) {
          this.copiedRegion[i][j] = grid[i + this.topLeft.x][j + this.topLeft.y]
        }
      }
    }
  }

  reset() {
    this.anchorPoint = null
    this.topLeft = null
    this.bottomRight = null
    this.previousTopLeft = null
    this.previousBottomRight = null
    this.copiedRegion = null
  }
}
