import { apiRequest } from 'src/utils/api'
import { API_ROOT as PRODUCTION_API_ROOT } from 'src/config/production'
import { newCave } from 'src/editor/actions'

export function loadMyLevels() {
  return async function(dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-caves/')
      if (json.length === 0) {
        dispatch(newCave('Untitled'))
      }
      return dispatch({
        type: 'LOAD_CAVES',
        payload: {
          caves: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_CAVES_ERROR',
        error: e
      })
    }
  }
}

export function loadPublicLevels() {
  return async function(dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/public-caves/')
      return dispatch({
        type: 'LOAD_PUBLIC_CAVES',
        payload: {
          caves: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_PUBLIC_CAVES_ERROR',
        error: e
      })
    }
  }
}

export function playCave(uuid) {
  return function (dispatch, getState) {
    try {
      const caveUuid = uuid || getState().editor.caveUuid
      const caveUrl = encodeURIComponent(
        `${PRODUCTION_API_ROOT}/reborn/caves/${caveUuid}/`
      )
      const playerUrl = `http://droidfreak36.com/HATPC/reborn.php?cave=${caveUrl}`
      window.open(playerUrl, '_blank')
      return dispatch({ type: 'PLAY_CAVE' })
    } catch (e) {
      return dispatch({
        type: 'PLAY_CAVE_ERROR',
        error: e
      })
    }
  }
}

export function likeCave(uuid) {
  return async function(dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, `/caves/${uuid}/like/`)

      return dispatch({
        type: 'LIKE_CAVE',
        payload: {
          uuid,
          newLikedCave: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'LIKE_CAVE_ERROR',
        error: e
      })
    }
  }
}
