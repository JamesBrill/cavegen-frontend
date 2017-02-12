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
    isOwnedByAnotherUser
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
    setUpTileKeyListeners(brush => dispatch(setCurrentBrush(brush)), this.handleInsertTile)
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
    const { dispatch, caveView, brushSize, previousCursor } = this.props
    if (previousCursor.size !== brushSize) {
      caveView.drawSquareOutline(previousCursor.position.x, previousCursor.position.y,
                    '#FFFFFF', previousCursor.size, brushSize)
      dispatch(setPreviousCursorSize(brushSize))
    }
    caveView.drawSquareOutline(previousCursor.position.x, previousCursor.position.y, '#FFFFFF', brushSize)
    caveView.drawCursor(x, y, brushSize)
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

  applyBrushAtPosition(x, y, brush) {
    if (brush.symbol === '6') {
      this.addColumn(x, y)
      return
    }
    const { grid, caveView, changeController } = this.props
    const tileChanges = this.getTileChanges(x, y, brush)
    grid.applyTileChanges(tileChanges)
    caveView.applyTileChanges(tileChanges)
    changeController.addTileChanges(tileChanges)
  }

  @autobind
  startPaintingAtMousePosition(optionalBrush) {
    const { isOwnedByAnotherUser, dispatch, caveView, currentBrush, grid, brushSize, lastUsedBrushSize } = this.props
    const { pixelX, pixelY } = this.state
    if (isOwnedByAnotherUser) {
      return
    }
    caveView.isMouseDown = true
    const cursorPosition = this.state.cursorPosition
    const gridX = cursorPosition.x || caveView.getGridX(pixelX)
    const gridY = cursorPosition.y || caveView.getGridY(pixelY)
    if (grid.withinLimits(gridX, gridY)) {
      this.applyBrushAtPosition(gridX, gridY, optionalBrush || currentBrush)
      caveView.paintLineMode = true
    }

    if (brushSize !== lastUsedBrushSize) {
      dispatch(setLastUsedBrushSize(brushSize))
    }
  }

  continuePaintingAtMousePosition() {
    const { caveView, previousCursor, grid, currentBrush } = this.props
    const { pixelX, pixelY, deleting } = this.state
    const spaceBrush = { fileName: 'space', symbol: ' ' }
    const gridX = caveView.getGridX(pixelX)
    const gridY = caveView.getGridY(pixelY)

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

  addColumn(x, y) {
    const { dispatch, caveWidth, caveView, brushSize } = this.props
    // TODO: add change to change history
    // TODO: fix dimensions when zooming
    caveView.addColumn(x)
    caveView.drawCursor(x, y, brushSize)
    dispatch(setCaveWidth(caveWidth + 1))
  }

  @autobind
  handleDeleteKeyDown() {
    this.setState({ deleting: true })
    const spaceBrush = { fileName: 'space', symbol: ' ' }
    this.startPaintingAtMousePosition(spaceBrush)
  }

  @autobind
  handleInsertTile(brush) {
    this.startPaintingAtMousePosition(brush)
    this.finishPainting()
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
    const cursorPosition = this.state.cursorPosition
    if (this.props.grid.withinLimits(cursorPosition.x - 1, cursorPosition.y)) {
      this.updateCursor(cursorPosition.x - 1, cursorPosition.y)
      if (e.altKey) {
        this.props.caveView.zoomer.panLeft()
      }
    }
  }

  @autobind
  @keydown(MOVE_UP_KEYS)
  handleArrowKeyPanUp(e) {
    e.preventDefault()
    const cursorPosition = this.state.cursorPosition
    if (this.props.grid.withinLimits(cursorPosition.x, cursorPosition.y - 1)) {
      this.updateCursor(cursorPosition.x, cursorPosition.y - 1)
      if (e.altKey) {
        this.props.caveView.zoomer.panUp()
      }
    }
  }

  @autobind
  @keydown(MOVE_RIGHT_KEYS)
  handleArrowKeyPanRight(e) {
    e.preventDefault()
    const cursorPosition = this.state.cursorPosition
    if (this.props.grid.withinLimits(cursorPosition.x + 1, cursorPosition.y)) {
      this.updateCursor(cursorPosition.x + 1, cursorPosition.y)
      if (e.altKey) {
        this.props.caveView.zoomer.panRight()
      }
    }
  }

  @autobind
  @keydown(MOVE_DOWN_KEYS)
  handleArrowKeyPanDown(e) {
    e.preventDefault()
    const cursorPosition = this.state.cursorPosition
    if (this.props.grid.withinLimits(cursorPosition.x, cursorPosition.y + 1)) {
      this.updateCursor(cursorPosition.x, cursorPosition.y + 1)
      if (e.altKey) {
        this.props.caveView.zoomer.panDown()
      }
    }
  }

  @autobind
  handleMouseDown(e) {
    const { caveView } = this.props
    if (!caveView.zoomer.panning) {
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
    this.setState({ pixelX: e.pageX - this.canvas.offsetLeft - this.canvas.offsetParent.offsetLeft })
    this.setState({ pixelY: e.pageY - this.canvas.offsetTop - this.canvas.offsetParent.offsetTop })
    this.continuePaintingAtMousePosition()
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
