import { combineReducers } from 'redux'

export default combineReducers({
  myLevels
})

function myLevels(state = [], { type, payload }) {
  let currentCave
  let currentCaveIndex
  switch (type) {
    case 'NEW_CAVE':
      return [...state, payload]

    case 'LOAD_CAVES':
      return payload.caves

    case 'UPDATE_CAVE':
      currentCave = state.filter(cave => cave.id === payload.id)[0]
      currentCaveIndex = state.indexOf(currentCave)
      return [
        ...state.slice(0, currentCaveIndex),
        payload,
        ...state.slice(currentCaveIndex + 1)
      ]

    default:
      return state
  }
}
