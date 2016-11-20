/* eslint-disable no-invalid-this */

import { CaveChangeHistory } from 'src/editor/utils/cave-change-history'
import { PaintedLineChange } from 'src/editor/utils/painted-line-change'
import { CaveChange } from 'src/editor/utils/cave-change'
import { getBorder, getTileSize } from 'src/editor/utils/tiles'
import grid from '' // TODO: make appropriate import here
import caveViewModel from '' // TODO: make appropriate import here
import caveView from '' // TODO: make appropriate import here
import { CaveView } from 'src/editor/utils/cave-view'

export class ChangeController {
  constructor() {
    this.changeHistory = new CaveChangeHistory()
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  resetCurrentPaintedLineChange = function () {
    this.currentPaintedLineChange = new PaintedLineChange()
  }

  buildCaveChange = function () {
    const preGenerationSnapshot = grid.getGridClone()
    const postGenerationWidth = caveViewModel.caveWidth()
    const postGenerationHeight = caveViewModel.caveHeight()
    return new CaveChange(preGenerationSnapshot, postGenerationWidth, postGenerationHeight)
  }

  addPaintedLineChange = function () {
    this.changeHistory.addChange(this.currentPaintedLineChange)
    this.resetCurrentPaintedLineChange()
  }

  addGenerateCaveChange = function () {
    const caveChange = this.buildCaveChange()
    this.changeHistory.addChange(caveChange)
  }

  addTileChanges = function (tileChanges) {
    for (let i = 0; i < tileChanges.length; i++) {
      this.currentPaintedLineChange.addTileChange(tileChanges[i])
    }
  }

  getCurrentChange = function () {
    return this.changeHistory.currentChange()
  }

  applyUndo = function () {
    if (!this.changeHistory.atBeginningOfHistory()) {
      this.applyChange(true)
    }
  }

  applyRedo = function () {
    if (!this.changeHistory.atEndOfHistory()) {
      this.applyChange(false)
    }
  }

  applyChange = function (isUndo) {
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
      this.applyGenerateCaveChange(currentChange, isUndo)
    }

    if (isUndo) {
      this.changeHistory.rollBackCurrentChange()
    }
  }

  applyPaintedLineChange = function (currentChange, isUndo) {
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

  applyGenerateCaveChange = function (currentChange, isUndo) {
    if (isUndo) {
      const width = currentChange.preGenerationWidth
      const height = currentChange.preGenerationHeight
      const border = getBorder(width, height)
      const tileSize = getTileSize(width, height)

      grid.rebuildCaveFromGrid(currentChange.preGenerationSnapshot)
      caveView = new CaveView(width, height, tileSize, border)
      caveView.draw(grid)
    } else {
      const width = currentChange.postGenerationWidth
      const height = currentChange.postGenerationHeight
      const border = getBorder(width, height)
      const tileSize = getTileSize(width, height)

      grid.rebuildCaveFromCoordinates(width, height)
      caveView = new CaveView(width, height, tileSize, border)
      caveView.draw(grid)
    }
  }
}
