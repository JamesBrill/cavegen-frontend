import { createAction } from 'redux-actions'

export const storeToken = createAction(
  'STORE_TOKEN',
  idToken => ({ idToken })
)

export const storeUser = createAction(
  'STORE_USER',
  user => ({ user })
)

export const logout = createAction('LOGOUT')
