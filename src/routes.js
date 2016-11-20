import React from 'react'
import { IndexRedirect, Route } from 'react-router'
import App from 'src/app/components/App'
import EditorPage from 'src/editor/components/EditorPage'

export default (
  <Route path='/' component={App}>
    <IndexRedirect to='/editor' />
    <Route path='editor' component={EditorPage} />
  </Route>
)
