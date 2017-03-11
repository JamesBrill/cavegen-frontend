import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { getBorder, getTileSize, mergeTileChanges } from 'src/editor/utils/tiles'
import { positionsBetweenPoints } from 'src/editor/utils/cave-network'
import { getCaveCode } from 'src/editor/utils/cave-code'
import { ChangeController } from 'src/editor/utils/change-controller'
import { Cave } from 'src/editor/utils/cave'
import { CaveView } from 'src/editor/utils/cave-view'
import { setUpTileKeyListeners } from 'src/editor/utils/keyHandler'
import { connect } from 'react-redux'
import KeyHandler, { KEYDOWN, KEYUP } from 'react-key-handler'
import keydown from 'react-keydown'

// TODO: add to validation
import {
  setGrid,
  setCaveView,
  setCaveWidth,
  setCaveHeight,
  setCurrentBrush,
  setChangeController,
  setPreviousCursorSize,
  setPreviousCursorPosition,
  setLastUsedBrushSize,
  setCaveCode,
  stopRebuild
} from 'src/editor/actions'
import {
  updateCave,
  loadCaveIntoGrid
} from 'src/caves/actions'

import styles from 'src/editor/components/Grid.css'

function mapStateToProps(state) {
  const currentCaveUuid = state.caves.currentCaveUuid
  const isOwnedByAnotherUser = state.caves.isOwnedByAnotherUser
  const caves = isOwnedByAnotherUser ? state.caves.publicCaves : state.caves.caves
  const currentCave = caves && caves.filter(cave => cave.uuid === currentCaveUuid)[0]
  return {
    grid: state.editor.grid,
    caveWidth: state.editor.caveWidth,
    caveHeight: state.editor.caveHeight,
    caveView: state.editor.caveView,
    changeController: state.editor.changeController,
    currentBrush: state.editor.currentBrush,
    brushSize: state.editor.brushSize,
    lastUsedBrushSize: state.editor.lastUsedBrushSize,
    previousCursor: state.editor.previousCursor,
    needsRebuild: state.editor.needsRebuild,
    imageMap: state.editor.imageMap,
    currentCave,
    currentCaveName: state.caves.currentCaveName,
    isOwnedByAnotherUser,
    cursorType: state.editor.cursorType
  }
}

const ZOOM_IN_KEYS = ['ctrl+=', 'cmd+=', 'ctrl+alt+=', 'cmd+alt+=']
const ZOOM_OUT_KEYS = ['ctrl+-', 'cmd+-', 'ctrl+alt+-', 'cmd+alt+-']
const MOVE_LEFT_KEYS = ['left', 'alt+left']
const MOVE_UP_KEYS = ['up', 'alt+up']
const MOVE_RIGHT_KEYS = ['right', 'alt+right']
const MOVE_DOWN_KEYS = ['down', 'alt+down']

@connect(mapStateToProps)
export default class Grid extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    grid: PropTypes.object,
    caveWidth: PropTypes.number,
    caveHeight: PropTypes.number,
    caveView: PropTypes.object,
    changeController: PropTypes.object,
    brushSize: PropTypes.number,
    lastUsedBrushSize: PropTypes.number,
    previousCursor: PropTypes.object,
    cursorType: PropTypes.oneOf([
      'SQUARE',
      'ADDCOLUMN',
      'REMOVECOLUMN',
      'ADDROW',
      'REMOVEROW',
      'SELECTREGION'
    ]),
    currentBrush: PropTypes.object,
    needsRebuild: PropTypes.bool,
    imageMap: PropTypes.object,
    currentCave: PropTypes.object,
    currentCaveName: PropTypes.string,
    isOwnedByAnotherUser: PropTypes.bool
  };

  constructor(props) {
    super(props)

    this.state = {
      redrawCanvas: false,
      pixelX: 0,
      pixelY: 0,
      deleting: false,
      cursorPosition: {
        x: 0,
        y: 0
      }
    }
  }

  componentDidMount() {
    const { dispatch, currentCave } = this.props
    const changeController = new ChangeController(this.rebuildCave)
    dispatch(setChangeController(changeController))
    window.addEventListener('resize', this.handleWindowResize)
    if (currentCave) {
      dispatch(loadCaveIntoGrid(currentCave))
    }
    setUpTileKeyListeners(this.handleSelectBrush, this.handleInsertTile)
  }

  componentWillReceiveProps({ caveView, caveWidth, caveHeight, grid, needsRebuild }) {
    const { dispatch } = this.props
    if (caveView && this.props.caveView !== caveView) {
      this.setState({ redrawCanvas: true })
    } else if (needsRebuild) {
      const newCaveView = this.rebuildCave(caveWidth, caveHeight, grid)
      newCaveView.zoomer.resize(newCaveView)
      this.setState({ redrawCanvas: false })
      dispatch(stopRebuild())
    } else {
      this.setState({ redrawCanvas: false })
    }
  }

  componentDidUpdate() {
    if (this.state.redrawCanvas) {
      this.props.caveView.draw({})
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  @autobind
  buildCaveView(grid, caveWidth, caveHeight) {
    const tileSize = getTileSize(caveWidth, caveHeight, this.getCanvasWidth(), this.getCanvasHeight())
    const border = getBorder(caveWidth, caveHeight, this.getCanvasWidth(), this.getCanvasHeight(), tileSize)
    return new CaveView({
      x: caveWidth,
      y: caveHeight,
      tileSize,
      border,
      scalingFactor: 1,
      canvas: this.canvas,
      grid,
      updateCursor: this.updateCursor,
      imageMap: this.props.imageMap
    })
  }

  @autobind
  getCanvasWidth() {
    return (this.canvas && this.canvas.clientWidth) || 1000
  }

  @autobind
  getCanvasHeight() {
    return (this.canvas && this.canvas.clientHeight) || 800
  }

  @autobind
  rebuildCave(width, height, grid) {
    const { dispatch, caveView, currentCaveName } = this.props
    const caveWidth = width || this.props.caveWidth
    const caveHeight = height || this.props.caveHeight
    if (caveView) {
      caveView.zoomer.resetZoom()
      caveView.zoomer.removeEventListeners()
    }
    dispatch(setCaveWidth(caveWidth))
    dispatch(setCaveHeight(caveHeight))
    const newGrid = grid || new Cave({ width: caveWidth, height: caveHeight })
    dispatch(setGrid(newGrid))
    const caveCode = getCaveCode(newGrid, currentCaveName, '1', 'clear')
    dispatch(setCaveCode(caveCode))
    const newCaveView = this.buildCaveView(newGrid, caveWidth, caveHeight)
    dispatch(setCaveView(newCaveView))
    return newCaveView
  }

  @autobind
  handleWindowResize() {
    const { caveWidth, caveHeight, imageMap } = this.props
    const unscaledTileSize = getTileSize(caveWidth, caveHeight, this.getCanvasWidth(), this.getCanvasHeight())
    const border = this.props.caveView.border || getBorder(caveWidth, caveHeight, this.getCanvasWidth(), this.getCanvasHeight(), unscaledTileSize)
    const newCaveView = new CaveView({
      x: caveWidth,
      y: caveHeight,
      tileSize: Math.round((this.props.caveView.scalingFactor || 1) * unscaledTileSize),
      unscaledTileSize,
      border,
      scalingFactor: this.props.caveView.scalingFactor,
      canvas: this.canvas,
      grid: this.props.grid,
      updateCursor: this.updateCursor,
      zoomer: this.props.caveView.zoomer,
      imageMap
    })
    this.props.dispatch(setCaveView(newCaveView))
    newCaveView.zoomer.resize(newCaveView)
    newCaveView.draw({})
  }

  @autobind
  handleUpdateGrid(grid) {
    this.props.dispatch(setGrid(grid))
  }

  @autobind
  handleUpdateCaveView(caveView) {
    this.props.dispatch(setCaveView(caveView))
  }

  @autobind
  updateCursor(x, y) {
    const { dispatch, caveView, brushSize, previousCursor, cursorType } = this.props
    const { pixelX, pixelY } = this.state
    if (previousCursor.size !== brushSize) {
      dispatch(setPreviousCursorSize(brushSize))
    }
    caveView.erasePreviousCursor(previousCursor.position.x,
                                 previousCursor.position.y,
                                 previousCursor.size,
                                 cursorType)
    caveView.drawCursor(x, y, pixelX, pixelY, brushSize, cursorType)
    dispatch(setPreviousCursorPosition({ x, y }))
    this.setState({ cursorPosition: { x, y } })
  }

  @autobind
  finishPainting() {
    const { dispatch, caveView, grid, changeController, currentCaveName } = this.props
    const caveCode = getCaveCode(grid, currentCaveName, '1', 'clear')
    dispatch(setCaveCode(caveCode))
    if (caveView.isMouseDown) {
      changeController.addPaintedLineChange()
      dispatch(updateCave({ text: caveCode }))
    }
    caveView.isMouseDown = false
    caveView.paintLineMode = false
  }

  getTileChanges(column, row, brush) {
    const { caveView, brushSize, grid } = this.props
    const currentPoint = { x: column, y: row }
    let tileChanges = []

    if (caveView.paintLineMode) {
      const lineStart = caveView.previousPaintedPoint
      const lineEnd = currentPoint
      let positions = positionsBetweenPoints(lineStart, lineEnd)
      positions = positions.slice(1)
      for (let i = 0; i < positions.length; i++) {
        const newTileChanges = grid.getTileChangesFromBrush(positions[i].x, positions[i].y, brush, grid, brushSize)
        tileChanges = mergeTileChanges(tileChanges, newTileChanges)
      }
    } else {
      const newTileChanges = grid.getTileChangesFromBrush(column, row, brush, grid, brushSize)
      tileChanges = mergeTileChanges(tileChanges, newTileChanges)
    }
    caveView.previousPaintedPoint = currentPoint
    return tileChanges
  }

  applyBrushAtPosition(x, y, brush, ignoreCursor) {
    const { grid, caveView, changeController } = this.props
    if (brush.symbol === '6') {
      this.addColumn(x, y, ignoreCursor)
      return
    } else if (brush.symbol === '7') {
      this.removeColumn(x, y, ignoreCursor)
      return
    } else if (brush.symbol === '8') {
      this.addRow(x, y, ignoreCursor)
      return
    } else if (brush.symbol === '9') {
      this.removeRow(x, y, ignoreCursor)
      return
    }
    const tileChanges = this.getTileChanges(x, y, brush)
    grid.applyTileChanges(tileChanges)
    caveView.applyTileChanges(tileChanges)
    changeController.addTileChanges(tileChanges)
  }

  @autobind
  startPaintingAtMousePosition(optionalBrush, ignoreCursor) {
    const { isOwnedByAnotherUser, dispatch, caveView, currentBrush, grid, brushSize, lastUsedBrushSize } = this.props
    const { pixelX, pixelY, cursorPosition } = this.state
    if (isOwnedByAnotherUser) {
      return
    }
    caveView.isMouseDown = true
    const gridX = cursorPosition.x || caveView.getGridX(pixelX)
    const gridY = cursorPosition.y || caveView.getGridY(pixelY)
    if (grid.withinLimits(gridX, gridY)) {
      this.applyBrushAtPosition(gridX, gridY, optionalBrush || currentBrush, ignoreCursor)
      caveView.paintLineMode = true
    }

    if (brushSize !== lastUsedBrushSize) {
      dispatch(setLastUsedBrushSize(brushSize))
    }
  }

  continuePaintingAtMousePosition() {
    const { caveView, previousCursor, grid, currentBrush, cursorType } = this.props
    const { pixelX, pixelY, deleting } = this.state
    const spaceBrush = { fileName: 'space', symbol: ' ' }
    const gridX = caveView.getGridX(pixelX)
    const gridY = caveView.getGridY(pixelY)

    if (cursorType === 'SQUARE') {
      if (gridX === previousCursor.position.x && gridY === previousCursor.position.y) {
        return
      }

      if (!grid.withinLimits(gridX, gridY)) {
        const x = (gridX < 0) ? 0 : ((gridX > grid.width - 1) ? grid.width - 1 : gridX)
        const y = (gridY < 0) ? 0 : ((gridY > grid.height - 1) ? grid.height - 1 : gridY)
        caveView.previousPaintedPoint = { x, y }
      }

      if (caveView.isMouseDown) {
        caveView.paintLineMode = true
      }

      if (caveView.isMouseDown && grid.withinLimits(gridX, gridY)) {
        this.applyBrushAtPosition(gridX, gridY, deleting ? spaceBrush : currentBrush)
      }
    }
    if (grid.withinLimits(gridX, gridY)) {
      this.updateCursor(gridX, gridY)
    }
  }

  updateDimensions(cave) {
    const { dispatch, grid, imageMap } = this.props
    const width = grid.width
    const height = grid.height
    const tileSize = getTileSize(width, height, this.getCanvasWidth(), this.getCanvasHeight())
    const border = getBorder(width, height, this.getCanvasWidth(), this.getCanvasHeight(), tileSize)

    dispatch(setGrid(cave || new Cave({ width, height })))
    const newCaveView = new CaveView({
      x: width,
      y: height,
      tileSize,
      border,
      canvas: this.canvas,
      grid,
      updateCursor: this.updateCursor,
      imageMap
    })
    dispatch(setCaveView(newCaveView))
    newCaveView.draw({ grid: cave || new Cave({ width, height }) })
  }

  addColumn(x, y, ignoreCursor) {
    const { dispatch, caveWidth, caveView, brushSize, cursorType, grid, changeController } = this.props
    const { pixelX, pixelY } = this.state
    const gridX = caveView.getGridX(pixelX)
    const columnInsertionX = caveView.getColumnInsertionX(pixelX)
    const before = grid.getGridClone()
    if (gridX === x) {
      caveView.addColumn(columnInsertionX)
      if (!ignoreCursor) {
        caveView.drawCursor(x, y, pixelX, pixelY, brushSize, cursorType)
      }
    } else {
      caveView.addColumnAtCursor()
      if (!ignoreCursor) {
        caveView.drawColumnAtCursor()
      }
    }
    if (!ignoreCursor) {
      const newCursorX = caveView.getGridX(pixelX)
      const newCursorY = caveView.getGridY(pixelY)
      this.updateCursor(newCursorX, newCursorY)
    }
    changeController.addCaveChange(before, grid.grid)
    dispatch(setCaveWidth(caveWidth + 1))
  }

  removeColumn(x, y, ignoreCursor) {
    const { dispatch, caveWidth, caveView, brushSize, cursorType, grid, changeController } = this.props
    const { pixelX, pixelY } = this.state
    const gridX = caveView.getGridX(pixelX)
    const before = grid.getGridClone()
    if (gridX === x) {
      caveView.removeColumn(x)
      if (!ignoreCursor) {
        caveView.drawCursor(x, y, pixelX, pixelY, brushSize, cursorType)
      }
    } else {
      caveView.removeColumnAtCursor()
      if (!ignoreCursor) {
        caveView.drawRemoveColumnAtCursor()
      }
    }
    if (!ignoreCursor) {
      const newCursorX = caveView.getGridX(pixelX)
      const newCursorY = caveView.getGridY(pixelY)
      this.updateCursor(newCursorX, newCursorY)
    }
    changeController.addCaveChange(before, grid.grid)
    dispatch(setCaveWidth(caveWidth - 1))
  }

  addRow(x, y, ignoreCursor) {
    const { dispatch, caveHeight, caveView, brushSize, cursorType, grid, changeController } = this.props
    const { pixelX, pixelY } = this.state
    const gridY = caveView.getGridY(pixelY)
    const rowInsertionY = caveView.getRowInsertionY(pixelY)
    const before = grid.getGridClone()
    if (gridY === y) {
      caveView.addRow(rowInsertionY)
      if (!ignoreCursor) {
        caveView.drawCursor(x, y, pixelX, pixelY, brushSize, cursorType)
      }
    } else {
      caveView.addRowAtCursor()
      if (!ignoreCursor) {
        caveView.drawRowAtCursor()
      }
    }
    if (!ignoreCursor) {
      const newCursorX = caveView.getGridX(pixelX)
      const newCursorY = caveView.getGridY(pixelY)
      this.updateCursor(newCursorX, newCursorY)
    }
    changeController.addCaveChange(before, grid.grid)
    dispatch(setCaveHeight(caveHeight + 1))
  }

  removeRow(x, y, ignoreCursor) {
    const { dispatch, caveHeight, caveView, brushSize, cursorType, grid, changeController } = this.props
    const { pixelX, pixelY } = this.state
    const gridY = caveView.getGridY(pixelY)
    const before = grid.getGridClone()
    if (gridY === y) {
      caveView.removeRow(y)
      if (!ignoreCursor) {
        caveView.drawCursor(x, y, pixelX, pixelY, brushSize, cursorType)
      }
    } else {
      caveView.removeRowAtCursor()
      if (!ignoreCursor) {
        caveView.drawRemoveRowAtCursor()
      }
    }
    if (!ignoreCursor) {
      const newCursorX = caveView.getGridX(pixelX)
      const newCursorY = caveView.getGridY(pixelY)
      this.updateCursor(newCursorX, newCursorY)
    }
    changeController.addCaveChange(before, grid.grid)
    dispatch(setCaveHeight(caveHeight - 1))
  }

  @autobind
  handleDeleteKeyDown() {
    const { caveView, grid, changeController, cursorType } = this.props
    const spaceBrush = { fileName: 'space', symbol: ' ' }
    if (cursorType === 'SELECTREGION') {
      const { topLeft, bottomRight } = caveView.regionSelector
      caveView.fillRegion(spaceBrush, topLeft, bottomRight)
      const tileChanges = grid.fillRegion(spaceBrush, topLeft, bottomRight)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
    } else {
      this.setState({ deleting: true })
      this.startPaintingAtMousePosition(spaceBrush)
    }
  }

  @autobind
  handleInsertTile(brush) {
    const { caveView, grid, changeController, cursorType } = this.props
    if (cursorType === 'SELECTREGION') {
      const { topLeft, bottomRight } = caveView.regionSelector
      caveView.fillRegion(brush, topLeft, bottomRight)
      const tileChanges = grid.fillRegion(brush, topLeft, bottomRight)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
    } else {
      this.startPaintingAtMousePosition(brush, true)
      this.finishPainting()
    }
  }

  @autobind
  handleSelectBrush(brush) {
    const { dispatch } = this.props
    const { pixelX, pixelY } = this.state
    dispatch(setCurrentBrush(brush, pixelX, pixelY))
  }

  @autobind
  handleDeleteKeyUp() {
    this.setState({ deleting: false })
    this.finishPainting()
  }

  @autobind
  handleInsertKeyDown() {
    this.startPaintingAtMousePosition()
  }

  @autobind
  handleInsertKeyUp() {
    this.finishPainting()
  }

  @autobind
  @keydown(ZOOM_IN_KEYS)
  handleZoomIn(e) {
    e.preventDefault()
    this.props.caveView.zoomer.zoomIn()
  }

  @autobind
  @keydown(ZOOM_OUT_KEYS)
  handleZoomOut(e) {
    e.preventDefault()
    this.props.caveView.zoomer.zoomOut()
  }

  @autobind
  @keydown(MOVE_LEFT_KEYS)
  handleArrowKeyPanLeft(e) {
    e.preventDefault()
    const { caveView, cursorType } = this.props
    const { pixelX, pixelY } = this.state
    const cursorPosition = this.state.cursorPosition
    if (caveView.isLineWithinLimits(pixelX, pixelY, cursorPosition.x - 1, cursorPosition.y)) {
      if (cursorType === 'ADDCOLUMN') {
        caveView.moveAddColumnLeft()
        const newCursorPosition = {
          x: cursorPosition.x - 1,
          y: cursorPosition.y
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'REMOVECOLUMN') {
        caveView.moveRemoveColumnLeft()
        // TODO: dedupe these lines
        const newCursorPosition = {
          x: cursorPosition.x - 1,
          y: cursorPosition.y
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'SQUARE' || cursorType === 'SELECTREGION') {
        this.updateCursor(cursorPosition.x - 1, cursorPosition.y)
      }
      if (e.altKey) {
        caveView.zoomer.panLeft()
      }
    }
  }

  @autobind
  @keydown(MOVE_UP_KEYS)
  handleArrowKeyPanUp(e) {
    e.preventDefault()
    const { caveView, cursorType } = this.props
    const { pixelX, pixelY } = this.state
    const cursorPosition = this.state.cursorPosition
    if (caveView.isLineWithinLimits(pixelX, pixelY, cursorPosition.x, cursorPosition.y - 1)) {
      if (cursorType === 'ADDROW') {
        caveView.moveAddRowUp()
        const newCursorPosition = {
          x: cursorPosition.x,
          y: cursorPosition.y - 1
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'REMOVEROW') {
        caveView.moveRemoveRowUp()
        // TODO: dedupe these lines
        const newCursorPosition = {
          x: cursorPosition.x,
          y: cursorPosition.y - 1
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'SQUARE' || cursorType === 'SELECTREGION') {
        this.updateCursor(cursorPosition.x, cursorPosition.y - 1)
      }
      if (e.altKey) {
        this.props.caveView.zoomer.panUp()
      }
    }
  }

  @autobind
  @keydown(MOVE_RIGHT_KEYS)
  handleArrowKeyPanRight(e) {
    const { caveView, cursorType } = this.props
    const { pixelX, pixelY } = this.state
    const cursorPosition = this.state.cursorPosition
    if (caveView.isLineWithinLimits(pixelX, pixelY, cursorPosition.x + 1, cursorPosition.y)) {
      if (cursorType === 'ADDCOLUMN') {
        caveView.moveAddColumnRight()
        const newCursorPosition = {
          x: cursorPosition.x + 1,
          y: cursorPosition.y
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'REMOVECOLUMN') {
        caveView.moveRemoveColumnRight()
        // TODO: dedupe these lines
        const newCursorPosition = {
          x: cursorPosition.x + 1,
          y: cursorPosition.y
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'SQUARE' || cursorType === 'SELECTREGION') {
        this.updateCursor(cursorPosition.x + 1, cursorPosition.y)
      }
      if (e.altKey) {
        caveView.zoomer.panRight()
      }
    }
  }

  @autobind
  @keydown(MOVE_DOWN_KEYS)
  handleArrowKeyPanDown(e) {
    e.preventDefault()
    const { caveView, cursorType } = this.props
    const { pixelX, pixelY } = this.state
    const cursorPosition = this.state.cursorPosition
    if (caveView.isLineWithinLimits(pixelX, pixelY, cursorPosition.x, cursorPosition.y + 1)) {
      if (cursorType === 'ADDROW') {
        caveView.moveAddRowDown()
        const newCursorPosition = {
          x: cursorPosition.x,
          y: cursorPosition.y + 1
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'REMOVEROW') {
        caveView.moveRemoveRowDown()
        // TODO: dedupe these lines
        const newCursorPosition = {
          x: cursorPosition.x,
          y: cursorPosition.y + 1
        }
        this.setState({ cursorPosition: newCursorPosition })
      } else if (cursorType === 'SQUARE' || cursorType === 'SELECTREGION') {
        this.updateCursor(cursorPosition.x, cursorPosition.y + 1)
      }
      if (e.altKey) {
        this.props.caveView.zoomer.panDown()
      }
    }
  }

  @autobind
  handleMouseDown(e) {
    const { caveView, grid, cursorType } = this.props
    const { cursorPosition } = this.state
    if (cursorType === 'SELECTREGION' && grid.withinLimits(cursorPosition.x, cursorPosition.y)) {
      caveView.setAnchorPoint(cursorPosition.x, cursorPosition.y)
      caveView.isMouseDown = true
      this.updateCursor(cursorPosition.x, cursorPosition.y)
    } else if (!caveView.zoomer.panning) {
      this.setState({ pixelX: e.pageX - this.canvas.offsetLeft - this.canvas.offsetParent.offsetLeft })
      this.setState({ pixelY: e.pageY - this.canvas.offsetTop - this.canvas.offsetParent.offsetTop })
      this.startPaintingAtMousePosition()
    }
  }

  @autobind
  handleMouseUp() {
    this.finishPainting()
  }

  @autobind
  handleMouseMove(e) {
    const { caveView, grid, cursorType } = this.props
    const pixelX = e.pageX - this.canvas.offsetLeft - this.canvas.offsetParent.offsetLeft
    const pixelY = e.pageY - this.canvas.offsetTop - this.canvas.offsetParent.offsetTop
    this.setState({ pixelX, pixelY })

    if (cursorType === 'SELECTREGION' && caveView.isMouseDown) {
      const gridX = caveView.getGridX(pixelX)
      const gridY = caveView.getGridY(pixelY)
      if (grid.withinLimits(gridX, gridY)) {
        caveView.setBoundPoint(gridX, gridY)
        this.updateCursor(gridX, gridY)
      }
    } else {
      this.continuePaintingAtMousePosition()
    }
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Grid, className)
    const newCanvasWidth = this.getCanvasWidth()
    const newCanvasHeight = this.getCanvasHeight()

    return (
      <div className={computedClassName}>
        <KeyHandler keyEventName={KEYDOWN} keyValue='Insert' onKeyHandle={this.handleInsertKeyDown} />
        <KeyHandler keyEventName={KEYUP} keyValue='Insert' onKeyHandle={this.handleInsertKeyUp} />
        <KeyHandler keyEventName={KEYDOWN} keyValue='Delete' onKeyHandle={this.handleDeleteKeyDown} />
        <KeyHandler keyEventName={KEYUP} keyValue='Delete' onKeyHandle={this.handleDeleteKeyUp} />
        <KeyHandler keyEventName={KEYDOWN} keyValue='Backspace' onKeyHandle={this.handleDeleteKeyDown} />
        <KeyHandler keyEventName={KEYUP} keyValue='Backspace' onKeyHandle={this.handleDeleteKeyUp} />
        <canvas
          className={styles.canvas}
          width={newCanvasWidth}
          height={newCanvasHeight}
          ref={canvas => (this.canvas = canvas)}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp} />
      </div>
    )
  }
}
