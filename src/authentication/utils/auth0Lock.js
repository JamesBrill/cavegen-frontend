import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOGIN_URL } from 'src/config'
import Auth0Lock from 'auth0-lock'

export function createAuth0Lock() {
  return new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      redirectUrl: LOGIN_URL,
      responseType: 'token'
    },
    closable: false,
    languageDictionary: {
      title: 'CaveGen'
    }
  })
}

export function getProfile(lock, token) {
  return new Promise(resolve => {
    lock.getProfile(token, (error, profile) => {
      if (!error) {
        resolve(profile)
      }
    })
  })
}
