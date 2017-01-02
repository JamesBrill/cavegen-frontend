import { PALETTE_BRUSHES } from 'src/utils/ImageLoader'

export const TILE_KEYS = ['x', 'b', 'k', 'shift+=', 'm', 'w', '/', 'shift+\\', '=',
                          'o', 'shift+6', 'shift+,', 'shift+.', 'v', ';',
                          'n', 'shift+9', 'shift+0', 'u',
                          '1', '2', '3', '4', '5', 'shift+2', 'shift+1', 'shift+`', 't', '.',
                          'z', 's', 'c', '0', 'alt+3', 'shift+d', 'l', 'g', 'f', 'r']

export function getFileNameFromSymbol(symbol) {
  for (let i = 0; i < PALETTE_BRUSHES.length; i++) {
    if (PALETTE_BRUSHES[i].symbol === symbol) {
      return (symbol === ' ') ? 'black' : PALETTE_BRUSHES[i].fileName
    }
  }
  return null
}

export function getTileFromSymbol(symbol) {
  for (let i = 0; i < PALETTE_BRUSHES.length; i++) {
    if (PALETTE_BRUSHES[i].symbol === symbol) {
      return PALETTE_BRUSHES[i]
    }
  }
  return null
}

export function getBorder(caveWidth, caveHeight, canvasWidth, canvasHeight) {
  const displayWidthHeightRatio = canvasWidth / canvasHeight
  const caveWidthHeightRatio = caveWidth / caveHeight
  const widthHeightRatio = caveWidthHeightRatio / displayWidthHeightRatio
  let border
  if (widthHeightRatio > 1) {
    const displayHeight = canvasHeight / widthHeightRatio
    const borderThickness = Math.floor((canvasHeight - displayHeight) / 2)
    border = { top: borderThickness, left: 0 }
  } else {
    const displayWidth = canvasWidth * widthHeightRatio
    const borderThickness = Math.floor((canvasWidth - displayWidth) / 2)
    border = { top: 0, left: borderThickness }
  }
  return border
}

export function getTileSize(caveWidth, caveHeight, canvasWidth, canvasHeight) {
  const displayWidthHeightRatio = canvasWidth / canvasHeight
  const caveWidthHeightRatio = caveWidth / caveHeight
  if (caveWidthHeightRatio > displayWidthHeightRatio) {
    return Math.floor(canvasWidth / caveWidth)
  }
  return Math.floor(canvasHeight / caveHeight)
}

export function mergeTileChanges(first, second) {
  const tileChanges = []
  for (let i = 0; i < first.length; i++) {
    tileChanges.push(first[i])
  }
  for (let i = 0; i < second.length; i++) {
    let merge = true
    for (let j = 0; j < first.length; j++) {
      if (second[i].equals(first[j])) {
        merge = false
        break
      }
    }
    if (merge) {
      tileChanges.push(second[i])
    }
  }
  return tileChanges
}
