import { combineReducers } from 'redux'
import { CaveViewModel } from 'src/editor/utils/cave-viewmodel'
import { CaveStorage } from 'src/editor/utils/cave-storage'

export default combineReducers({
  grid,
  caveView,
  caveViewModel,
  caveStorage,
  currentBrush
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
