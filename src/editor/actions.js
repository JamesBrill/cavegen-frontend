import { createAction } from 'redux-actions'

export const setGrid = createAction(
  'SET_GRID',
  grid => ({ grid })
)

export const setCaveView = createAction(
  'SET_CAVE_VIEW',
  caveView => ({ caveView })
)

export const setCurrentBrush = createAction(
  'SET_CURRENT_BRUSH',
  currentBrush => ({ currentBrush })
)
