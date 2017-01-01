import { apiRequest } from 'src/utils/api'
import {
  setCaveWidth,
  setCaveHeight
} from 'src/editor/actions'

export function newCave(text) {
  return async function (dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/caves/', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: { text }
      })

      return dispatch({
        type: 'NEW_CAVE',
        payload: {
          cave: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'NEW_CAVE_ERROR',
        error: e
      })
    }
  }
}

export function loadCaves() {
  return async function (dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-caves/')

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

export function loadCaveIntoGrid(cave) {
  return function (dispatch, getState) {
    const { grid, changeController } = getState().editor
    grid.rebuildCaveFromCaveString(cave.text)
    changeController.clear()
    dispatch(setCaveWidth(grid.width))
    dispatch(setCaveHeight(grid.height))
    dispatch({ type: 'LOAD_CAVE_INTO_GRID' })
  }
}
