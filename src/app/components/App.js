import React, { PureComponent, PropTypes, Children, cloneElement } from 'react'
import { logout } from 'src/authentication/actions'
import { loadImages } from 'src/editor/actions'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { withRouter } from 'react-router'
import moment from 'moment'
import ScheduledEvent from 'src/utils/ScheduledEvent'
import Spinner from 'src/components/Spinner'
import { LOGIN_URL } from 'src/config'

import styles from 'src/app/components/App.css'

function mapStateToProps(state) {
  const location = state.routing.locationBeforeTransitions
  const isEditorOpen = location.pathname.startsWith('/build')
  const isAuthenticated = !!(state.authentication && state.authentication.token !== null)
  return {
    tokenExpiryTime: state.authentication.claims.exp,
    isAuthenticated,
    isEmailVerified: state.authentication.claims['email_verified'],
    isEditorOpen
  }
}

@connect(mapStateToProps, { logout, loadImages })
@withRouter
export default class App extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tokenExpiryTime: PropTypes.number,
    isAuthenticated: PropTypes.bool,
    isEmailVerified: PropTypes.bool,
    isEditorOpen: PropTypes.bool,
    logout: PropTypes.func,
    loadImages: PropTypes.func
  };

  constructor(props) {
    super(props)

    this.state = {
      imagesLoaded: false
    }
  }

  componentWillMount() {
    this.loadImagesOrRedirectToLogin(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadImagesOrRedirectToLogin(nextProps)
  }

  @autobind
  loadImagesOrRedirectToLogin(props) {
    const { isEditorOpen, isAuthenticated, loadImages, isEmailVerified } = props // eslint-disable-line no-shadow
    if (isEditorOpen) {
      if ((isAuthenticated && !isEmailVerified) || !isAuthenticated) {
        window.location = LOGIN_URL
      }
      loadImages().then(() => this.setState({ imagesLoaded: true }))
    }
  }

  render() {
    const { logout, isAuthenticated, tokenExpiryTime, isEmailVerified, isEditorOpen } = this.props // eslint-disable-line no-shadow

    if (isEditorOpen && isAuthenticated && !isEmailVerified) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Please verify your email. Redirecting to login...
        </div>
      )
    }

    if (isEditorOpen && !isAuthenticated) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Redirecting to login...
        </div>
      )
    }

    if (isEditorOpen && !this.state.imagesLoaded) {
      return (
        <div className={styles.spinnerContainer}>
          <Spinner className={styles.spinner} />
          Loading tiles...
        </div>
      )
    }

    return (
      <div className={styles.App}>
        <ScheduledEvent when={moment.unix(tokenExpiryTime)} action={logout} />
        {cloneElement(Children.only(this.props.children), { className: styles.page })}
      </div>
    )
  }
}
