import { combineReducers } from 'redux'

export default combineReducers({
  caves,
  currentCaveUuid
})

function caves(state = [], { type, payload }) {
  let currentCave
  let currentCaveIndex
  switch (type) {
    case 'NEW_CAVE':
      return [
        ...state,
        payload.newCave
      ]

    case 'LOAD_CAVES':
      return payload.caves

    case 'UPDATE_CAVE':
      currentCave = state.filter(cave => cave.uuid === payload.uuid)[0]
      currentCaveIndex = state.indexOf(currentCave)
      return [
        ...state.slice(0, currentCaveIndex),
        payload.updatedCave,
        ...state.slice(currentCaveIndex + 1)
      ]

    default:
      return state
  }
}

function currentCaveUuid(state = -1, { type, payload }) {
  switch (type) {
    case 'NEW_CAVE':
      return payload.newCave.uuid

    case 'UPDATE_CAVE':
    case 'LOAD_CAVE_INTO_GRID':
      return payload.uuid

    default:
      return state
  }
}
