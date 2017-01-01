import { apiRequest } from 'src/utils/api'

export function loadCaves() {
  return async function (dispatch, getState) {
    try {
      const { json } = await apiRequest(getState, '/my-caves/')

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
