import React, { PureComponent, PropTypes } from 'react'
import classNames from 'classnames'
import { autobind } from 'core-decorators'
import { preloadImages } from 'src/editor/utils/image-preloader'
import { getBorder, getTileSize, mergeTileChanges } from 'src/editor/utils/tiles'
import { addMouseEventListeners, addKeyboardEventListeners } from 'src/editor/utils/event-listener-builder'
import { positionsBetweenPoints } from 'src/editor/utils/cave-network'
import { Cave } from 'src/editor/utils/cave'
import { CaveView } from 'src/editor/utils/cave-view'
import { connect } from 'react-redux'

// TODO: add to validation
import {
  setGrid,
  setCaveView,
  setPreviousCursorSize,
  setPreviousCursorPosition,
  setLastUsedBrushSize
} from 'src/editor/actions'

import styles from 'src/editor/components/Grid.css'

function mapStateToProps(state) {
  return {
    grid: state.editor.grid,
    caveView: state.editor.caveView,
    caveViewModel: state.editor.caveViewModel,
    caveStorage: state.editor.caveStorage,
    changeController: state.editor.changeController,
    currentBrush: state.editor.currentBrush,
    brushSize: state.editor.brushSize,
    lastUsedBrushSize: state.editor.lastUsedBrushSize,
    previousCursor: state.editor.previousCursor
  }
}

@connect(mapStateToProps)
export default class Grid extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func,
    grid: PropTypes.object,
    caveView: PropTypes.object,
    caveViewModel: PropTypes.object,
    changeController: PropTypes.object,
    caveStorage: PropTypes.object,
    brushSize: PropTypes.number,
    lastUsedBrushSize: PropTypes.number,
    previousCursor: PropTypes.object
  };

  componentDidMount() {
    const { dispatch } = this.props
    preloadImages()
    const newGrid = new Cave(40, 40)
    dispatch(setGrid(newGrid))
    const tileSize = getTileSize(40, 40)
    const border = getBorder(40, 40)
    const newCaveView = new CaveView(40, 40, tileSize, border, this.canvas)
    dispatch(setCaveView(newCaveView))
    newCaveView.draw(newGrid)
    /*dispatch(setCaveViewModel(new CaveViewModel(grid,
      this.handleUpdateGrid,
      caveView,
      this.handleUpdateCaveView)))
    addMouseEventListeners(caveView, caveViewModel)
    addKeyboardEventListeners(caveView)*/
  }

  @autobind
  handleUpdateGrid(grid) {
    this.props.dispatch(setGrid(grid))
  }

  @autobind
  handleUpdateCaveView(caveView) {
    this.props.dispatch(setCaveView(caveView))
  }

  updateCursor(x, y) {
    const { dispatch, caveView, brushSize, previousCursor } = this.props
    if (previousCursor.size !== brushSize) {
      caveView.drawSquareOutline(previousCursor.position.x, previousCursor.position.y,
                    '#FFFFFF', previousCursor.size, brushSize)
      dispatch(setPreviousCursorSize(brushSize))
    }
    caveView.drawSquareOutline(previousCursor.position.x, previousCursor.position.y, brushSize)
    caveView.drawCursor(x, y, brushSize)
    dispatch(setPreviousCursorPosition({ x, y }))
  }

  finishPainting() {
    const { caveView, changeController } = this.props
    if (caveView.isMouseDown) {
      changeController.addPaintedLineChange()
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
    const { grid, caveView, changeController } = this.props
    const tileChanges = this.getTileChanges(x, y, brush)
    grid.applyTileChanges(tileChanges)
    caveView.applyTileChanges(tileChanges)
    changeController.addTileChanges(tileChanges)
  }

  startPaintingAtMousePosition(pixelX, pixelY) {
    const { dispatch, caveView, currentBrush, grid, brushSize, lastUsedBrushSize } = this.props
    caveView.isMouseDown = true
    const gridX = caveView.getGridX(pixelX)
    const gridY = caveView.getGridY(pixelY)
    if (grid.withinLimits(gridX, gridY)) {
      this.applyBrushAtPosition(gridX, gridY, currentBrush)
      caveView.paintLineMode = true
    }

    if (brushSize !== lastUsedBrushSize) {
      dispatch(setLastUsedBrushSize(brushSize))
      // _gaq.push(['_trackEvent', 'Painting', 'Use New Brush Size', this.caveName(), brushSize])
    }
  }

  continuePaintingAtMousePosition(pixelX, pixelY) {
    const { caveView, previousCursor, grid, currentBrush } = this.props
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
      this.applyBrushAtPosition(gridX, gridY, currentBrush)
    }

    if (grid.withinLimits(gridX, gridY)) {
      this.updateCursor(gridX, gridY)
    }
  }

  updateDimensions(cave) {
    const { dispatch, grid } = this.props
    const width = grid.width
    const height = grid.height
    const border = getBorder(width, height)
    const tileSize = getTileSize(width, height)

    dispatch(setGrid(cave || new Cave(width, height)))
    const newCaveView = new CaveView(width, height, tileSize, border)
    dispatch(setCaveView(newCaveView))
    newCaveView.draw(grid)
  }

  @autobind
  handleMouseDown(e) {
    debugger
  }

  render() {
    const { className } = this.props
    const computedClassName = classNames(styles.Grid, className)

    return (
      <div className={computedClassName}>
        <canvas
          className={styles.canvas}
          width={1000}
          height={800}
          ref={canvas => (this.canvas = canvas)}
          onMouseDown={this.handleMouseDown} />
      </div>
    )
  }
}
