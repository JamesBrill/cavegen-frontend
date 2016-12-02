export function getCaveCode(grid, name, terrainType, waterType) {
  let caveCode = `${validatedCaveName(name)}\nterrain ${terrainType}\nbackground 1\nwater ${waterType}\n`

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      caveCode += grid.getTileAtCoordinates(j, i).symbol
    }
    caveCode += '\n'
  }
  return addMissingDoorAndStartingPosition(caveCode)
}

function validatedCaveName(text) {
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

function addMissingDoorAndStartingPosition(caveString) {
  let additionalCharacters = ''
  if (caveString.indexOf('#') === -1) {
    additionalCharacters += '#'
  }
  if (caveString.indexOf('D') === -1) {
    additionalCharacters += 'D'
  }
  return `${caveString}${additionalCharacters}`
}
