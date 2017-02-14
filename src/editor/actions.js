import { createAction } from 'redux-actions'
import { API_ROOT as PRODUCTION_API_ROOT } from 'src/config/production'
import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'
import { getCaveCode } from 'src/editor/utils/cave-code'
import { updateCave } from 'src/caves/actions'

export const setOpenTab = createAction(
  'SET_OPEN_TAB',
  openTab => ({ openTab })
)

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

export const setChangeController = createAction(
  'SET_CHANGE_CONTROLLER',
  changeController => ({ changeController })
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

export const setCursorType = createAction(
  'SET_CURSOR_TYPE',
  cursorType => ({ cursorType })
)

export function setCurrentBrush(brush, pixelX, pixelY) {
  return function (dispatch, getState) {
    const { cursorType, caveView, previousCursor, brushSize } = getState().editor
    const gridX = caveView.getGridX(pixelX || 0)
    const gridY = caveView.getGridY(pixelY || 0)
    let newCursorType
    if (brush.symbol === '6' && cursorType !== 'ADDCOLUMN') {
      dispatch(setCursorType('ADDCOLUMN'))
      newCursorType = 'ADDCOLUMN'
    } else if (brush.symbol !== '6' && cursorType !== 'SQUARE') {
      dispatch(setCursorType('SQUARE'))
      newCursorType = 'SQUARE'
    }
    if (newCursorType) {
      caveView.erasePreviousCursor(previousCursor.position.x,
                                   previousCursor.position.y,
                                   previousCursor.size,
                                   cursorType)
      if (pixelX && pixelY) {
        caveView.drawCursor(gridX, gridY, pixelX, pixelY, brushSize, newCursorType)
      }
    }
    return dispatch({
      type: 'SET_CURRENT_BRUSH',
      payload: {
        currentBrush: brush
      }
    })
  }
}

export function undoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    const { currentCaveName } = getState().caves
    changeController.applyUndo(grid, caveView)
    const caveCode = getCaveCode(grid, currentCaveName)
    dispatch(updateCave({ text: caveCode }))
    return dispatch({ type: 'UNDO_CAVE_CHANGE' })
  }
}

export function redoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    const { currentCaveName } = getState().caves
    changeController.applyRedo(grid, caveView)
    const caveCode = getCaveCode(grid, currentCaveName)
    dispatch(updateCave({ text: caveCode }))
    return dispatch({ type: 'REDO_CAVE_CHANGE' })
  }
}

export function startRebuild() {
  return function (dispatch, getState) {
    const { caveWidth, caveHeight } = getState().editor
    return dispatch({
      type: 'START_REBUILD',
      payload: {
        area: caveWidth * caveHeight
      }
    })
  }
}

export const stopRebuild = createAction('STOP_REBUILD')

export function playCave() {
  return function (dispatch, getState) {
    try {
      const uuid = getState().caves.currentCaveUuid
      const caveUrl = encodeURIComponent(`${PRODUCTION_API_ROOT}/reborn/caves/${uuid}/`)
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

export function loadImages() {
  return async function (dispatch) {
    try {
      const imageMap = await Promise.all(PALETTE_BRUSHES_LIST.map(brush => new Promise(resolve => {
        const fileName = brush.fileName
        const image = new Image()
        image.onload = function () {
          resolve({ fileName, image: this })
        }
        image.src = brush.imagePath
      })))

      return dispatch({
        type: 'LOAD_IMAGES',
        payload: { imageMap }
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_IMAGES_ERROR',
        error: e
      })
    }
  }
}
