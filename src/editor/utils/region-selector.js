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

  reset() {
    this.anchorPoint = null
    this.topLeft = null
    this.bottomRight = null
    this.previousTopLeft = null
    this.previousBottomRight = null
  }
}
