/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'

export class Zoomer {
  constructor(canvas, caveView, updateCursor) {
    this.caveView = caveView
    this.updateCursor = updateCursor
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.lastX = this.canvas.clientWidth / 2
    this.lastY = this.canvas.clientHeight / 2
    this.canvasWidth = this.canvas.clientWidth
    this.canvasHeight = this.canvas.clientHeight
    this.totalXTranslation = 0
    this.totalYTranslation = 0
    this.trackTransforms(this.context)
    this.context.translate(0, 0)
    this.panning = false
    this.panningLeft = false
    this.panningUp = false
    this.panningRight = false
    this.panningDown = false
    this.canvas.addEventListener('DOMMouseScroll', this.handleScroll, false)
    this.canvas.addEventListener('mousewheel', this.handleScroll, false)
    this.canvas.addEventListener('mousedown', this.handleMouseDown, false)
    this.canvas.addEventListener('mousemove', this.handleMouseMove, false)
    this.canvas.addEventListener('mouseup', this.handleMouseUp, false)
  }

  removeEventListeners() {
    this.canvas.removeEventListener('DOMMouseScroll', this.handleScroll, false)
    this.canvas.removeEventListener('mousewheel', this.handleScroll, false)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown, false)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove, false)
    this.canvas.removeEventListener('mouseup', this.handleMouseUp, false)
  }

  resize(caveView, canvas) {
    this.caveView = caveView
    this.context = canvas.getContext('2d')
    const lastXProportion = this.lastX / this.canvasWidth
    const lastYProportion = this.lastY / this.canvasHeight
    this.lastX = Math.round(this.canvas.clientWidth * lastXProportion)
    this.lastY = Math.round(this.canvas.clientHeight * lastYProportion)
    this.totalXTranslation *= Math.round(this.canvas.width / this.canvasWidth)
    this.totalYTranslation *= Math.round(this.canvas.height / this.canvasHeight)
    this.canvasWidth = this.canvas.clientWidth
    this.canvasHeight = this.canvas.clientHeight
    this.panning = false
    this.panningLeft = false
    this.panningUp = false
    this.panningRight = false
    this.panningDown = false
    this.trackTransforms(this.context)
    this.context.translate(this.totalXTranslation, this.totalYTranslation)
    this.redraw(true)
  }

  resetZoom() {
    this.context.translate(-this.totalXTranslation, -this.totalYTranslation)
  }

  redraw(hideCursor) {
    const p1 = this.context.transformedPoint(0, 0)
    const p2 = this.context.transformedPoint(this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    this.caveView.draw({})
    const gridX = this.caveView.getGridX(this.lastX)
    const gridY = this.caveView.getGridY(this.lastY)
    if (!hideCursor) {
      this.updateCursor(gridX, gridY)
    }
  }

  trackTransforms(context) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    let xform = svg.createSVGMatrix()
    context.getTransform = function () {
      return xform
    }

    const savedTransforms = []
    const save = context.save
    context.save = function () {
      savedTransforms.push(xform.translate(0, 0))
      return Reflect.apply(save, context)
    }
    const restore = context.restore
    context.restore = function () {
      xform = savedTransforms.pop()
      return Reflect.apply(restore, context)
    }
    const scale = context.scale
    context.scale = function (sx, sy) {
      xform = xform.scaleNonUniform(sx, sy)
      return Reflect.apply(scale, context, [sx, sy])
    }
    const rotate = context.rotate
    context.rotate = function (radians) {
      xform = xform.rotate(radians * 180 / Math.PI)
      return Reflect.apply(rotate, context, [radians])
    }
    const translate = context.translate
    context.translate = function (dx, dy) {
      xform = xform.translate(dx, dy)
      return Reflect.apply(translate, context, [dx, dy])
    }
    const transform = context.transform
    context.transform = function (a, b, c, d, e, f) {
      const matrix = svg.createSVGMatrix()
      matrix.a = a
      matrix.b = b
      matrix.c = c
      matrix.d = d
      matrix.e = e
      matrix.f = f
      xform = xform.multiply(matrix)
      return Reflect.apply(transform, context, [a, b, c, d, e, f])
    }
    const setTransform = context.setTransform
    context.setTransform = function (a, b, c, d, e, f) {
      xform.a = a
      xform.b = b
      xform.c = c
      xform.d = d
      xform.e = e
      xform.f = f
      return Reflect.apply(setTransform, context, [a, b, c, d, e, f])
    }
    const point = svg.createSVGPoint()
    context.transformedPoint = function (x, y) {
      point.x = x
      point.y = y
      return point.matrixTransform(xform.inverse())
    }
  }

  zoom(mouseWheelDelta) {
    if (mouseWheelDelta >= 1) {
      this.caveView.multiplyScalingFactor(1 + (0.2 * mouseWheelDelta))
    } else {
      this.caveView.multiplyScalingFactor(1 / (1 + (0.2 * -mouseWheelDelta)))
    }

    const tilesBetweenMouseAndContextLeft = this.getNumberOfTilesFromContextLeft(this.lastX)
    const tilesBetweenMouseAndContextTop = this.getNumberOfTilesFromContextTop(this.lastY)
    this.caveView.scaleTileSize()
    const oldXContextMouseDistance = this.lastX - this.totalXTranslation
    const oldYContextMouseDistance = this.lastY - this.totalYTranslation
    const newXContextMouseDistance = this.caveView.tileSize * tilesBetweenMouseAndContextLeft
    const newYContextMouseDistance = this.caveView.tileSize * tilesBetweenMouseAndContextTop
    const xDifference = Math.round(newXContextMouseDistance - oldXContextMouseDistance)
    const yDifference = Math.round(newYContextMouseDistance - oldYContextMouseDistance)

    this.context.translate(-xDifference, -yDifference)
    this.totalXTranslation -= xDifference
    this.totalYTranslation -= yDifference

    this.redraw()
  }

  getNumberOfTilesFromContextLeft(mouseX) {
    const distanceFromContextLeft = mouseX - this.totalXTranslation
    return distanceFromContextLeft / this.caveView.tileSize
  }

  getNumberOfTilesFromContextTop(mouseY) {
    const distanceFromContextTop = mouseY - this.totalYTranslation
    return distanceFromContextTop / this.caveView.tileSize
  }

  @autobind
  handleScroll(evt) {
    const delta = evt.wheelDelta ?
          evt.wheelDelta / 40 :
          (evt.detail ? -evt.detail : 0)
    if (delta) {
      let normalisedDelta = delta / Math.abs(delta)
      if (isNaN(normalisedDelta)) {
        normalisedDelta = 0
      }
      this.zoom(normalisedDelta)
    }
    return evt.preventDefault() && false
  }

  @autobind
  handleMouseDown(evt) {
    if (evt.button === 1) {
      this.enablePanning()
    }
    if (this.panning) {
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
      this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
      this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
      this.dragStart = this.context.transformedPoint(this.lastX, this.lastY)
    }
  }

  @autobind
  handleMouseMove(evt) {
    this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft)
    this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop)
    if (this.dragStart) {
      const point = this.context.transformedPoint(this.lastX, this.lastY)
      this.context.translate(point.x - this.dragStart.x, point.y - this.dragStart.y)
      this.totalXTranslation += (point.x - this.dragStart.x)
      this.totalYTranslation += (point.y - this.dragStart.y)
      this.redraw()
    }
  }

  @autobind
  handleMouseUp(evt) {
    if (evt.button === 1) {
      this.disablePanning()
    }
    this.dragStart = null
  }

  transformPixelX(pixelX) {
    const transformedPoint = this.context.transformedPoint(pixelX, 0)
    return transformedPoint.x
  }

  transformPixelY(pixelY) {
    const transformedPoint = this.context.transformedPoint(0, pixelY)
    return transformedPoint.y
  }

  enablePanning() {
    this.panning = true
  }

  disablePanning() {
    this.panning = false
  }

  panLeft() {
    if (this.totalXTranslation <= (this.caveView.tileSize * (this.caveView.width - 2))) {
      const shift = this.caveView.tileSize
      this.context.translate(shift, 0)
      this.totalXTranslation += shift
      this.redraw()
    }
  }

  panRight() {
    if (this.totalXTranslation >= -(this.caveView.tileSize * (this.caveView.width - 2))) {
      const shift = -this.caveView.tileSize
      this.context.translate(shift, 0)
      this.totalXTranslation += shift
      this.redraw()
    }
  }

  panUp() {
    if (this.totalYTranslation <= (this.caveView.tileSize * (this.caveView.height - 2))) {
      const shift = this.caveView.tileSize
      this.context.translate(0, shift)
      this.totalYTranslation += shift
      this.redraw()
    }
  }

  panDown() {
    if (this.totalYTranslation >= -(this.caveView.tileSize * (this.caveView.height - 2))) {
      const shift = -this.caveView.tileSize
      this.context.translate(0, shift)
      this.totalYTranslation += shift
      this.redraw()
    }
  }

  startPanningLeft() {
    if (!this.panningLeft) {
      setTimeout(this.continuePanningLeft, 10)
    }
    this.panningLeft = true
  }

  @autobind
  continuePanningLeft() {
    if (this.panningLeft) {
      this.panLeft()
      setTimeout(this.continuePanningLeft, 10)
    }
  }

  stopPanningLeft() {
    this.panningLeft = false
  }

  startPanningUp() {
    if (!this.panningUp) {
      setTimeout(this.continuePanningUp, 10)
    }
    this.panningUp = true
  }

  @autobind
  continuePanningUp() {
    if (this.panningUp) {
      this.panUp()
      setTimeout(this.continuePanningUp, 10)
    }
  }

  stopPanningUp() {
    this.panningUp = false
  }

  startPanningRight() {
    if (!this.panningRight) {
      setTimeout(this.continuePanningRight, 10)
    }
    this.panningRight = true
  }

  @autobind
  continuePanningRight() {
    if (this.panningRight) {
      this.panRight()
      setTimeout(this.continuePanningRight, 10)
    }
  }

  stopPanningRight() {
    this.panningRight = false
  }

  startPanningDown() {
    if (!this.panningDown) {
      setTimeout(this.continuePanningDown, 10)
    }
    this.panningDown = true
  }

  @autobind
  continuePanningDown() {
    if (this.panningDown) {
      this.panDown()
      setTimeout(this.continuePanningDown, 10)
    }
  }

  stopPanningDown() {
    this.panningDown = false
  }
}
