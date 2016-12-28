import 'babel-polyfill'
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import store from 'src/store'
import routes from 'src/routes'

import 'src/base.css'

const history = syncHistoryWithStore(browserHistory, store)

const rootElement = document.getElementById('root')
function renderApp(newRoutes) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          {newRoutes}
        </Router>
      </Provider>
    </AppContainer>,
    rootElement
  )
}

if (module.hot) {
  module.hot.accept('src/routes', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use `routes` here rather than require() a `newRoutes`.
    const newRoutes = require('src/routes').default
    renderApp(newRoutes)
  })
}

setTimeout(() => renderApp(routes), 0)
