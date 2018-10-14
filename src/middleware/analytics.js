/* eslint-disable no-undef */

export default function analyticsMiddleware(store) {
  const isProduction = process.env.NODE_ENV === 'production'

  return next => action => {
    const result = next(action)
    const nextState = store.getState()
    if (!isProduction) {
      return result
    }
    switch (action.type) {
      case 'NEW_CAVE':
        handleNewCave()
        break

      case 'UPDATE_CAVE':
        handleUpdateCave(result.payload.change, nextState)
        break

      case 'LOAD_CAVE_INTO_GRID':
        handleLoadCave(result.payload.name)
        break

      case 'SET_CAVE_WIDTH':
        handleSetCaveWidth(result.payload.caveWidth)
        break

      case 'SET_CAVE_HEIGHT':
        handleSetCaveHeight(result.payload.caveHeight)
        break

      case 'SET_CURRENT_BRUSH':
        handleSetCurrentBrush(result.payload.currentBrush.fileName)
        break

      case 'SET_BRUSH_SIZE':
        handleSetBrushSize(result.payload.brushSize)
        break

      case 'START_REBUILD':
        handleRebuild(result.payload.area, nextState)
        break
    }

    return result
  }
}

function handleNewCave() {
  ga('send', 'event', 'Caves', 'new cave')
}

function handleUpdateCave(change, newState) {
  if (change.text) {
    ga('send', 'event', 'Caves', 'update cave text', newState.editor.caveName)
  }
  if (change.name) {
    ga('send', 'event', 'Caves', 'update cave name', change.name)
  }
}

function handleLoadCave(name) {
  ga('send', 'event', 'Caves', 'load', name)
}

function handleSetCaveWidth(width) {
  ga('send', 'event', 'Caves', 'set width', width)
}

function handleSetCaveHeight(height) {
  ga('send', 'event', 'Caves', 'set height', height)
}

function handleSetCurrentBrush(brush) {
  ga('send', 'event', 'Editor', 'set brush type', brush)
}

function handleSetBrushSize(size) {
  ga('send', 'event', 'Editor', 'set brush size', size)
}

function handleRebuild(area, newState) {
  ga('send', 'event', 'Caves', 'rebuild', newState.editor.caveName, area)
}
