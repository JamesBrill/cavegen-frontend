import { combineReducers } from 'redux'
import jwtDecode from 'jwt-decode'

export default combineReducers({
  token,
  claims
})

function token(state = null, action) {
  switch (action.type) {
    case 'STORE_TOKEN':
      return action.payload.idToken

    case 'LOGOUT':
      return null

    default:
      return state
  }
}

function claims(state = {}, action) {
  switch (action.type) {
    case 'STORE_TOKEN':
      return jwtDecode(action.payload.idToken)

    case 'LOGOUT':
      return {}

    default:
      return state
  }
}
