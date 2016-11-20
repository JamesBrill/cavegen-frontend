/* eslint-disable no-invalid-this */

import { TileChange } from 'src/editor/utils/tile-change'

export class PaintedLineChange {
  constructor() {
    this.tileChanges = []
  }

  addTileChange = function (tileChange) {
    // This filthy code is to get Undo/Redo to work with Spike Digger. It finds pairs like (Terrain, DownSpike)
    // when given a (DownSpike, Space) pair and merges them together into (Terrain, Space). It basically wipes
    // out the intermediate "CleanUpSpikes" step, which we don't want the user to see when using Undo/Redo.
    const matchingChanges = []
    for (let i = 0; i < this.tileChanges.length; i++) {
      if (this.tileChanges[i].x === tileChange.x &&
          this.tileChanges[i].y === tileChange.y &&
          this.tileChanges[i].after === tileChange.before) {
        matchingChanges.push(this.tileChanges[i])
      }
    }
    if (matchingChanges.length > 0) {
      const merger = matchingChanges[0]
      this.removeChanges(matchingChanges)

      this.tileChanges.push(new TileChange(tileChange.x, tileChange.y, merger.before, tileChange.after))
    } else {
      this.tileChanges.push(tileChange)
    }
  }

  // Returns true if not all TileChanges change a tile from one type back to that same type again
  hasEffect = function () {
    let hasEffect = false
    const ineffectiveChanges = []
    for (let i = 0; i < this.tileChanges.length; i++) {
      const tileChange = this.tileChanges[i]
      if (tileChange.before !== tileChange.after) {
        hasEffect = true
      } else {
        ineffectiveChanges.push(tileChange)
      }
    }

    this.removeChanges(ineffectiveChanges)
    return hasEffect
  }

  equals = function (other) {
    if (!other || !(other instanceof PaintedLineChange)) {
      return false
    }

    if (this.tileChanges.length !== other.tileChanges.length) {
      return false
    }

    for (let i = 0; i < this.tileChanges.length; i++) {
      if (this.tileChanges[i] !== other.tileChanges[i]) {
        return false
      }
    }
    return true
  }

  removeChanges = function (changes) {
    const indexesOfChangesToRemove = []
    let offset = 0
    for (let i = 0; i < this.tileChanges.length; i++) {
      if (changes.indexOf(this.tileChanges[i]) !== -1) {
        indexesOfChangesToRemove.push(i - offset)
        offset++
      }
    }
    for (let i = 0; i < indexesOfChangesToRemove.length; i++) {
      this.tileChanges.splice(indexesOfChangesToRemove[i], 1)
    }
  }
}
