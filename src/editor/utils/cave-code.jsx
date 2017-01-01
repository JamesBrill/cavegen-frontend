export function getCaveCode(grid, name, terrainType, waterType) {
  let caveCode = `${validatedCaveName(name)}\nterrain ${terrainType}\nbackground 1\nwater ${waterType}\n`

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      caveCode += grid.getTileAtCoordinates(j, i).symbol
    }
    caveCode += '\n'
  }
  return caveCode
}

export function getNewCaveCode() {
  let caveCode = 'Untitled\nterrain 1\nbackground 1\nwater clear\n'

  for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 40; j++) {
      caveCode += 'x'
    }
    caveCode += '\n'
  }
  return caveCode
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
