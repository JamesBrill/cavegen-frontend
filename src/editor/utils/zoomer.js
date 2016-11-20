/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'
import caveViewModel from '' // TODO: make appropriate import here
import caveView from '' // TODO: make appropriate import here
import grid from '' // TODO: make appropriate import here

export class Zoomer {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.lastX = this.canvas.width / 2
    this.lastY = this.canvas.height / 2
    this.totalXTranslation = 0
    this.totalYTranslation = 0
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

  static zoomerInstance = null

  static getZoomer(canvas) {
    if (Zoomer.zoomerInstance === null) {
      Zoomer.zoomerInstance = new Zoomer(canvas)
    }
    const context = Zoomer.zoomerInstance.context
    Zoomer.zoomerInstance.trackTransforms(context)
    Zoomer.zoomerInstance.totalXTranslation = 0
    Zoomer.zoomerInstance.totalYTranslation = 0
    return Zoomer.zoomerInstance
  }

  redraw = function () {
    const p1 = this.context.transformedPoint(0, 0)
    const p2 = this.context.transformedPoint(this.canvas.width, this.canvas.height)
    this.context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
    caveView.draw(grid)
    const gridX = caveView.getGridX(this.lastX)
    const gridY = caveView.getGridY(this.lastY)
    caveViewModel.updateCursor(gridX, gridY)
  }

  trackTransforms = function (context) {
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

  zoom = function (mouseWheelDelta) {
    if (mouseWheelDelta >= 1) {
      caveView.multiplyScalingFactor(1 + (0.2 * mouseWheelDelta))
    } else {
      caveView.multiplyScalingFactor(1 / (1 + (0.2 * -mouseWheelDelta)))
    }

    const tilesBetweenMouseAndContextLeft = this.getNumberOfTilesFromContextLeft(this.lastX)
    const tilesBetweenMouseAndContextTop = this.getNumberOfTilesFromContextTop(this.lastY)
    caveView.scaleTileSize()
    const oldXContextMouseDistance = this.lastX - this.totalXTranslation
    const oldYContextMouseDistance = this.lastY - this.totalYTranslation
    const newXContextMouseDistance = caveView.tileSize * tilesBetweenMouseAndContextLeft
    const newYContextMouseDistance = caveView.tileSize * tilesBetweenMouseAndContextTop
    const xDifference = Math.round(newXContextMouseDistance - oldXContextMouseDistance)
    const yDifference = Math.round(newYContextMouseDistance - oldYContextMouseDistance)

    this.context.translate(-xDifference, -yDifference)
    this.totalXTranslation -= xDifference
    this.totalYTranslation -= yDifference

    this.redraw()
  }

  getNumberOfTilesFromContextLeft = function (mouseX) {
    const distanceFromContextLeft = mouseX - this.totalXTranslation
    return distanceFromContextLeft / caveView.tileSize
  }

  getNumberOfTilesFromContextTop = function (mouseY) {
    const distanceFromContextTop = mouseY - this.totalYTranslation
    return distanceFromContextTop / caveView.tileSize
  }

  @autobind
  handleScroll = function (evt) {
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
  handleMouseDown = function (evt) {
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
  handleMouseMove = function (evt) {
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
  handleMouseUp = function (evt) {
    if (evt.button === 1) {
      this.disablePanning()
    }
    this.dragStart = null
  }

  transformPixelX = function (pixelX) {
    const transformedPoint = this.context.transformedPoint(pixelX, 0)
    return transformedPoint.x
  }

  transformPixelY = function (pixelY) {
    const transformedPoint = this.context.transformedPoint(0, pixelY)
    return transformedPoint.y
  }

  enablePanning = function () {
    this.panning = true
  }

  disablePanning = function () {
    this.panning = false
  }

  panLeft = function () {
    if (this.totalXTranslation <= (caveView.tileSize * (caveView.width - 2))) {
      const shift = caveView.tileSize
      this.context.translate(shift, 0)
      this.totalXTranslation += shift
      this.redraw()
    }
  }

  panRight = function () {
    if (this.totalXTranslation >= -(caveView.tileSize * (caveView.width - 2))) {
      const shift = -caveView.tileSize
      this.context.translate(shift, 0)
      this.totalXTranslation += shift
      this.redraw()
    }
  }

  panUp = function () {
    if (this.totalYTranslation <= (caveView.tileSize * (caveView.height - 2))) {
      const shift = caveView.tileSize
      this.context.translate(0, shift)
      this.totalYTranslation += shift
      this.redraw()
    }
  }

  panDown = function () {
    if (this.totalYTranslation >= -(caveView.tileSize * (caveView.height - 2))) {
      const shift = -caveView.tileSize
      this.context.translate(0, shift)
      this.totalYTranslation += shift
      this.redraw()
    }
  }

  startPanningLeft = function () {
    if (!this.panningLeft) {
      setTimeout(this.continuePanningLeft, 10)
    }
    this.panningLeft = true
  }

  @autobind
  continuePanningLeft = function () {
    if (this.panningLeft) {
      this.panLeft()
      setTimeout(this.continuePanningLeft, 10)
    }
  }

  stopPanningLeft = function () {
    this.panningLeft = false
  }

  startPanningUp = function () {
    if (!this.panningUp) {
      setTimeout(this.continuePanningUp, 10)
    }
    this.panningUp = true
  }

  @autobind
  continuePanningUp = function () {
    if (this.panningUp) {
      this.panUp()
      setTimeout(this.continuePanningUp, 10)
    }
  }

  stopPanningUp = function () {
    this.panningUp = false
  }

  startPanningRight = function () {
    if (!this.panningRight) {
      setTimeout(this.continuePanningRight, 10)
    }
    this.panningRight = true
  }

  @autobind
  continuePanningRight = function () {
    if (this.panningRight) {
      this.panRight()
      setTimeout(this.continuePanningRight, 10)
    }
  }

  stopPanningRight = function () {
    this.panningRight = false
  }

  startPanningDown = function () {
    if (!this.panningDown) {
      setTimeout(this.continuePanningDown, 10)
    }
    this.panningDown = true
  }

  @autobind
  continuePanningDown = function () {
    if (this.panningDown) {
      this.panDown()
      setTimeout(this.continuePanningDown, 10)
    }
  }

  stopPanningDown = function () {
    this.panningDown = false
  }
}

Zoomer.zoomerInstance = null
