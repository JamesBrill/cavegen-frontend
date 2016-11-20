import { LOCATION_CHANGE } from 'react-router-redux'
import { SEGMENT_WRITE_KEY } from 'src/config'

if (window && window.analytics) {
  window.analytics.load(SEGMENT_WRITE_KEY)
}

export default function analyticsMiddleware(store) {
  // This allows us to assume that window.analytics is always a thing.
  if (!window || !window.analytics) {
    return f => f
  }

  const initialState = store.getState()

  if (initialState.authentication.token) {
    handleAuthentication(initialState)
  }

  return next => action => {
    const prevState = store.getState()
    const result = next(action)
    const nextState = store.getState()

    switch (action.type) {
      case 'STORE_TOKEN':
        handleAuthentication(nextState)
        handleLogin()
        break

      case 'BEGIN_GOOGLE_LOGIN':
        handleBeginGoogleLogin()
        break

      case 'LOGOUT':
        handleLogout()
        break

      case LOCATION_CHANGE:
        handlePathChange(action, prevState)
        break

      // no default
    }

    return result
  }
}

function handleAuthentication(newState) {
  const analytics = window.analytics
  const { sub, email } = newState.authentication.claims
  const emailDomain = email.substring(email.lastIndexOf('@') + 1)

  analytics.identify(sub, { email, emailDomain })
  analytics.alias(sub)
  analytics.group(emailDomain)
}

function handleLogin() {
  window.analytics.track('Signed In')
}

function handleBeginGoogleLogin() {
  window.analytics.track('Started Google OAuth')
}

function handleLogout() {
  window.analytics.reset()
}

function handlePathChange(action, prevState) {
  const { pathname: path, search } = action.payload
  const { locationBeforeTransitions } = prevState.routing

  if (locationBeforeTransitions) {
    const { pathname: oldPath, search: oldSearch } = locationBeforeTransitions
    window.analytics.page({ path, search, oldPath, oldSearch })
  } else {
    window.analytics.page({ path, search })
  }
}
