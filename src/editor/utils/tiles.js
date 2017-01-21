import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'

export function getFileNameFromSymbol(symbol) {
  for (let i = 0; i < PALETTE_BRUSHES_LIST.length; i++) {
    if (PALETTE_BRUSHES_LIST[i].symbol === symbol) {
      return (symbol === ' ') ? 'black' : PALETTE_BRUSHES_LIST[i].fileName
    }
  }
  return null
}

export function getTileFromSymbol(symbol) {
  for (let i = 0; i < PALETTE_BRUSHES_LIST.length; i++) {
    if (PALETTE_BRUSHES_LIST[i].symbol === symbol) {
      return PALETTE_BRUSHES_LIST[i]
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
