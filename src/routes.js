import React from 'react'
import { IndexRedirect, Route } from 'react-router'
import App from 'src/app/components/App'
import MyLevelsPage from 'src/levels/components/MyLevelsPage'
import PublicLevelsPage from 'src/levels/components/PublicLevelsPage'
import LevelPage from 'src/levels/components/LevelPage'
import NewLevelPage from 'src/editor/components/NewLevelPage'
import EditorPage from 'src/editor/components/EditorPage'
import EventsPage from 'src/editor/components/EventsPage'
import PropertiesPage from 'src/editor/components/PropertiesPage'
import LearnPage from 'src/learn/components/LearnPage'

export default (
  <Route path='/' component={App}>
    <IndexRedirect to='/build' />
    <Route path='my-levels' component={MyLevelsPage} />
    <Route path='public-levels' component={PublicLevelsPage} />
    <Route path='level/:id' component={LevelPage} />
    <Route path='new-level' component={NewLevelPage} />
    <Route path='build' component={EditorPage} />
    <Route path='events' component={EventsPage} />
    <Route path='properties' component={PropertiesPage} />
    <Route path='learn' component={LearnPage} />
  </Route>
)
