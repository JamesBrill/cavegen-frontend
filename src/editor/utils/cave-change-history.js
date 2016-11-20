/* eslint-disable no-invalid-this */

export class CaveChangeHistory {
  constructor() {
    this.changes = []
    this.currentChangeIndex = -1
  }

  numberOfChanges = function () {
    return this.changes.length
  }

  currentChange = function () {
    this.currentChangeIndex = Math.max(0, this.currentChangeIndex)
    return this.changes[this.currentChangeIndex]
  }

  atBeginningOfHistory = function () {
    return this.currentChangeIndex === -1
  }

  atEndOfHistory = function () {
    return this.currentChangeIndex === (this.changes.length - 1)
  }

  rollBackCurrentChange = function () {
    this.currentChangeIndex = Math.max(-1, this.currentChangeIndex - 1)
  }

  rollForwardCurrentChange = function () {
    this.currentChangeIndex = Math.min(this.changes.length - 1, this.currentChangeIndex + 1)
  }

  getTileChanges = function (index) {
    return this.changes[index].tileChanges
  }

  cullHistory = function () {
    if (this.numberOfChanges() > 100) {
      const numberOfChangesToRemove = this.numberOfChanges() - 100
      this.changes.splice(0, numberOfChangesToRemove)
      this.currentChangeIndex -= numberOfChangesToRemove
    }
  }

  addChange = function (change) {
    if (this.currentChangeIndex === -1) {
      this.changes = [change]
      this.currentChangeIndex = 0
    } else {
      const currentChange = (this.numberOfChanges() > 0) ? this.currentChange() : null
      // This clause prevents duplicate changes and 'non-changes' from being added to the change history.
      // Duplicate changes occur when duplicate mouse events are fired off rapidly (and erroneously).
      if ((currentChange !== null && !currentChange.equals(change) && change.hasEffect()) || currentChange === null) {
        this.changes = this.changes.slice(0, this.currentChangeIndex + 1)
        this.changes.push(change)
        this.currentChangeIndex++
        this.cullHistory()
      }
    }
  }
}
