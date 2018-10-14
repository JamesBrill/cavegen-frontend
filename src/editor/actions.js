import uuid from 'uuid'
import { createAction } from 'redux-actions'
import { Cave } from 'src/editor/utils/cave'
import { splitCaveCode } from 'src/editor/utils/cave-code'
import { PALETTE_BRUSHES_LIST } from 'src/utils/ImageLoader'
import { writeCave, writeCaveName, writeCaveText } from 'src/utils/storage'
import {
  getCaveCodeOfDimensions,
  getCaveCode
} from 'src/editor/utils/cave-code'

export function newCave(name, width, height) {
  return dispatch => {
    try {
      const text = getCaveCodeOfDimensions(width || 40, height || 40)
      const id = uuid.v1()
      writeCave({ id, name, text })

      return dispatch({
        type: 'NEW_CAVE',
        payload: { id, name, text }
      })
    } catch (e) {
      return dispatch({
        type: 'NEW_CAVE_ERROR',
        error: e
      })
    }
  }
}

export function updateCave({ id, name, text }) {
  return dispatch => {
    try {
      if (name) {
        writeCaveName({ id, name })
      } else {
        writeCaveText({ id, text })
      }
      return dispatch({
        type: 'UPDATE_CAVE',
        payload: { id, name, text }
      })
    } catch (e) {
      return dispatch({
        type: 'UPDATE_CAVE_ERROR',
        error: e
      })
    }
  }
}

export const setGrid = createAction('SET_GRID', grid => ({ grid }))

export const setCaveWidth = createAction('SET_CAVE_WIDTH', caveWidth => ({
  caveWidth
}))

export const setCaveHeight = createAction('SET_CAVE_HEIGHT', caveHeight => ({
  caveHeight
}))

export const setBackgroundType = createAction(
  'SET_BACKGROUND_TYPE',
  backgroundType => ({
    backgroundType
  })
)

export const setTerrainType = createAction('SET_TERRAIN_TYPE', terrainType => ({
  terrainType
}))

export const setWaterType = createAction('SET_WATER_TYPE', waterType => ({
  waterType
}))

export const setCaveCode = createAction('SET_CAVE_CODE', caveCode => ({
  caveCode
}))

export function updateCaveCodeOnServer(changes, uuid) {
  return function (dispatch, getState) {
    const {
      grid,
      caveName,
      eventsText,
      terrainType,
      backgroundType,
      waterType,
      caveUuid
    } = Object.assign({}, getState().editor, changes)
    const caveCode = getCaveCode(
      grid,
      caveName,
      eventsText,
      terrainType,
      backgroundType,
      waterType
    )
    dispatch(updateCave({ id: uuid, text: caveCode, name: caveName }))
    if (!uuid || uuid === caveUuid) {
      dispatch(setCaveCode(caveCode))
    }
  }
}

export function updateCaveCodeInRedux(grid) {
  return function (dispatch, getState) {
    const {
      caveName,
      eventsText,
      terrainType,
      backgroundType,
      waterType
    } = getState().editor
    const caveCode = getCaveCode(
      grid,
      caveName,
      eventsText,
      terrainType,
      backgroundType,
      waterType
    )
    dispatch(setCaveCode(caveCode))
  }
}

export const setCaveView = createAction('SET_CAVE_VIEW', caveView => ({
  caveView
}))

export const setChangeController = createAction(
  'SET_CHANGE_CONTROLLER',
  changeController => ({ changeController })
)

export const setBrushSize = createAction('SET_BRUSH_SIZE', brushSize => ({
  brushSize
}))

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

export const setCursorType = createAction('SET_CURSOR_TYPE', cursorType => ({
  cursorType
}))

export const hoverAtCoordinates = createAction(
  'HOVER_AT_COORDINATES',
  (x, y) => ({
    x,
    y
  })
)

export function setCurrentBrush(brush, pixelX, pixelY) {
  return function (dispatch, getState) {
    const {
      cursorType,
      caveView,
      previousCursor,
      brushSize
    } = getState().editor
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
      caveView.setAnchorPoint(
        previousCursor.position.x,
        previousCursor.position.y
      )
      newCursorType = 'SELECTREGION'
    } else if (
      ['6', '7', '8', '9', 'a'].indexOf(brush.symbol) === -1 &&
      cursorType !== 'SQUARE'
    ) {
      dispatch(setCursorType('SQUARE'))
      newCursorType = 'SQUARE'
    }
    if (newCursorType) {
      caveView.erasePreviousCursor(
        previousCursor.position.x,
        previousCursor.position.y,
        previousCursor.size,
        cursorType
      )
      if (newCursorType !== 'SELECTREGION') {
        caveView.resetRegionSelector()
      }
      if (pixelX && pixelY) {
        caveView.drawCursor(
          gridX,
          gridY,
          pixelX,
          pixelY,
          brushSize,
          newCursorType
        )
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
    changeController.applyUndo(grid, caveView)
    dispatch(updateCaveCodeOnServer())
    return dispatch({ type: 'UNDO_CAVE_CHANGE' })
  }
}

export function redoCaveChange() {
  return function (dispatch, getState) {
    const { changeController, caveView, grid } = getState().editor
    changeController.applyRedo(grid, caveView)
    dispatch(updateCaveCodeOnServer())
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

export function loadCaveIntoGrid(uuidToLoad) {
  return function (dispatch, getState) {
    const { changeController, caveUuid } = getState().editor
    const { myLevels } = getState().levels
    const id = uuidToLoad || (caveUuid === null ? myLevels[0].id : caveUuid)
    const cave = myLevels.find(x => x.id === id)
    const {
      caveString,
      eventsText,
      backgroundType,
      terrainType,
      waterType
    } = splitCaveCode(cave.text)
    const grid = new Cave({ caveString })
    dispatch(setGrid(grid))
    if (changeController) {
      changeController.clear()
    }
    dispatch(setCaveWidth(grid.width))
    dispatch(setCaveHeight(grid.height))
    dispatch({
      type: 'LOAD_CAVE_INTO_GRID',
      payload: {
        id: cave.id,
        name: cave.name,
        caveCode: caveString,
        eventsText,
        backgroundType,
        terrainType,
        waterType
      }
    })
  }
}

export function loadImages() {
  return async function(dispatch) {
    try {
      const imageMap = await Promise.all(
        PALETTE_BRUSHES_LIST.map(
          brush =>
            new Promise(resolve => {
              const fileName = brush.fileName
              const image = new Image()
              image.onload = function () {
                resolve({ fileName, image: this })
              }
              image.src =
                fileName === 'space'
                  ? '/static/misc/black.png'
                  : brush.imagePath
            })
        )
      )

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
    const { cursorType, caveView, changeController } = getState().editor
    if (
      cursorType === 'SELECTREGION' &&
      ['6', '7', '8', '9', 'a', 'f', 'r'].indexOf(brush.symbol) === -1
    ) {
      const tileChanges = caveView.fillRegion(brush)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
      dispatch(updateCaveCodeOnServer())
    }
  }
}

export function pasteRegion(x, y) {
  return function (dispatch, getState) {
    const { cursorType, caveView, changeController } = getState().editor
    if (cursorType === 'SELECTREGION') {
      const tileChanges = caveView.pasteRegion(x, y)
      changeController.addTileChanges(tileChanges)
      changeController.addPaintedLineChange()
      dispatch(updateCaveCodeOnServer())
    }
  }
}

export function rebuildLevel(width, height) {
  return function (dispatch, getState) {
    const { caveWidth, caveHeight } = getState().editor
    dispatch(setCaveWidth(width || caveWidth))
    dispatch(setCaveHeight(height || caveHeight))
    dispatch(startRebuild())
    dispatch(
      setGrid(
        new Cave({
          width: width || caveWidth,
          height: height || caveHeight
        })
      )
    )
  }
}
