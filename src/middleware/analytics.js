/* eslint-disable no-undef */

export default function analyticsMiddleware(store) {
  const initialState = store.getState()

  if (initialState.authentication.token) {
    handleAuthentication(initialState)
  }

  return next => action => {
    const result = next(action)
    const nextState = store.getState()

    switch (action.type) {
      case 'STORE_TOKEN':
        handleAuthentication(nextState)
        break

      case 'LOGOUT':
        handleLogout(nextState)
        break

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

      case 'PLAY_CAVE':
        handlePlayCave(nextState)
        break

      case 'UPDATE_USER_PROFILE':
        handleUpdateProfile(result.payload.change)
        break
    }

    return result
  }
}

function handleAuthentication(newState) {
  ga('set', 'userId', newState.authentication.claims.sub)
  ga('send', 'event', 'CaveGen', 'login', newState.authentication.claims.sub)
}

function handleLogout(newState) {
  ga('send', 'event', 'CaveGen', 'logout', newState.authentication.claims.sub)
}

function handleNewCave() {
  ga('send', 'event', 'Caves', 'new cave')
}

function handleUpdateCave(change, newState) {
  if (change.text) {
    ga('send', 'event', 'Caves', 'update cave text', newState.caves.currentCaveName)
  }
  if (change.name) {
    ga('send', 'event', 'Caves', 'update cave name', change.name)
  }
  if (change.isPublic) {
    ga('send', 'event', 'Caves', 'make cave public', newState.caves.currentCaveName)
  }
  if (change.isPublic === false) {
    ga('send', 'event', 'Caves', 'make cave private', newState.caves.currentCaveName)
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
  ga('send', 'event', 'Caves', 'rebuild', newState.caves.currentCaveName, area)
}

function handlePlayCave(newState) {
  ga('send', 'event', 'Caves', 'play', newState.caves.currentCaveName)
}

function handleUpdateProfile(change) {
  if (change.displayName) {
    ga('send', 'event', 'Profile', 'update display name', change.displayName)
  }
  if (change.picture) {
    ga('send', 'event', 'Profile', 'update picture', change.picture)
  }
}
