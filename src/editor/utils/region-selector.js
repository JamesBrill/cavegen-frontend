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
    this.resetMovingRegion()
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
    this.resetMovingRegion()
  }

  copyRegion(grid) {
    this.copiedRegion = this.getRegionSnapshot(grid)
  }

  moveRegionLeft(grid) {
    if (this.movingRegion === null) {
      this.startMovingRegion(grid)
    }
    this.movingRegionX--
  }

  moveRegionRight(grid) {
    if (this.movingRegion === null) {
      this.startMovingRegion(grid)
    }
    this.movingRegionX++
  }

  moveRegionUp(grid) {
    if (this.movingRegion === null) {
      this.startMovingRegion(grid)
    }
    this.movingRegionY--
  }

  moveRegionDown(grid) {
    if (this.movingRegion === null) {
      this.startMovingRegion(grid)
    }
    this.movingRegionY++
  }

  startMovingRegion(grid) {
    this.movingRegion = this.getRegionSnapshot(grid)
    this.preMoveGridSnapshot = grid.map(a => a.slice())
    for (let i = this.topLeft.x; i <= this.bottomRight.x; i++) {
      for (let j = this.topLeft.y; j <= this.bottomRight.y; j++) {
        this.preMoveGridSnapshot[i][j] = { fileName: 'space', symbol: ' ' }
      }
    }
    this.movingRegionX = this.topLeft.x
    this.movingRegionY = this.topLeft.y
  }

  getRegionSnapshot(grid) {
    let regionSnapshot
    const regionWidth = this.bottomRight.x - this.topLeft.x + 1
    const regionHeight = this.bottomRight.y - this.topLeft.y + 1
    if (regionWidth * regionHeight > 0) {
      regionSnapshot = Array(regionWidth).fill().map(() => Array(regionHeight))
      for (let i = 0; i < regionWidth; i++) {
        for (let j = 0; j < regionHeight; j++) {
          regionSnapshot[i][j] = grid[i + this.topLeft.x][j + this.topLeft.y]
        }
      }
    }
    return regionSnapshot
  }

  reset() {
    this.anchorPoint = null
    this.topLeft = null
    this.bottomRight = null
    this.previousTopLeft = null
    this.previousBottomRight = null
    this.copiedRegion = null
    this.resetMovingRegion()
  }

  resetMovingRegion() {
    this.movingRegion = null
    this.movingRegionX = null
    this.movingRegionY = null
    this.preMoveGridSnapshot = null
  }
}
