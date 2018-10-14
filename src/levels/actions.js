import { readAllCaves } from 'src/utils/storage'
import { newCave } from 'src/editor/actions'

export function loadMyLevels() {
  return dispatch => {
    try {
      const caves = readAllCaves()
      if (caves.length === 0) {
        dispatch(newCave('Untitled'))
      }
      return dispatch({
        type: 'LOAD_CAVES',
        payload: { caves }
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_CAVES_ERROR',
        error: e
      })
    }
  }
}
