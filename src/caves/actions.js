import { apiRequest } from 'src/utils/api'
import { getNewCaveCode } from 'src/editor/utils/cave-code'
import { Cave } from 'src/editor/utils/cave'
import {
  setGrid,
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
        payload: { newCave: json }
      })
    } catch (e) {
      return dispatch({
        type: 'NEW_CAVE_ERROR',
        error: e
      })
    }
  }
}

export function updateCave(cave) {
  return async function (dispatch, getState) {
    try {
      const uuid = getState().caves.currentCaveUuid
      const { json } = await apiRequest(getState, `/caves/${uuid}/`, {
        method: 'put',
        headers: { 'content-type': 'application/json' },
        body: cave
      })

      return dispatch({
        type: 'UPDATE_CAVE',
        payload: {
          uuid,
          updatedCave: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'UPDATE_CAVE_ERROR',
        error: e
      })
    }
  }
}

export function loadCaves() {
  return async function (dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-caves/')
      if (json.length === 0) {
        dispatch(newCave(getNewCaveCode()))
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
      payload: { uuid: cave.uuid }
    })
  }
}
