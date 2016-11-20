import { PALETTE_BRUSHES } from 'src/utils/ImageLoader'

export function isTile(symbol) {
  return /[xbk+mw\/|=o^<>v\"n()u12345@!~t.zc0#Dlg"]/.test(symbol)
}

export function getFileNameFromSymbol(symbol) {
  for (let i = 0; i < PALETTE_BRUSHES.length; i++) {
    if (PALETTE_BRUSHES[i].symbol === symbol) {
      return (symbol === " ") ? 'black' : PALETTE_BRUSHES[i].fileName
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
