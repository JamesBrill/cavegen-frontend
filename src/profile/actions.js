import { apiRequest } from 'src/utils/api'

export function loadUserProfile() {
  return async function (dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-profile/')
      return dispatch({
        type: 'LOAD_USER_PROFILE',
        payload: json
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_USER_PROFILE_ERROR',
        error: e
      })
    }
  }
}

export function updateUserProfile(profile) {
  return async function (dispatch, getState) {
    try {
      const currentProfile = getState().profile
      const { json } = await apiRequest(getState, '/my-profile/', {
        method: 'put',
        headers: { 'content-type': 'application/json' },
        body: Object.assign({}, currentProfile, profile)
      })

      return dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: {
          ...json,
          change: profile
        }
      })
    } catch (e) {
      return dispatch({
        type: 'UPDATE_USER_PROFILE_ERROR',
        error: e
      })
    }
  }
}
