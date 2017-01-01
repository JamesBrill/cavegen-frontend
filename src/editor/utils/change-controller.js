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

  buildCaveChange(grid, newCaveWidth, newCaveHeight) {
    const preGenerationSnapshot = grid.getGridClone()
    return new CaveChange(preGenerationSnapshot, newCaveWidth, newCaveHeight)
  }

  addPaintedLineChange() {
    this.changeHistory.addChange(this.currentPaintedLineChange)
    this.resetCurrentPaintedLineChange()
  }

  addGenerateCaveChange(grid, newCaveWidth, newCaveHeight) {
    const caveChange = this.buildCaveChange(grid, newCaveWidth, newCaveHeight)
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
      this.applyGenerateCaveChange(currentChange, isUndo, grid)
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

  applyGenerateCaveChange(currentChange, isUndo, grid) {
    let width, height
    if (isUndo) {
      width = currentChange.preGenerationWidth
      height = currentChange.preGenerationHeight
      grid.rebuildCaveFromGrid(currentChange.preGenerationSnapshot)
    } else {
      width = currentChange.postGenerationWidth
      height = currentChange.postGenerationHeight
      grid.rebuildCaveFromCoordinates(width, height)
    }
    const newCaveView = this.rebuildCave(width, height, grid)
    newCaveView.zoomer.resize(newCaveView)
    newCaveView.draw({ grid })
  }
}
