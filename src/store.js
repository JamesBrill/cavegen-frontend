import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { hashHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import analyticsMiddleware from 'src/middleware/analytics'
import * as reducers from 'src/reducers'

const store = compose(
  applyMiddleware(
    analyticsMiddleware,
    thunkMiddleware,
    routerMiddleware(hashHistory)
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
