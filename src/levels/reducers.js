import { combineReducers } from 'redux'

export default combineReducers({
  myLevels,
  publicLevels
})

function myLevels(state = [], { type, payload }) {
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

function publicLevels(state = [], { type, payload }) {
  let currentCave
  let currentCaveIndex
  switch (type) {
    case 'LOAD_PUBLIC_CAVES':
      return payload.caves

    case 'LIKE_CAVE':
      currentCave = state.filter(cave => cave.uuid === payload.uuid)[0]
      currentCaveIndex = state.indexOf(currentCave)
      return [
        ...state.slice(0, currentCaveIndex),
        payload.newLikedCave,
        ...state.slice(currentCaveIndex + 1)
      ]

    case 'LOGOUT':
      return []

    default:
      return state
  }
}
