import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LOGIN_URL } from 'src/config'

export default function requiresAuthentication(WrappedComponent) {
  function mapStateToProps(state) {
    const isAuthenticated = !!(state.authentication && state.authentication.token !== null)

    return { isAuthenticated }
  }

  @connect(mapStateToProps)
  class AuthenticatedComponent extends PureComponent {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired
    };

    componentWillMount() {
      this.checkAuth()
    }

    componentDidUpdate() {
      this.checkAuth()
    }

    checkAuth() {
      if (!this.allowedAccess()) {
        window.location = LOGIN_URL
      }
    }

    allowedAccess() {
      return this.props.isAuthenticated
    }

    render() {
      return this.allowedAccess() ? <WrappedComponent {...this.props} /> : null
    }
  }

  return AuthenticatedComponent
}
