import { getTileFromSymbol } from 'src/editor/utils/tiles'

export function setUpTileKeyListeners(selectBrush, insertTile) {
  function applyHotkey(e, brush) {
    if (!e.metaKey && !e.ctrlKey) {
      if (e.altKey) {
        insertTile(brush)
      } else {
        selectBrush(brush)
      }
    }
  }

  window.addEventListener('keydown', e => {
    let tile
    switch (e.code) {
      case 'Quote':
        tile = e.shiftKey ? '\"' : '\''
        break
      case 'KeyS':
        tile = ' '
        break
      case 'KeyF':
        tile = 'f'
        break
      case 'KeyR':
        tile = 'r'
        break
      case 'KeyX':
        tile = 'x'
        break
      case 'Equal':
        tile = e.shiftKey ? '+' : '='
        break
      case 'Digit3':
        tile = e.shiftKey ? '#' : '3'
        break
      case 'KeyD':
        tile = 'D'
        break
      case 'KeyB':
        tile = 'b'
        break
      case 'KeyK':
        tile = 'k'
        break
      case 'KeyO':
        tile = 'o'
        break
      case 'KeyM':
        tile = 'm'
        break
      case 'KeyW':
        tile = 'w'
        break
      case 'Digit6':
        tile = e.shiftKey ? '^' : '6'
        break
      case 'Digit7':
        tile = '7'
        break
      case 'Comma':
        tile = e.shiftKey ? '<' : ','
        break
      case 'Period':
        tile = e.shiftKey ? '>' : '.'
        break
      case 'KeyV':
        tile = 'v'
        break
      case 'BracketLeft':
        if (e.shiftKey) {
          tile = '{'
        }
        break
      case 'BracketRight':
        if (e.shiftKey) {
          tile = '}'
        }
        break
      case 'Slash':
        tile = '/'
        break
      case 'Backslash':
        if (e.shiftKey) {
          tile = '|'
        }
        break
      case 'Digit1':
        tile = e.shiftKey ? '!' : '1'
        break
      case 'Digit2':
        tile = e.shiftKey ? '@' : '2'
        break
      case 'Digit4':
        tile = '4'
        break
      case 'Digit5':
        tile = '5'
        break
      case 'Backquote':
        if (e.shiftKey) {
          tile = '~'
        }
        break
      case 'KeyT':
        tile = 't'
        break
      case 'KeyN':
        tile = 'n'
        break
      case 'KeyU':
        tile = 'u'
        break
      case 'Digit9':
        if (e.shiftKey) {
          tile = '('
        }
        break
      case 'Digit0':
        if (e.shiftKey) {
          tile = ')'
        }
        break
      case 'KeyZ':
        tile = 'z'
        break
      case 'KeyL':
        tile = 'l'
        break
      case 'KeyG':
        tile = 'g'
        break
      case 'KeyC':
        tile = 'c'
        break
      default:
        tile = ''
    }

    if (tile !== '') {
      const brush = getTileFromSymbol(tile)
      if (brush) {
        applyHotkey(e, brush)
      }
    }
  }, true)
}
