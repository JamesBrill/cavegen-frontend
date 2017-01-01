import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import persistState from 'redux-localstorage'
import analyticsMiddleware from 'src/middleware/analytics'
import * as reducers from 'src/reducers'

const store = compose(
  persistState(['caves', 'authentication']),
  applyMiddleware(
    analyticsMiddleware,
    thunkMiddleware,
    routerMiddleware(browserHistory)
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
)

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('src/reducers', () => {
    const newReducers = require('src/reducers')

    store.replaceReducer(combineReducers({
      ...newReducers,
      routing: routerReducer
    }))
  })
}

export default store
