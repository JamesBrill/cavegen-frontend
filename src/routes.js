import React from 'react'
import { IndexRedirect, Route } from 'react-router'
import App from 'src/app/components/App'
import LevelsPage from 'src/levels/components/LevelsPage'
import EditorPage from 'src/editor/components/EditorPage'
import CheckpointsPage from 'src/editor/components/CheckpointsPage'
import PropertiesPage from 'src/editor/components/PropertiesPage'
import LearnPage from 'src/learn/components/LearnPage'
import ProfilePage from 'src/profile/components/ProfilePage'
import LoginPage from 'src/authentication/components/LoginPage'

export default (
  <Route path='/' component={App}>
    <IndexRedirect to='/build' />
    <Route path='levels' component={LevelsPage} />
    <Route path='build' component={EditorPage} />
    <Route path='checkpoints' component={CheckpointsPage} />
    <Route path='properties' component={PropertiesPage} />
    <Route path='learn' component={LearnPage} />
    <Route path='profile' component={ProfilePage} />
    <Route path='login' component={LoginPage} />
  </Route>
)
