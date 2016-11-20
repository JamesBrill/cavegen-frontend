/* eslint-disable no-invalid-this */

export class CaveStorage {
  constructor() {
    this.caveNames = this.loadAllCaveNames()
    this.selectedCaveName = ''
  }

  loadCave = function (caveName, caveViewModel) {
    if (!caveName || caveName === '') {
      return
    }
    const caveString = localStorage[`cavegen_${caveName}`]
    // _gaq.push(['_trackEvent', 'Storage', 'Load Cave', caveViewModel.caveName(), caveViewModel.caveWidth() * caveViewModel.caveHeight()])
    caveViewModel.loadCave(caveName, caveString)
  }

  loadAllCaveNames = function () {
    const caveNames = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.indexOf('cavegen_') === 0) {
        caveNames.push(key.substring(8))
      }
    }
    return caveNames
  }

  storeCave = function (caveViewModel) {
    const caveName = caveViewModel.caveName()
    const caveString = caveViewModel.getCaveString()
    let addToCaveNameList = false
    if (!localStorage[`cavegen_${caveName}`]) {
      addToCaveNameList = true
    }

    localStorage[`cavegen_${caveName}`] = caveString
    // _gaq.push(['_trackEvent', 'Storage', 'Save Cave', caveViewModel.caveName(), caveViewModel.caveWidth() * caveViewModel.caveHeight()])

    // The flag seems redundant, but need to make sure storage did not fail before
    // adding the name to the list
    if (addToCaveNameList) {
      this.caveNames.push(caveName)
    }
  }
}
