import { PALETTE_BRUSHES } from 'src/utils/ImageLoader'
const CAVE_DISPLAY_WIDTH = {} // TODO: make appropriate import here
const CAVE_DISPLAY_HEIGHT = {} // TODO: make appropriate import here

export function isTile(symbol) {
  return /[xbk+mw\/|=o^<>v\"n()u12345@!~t.zc0#Dlg"]/.test(symbol)
}

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

export function getBorder(caveWidth, caveHeight) {
  const displayWidthHeightRatio = CAVE_DISPLAY_WIDTH / CAVE_DISPLAY_HEIGHT
  const caveWidthHeightRatio = caveWidth / caveHeight
  const widthHeightRatio = caveWidthHeightRatio / displayWidthHeightRatio
  let border
  if (widthHeightRatio > 1) {
    const displayHeight = CAVE_DISPLAY_HEIGHT / widthHeightRatio
    const borderThickness = Math.floor((CAVE_DISPLAY_HEIGHT - displayHeight) / 2)
    border = { top: borderThickness, left: 0 }
  } else {
    const displayWidth = CAVE_DISPLAY_WIDTH * widthHeightRatio
    const borderThickness = Math.floor((CAVE_DISPLAY_WIDTH - displayWidth) / 2)
    border = { top: 0, left: borderThickness }
  }
  return border
}

export function getTileSize(caveWidth, caveHeight) {
  const displayWidthHeightRatio = CAVE_DISPLAY_WIDTH / CAVE_DISPLAY_HEIGHT
  const caveWidthHeightRatio = caveWidth / caveHeight
  if (caveWidthHeightRatio > displayWidthHeightRatio) {
    return Math.floor(CAVE_DISPLAY_WIDTH / caveWidth)
  }
  return Math.floor(CAVE_DISPLAY_HEIGHT / caveHeight)
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
