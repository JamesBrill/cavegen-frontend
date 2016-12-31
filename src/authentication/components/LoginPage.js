import React, { PureComponent, PropTypes } from 'react'
import Auth0 from 'auth0-js'
import { createAuth0Lock, getProfile } from 'src/authentication/utils/auth0Lock'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter, locationShape, browserHistory } from 'react-router'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from 'src/config'
import { storeToken, storeUser } from 'src/authentication/actions'

function mapStateToProps(state) {
  return {
    token: state.authentication && state.authentication.token
  }
}

@connect(mapStateToProps)
@withRouter
export default class LoginPage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    location: locationShape.isRequired,
    token: PropTypes.string
  };

  @autobind
  showAuth0Lock() {
    const lock = createAuth0Lock()
    lock.show()
  }

  componentWillMount() {
    const token = this.props.token || this.props.location.query.token
    if (token) {
      this.props.dispatch(storeToken(token))
      getProfile(createAuth0Lock(), token).then(profile => {
        this.props.dispatch(storeUser(profile))
      })
      browserHistory.replace('/')
    } else {
      this.showAuth0Lock()
    }
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
