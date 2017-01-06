import React, { PureComponent, PropTypes } from 'react'
import { createAuth0Lock } from 'src/authentication/utils/auth0Lock'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter, locationShape, browserHistory } from 'react-router'
import { storeToken, logout } from 'src/authentication/actions'
import { loadUserProfile } from 'src/profile/actions'
import jwtDecode from 'jwt-decode'

import styles from 'src/authentication/components/LoginPage.css'

function mapStateToProps(state) {
  return {
    token: state.authentication && state.authentication.token,
    isEmailVerified: state.authentication.claims['email_verified']
  }
}

@connect(mapStateToProps)
@withRouter
export default class LoginPage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    location: locationShape.isRequired,
    token: PropTypes.string,
    isEmailVerified: PropTypes.bool
  };

  @autobind
  showAuth0Lock() {
    const lock = createAuth0Lock()
    lock.show()
  }

  componentWillMount() {
    if (this.emailVerificationNeeded()) {
      return
    }
    const token = this.props.token || this.props.location.query.token
    if (token && this.props.isEmailVerified !== false) {
      this.props.dispatch(storeToken(token))
      this.props.dispatch(loadUserProfile())
    } else {
      this.props.dispatch(logout())
      this.showAuth0Lock()
    }
  }

  @autobind
  emailVerificationNeeded() {
    return this.props.location.query.token &&
           !jwtDecode(this.props.location.query.token)['email_verified']
  }

  componentWillReceiveProps({ isEmailVerified }) {
    if (isEmailVerified) {
      browserHistory.replace('/')
    } else {
      this.props.dispatch(logout())
      this.showAuth0Lock()
    }
  }

  render() {
    if (this.emailVerificationNeeded()) {
      return (
        <div className={styles.container}>
          Please verify your email to log in.
        </div>
      )
    } else {
      return null
    }
  }
}
