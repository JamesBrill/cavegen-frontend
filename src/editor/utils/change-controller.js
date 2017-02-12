/* eslint-disable no-invalid-this */

import { CaveChangeHistory } from 'src/editor/utils/cave-change-history'
import { PaintedLineChange } from 'src/editor/utils/painted-line-change'
import { CaveChange } from 'src/editor/utils/cave-change'

export class ChangeController {
  constructor(rebuildCave) {
    this.changeHistory = new CaveChangeHistory()
    this.currentPaintedLineChange = new PaintedLineChange()
    this.rebuildCave = rebuildCave
  }

  clear() {
    this.changeHistory.clear()
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  resetCurrentPaintedLineChange() {
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  addPaintedLineChange() {
    this.changeHistory.addChange(this.currentPaintedLineChange)
    this.resetCurrentPaintedLineChange()
  }

  addCaveChange(before, after) {
    const caveChange = new CaveChange(before, after)
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

  applyUndo(grid, caveView) {
    if (!this.changeHistory.atBeginningOfHistory()) {
      this.applyChange(true, grid, caveView)
    }
  }

  applyRedo(grid, caveView) {
    if (!this.changeHistory.atEndOfHistory()) {
      this.applyChange(false, grid, caveView)
    }
  }

  applyChange(isUndo, grid, caveView) {
    if (!isUndo) {
      this.changeHistory.rollForwardCurrentChange()
    }

    const currentChange = this.getCurrentChange()
    if (!currentChange) {
      return
    }

    if (currentChange instanceof PaintedLineChange) {
      this.applyPaintedLineChange(currentChange, isUndo, grid, caveView)
    } else if (currentChange instanceof CaveChange) {
      this.applyCaveChange(currentChange, isUndo, caveView)
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

  applyCaveChange(currentChange, isUndo, caveView) {
    caveView.grid.rebuildCaveFromGrid(isUndo ? currentChange.before : currentChange.after)
    caveView.updateToGrid()
  }
}
