import React, { PureComponent, PropTypes } from 'react'
import Auth0Lock from 'auth0-lock'
import Auth0 from 'auth0-js'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter, locationShape, browserHistory } from 'react-router'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOGIN_URL } from 'src/config'
import { storeToken } from 'src/authentication/actions'

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
  getIdTokenFromUrlHash() {
    const result = new Auth0({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN
    }).parseHash(this.props.location.hash)
    return result && result.idToken
  }

  showAuth0Lock() {
    const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
      auth: {
        redirectUrl: LOGIN_URL,
        responseType: 'token'
      },
      closable: false,
      languageDictionary: {
        title: 'CaveGen'
      }
    })
    lock.show()
  }

  componentWillMount() {
    const token = this.props.token || this.getIdTokenFromUrlHash()
    if (token) {
      this.props.dispatch(storeToken(token))
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
