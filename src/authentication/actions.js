import { createAction } from 'redux-actions'

export const storeToken = createAction(
  'STORE_TOKEN',
  idToken => ({ idToken })
)

export const logout = createAction('LOGOUT')
