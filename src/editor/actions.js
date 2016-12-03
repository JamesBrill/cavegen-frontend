import { createAction } from 'redux-actions'

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
