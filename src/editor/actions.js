import { createAction } from 'redux-actions'
import { apiRequest } from 'src/utils/api'
import { API_ROOT as PRODUCTION_API_ROOT } from 'src/config/production'
import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'
import { getCaveCode, getCaveCodeOfDimensions } from 'src/editor/utils/cave-code'

export function newCave(name, width, height) {
  return async function (dispatch, getState) {
    try {
      const text = getCaveCodeOfDimensions(width || 40, height || 40)
      const { json } = await apiRequest(getState, '/caves/', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: { name, text }
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
      const uuid = getState().editor.caveUuid
      const caves = getState().levels.myLevels
      const currentCave = caves && caves.filter(c => c.uuid === uuid)[0]
      const { json } = await apiRequest(getState, `/caves/${uuid}/`, {
        method: 'put',
        headers: { 'content-type': 'application/json' },
        body: Object.assign({}, currentCave, cave)
      })

      return dispatch({
        type: 'UPDATE_CAVE',
        payload: {
          uuid,
          updatedCave: json,
          change: cave
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
    } else if (brush.symbol === '7' && cursorType !== 'REMOVECOLUMN') {
      dispatch(setCursorType('REMOVECOLUMN'))
      newCursorType = 'REMOVECOLUMN'
    } else if (brush.symbol === '8' && cursorType !== 'ADDROW') {
      dispatch(setCursorType('ADDROW'))
      newCursorType = 'ADDROW'
    } else if (brush.symbol === '9' && cursorType !== 'REMOVEROW') {
      dispatch(setCursorType('REMOVEROW'))
      newCursorType = 'REMOVEROW'
    } else if (brush.symbol === 'a' && cursorType !== 'SELECTREGION') {
      dispatch(setCursorType('SELECTREGION'))
      caveView.setAnchorPoint(previousCursor.position.x, previousCursor.position.y)
      newCursorType = 'SELECTREGION'
    } else if (['6', '7', '8', '9', 'a'].indexOf(brush.symbol) === -1 && cursorType !== 'SQUARE') {
      dispatch(setCursorType('SQUARE'))
      newCursorType = 'SQUARE'
    }
    if (newCursorType) {
      caveView.erasePreviousCursor(previousCursor.position.x,
                                   previousCursor.position.y,
                                   previousCursor.size,
                                   cursorType)
      if (newCursorType !== 'SELECTREGION') {
        caveView.resetRegionSelector()
      }
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
    const { caveName } = getState().editor
    changeController.applyUndo(grid, caveView)
    const caveCode = getCaveCode(grid, caveName)
    dispatch(updateCave({ text: caveCode }))
    return dispatch({ type: 'UNDO_CAVE_CHANGE' })
  }
}

export function redoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    const { caveName } = getState().editor
    changeController.applyRedo(grid, caveView)
    const caveCode = getCaveCode(grid, caveName)
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
      const uuid = getState().editor.caveUuid
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

export function fillRegion(brush) {
  return function (dispatch, getState) {
    const { cursorType, caveView, changeController, grid } = getState().editor
    const { caveName } = getState().editor
    if (cursorType === 'SELECTREGION' &&
        ['6', '7', '8', '9', 'a', 'f', 'r'].indexOf(brush.symbol) === -1) {
      const tileChanges = caveView.fillRegion(brush)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
      const caveCode = getCaveCode(grid, caveName, '1', 'clear')
      dispatch(updateCave({ text: caveCode }))
    }
  }
}

export function pasteRegion(x, y) {
  return function (dispatch, getState) {
    const { cursorType, caveView, changeController, grid } = getState().editor
    const { caveName } = getState().editor
    if (cursorType === 'SELECTREGION') {
      const tileChanges = caveView.pasteRegion(x, y)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
      const caveCode = getCaveCode(grid, caveName, '1', 'clear')
      dispatch(updateCave({ text: caveCode }))
    }
  }
}
