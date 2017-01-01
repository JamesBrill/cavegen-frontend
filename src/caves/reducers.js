import { combineReducers } from 'redux'

export default combineReducers({
  caves,
  currentCave
})

function caves(state = [], { type, payload }) {
  switch (type) {
    case 'LOAD_CAVES':
      return payload.caves

    default:
      return state
  }
}

function currentCave(state = null, { type, payload }) {
  switch (type) {
    case 'NEW_CAVE':
    case 'LOAD_CAVE_INTO_GRID':
      return payload.cave

    default:
      return state
  }
}
