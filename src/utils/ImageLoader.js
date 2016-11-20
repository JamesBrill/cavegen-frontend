export const PALETTE_BRUSHES = [
  { fileName: 'terrain', symbol: 'x' },
  { fileName: 'space', symbol: ' ' },
  { fileName: 'spikefiller', symbol: 'f' },
  { fileName: 'spikeremover', symbol: 'r' },
  { fileName: 'treasure', symbol: '+' },
  { fileName: 'hannah', symbol: '#' },
  { fileName: 'door', symbol: 'D' },
  { fileName: 'woodencrate', symbol: 'b' },
  { fileName: 'steelcrate', symbol: 'k' },
  { fileName: 'boulder', symbol: 'o' },
  { fileName: 'upspike', symbol: 'm' },
  { fileName: 'downspike', symbol: 'w' },
  { fileName: 'dynamite', symbol: '/' },
  { fileName: 'steeldynamite', symbol: '|' },
  { fileName: 'platform', symbol: '=' },
  { fileName: 'ladder', symbol: '\"' },
  { fileName: 'arrowup', symbol: '^' },
  { fileName: 'arrowleft', symbol: '<' },
  { fileName: 'arrowdown', symbol: 'v' },
  { fileName: 'arrowright', symbol: '>' },
  { fileName: 'clone', symbol: 'c' },
  { fileName: 'tutorialup', symbol: 'n' },
  { fileName: 'tutorialleft', symbol: '(' },
  { fileName: 'tutorialdown', symbol: 'u' },
  { fileName: 'tutorialright', symbol: ')' },
  { fileName: 'enemy1', symbol: '1' },
  { fileName: 'enemy2', symbol: '2' },
  { fileName: 'enemy3', symbol: '3' },
  { fileName: 'enemy4', symbol: '4' },
  { fileName: 'enemy5', symbol: '5' },
  { fileName: 'watercrate', symbol: '@' },
  { fileName: 'watertap', symbol: '!' },
  { fileName: 'waterlevel', symbol: '~' },
  { fileName: 'waterstart', symbol: 't' },
  { fileName: 'airpocket', symbol: '.' },
  { fileName: 'secret', symbol: 'z' },
  { fileName: 'shockwave', symbol: '0' },
  { fileName: 'heart', symbol: 'l' },
  { fileName: 'gem', symbol: 'g' }
]
const ASSETS_PATH = 'src/assets'
export const PALETTE_IMAGES_PATH = `${ASSETS_PATH}/palette-tiles`
export const MISC_IMAGES_PATH = `${ASSETS_PATH}/misc`
export const PALETTE_IMAGE_PATHS = PALETTE_BRUSHES.map(brush => `${PALETTE_IMAGES_PATH}/${brush.fileName}.png`)
