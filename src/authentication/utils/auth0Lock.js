import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_CALLBACK_URL } from 'src/config'
import Auth0Lock from 'auth0-lock'

export function createAuth0Lock() {
  return new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    auth: {
      redirectUrl: AUTH0_CALLBACK_URL,
      responseType: 'code',
      params: {
        scope: 'openid email'
      }
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
