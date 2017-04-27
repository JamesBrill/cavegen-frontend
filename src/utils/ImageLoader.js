export const PALETTE_BRUSHES = {
  Tools: [
    { fileName: 'space', symbol: ' ', tooltip: 'Eraser s' },
    { fileName: 'spikefiller', symbol: 'f', tooltip: 'Spike Filler f' },
    { fileName: 'spikeremover', symbol: 'r', tooltip: 'Spike Remover r' },
    { fileName: 'addcolumn', symbol: '6', tooltip: 'Add Column 6' },
    { fileName: 'removecolumn', symbol: '7', tooltip: 'Remove Column 7' },
    { fileName: 'addrow', symbol: '8', tooltip: 'Add Row 8' },
    { fileName: 'removerow', symbol: '9', tooltip: 'Remove Row 9' },
    { fileName: 'selectregion', symbol: 'a', tooltip: 'Select Region a' }
  ],
  Common: [
    { fileName: 'terrain', symbol: 'x', tooltip: 'Terrain x' },
    { fileName: 'treasure', symbol: '+', tooltip: 'Treasure +' },
    { fileName: 'hannah', symbol: '#', tooltip: 'Starting Position #' },
    { fileName: 'door', symbol: 'D', tooltip: 'Level Exit d' },
    { fileName: 'woodencrate', symbol: 'b', tooltip: 'Wooden Crate b' },
    { fileName: 'steelcrate', symbol: 'k', tooltip: 'Steel Crate k' },
    { fileName: 'boulder', symbol: 'o', tooltip: 'Boulder o' },
    { fileName: 'upspike', symbol: 'm', tooltip: 'Stalagmite m' },
    { fileName: 'downspike', symbol: 'w', tooltip: 'Stalactite w' },
    { fileName: 'platform', symbol: '=', tooltip: 'Platform =' },
    { fileName: 'ladder', symbol: '\"', tooltip: 'Ladder \"' }
  ],
  Destructive: [
    { fileName: 'arrowup', symbol: '^', tooltip: 'Arrow Up ^' },
    { fileName: 'arrowleft', symbol: '<', tooltip: 'Arrow Left <' },
    { fileName: 'arrowdown', symbol: 'v', tooltip: 'Arrow Down v' },
    { fileName: 'arrowright', symbol: '>', tooltip: 'Arrow Right >' },
    { fileName: 'steelarrowup', symbol: '\'', tooltip: 'Steel Arrow Up \'' },
    { fileName: 'steelarrowleft', symbol: '{', tooltip: 'Steel Arrow Left {' },
    { fileName: 'steelarrowdown', symbol: ',', tooltip: 'Steel Arrow Down ,' },
    { fileName: 'steelarrowright', symbol: '}', tooltip: 'Steel Arrow Right }' },
    { fileName: 'dynamite', symbol: '/', tooltip: 'Wooden Dynamite /' },
    { fileName: 'steeldynamite', symbol: '|', tooltip: 'Steel Dynamite |' }
  ],
  Enemies: [
    { fileName: 'enemy1', symbol: '1', tooltip: 'Enemy 1' },
    { fileName: 'enemy2', symbol: '2', tooltip: 'Enemy 2' },
    { fileName: 'enemy3', symbol: '3', tooltip: 'Enemy 3' },
    { fileName: 'enemy4', symbol: '4', tooltip: 'Enemy 4' },
    { fileName: 'enemy5', symbol: '5', tooltip: 'Enemy 5' }
  ],
  Water: [
    { fileName: 'watercrate', symbol: '@', tooltip: 'Water Crate @' },
    { fileName: 'watertap', symbol: '!', tooltip: 'Water Tap Crate !' },
    { fileName: 'waterlevel', symbol: '~', tooltip: 'Water Surface ~' },
    { fileName: 'waterstart', symbol: 't', tooltip: 'Water Source t' },
    { fileName: 'airpocket', symbol: '.', tooltip: 'Air Pocket .' }
  ],
  Rare: [
    { fileName: 'tutorialup', symbol: 'n', tooltip: 'Pointer Up n' },
    { fileName: 'tutorialleft', symbol: '(', tooltip: 'Pointer Left (' },
    { fileName: 'tutorialdown', symbol: 'u', tooltip: 'Pointer Down u' },
    { fileName: 'tutorialright', symbol: ')', tooltip: 'Pointer Right )' },
    { fileName: 'secret', symbol: 'z', tooltip: 'Secret Area z' },
    { fileName: 'heart', symbol: 'l', tooltip: 'Heart l' },
    { fileName: 'gem', symbol: 'g', tooltip: 'Gem g' },
    { fileName: 'clone', symbol: 'c', tooltip: 'Fake Crate c' }
  ]
}
const ASSETS_PATH = '/static'
export const PALETTE_IMAGES_PATH = `${ASSETS_PATH}/palette-tiles`
export const MISC_IMAGES_PATH = `${ASSETS_PATH}/misc`
Object.keys(PALETTE_BRUSHES).forEach(category => {
  PALETTE_BRUSHES[category].forEach(brush => Object.assign(brush, { imagePath: `${PALETTE_IMAGES_PATH}/${brush.fileName}.png` }))
})
export const PALETTE_BRUSHES_LIST = Object.keys(PALETTE_BRUSHES).reduce((brushes, category) => brushes.concat(PALETTE_BRUSHES[category]), [])
export const PALETTE_BRUSH_IMAGES = PALETTE_BRUSHES_LIST.map(brush => {
  let selectTileHotkey, placeTileHotkey
  switch (brush.symbol) {
    case 'D':
      selectTileHotkey = 'd'
      placeTileHotkey = 'Alt + d'
      break
    case ' ':
      selectTileHotkey = 's'
      placeTileHotkey = 'Alt + s'
      break
    default:
      selectTileHotkey = brush.symbol
      placeTileHotkey = `Alt + ${brush.symbol}`
  }
  return {
    imagePath: brush.imagePath,
    tooltip: brush.tooltip,
    selectTileHotkey,
    placeTileHotkey
  }
})
