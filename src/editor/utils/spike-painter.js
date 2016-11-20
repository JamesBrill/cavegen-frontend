import { getTileFromSymbol } from 'src/editor/utils/tiles'

export function getTileFromSpikeFiller(grid, row, column) {
  if (grid.getTileAtCoordinates(column, row).symbol !== ' ') {
    return grid.getTileAtCoordinates(column, row)
  }

  if (grid.getTileAtCoordinates(column, row - 1).symbol === 'x') {
    return getTileFromSymbol('w')
  }

  if (grid.getTileAtCoordinates(column, row + 1).symbol === 'x') {
    return getTileFromSymbol('m')
  }

  return getTileFromSymbol(' ')
}

export function getTileFromSpikeRemover(grid, row, column) {
  if (grid.getTileAtCoordinates(column, row).symbol !== 'w' &&
      grid.getTileAtCoordinates(column, row).symbol !== 'm') {
    return grid.getTileAtCoordinates(column, row)
  }
  return getTileFromSymbol(' ')
}
