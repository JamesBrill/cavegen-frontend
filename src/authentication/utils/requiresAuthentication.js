import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LOGIN_URL } from '../config'

export default function requiresAuthentication(WrappedComponent) {
  function mapStateToProps(state, ownProps) {
    const isAuthenticated = state.authentication.token !== null
    const originalProps = ownProps

    return { isAuthenticated, originalProps }
  }

  @connect(mapStateToProps)
  class AuthenticatedComponent extends PureComponent {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      originalProps: PropTypes.object // eslint-disable-line react/forbid-prop-types
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
      const childProps = this.props.originalProps

      return this.allowedAccess() ? <WrappedComponent {...childProps} /> : null
    }
  }

  return AuthenticatedComponent
}
