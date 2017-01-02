import { combineReducers } from 'redux'

export default combineReducers({
  picture,
  displayName
})

function picture(state = '', { type, payload }) {
  switch (type) {
    case 'LOAD_USER_PROFILE':
    case 'UPDATE_USER_PROFILE':
      return payload.picture

    case 'LOGOUT':
      return ''

    default:
      return state
  }
}

function displayName(state = 'anonymous', { type, payload }) {
  switch (type) {
    case 'LOAD_USER_PROFILE':
    case 'UPDATE_USER_PROFILE':
      return payload.displayName

    case 'LOGOUT':
      return 'anonymous'

    default:
      return state
  }
}
