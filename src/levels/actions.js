import { apiRequest } from 'src/utils/api'
import { newCave } from 'src/editor/actions'

export function loadMyLevels() {
  return async function(dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-caves/')
      if (json.length === 0) {
        dispatch(newCave('Untitled'))
      }
      return dispatch({
        type: 'LOAD_CAVES',
        payload: {
          caves: json
        }
      })
    } catch (e) {
      return dispatch({
        type: 'LOAD_CAVES_ERROR',
        error: e
      })
    }
  }
}
