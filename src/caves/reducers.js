import { combineReducers } from 'redux'

export default combineReducers({
  caves
})

function caves(state = [], { type, payload }) {
  switch (type) {
    case 'LOAD_CAVES':
      return payload.caves

    default:
      return state
  }
}
