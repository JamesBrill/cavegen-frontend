import { apiRequest } from 'src/utils/api'
import { Cave } from 'src/editor/utils/cave'
import {
  setGrid,
  setCaveWidth,
  setCaveHeight,
  newCave
} from 'src/editor/actions'

export function loadMyLevels() {
  return async function (dispatch, getState) {
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
  return async function (dispatch, getState) {
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

export function loadCaveIntoGrid(cave) {
  return function (dispatch, getState) {
    const { changeController } = getState().editor
    const grid = new Cave({ caveString: cave.text })
    dispatch(setGrid(grid))
    changeController.clear()
    dispatch(setCaveWidth(grid.width))
    dispatch(setCaveHeight(grid.height))
    dispatch({
      type: 'LOAD_CAVE_INTO_GRID',
      payload: {
        uuid: cave.uuid,
        name: cave.name,
        likes: cave.likes,
        isPublic: cave.isPublic
      }
    })
  }
}

export function likeCave() {
  return async function (dispatch, getState) {
    try {
      const uuid = getState().editor.caveUuid
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
