import merge from 'lodash.merge'
import { Schema } from 'normalizr'
import * as schemas from 'src/schemas'

const DEFAULT_STATE = {}

for (const schema of Object.values(schemas)) {
  if (schema instanceof Schema) {
    DEFAULT_STATE[schema.getKey()] = {}
  }
}

export default function entities(state = DEFAULT_STATE, action) {
  if (action.meta && action.meta.entities) {
    return merge({}, state, action.meta.entities)
  } else {
    return state
  }
}
