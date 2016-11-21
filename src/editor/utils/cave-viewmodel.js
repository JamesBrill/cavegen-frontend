/* eslint-disable no-invalid-this */

import { autobind } from 'core-decorators'
import { ChangeController } from 'src/editor/utils/change-controller'
// TODO: either store these in here or inject them in - tricky with event-listener-builder callbacks for currentBrush

export class CaveViewModel {
  constructor(grid, updateGrid, caveView, updateCaveView) {
    this.grid = grid
    this.updateGrid = updateGrid
    this.caveView = caveView
    this.updateCaveView = updateCaveView
    this.caveName = '_'
    this.caveWidth = 40
    this.caveHeight = 40
    this.terrainType = '1'
    this.waterType = 'clear'
    this.changeController = new ChangeController()
    this.previousCursorPosition = { x: 1, y: 1 }
    this.previousCursorSize = -1
  }

  @autobind
  validatedCaveName() {
    const text = this.caveName()
    if (text === '') {
      return '_'
    }
    const regex = /[^a-zA-Z0-9_]/g
    let validName = text.replace(regex, '')
    if (validName.length > 20) {
      validName = validName.substring(0, 20)
    }
    if (validName.Length < 1) {
      validName = '_'
    }
    return validName
  }

  validateDimensions() {
    let validationReport = ''

    if (isNaN(this.caveWidth())) {
      this.caveWidth(40)
      validationReport += 'Width must be an integer.\n'
    }
    if (isNaN(this.caveHeight())) {
      this.caveHeight(40)
      validationReport += 'Height must be an integer.\n'
    }

    this.caveWidth(Math.round(this.caveWidth()))
    this.caveHeight(Math.round(this.caveHeight()))

    if (this.caveWidth() < 5) {
      this.caveWidth(5)
      validationReport += 'Width too small. Must be at least 5.\n'
    }
    if (this.caveHeight() < 5) {
      this.caveHeight(5)
      validationReport += 'Height too small. Must be at least 5.\n'
    }

    const area = this.caveWidth() * this.caveHeight()
    if (area > 8000) {
      this.caveWidth(89)
      this.caveHeight(89)
      validationReport += 'Area too large. Must be no more than 8000.\n'
    }
    if (area < 256) {
      this.caveWidth(16)
      this.caveHeight(16)
      validationReport += 'Area too small. Must be no less than 256.\n'
    }

    if (validationReport !== '') {
      alert(validationReport)
      return false
    }
    return true
  }

  getCaveString() {
    let caveString = `${this.validatedCaveName()}\nterrain ${this.terrainType()}\nbackground 1\nwater ${this.waterType()}\n`

    for (let i = 0; i < this.caveHeight(); i++) {
      for (let j = 0; j < this.caveWidth(); j++) {
        caveString += this.grid.getTileAtCoordinates(j, i).symbol
      }
      caveString += '\n'
    }
    return caveString
  }

  getUploadableCaveString() {
    const caveString = this.getCaveString()
    return this.addMissingDoorAndStartingPosition(caveString)
  }

  addMissingDoorAndStartingPosition(caveString) {
    let additionalCharacters = ''
    if (caveString.indexOf('#') === -1) {
      additionalCharacters += '#'
    }
    if (caveString.indexOf('D') === -1) {
      additionalCharacters += 'D'
    }
    return `${caveString}${additionalCharacters}`
  }

  generateCave() {
    if (this.validateDimensions()) {
      this.changeController.addGenerateCaveChange(this.grid, this)
      this.updateDimensions()
      // _gaq.push(['_trackEvent', 'Generation', 'Generate Cave', 'Width', this.caveWidth()])
      // _gaq.push(['_trackEvent', 'Generation', 'Generate Cave', 'Height', this.caveHeight()])
    }
  }

  loadCave(caveName, caveString) {
    this.grid.rebuildCaveFromCaveString(caveString)
    this.caveName(caveName)
    this.caveWidth(this.grid.width)
    this.caveHeight(this.grid.height)
    this.updateDimensions(this.grid)
    this.changeController = new ChangeController()
  }

  undo(updateCaveView) {
    this.changeController.applyUndo(this.grid, this.caveView, updateCaveView)
  }

  redo(updateCaveView) {
    this.changeController.applyRedo(this.grid, this.caveView, updateCaveView)
  }
}
