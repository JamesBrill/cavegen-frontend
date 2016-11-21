/* eslint-disable no-invalid-this */

import { CaveChangeHistory } from 'src/editor/utils/cave-change-history'
import { PaintedLineChange } from 'src/editor/utils/painted-line-change'
import { CaveChange } from 'src/editor/utils/cave-change'
import { getBorder, getTileSize } from 'src/editor/utils/tiles'
import { CaveView } from 'src/editor/utils/cave-view'

export class ChangeController {
  constructor() {
    this.changeHistory = new CaveChangeHistory()
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  resetCurrentPaintedLineChange() {
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  buildCaveChange(grid, caveViewModel) {
    const preGenerationSnapshot = grid.getGridClone()
    const postGenerationWidth = caveViewModel.caveWidth()
    const postGenerationHeight = caveViewModel.caveHeight()
    return new CaveChange(preGenerationSnapshot, postGenerationWidth, postGenerationHeight)
  }

  addPaintedLineChange() {
    this.changeHistory.addChange(this.currentPaintedLineChange)
    this.resetCurrentPaintedLineChange()
  }

  addGenerateCaveChange(grid, caveViewModel) {
    const caveChange = this.buildCaveChange(grid, caveViewModel)
    this.changeHistory.addChange(caveChange)
  }

  addTileChanges(tileChanges) {
    for (let i = 0; i < tileChanges.length; i++) {
      this.currentPaintedLineChange.addTileChange(tileChanges[i])
    }
  }

  getCurrentChange() {
    return this.changeHistory.currentChange()
  }

  applyUndo(grid, caveView, updateCaveView) {
    if (!this.changeHistory.atBeginningOfHistory()) {
      this.applyChange(true, grid, caveView, updateCaveView)
    }
  }

  applyRedo(grid, caveView, updateCaveView) {
    if (!this.changeHistory.atEndOfHistory()) {
      this.applyChange(false, grid, caveView, updateCaveView)
    }
  }

  applyChange(isUndo, grid, caveView, updateCaveView) {
    if (!isUndo) {
      this.changeHistory.rollForwardCurrentChange()
    }

    const currentChange = this.getCurrentChange()
    if (!currentChange) {
      return
    }

    if (currentChange instanceof PaintedLineChange) {
      this.applyPaintedLineChange(currentChange, isUndo)
    } else if (currentChange instanceof CaveChange) {
      this.applyGenerateCaveChange(currentChange, isUndo, grid, caveView, updateCaveView)
    }

    if (isUndo) {
      this.changeHistory.rollBackCurrentChange()
    }
  }

  applyPaintedLineChange(currentChange, isUndo, grid, caveView) {
    const tileChanges = currentChange.tileChanges
    const paintedPositions = []
    for (let i = 0; i < tileChanges.length; i++) {
      const x = tileChanges[i].x
      const y = tileChanges[i].y
      if (grid.withinLimits(x, y)) {
        const tile = isUndo ? tileChanges[i].before : tileChanges[i].after
        paintedPositions.push({ x, y, brush: tile })
        grid.setTileAtCoordinates(x, y, tile)
      }
    }
    caveView.paintPositions(paintedPositions)
  }

  applyGenerateCaveChange(currentChange, isUndo, grid, caveView, updateCaveView) {
    if (isUndo) {
      const width = currentChange.preGenerationWidth
      const height = currentChange.preGenerationHeight
      const border = getBorder(width, height)
      const tileSize = getTileSize(width, height)

      grid.rebuildCaveFromGrid(currentChange.preGenerationSnapshot)
      const newCaveView = new CaveView(width, height, tileSize, border)
      updateCaveView(newCaveView)
      newCaveView.draw(grid)
    } else {
      const width = currentChange.postGenerationWidth
      const height = currentChange.postGenerationHeight
      const border = getBorder(width, height)
      const tileSize = getTileSize(width, height)

      grid.rebuildCaveFromCoordinates(width, height)
      const newCaveView = new CaveView(width, height, tileSize, border)
      updateCaveView(newCaveView)
      newCaveView.draw(grid)
    }
  }
}
