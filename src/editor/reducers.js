import { combineReducers } from 'redux'

export default combineReducers({
  grid,
  caveWidth,
  caveHeight,
  caveCode,
  caveView,
  changeController,
  currentBrush,
  brushSize,
  lastUsedBrushSize,
  previousCursor,
  needsRebuild,
  imageMap,
  openTab
})

function grid(state = null, { type, payload }) {
  switch (type) {
    case 'SET_GRID':
      return payload.grid

    default:
      return state
  }
}

function caveWidth(state = 40, { type, payload }) {
  switch (type) {
    case 'SET_CAVE_WIDTH':
      return payload.caveWidth

    default:
      return state
  }
}

function caveHeight(state = 40, { type, payload }) {
  switch (type) {
    case 'SET_CAVE_HEIGHT':
      return payload.caveHeight

    default:
      return state
  }
}

function caveCode(state = '', { type, payload }) {
  switch (type) {
    case 'SET_CAVE_CODE':
      return payload.caveCode

    default:
      return state
  }
}

function caveView(state = null, { type, payload }) {
  switch (type) {
    case 'SET_CAVE_VIEW':
      return payload.caveView

    default:
      return state
  }
}

function changeController(state = null, { type, payload }) {
  switch (type) {
    case 'SET_CHANGE_CONTROLLER':
      return payload.changeController

    default:
      return state
  }
}

function currentBrush(state = { fileName: 'terrain', symbol: 'x' }, { type, payload }) {
  switch (type) {
    case 'SET_CURRENT_BRUSH':
      return payload.currentBrush

    default:
      return state
  }
}

function brushSize(state = 1, { type, payload }) {
  switch (type) {
    case 'SET_BRUSH_SIZE':
      return payload.brushSize

    default:
      return state
  }
}

function lastUsedBrushSize(state = null, { type, payload }) {
  switch (type) {
    case 'SET_LAST_USED_BRUSH_SIZE':
      return payload.lastUsedBrushSize

    default:
      return state
  }
}

function previousCursor(state = { size: 1, position: { x: 0, y: 0 } }, { type, payload }) {
  switch (type) {
    case 'SET_PREVIOUS_CURSOR_SIZE':
      return {
        size: payload.previousCursorSize,
        position: state.position
      }

    case 'SET_PREVIOUS_CURSOR_POSITION':
      return {
        size: state.size,
        position: payload.previousCursorPosition
      }

    default:
      return state
  }
}

function needsRebuild(state = false, { type }) {
  switch (type) {
    case 'START_REBUILD':
    case 'LOAD_CAVE_INTO_GRID':
      return true

    case 'STOP_REBUILD':
      return false

    default:
      return state
  }
}

function imageMap(state = [], { type, payload }) {
  switch (type) {
    case 'LOAD_IMAGES':
      return payload.imageMap

    default:
      return state
  }
}

function openTab(state = 'palette', { type, payload }) {
  switch (type) {
    case 'SET_OPEN_TAB':
      return payload.openTab

    default:
      return state
  }
}
