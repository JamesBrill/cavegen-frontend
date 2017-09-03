export function getCaveCode(
  grid,
  name,
  eventsText,
  terrainType,
  waterType,
  backgroundType
) {
  let caveCode = `${validatedCaveName(name)}\nterrain ${terrainType ||
    '1'}\nbackground ${backgroundType || '1'}\nwater ${waterType || 'clear'}\n`

  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      caveCode += grid.getTileAtCoordinates(j, i).symbol
    }
    caveCode += '\n'
  }
  return `${caveCode}${eventsText}`
}

export function splitCaveCode(caveCode) {
  const caveCodeLines = caveCode.split('\n')
  const name = caveCodeLines[0]
  const terrainType = caveCodeLines[1].split(' ')[1]
  const backgroundType = caveCodeLines[2].split(' ')[1]
  const waterType = caveCodeLines[3]
  let caveString, eventsText
  const eventsStartIndex = caveCode.indexOf('$')
  if (eventsStartIndex !== -1) {
    caveString = caveCode.slice(0, eventsStartIndex).trim()
    eventsText = caveCode.slice(eventsStartIndex).trim()
  } else {
    caveString = caveCode.trim()
    eventsText = ''
  }
  return {
    name,
    terrainType,
    backgroundType,
    waterType,
    caveString,
    eventsText
  }
}

export function getCaveCodeOfDimensions(width, height) {
  let caveCode = 'Untitled\nterrain 1\nbackground 1\nwater clear\n'

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
        caveCode += 'x'
      } else {
        caveCode += ' '
      }
    }
    caveCode += '\n'
  }
  return caveCode
}

export function getNewCaveCode() {
  return getCaveCodeOfDimensions(40, 40)
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
