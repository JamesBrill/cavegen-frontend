/* eslint-disable no-invalid-this */

export class CaveChange {
  constructor(preGenerationSnapshot, postGenerationWidth, postGenerationHeight) {
    this.preGenerationSnapshot = preGenerationSnapshot
    this.preGenerationWidth = preGenerationSnapshot.length
    this.preGenerationHeight = preGenerationSnapshot[0].length
    this.postGenerationWidth = postGenerationWidth
    this.postGenerationHeight = postGenerationHeight
  }

  // Returns true if regeneration changes the existing cave
  hasEffect = function () {
    if (this.preGenerationWidth !== this.postGenerationWidth ||
      this.preGenerationHeight !== this.postGenerationHeight) {
      return true
    }

    for (let i = 0; i < this.preGenerationWidth; i++) {
      for (let j = 0; j < this.preGenerationHeight; j++) {
        if (this.preGenerationSnapshot[i][j].symbol !== 'x') {
          return true
        }
      }
    }
    return false
  }

  equals = function (other) {
    if (!other || !(other instanceof CaveChange)) {
      return false
    }

    if (this.preGenerationWidth !== other.preGenerationWidth ||
      this.preGenerationHeight !== other.preGenerationHeight ||
      this.postGenerationWidth !== other.postGenerationWidth ||
      this.postGenerationHeight !== other.postGenerationHeight) {
      return false
    }

    for (let i = 0; i < this.preGenerationWidth; i++) {
      for (let j = 0; j < this.preGenerationHeight; j++) {
        if (this.preGenerationSnapshot[i][j] !== other.preGenerationSnapshot[i][j]) {
          return false
        }
      }
    }
    return true
  }
}
