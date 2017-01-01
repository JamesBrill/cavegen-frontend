import fetch from 'isomorphic-fetch'
import { camelizeKeys, decamelizeKeys } from 'humps'
import isString from 'lodash.isstring'
import { API_ROOT } from 'src/config'
import ExtendableError from 'src/utils/ExtendableError'

export class ApiError extends ExtendableError {
  constructor(message, response, json) {
    super(message)
    this.response = response
    this.json = json
  }
}

export async function apiRequest(getState, endpoint, options = {}) {
  const { authentication } = getState()

  // attach the authorization header if we have a token...
  if (authentication.token) {
    options.headers = {
      Authorization: `Bearer ${authentication.token}`,
      ...options.headers
    }
  }
  // decamelize the keys & stringify if the body isn't a string
  if (options.hasOwnProperty('body') && !isString(options.body)) {
    options.body = JSON.stringify(decamelizeKeys(options.body))
  }

  try {
    const url = endpoint.startsWith('/') ? `${API_ROOT}${endpoint}` : endpoint
    const response = await fetch(url, options)
    const json = await response.json()

    if (!response.ok) {
      throw new ApiError('Non-OK response from API', response, camelizeKeys(json))
    } else {
      return { response, json: camelizeKeys(json) }
    }
  } catch (e) {
    if (e.message === 'Non-OK response from API') {
      throw e
    }
    // This is likely a network error
    throw new ApiError('A network error occurred during an API request')
  }
}
