import { combineReducers } from 'redux'

export default combineReducers({
  caves,
  currentCaveUuid,
  currentCaveName
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

    case 'LOGOUT':
      return []

    default:
      return state
  }
}

function currentCaveUuid(state = null, { type, payload }) {
  switch (type) {
    case 'NEW_CAVE':
      return payload.newCave.uuid

    case 'UPDATE_CAVE':
    case 'LOAD_CAVE_INTO_GRID':
      return payload.uuid

    case 'LOGOUT':
      return null

    default:
      return state
  }
}

function currentCaveName(state = null, { type, payload }) {
  switch (type) {
    case 'NEW_CAVE':
      return 'Untitled'

    case 'UPDATE_CAVE':
      return payload.updatedCave.name

    case 'LOAD_CAVE_INTO_GRID':
      return payload.name

    case 'LOGOUT':
      return null

    default:
      return state
  }
}
