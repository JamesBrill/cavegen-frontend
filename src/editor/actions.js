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

export const startRebuild = createAction('START_REBUILD')
export const stopRebuild = createAction('STOP_REBUILD')

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
