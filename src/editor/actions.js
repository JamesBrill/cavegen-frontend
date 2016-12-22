import { createAction } from 'redux-actions'
import { apiRequest } from 'src/utils/api'
import { API_ROOT as PRODUCTION_API_ROOT } from 'src/config/production'

export const setGrid = createAction(
  'SET_GRID',
  grid => ({ grid })
)

export const setCaveWidth = createAction(
  'SET_CAVE_WIDTH',
  caveWidth => ({ caveWidth })
)

export const setCaveHeight = createAction(
  'SET_CAVE_HEIGHT',
  caveHeight => ({ caveHeight })
)

export const setCaveCode = createAction(
  'SET_CAVE_CODE',
  caveCode => ({ caveCode })
)

export const setCaveView = createAction(
  'SET_CAVE_VIEW',
  caveView => ({ caveView })
)

export const setCaveViewModel = createAction(
  'SET_CAVE_VIEWMODEL',
  caveViewModel => ({ caveViewModel })
)

export const setChangeController = createAction(
  'SET_CHANGE_CONTROLLER',
  changeController => ({ changeController })
)

export const setCurrentBrush = createAction(
  'SET_CURRENT_BRUSH',
  currentBrush => ({ currentBrush })
)

export const setBrushSize = createAction(
  'SET_BRUSH_SIZE',
  brushSize => ({ brushSize })
)

export const setLastUsedBrushSize = createAction(
  'SET_LAST_USED_BRUSH_SIZE',
  lastUsedBrushSize => ({ lastUsedBrushSize })
)

export const setPreviousCursorSize = createAction(
  'SET_PREVIOUS_CURSOR_SIZE',
  previousCursorSize => ({ previousCursorSize })
)

export const setPreviousCursorPosition = createAction(
  'SET_PREVIOUS_CURSOR_POSITION',
  previousCursorPosition => ({ previousCursorPosition })
)

export function undoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    changeController.applyUndo(grid, caveView)
    return dispatch({ type: 'UNDO_CAVE_CHANGE' })
  }
}

export function redoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    changeController.applyRedo(grid, caveView)
    return dispatch({ type: 'REDO_CAVE_CHANGE' })
  }
}

export function startRebuild() {
  return function (dispatch, getState) {
    const { changeController, grid, caveWidth, caveHeight } = getState().editor
    changeController.addGenerateCaveChange(grid, caveWidth, caveHeight)
    return dispatch({ type: 'START_REBUILD' })
  }
}

export const stopRebuild = createAction('STOP_REBUILD')

export function playCave() {
  return async function (dispatch, getState) {
    try {
      const text = getState().editor.caveCode
      const { json } = await apiRequest(getState, '/caves/', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: { text }
      })

      const caveUrl = encodeURIComponent(`${PRODUCTION_API_ROOT}/caves/${json.id}/`)
      const playerUrl = `http://droidfreak36.com/HATPC/0_2_1/index.html?cave=${caveUrl}`
      window.open(playerUrl, 'HATPC Reborn', 'height=440,width=600')

      return dispatch({
        type: 'PLAY_CAVE',
        payload: text
      })
    } catch (e) {
      return dispatch({
        type: 'PLAY_CAVE_ERROR',
        error: e
      })
    }
  }
}
