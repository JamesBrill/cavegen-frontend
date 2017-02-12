/* eslint-disable no-invalid-this */

export class CaveChange {
  constructor(before, after) {
    this.before = before
    this.after = after
    this.beforeWidth = before.length
    this.beforeHeight = before[0].length
    this.afterWidth = after.length
    this.afterHeight = after[0].length
  }

  hasEffect() {
    if (this.beforeWidth !== this.afterWidth ||
      this.beforeHeight !== this.afterHeight) {
      return true
    }

    for (let i = 0; i < this.beforeWidth; i++) {
      for (let j = 0; j < this.beforeHeight; j++) {
        if (this.before[i][j].symbol !== this.after[i][j].symbol) {
          return true
        }
      }
    }
    return false
  }

  equals(other) {
    if (!other || !(other instanceof CaveChange)) {
      return false
    }

    if (this.beforeWidth !== other.beforeWidth ||
      this.beforeHeight !== other.beforeHeight ||
      this.afterWidth !== other.afterWidth ||
      this.afterHeight !== other.afterHeight) {
      return false
    }

    for (let i = 0; i < this.beforeWidth; i++) {
      for (let j = 0; j < this.beforeHeight; j++) {
        if (this.before[i][j] !== other.before[i][j]) {
          return false
        }
      }
    }

    for (let i = 0; i < this.afterWidth; i++) {
      for (let j = 0; j < this.afterHeight; j++) {
        if (this.after[i][j] !== other.after[i][j]) {
          return false
        }
      }
    }
    return true
  }
}
