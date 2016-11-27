import { combineReducers } from 'redux'
import { CaveStorage } from 'src/editor/utils/cave-storage'

export default combineReducers({
  grid,
  caveView,
  caveViewModel,
  caveStorage,
  changeController,
  currentBrush,
  brushSize,
  lastUsedBrushSize,
  previousCursor
})

function grid(state = null, { type, payload }) {
  switch (type) {
    case 'SET_GRID':
      return payload.grid

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

function caveViewModel(state = null, { type, payload }) {
  switch (type) {
    case 'SET_CAVE_VIEWMODEL':
      return payload.caveViewModel

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

function caveStorage(state = new CaveStorage(), { type, payload }) {
  switch (type) {
    case 'SET_CAVE_STORAGE':
      return payload.caveStorage

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
